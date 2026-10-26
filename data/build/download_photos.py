#!/usr/bin/env python3
"""Download Stampd place photos: prefer local assets/places/<id>.jpg from Commons."""
from __future__ import annotations

import json
import io
import re
import time
import hashlib
from pathlib import Path
from urllib.parse import urlparse, urlunparse, unquote, quote, urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from PIL import Image

ROOT = Path("/workspace/design/world-icons-passport/app-preview")
PLACES = ROOT / "data" / "places.json"
ASSETS = ROOT / "assets" / "places"
STATUS = ROOT / "data" / "photo-batch-status.json"
UA = "StampdPreviewBot/1.0 (educational travel passport preview; local asset cache)"
MAX_BYTES = 500 * 1024
MAX_EDGE = 1200
SLEEP = 0.35  # be polite to Commons

ASSETS.mkdir(parents=True, exist_ok=True)


def clean_image_url(u: str) -> str:
    """Normalize Commons *image* URLs: drop utm query, rewrite thumb host."""
    if not u:
        return ""
    p = urlparse(u)
    netloc = p.netloc
    if netloc == "thumb.wikimedia.org":
        netloc = "upload.wikimedia.org"
    # keep path only (strip utm); image thumbs don't need query
    return urlunparse(("https", netloc, p.path, "", "", ""))


def fetch_bytes(url: str, timeout: int = 90, clean_image: bool = False) -> bytes:
    if clean_image:
        url = clean_image_url(url)
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=timeout) as r:
        return r.read()


def save_jpeg(data: bytes, dest: Path) -> int:
    img = Image.open(io.BytesIO(data))
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    elif img.mode == "L":
        img = img.convert("RGB")
    w, h = img.size
    if max(w, h) > MAX_EDGE:
        if w >= h:
            img = img.resize((MAX_EDGE, max(1, int(h * MAX_EDGE / w))), Image.LANCZOS)
        else:
            img = img.resize((max(1, int(w * MAX_EDGE / h)), MAX_EDGE), Image.LANCZOS)
    q = 85
    while True:
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=q, optimize=True)
        if buf.tell() <= MAX_BYTES or q <= 50:
            dest.write_bytes(buf.getvalue())
            return buf.tell()
        q -= 5


def commons_search(query: str, limit: int = 5) -> list[dict]:
    """Search Commons for images; return list of {title, url, thumburl, user, license}."""
    api = "https://commons.wikimedia.org/w/api.php?" + urlencode({
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": 6,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|user|extmetadata|size|mime",
        "iiurlwidth": MAX_EDGE,
    })
    raw = b""
    for attempt in range(3):
        try:
            raw = fetch_bytes(api)
            if raw.strip().startswith(b"{") or raw.strip().startswith(b"["):
                break
            time.sleep(1.5 * (attempt + 1))
        except Exception:
            time.sleep(1.5 * (attempt + 1))
            raw = b""
    if not raw or not (raw.strip().startswith(b"{") or raw.strip().startswith(b"[")):
        return []
    try:
        data = json.loads(raw.decode("utf-8", errors="replace"))
    except Exception:
        return []
    pages = (data.get("query") or {}).get("pages") or {}
    out = []
    for page in pages.values():
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        ii = infos[0]
        mime = (ii.get("mime") or "").lower()
        if not mime.startswith("image/"):
            continue
        if mime not in ("image/jpeg", "image/png", "image/webp", "image/tiff", "image/gif"):
            continue
        meta = ii.get("extmetadata") or {}
        lic = (meta.get("LicenseShortName") or {}).get("value") or ""
        artist = (meta.get("Artist") or {}).get("value") or ii.get("user") or "Wikimedia Commons"
        # strip HTML from artist
        artist = re.sub(r"<[^>]+>", "", artist).strip()
        thumb = ii.get("thumburl") or ii.get("url")
        title = page.get("title") or ""
        file_page = f"https://commons.wikimedia.org/wiki/{quote(title.replace(' ', '_'))}"
        out.append(
            {
                "title": title,
                "url": thumb,
                "fullurl": ii.get("url"),
                "user": artist,
                "license": lic,
                "source": file_page,
            }
        )
    return out


def pick_search_queries(pl: dict) -> list[str]:
    name = pl.get("name") or ""
    city = pl.get("city") or ""
    country = pl.get("country_name") or pl.get("country") or ""
    # strip parentheticals for cleaner search
    base = re.sub(r"\s*\([^)]*\)", "", name).strip()
    qs = []
    if city:
        qs.append(f"{base} {city}")
    qs.append(f"{base} {country}")
    qs.append(base)
    if city and country:
        qs.append(f"{city} {country} food market")
        qs.append(f"{city} skyline")
        qs.append(f"{city} street")
    # dedupe preserve order
    seen = set()
    out = []
    for q in qs:
        q = q.strip()
        if q and q not in seen:
            seen.add(q)
            out.append(q)
    return out


def download_for_place(pl: dict) -> tuple[bool, str]:
    """Try to get local jpg. Returns (ok, note)."""
    pid = pl["id"]
    dest = ASSETS / f"{pid}.jpg"
    if dest.exists() and dest.stat().st_size >= 5000:
        pl["photo"] = f"assets/places/{pid}.jpg"
        return True, "already_local"

    # 1) existing photo_url
    url = pl.get("photo_url") or ""
    if url:
        try:
            data = fetch_bytes(url, clean_image=True)
            if len(data) < 2000:
                raise ValueError("too small")
            save_jpeg(data, dest)
            if dest.stat().st_size >= 5000:
                pl["photo"] = f"assets/places/{pid}.jpg"
                return True, "from_photo_url"
            dest.unlink(missing_ok=True)
        except Exception as e:
            pass

    # 2) try full-size from photo_source File: page via API
    src = pl.get("photo_source") or ""
    m = re.search(r"/wiki/File:(.+)$", src)
    if m:
        title = "File:" + unquote(m.group(1).replace("_", " "))
        api = "https://commons.wikimedia.org/w/api.php?" + urlencode({
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|user|extmetadata|mime",
            "iiurlwidth": MAX_EDGE,
        })
        try:
            raw = fetch_bytes(api)
            data = json.loads(raw.decode("utf-8", errors="replace"))
            pages = (data.get("query") or {}).get("pages") or {}
            for page in pages.values():
                infos = page.get("imageinfo") or []
                if not infos:
                    continue
                ii = infos[0]
                thumb = ii.get("thumburl") or ii.get("url")
                if not thumb:
                    continue
                blob = fetch_bytes(thumb, clean_image=True)
                save_jpeg(blob, dest)
                if dest.stat().st_size >= 5000:
                    pl["photo"] = f"assets/places/{pid}.jpg"
                    # refresh credit if empty
                    if not pl.get("photo_credit"):
                        meta = ii.get("extmetadata") or {}
                        artist = re.sub(
                            r"<[^>]+>",
                            "",
                            (meta.get("Artist") or {}).get("value") or ii.get("user") or "Wikimedia",
                        ).strip()
                        lic = (meta.get("LicenseShortName") or {}).get("value") or ""
                        pl["photo_credit"] = f"{artist} · {lic}".strip(" ·")
                    return True, "from_photo_source_api"
                dest.unlink(missing_ok=True)
        except Exception:
            pass

    # 3) Commons search
    for q in pick_search_queries(pl):
        time.sleep(SLEEP)
        results = commons_search(q, limit=6)
        for r in results:
            try:
                blob = fetch_bytes(r["url"] or r["fullurl"], clean_image=True)
                save_jpeg(blob, dest)
                if dest.stat().st_size < 5000:
                    dest.unlink(missing_ok=True)
                    continue
                pl["photo"] = f"assets/places/{pid}.jpg"
                lic = r.get("license") or ""
                pl["photo_credit"] = f"{r.get('user','Wikimedia')} · {lic}".strip(" ·")
                pl["photo_source"] = r.get("source")
                # keep photo_url as fallback mirror
                pl["photo_url"] = clean_image_url(r.get("url") or r.get("fullurl") or "")
                if pl.get("chapter") == "Foods" and "food" not in (pl.get("name") or "").lower():
                    # representative city/neighbourhood images are OK for Foods
                    if not pl.get("photo_note"):
                        pl["photo_note"] = "Representative Commons photo of the area / venue type"
                return True, f"commons_search:{q}"
            except Exception:
                dest.unlink(missing_ok=True)
                continue

    # 4) last resort: leave / set photo_url if we found any candidate URL without download
    # try one more broader search just for URL
    for q in pick_search_queries(pl)[:2]:
        time.sleep(SLEEP)
        results = commons_search(q, limit=3)
        if results:
            r = results[0]
            pl["photo_url"] = clean_image_url(r.get("url") or r.get("fullurl") or "")
            lic = r.get("license") or ""
            pl["photo_credit"] = f"{r.get('user','Wikimedia')} · {lic}".strip(" ·")
            pl["photo_source"] = r.get("source")
            if not pl.get("photo_note"):
                pl["photo_note"] = "URL-only fallback — local download failed"
            return False, f"url_only_fallback:{q}"

    return False, "failed"


def counts(places):
    local = url_only = missing = 0
    for pl in places:
        ph = pl.get("photo") or ""
        if ph.startswith("assets/"):
            local += 1
        elif pl.get("photo_url"):
            url_only += 1
        else:
            missing += 1
    return local, url_only, missing


def write_status(countries_done, places, notes: str):
    local, url_only, missing = counts(places)
    # still needing local
    still = sum(1 for pl in places if not (pl.get("photo") or "").startswith("assets/"))
    payload = {
        "updated": time.strftime("%Y-%m-%dT%H:%M:%S+04:00"),
        "countries_done": countries_done,
        "local_count": local,
        "url_only_count": url_only,
        "still_missing_count": missing,  # no photo AND no photo_url
        "still_need_local_count": still,
        "notes": notes,
    }
    STATUS.write_text(json.dumps(payload, indent=2) + "\n")
    return payload


def process_countries(country_ids: list[str], all_done: list[str]):
    data = json.loads(PLACES.read_text())
    places = data["places"]
    by_id = {pl["id"]: pl for pl in places}
    # group
    todo = []
    for pl in places:
        cid = pl.get("country_id") or ""
        if cid not in country_ids:
            continue
        ph = pl.get("photo") or ""
        dest = ASSETS / f"{pl['id']}.jpg"
        if ph.startswith("assets/") and dest.exists() and dest.stat().st_size >= 5000:
            continue
        # also fix if local file exists but photo field wrong
        if dest.exists() and dest.stat().st_size >= 5000:
            pl["photo"] = f"assets/places/{pl['id']}.jpg"
            continue
        todo.append(pl)

    ok = fail = urlfb = 0
    fail_ids = []
    for i, pl in enumerate(todo):
        try:
            success, note = download_for_place(pl)
        except Exception as e:
            success, note = False, f"exception:{type(e).__name__}"
            print(f"  ! {pl['id']} {note}", flush=True)
        if success:
            ok += 1
        elif note.startswith("url_only"):
            urlfb += 1
            fail_ids.append(pl["id"])
        else:
            fail += 1
            fail_ids.append(pl["id"])
        time.sleep(SLEEP)
        if (i + 1) % 10 == 0:
            print(f"  … {i+1}/{len(todo)} ok={ok} urlfb={urlfb} fail={fail}", flush=True)
            # mid-batch persist
            data["version"] = 5
            data["updated"] = time.strftime("%Y-%m-%d")
            tmp = PLACES.with_suffix(".json.tmp")
            tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
            tmp.replace(PLACES)
            write_status(all_done + [c for c in country_ids if c not in all_done], data["places"], f"mid-batch {country_ids} i={i+1}/{len(todo)}")

    data["version"] = 5
    data["updated"] = time.strftime("%Y-%m-%d")
    # atomic write
    tmp = PLACES.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    tmp.replace(PLACES)

    for c in country_ids:
        if c not in all_done:
            all_done.append(c)
    notes = (
        f"Batch {country_ids}: processed={len(todo)} local_ok={ok} "
        f"url_fallback={urlfb} fail={fail} stubborn={fail_ids[:20]}"
    )
    st = write_status(all_done, data["places"], notes)
    print(notes)
    print("STATUS", st)
    return st, fail_ids


if __name__ == "__main__":
    import sys

    countries = sys.argv[1:]
    done_path = Path("/workspace/design/world-icons-passport/app-preview/data/photo-batch-status.json")
    all_done = []
    if done_path.exists():
        try:
            all_done = list(json.loads(done_path.read_text()).get("countries_done") or [])
        except Exception:
            all_done = []
    if not countries:
        print("Usage: download_photos.py <country_id> ...")
        sys.exit(1)
    process_countries(countries, all_done)
