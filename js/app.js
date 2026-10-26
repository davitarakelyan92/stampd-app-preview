/* Stampd app-preview — routing, Countries, distance. Brand: logo.js / stamps.js / icons.js */
(function () {
  const CLOTH = {
    blue: "#1B2747",
    red: "#8B1E2D",
    green: "#1E3B32",
    black: "#1A1A1E",
    orange: "#7A3F18",
  };

  const STAMP_OPTS = { w: 150, h: 182, P: 10, labelFont: "Plus Jakarta Sans", labelW: 800, labelSize: 11.5 };
  const STAMP_COLORS = ["coral", "sky", "sunny", "mint", "twilight"];
  const CHAPTER_ORDER = ["Monuments", "Foods", "Visit", "Seasonal"];
  const DEMO_ICON_IDS = ["eiffel", "taj", "lantern", "colosseum", "trevi", "pantheon", "pizza", "gelato"];

  let stamps = [];

  const state = {
    screen: "home",
    countryId: localStorage.getItem("stampd-preview-country") || "",
    collected: 0,
    treviEarned: false,
    chip: "All",
    placesData: null,
    meData: null,
    meStatus: "idle", // idle | loading | ready | empty | error
    userPos: null,
    geoMode: "yerevan",
    detailIcon: null,
  };

  function clothHex(c) {
    const row = c || country();
    if (row && row.cloth_hex) return row.cloth_hex;
    return CLOTH[(row && row.family) || "blue"] || CLOTH.blue;
  }

  function countriesAll() {
    const fromFile = (state.placesData && state.placesData.countries) || [];
    return fromFile
      .filter((row) => row && row.id && row.id !== "default")
      .map((row) => ({
        ...row,
        cloth_hex: row.cloth_hex || CLOTH[row.family] || CLOTH.blue,
      }));
  }

  function liveCountries() {
    return countriesAll().filter((c) => c.status === "live" && c.id !== "default");
  }

  function soonCountries() {
    return countriesAll().filter((c) => c.status === "coming_soon");
  }

  function firstLiveCountryId() {
    const live = liveCountries();
    const am = live.find((c) => c.id === "am");
    if (am) return "am";
    return live.length ? live[0].id : "am";
  }

  function resolveCountryId(id) {
    if (!id || id === "default") return firstLiveCountryId();
    const row = countriesAll().find((c) => c.id === id);
    if (!row || row.status === "coming_soon" || row.id === "default") return firstLiveCountryId();
    return id;
  }

  function country() {
    const id = resolveCountryId(state.countryId);
    return countriesAll().find((x) => x.id === id) || liveCountries()[0] || { id: "am", name: "Armenia", family: "red", cloth_hex: CLOTH.red, status: "live" };
  }

  function placeById(id) {
    const places = (state.placesData && state.placesData.places) || [];
    return places.find((p) => p.id === id) || null;
  }

  function placesForCountryCode(code) {
    const places = (state.placesData && state.placesData.places) || [];
    return places.filter((p) => String(p.country || "").toUpperCase() === code);
  }

  function homePoint() {
    const h = state.placesData && state.placesData.home;
    if (h && typeof h.lat === "number" && typeof h.lng === "number") return h;
    return { name: "Yerevan", lat: 40.1777, lng: 44.5126 };
  }

  function haversineKm(a, b) {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function originPoint() {
    if (state.userPos && typeof state.userPos.lat === "number") return state.userPos;
    return homePoint();
  }

  function formatDistance(km) {
    if (km == null || !isFinite(km)) return "Distance unavailable";
    if (km < 1) {
      const m = Math.round(km * 1000);
      return `${m.toLocaleString("en-US")} m from you`;
    }
    const whole = Math.round(km);
    return `${whole.toLocaleString("en-US")} km from you`;
  }

  function placeKm(place) {
    if (!place || typeof place.lat !== "number" || typeof place.lng !== "number") return Number.POSITIVE_INFINITY;
    return haversineKm(originPoint(), place);
  }

  function countryKm(c) {
    if (!c || typeof c.lat !== "number" || typeof c.lng !== "number") return Number.POSITIVE_INFINITY;
    return haversineKm(originPoint(), c);
  }

  function shouldShowDistance(s) {
    return true;
  }

  function distanceLabelFor(stamp) {
    if (!shouldShowDistance(stamp)) return null;
    const place = placeById(stamp.icon);
    if (!place || typeof place.lat !== "number" || typeof place.lng !== "number") {
      return "Distance unavailable";
    }
    return formatDistance(placeKm(place));
  }

  function chapterRank(ch) {
    const i = CHAPTER_ORDER.indexOf(ch);
    return i === -1 ? 99 : i;
  }

  function sortPlaces(list) {
    return list.slice().sort((a, b) => {
      const da = placeKm(a) - placeKm(b);
      if (da) return da;
      const cr = chapterRank(a.chapter) - chapterRank(b.chapter);
      if (cr) return cr;
      return String(a.name || a.id).localeCompare(String(b.name || b.id));
    });
  }

  function sortLiveCountries(list) {
    return list.slice().sort((a, b) => {
      const d = countryKm(a) - countryKm(b);
      if (d) return d;
      return String(a.name || a.id).localeCompare(String(b.name || b.id));
    });
  }

  function collectedIdSet() {
    const ids = (state.meData && state.meData.collected_place_ids) || [];
    return new Set(ids);
  }

  function stampFromPlace(place, index, collected) {
    const colors = STAMP_COLORS;
    let color = colors[index % colors.length];
    let st = "locked";
    let level = 0;
    let note = "Locked";
    let here = false;
    const isSeasonal = place.chapter === "Seasonal";
    const isCollected = collected.has(place.id);

    if (isCollected) {
      st = "earned";
      note = "Collected";
      if (index === 1) level = 2;
    } else if (isSeasonal) {
      st = "seasonal";
      color = "twilight";
      note = place.seasonal_label ? `Seasonal · ${place.seasonal_label}` : "Seasonal";
    }

    return {
      icon: place.id,
      color,
      state: st,
      note,
      chapter: place.chapter || "Other",
      placeName: place.name,
      level: level || undefined,
      here: here || undefined,
    };
  }

  function rebuildStampsFromPlaces() {
    const places = (state.placesData && state.placesData.places) || [];
    const cid = state.countryId;
    let source = [];
    const collected = collectedIdSet();

    if (cid === "am") {
      source = sortPlaces(placesForCountryCode("AM"));
    } else if (cid === "it") {
      source = sortPlaces(placesForCountryCode("IT"));
    } else {
      const code = String(cid || "").toUpperCase();
      const byCountry = placesForCountryCode(code);
      if (byCountry.length) {
        source = sortPlaces(byCountry);
      } else {
        const byId = Object.fromEntries(places.map((p) => [p.id, p]));
        source = DEMO_ICON_IDS.map((id) => byId[id]).filter(Boolean);
        if (!source.length) {
          source = places.filter((p) => p.catalog === "sample_icons").slice(0, 3);
        }
        source = sortPlaces(source);
      }
    }

    stamps = source.map((p, i) => stampFromPlace(p, i, collected));

    if (state.treviEarned) {
      const trevi = stamps.find((s) => s.icon === "trevi");
      if (trevi) {
        trevi.state = "earned";
        trevi.here = false;
        trevi.color = "sky";
        trevi.note = "Collected Oct 2026";
      }
    }

    const earned = stamps.filter((s) => s.state === "earned").length;
    state.collected = Math.min(earned, stamps.length);
    if (!countsHasChip(state.chip)) state.chip = "All";
  }

  function countsHasChip(chip) {
    if (chip === "All") return true;
    return stamps.some((s) => s.chapter === chip);
  }

  function collectedStamps(list) {
    const prefer = ["earned", "seasonal", "gifted", "resting"];
    return list
      .filter((s) => prefer.includes(s.state))
      .sort((a, b) => prefer.indexOf(a.state) - prefer.indexOf(b.state));
  }

  function countryCodeFor(c) {
    if (!c || !c.id || c.id === "default") return null;
    if (c.id === "am") return "AM";
    if (c.id === "it") return "IT";
    return String(c.id).toUpperCase();
  }

  function stampsAvailableForCountry(c) {
    const code = countryCodeFor(c);
    if (!code) return 0;
    return placesForCountryCode(code).length;
  }

  function stampsListForCountryPreview(c) {
    const code = countryCodeFor(c);
    if (!code) return [];
    const collected = collectedIdSet();
    const source = sortPlaces(placesForCountryCode(code));
    return source.map((p, i) => stampFromPlace(p, i, collected));
  }

  function collectedForCountry(c) {
    const list = stampsListForCountryPreview(c);
    return list.filter((s) => s.state === "earned");
  }

  function hasStampIcon(id) {
    return !!(typeof WI_ICONS === "object" && WI_ICONS && WI_ICONS[id]);
  }

  function thumbKindForPlace(place, collected) {
    if (collected.has(place.id)) return "collected";
    /* Seasonal not yet earned, or missing art → unavailable */
    if (place.chapter === "Seasonal" || !hasStampIcon(place.id)) return "unavailable";
    return "open";
  }

  function pickThumbPlaces(c) {
    const code = countryCodeFor(c);
    if (!code) return [];
    const collected = collectedIdSet();
    const places = sortPlaces(placesForCountryCode(code));
    const buckets = { collected: [], open: [], unavailable: [] };
    places.forEach((p) => {
      buckets[thumbKindForPlace(p, collected)].push(p);
    });
    const out = [];
    const take = (kind) => {
      if (buckets[kind].length) out.push({ place: buckets[kind].shift(), kind });
    };
    /* Ensure all three states appear when the country has them */
    take("collected");
    take("open");
    take("unavailable");
    const rest = []
      .concat(buckets.collected.map((p) => ({ place: p, kind: "collected" })))
      .concat(buckets.open.map((p) => ({ place: p, kind: "open" })))
      .concat(buckets.unavailable.map((p) => ({ place: p, kind: "unavailable" })));
    rest.sort((a, b) => placeKm(a.place) - placeKm(b.place));
    while (out.length < 4 && rest.length) out.push(rest.shift());
    out.sort((a, b) => placeKm(a.place) - placeKm(b.place));
    return out.slice(0, 4);
  }

  function thumbHtml(entry) {
    const place = entry.place;
    const kind = entry.kind;
    const cls =
      kind === "collected" ? "is-collected" : kind === "unavailable" ? "is-unavailable" : "is-open";
    const stroke =
      kind === "collected" ? "#1B2747" : kind === "unavailable" ? "#C8C4BC" : "#A3AABA";
    const icon =
      typeof wiIcon === "function" ? wiIcon(place.id, { size: 18, stroke, sw: 2.2 }) : "";
    const check =
      kind === "collected"
        ? `<span class="stamp-thumb-check" aria-hidden="true"><svg width="7" height="7" viewBox="0 0 12 12"><path d="M2.5 6.2l2.4 2.4 4.6-5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
        : "";
    const title = String(place.name || place.id).replace(/"/g, "&quot;");
    return `<span class="stamp-thumb ${cls}" title="${title}" aria-hidden="true">${icon}${check}</span>`;
  }

  function thumbsRowHtml(c) {
    const entries = pickThumbPlaces(c);
    if (!entries.length) return "";
    return `<div class="stamp-thumbs">${entries.map(thumbHtml).join("")}</div>`;
  }

  /* ── Screens ── */
  function showScreen(name) {
    state.screen = name;
    document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("on", el.dataset.screen === name));
    document.querySelectorAll(".tab [data-tab]").forEach((btn) => {
      const tab = btn.dataset.tab;
      const on =
        (tab === "countries" && name === "home") ||
        (tab === "album" && name === "album") ||
        (tab === "support" && name === "support") ||
        (tab === "map" && name === "map") ||
        (tab === "trade" && name === "trade") ||
        (tab === "me" && name === "me");
      btn.classList.toggle("on", on);
    });
    if (name === "home") renderHome();
    if (name === "album") renderAlbum();
    if (name === "support") renderSupport();
    if (name === "me") renderMe();
    if (name === "detail") renderDetail();
  }

  function renderHome() {
    const book = document.getElementById("passport-book");
    const lock = document.getElementById("cover-lockup");
    const meta = document.getElementById("cover-meta");
    const c = country();
    state.countryId = c.id;
    const hex = clothHex(c);
    book.style.background = hex;
    lock.innerHTML = coverCountryFace({ cloth: hex, name: c.name, size: 36, withSlogan: false });
    const n = stampsAvailableForCountry(c);
    meta.innerHTML = `<b>${c.name}</b><span class="cover-meta-sub">${n} stamps available</span>`;
    renderCountriesLists();
  }

  function liveCardHtml(c) {
    const hex = clothHex(c);
    const preview = stampsListForCountryPreview(c);
    const total = preview.length || stampsAvailableForCountry(c);
    const collected = preview.filter((s) => s.state === "earned").length;
    const stat = `<span class="stat">${collected} of ${total} stamps</span>`;
    const thumbs = thumbsRowHtml(c);
    return `<button type="button" class="country-card" data-country="${c.id}">
      <span class="mini" style="background:${hex}"><span class="h"></span></span>
      <span class="info"><span class="nm">${c.name}</span>${stat}${thumbs}</span>
    </button>`;
  }

  function soonCardHtml(c) {
    return `<button type="button" class="country-card soon" data-soon="${c.id}" aria-disabled="true">
      <span class="mini soon"><span class="h"></span></span>
      <span class="info"><span class="nm">${c.name}</span><span class="hx">Coming soon</span></span>
      <span class="soon-pill">Coming soon</span>
    </button>`;
  }

  function renderCountriesLists() {
    const liveEl = document.getElementById("countries-live");
    const soonEl = document.getElementById("countries-soon");
    if (!liveEl || !soonEl) return;

    liveEl.innerHTML = sortLiveCountries(liveCountries()).map(liveCardHtml).join("");
    soonEl.innerHTML = soonCountries().map(soonCardHtml).join("");

    liveEl.querySelectorAll("[data-country]").forEach((btn) => {
      btn.addEventListener("click", () => openCountryGallery(btn.dataset.country));
    });
    soonEl.querySelectorAll("[data-soon]").forEach((btn) => {
      btn.addEventListener("click", () => softToast("Coming soon"));
    });
  }

  function softToast(msg) {
    const el = document.getElementById("soft-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(softToast._t);
    softToast._t = setTimeout(() => el.classList.remove("on"), 1600);
  }

  function renderSupport() {
    /* Static HTML — nothing dynamic required */
  }

  function countryRowById(id) {
    return countriesAll().find((c) => c.id === id) || null;
  }

  function renderMeEmpty(title, sub, showRetry) {
    const root = document.getElementById("me-root");
    if (!root) return;
    root.innerHTML = `<div class="me-empty">
      <p class="me-empty-title">${title}</p>
      <p class="me-empty-sub">${sub}</p>
      ${showRetry ? '<button type="button" class="btn-ghost" id="me-retry">Retry</button>' : ""}
    </div>`;
    const retry = document.getElementById("me-retry");
    if (retry) retry.addEventListener("click", () => loadMe(true).then(() => { rebuildStampsFromPlaces(); renderMe(); }));
  }

  function initialsFromName(name) {
    const parts = String(name || "S").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "S";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function achievementIcon(theme, earned) {
    const map = { milestone: "★", country: "▣", chapter: "◆", seasonal: "✧", travel: "➤", distance: "◎" };
    return map[theme] || (earned ? "✓" : "○");
  }

  function renderMe() {
    const root = document.getElementById("me-root");
    if (!root) return;
    if (state.meStatus === "loading" || state.meStatus === "idle") {
      renderMeEmpty("Loading profile…", "Fetching your Stampd passport details.", false);
      if (state.meStatus === "idle") loadMe().then(renderMe);
      return;
    }
    if (state.meStatus === "error" || state.meStatus === "empty" || !state.meData) {
      renderMeEmpty("Profile coming soon", "We’ll show countries you’ve visited and achievements here.", true);
      return;
    }
    const d = state.meData;
    const profile = d.profile || {};
    const name = profile.display_name || profile.name || "Traveler";
    const home = [profile.home_city, profile.home_country].filter(Boolean).join(" · ");
    const bio = profile.bio || "";
    const member = profile.member_since || "";
    const visitedRows = Array.isArray(d.countries) ? d.countries : [];
    const achievements = Array.isArray(d.achievements) ? d.achievements : [];
    const fav = profile.favorite_country_id || profile.active_passport_country_id;

    const coversHtml = visitedRows
      .filter((row) => !!row.visited)
      .map((row) => {
        const hex = CLOTH[row.family] || row.cloth_hex || CLOTH.blue;
        const visited = !!row.visited;
        const face = coverCountryFace({ cloth: hex, name: row.name, size: 10, withSlogan: false });
        return `<button type="button" class="me-cover-item ${visited ? "" : "muted"}" data-me-country="${row.id}" ${row.status === "coming_soon" ? 'data-soon="1"' : ""}>
          <div class="me-mini-book" style="background:${hex}"><span class="hinge"></span>${face}</div>
          <span class="me-mini-label">${row.name}${fav === row.id ? " · ★" : ""}</span>
        </button>`;
      })
      .join("");

    const achHtml = achievements
      .map((a) => {
        const earned = !!a.earned_at;
        const title = a.title || a.name || "Achievement";
        const desc = a.description || a.desc || "";
        return `<div class="me-ach ${earned ? "" : "locked"}">
          <div class="me-ach-ico">${achievementIcon(a.theme, earned)}</div>
          <p class="me-ach-title">${title}</p>
          <p class="me-ach-desc">${desc}</p>
        </div>`;
      })
      .join("");

    const memberLabel = member
      ? new Date(member + "T00:00:00").toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })
      : "—";

    root.innerHTML = `<div class="me-profile">
      <div class="me-card me-profile-row">
        <div class="me-avatar" aria-hidden="true">${initialsFromName(name)}</div>
        <div>
          <h2 class="me-name">${name}</h2>
          <p class="me-handle">${home || bio}</p>
          ${home && bio ? `<p class="me-handle">${bio}</p>` : ""}
        </div>
      </div>
      <div>
        <div class="me-section-k">Visited passports</div>
        <div class="me-covers">${coversHtml || '<p class="me-empty-sub">No countries yet.</p>'}</div>
      </div>
      <div>
        <div class="me-section-k">Achievements</div>
        <div class="me-ach-grid">${achHtml || '<p class="me-empty-sub">No achievements yet.</p>'}</div>
      </div>
      <div>
        <div class="me-section-k">Profile details</div>
        <div class="me-card me-details">
          <div class="meta-row"><span class="meta-k">Country home</span><span class="meta-v">${home || "—"}</span></div>
          <div class="meta-row"><span class="meta-k">Stamps collected</span><span class="meta-v">${profile.stamps_collected ?? "—"}</span></div>
          <div class="meta-row"><span class="meta-k">Member since</span><span class="meta-v">${memberLabel}</span></div>
        </div>
      </div>
    </div>`;

    root.querySelectorAll("[data-me-country]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.soon) {
          softToast("Coming soon");
          return;
        }
        selectCountry(btn.dataset.meCountry);
        showScreen("home");
      });
    });
  }

  function loadMe(force) {
    if (!force && (state.meStatus === "loading" || state.meStatus === "ready")) {
      return Promise.resolve(state.meData);
    }
    state.meStatus = "loading";
    return fetch("data/me.json")
      .then((r) => {
        if (!r.ok) throw new Error("me.json " + r.status);
        return r.json();
      })
      .then((data) => {
        state.meData = data;
        state.meStatus = "ready";
        rebuildStampsFromPlaces();
        return data;
      })
      .catch(() => {
        state.meData = null;
        state.meStatus = "empty";
        return null;
      });
  }

  function renderAlbum() {
    const g = document.getElementById("stamp-grid");
    const toast = document.getElementById("checkin-toast");
    const progBig = document.getElementById("prog-big");
    const bar = document.getElementById("prog-bar");

    const filter = state.chip;
    const list = stamps.filter((s) => filter === "All" || s.chapter === filter);

    g.innerHTML = list
      .map((s) => {
        const opts = {
          ...STAMP_OPTS,
          icon: s.icon,
          color: s.color,
          state: s.state,
          note: s.note,
          name: s.placeName,
        };
        if (s.level) opts.level = s.level;
        if (s.here && s.state === "locked") opts.here = true;
        const svg = digitalStamp(opts);
        const dist = distanceLabelFor(s);
        const distHtml = dist
          ? `<div class="stamp-dist">${dist}</div>`
          : `<div class="stamp-dist stamp-dist-empty" aria-hidden="true"></div>`;
        return `<div class="stamp-card" role="button" tabindex="0" data-stamp="${s.icon}">${svg}${distHtml}</div>`;
      })
      .join("");

    g.querySelectorAll(".stamp-card[data-stamp]").forEach((card) => {
      const open = () => openDetail(card.dataset.stamp);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    renderChips();

    const total = stamps.length;
    const n = Math.min(state.collected, total);
    progBig.innerHTML = `${n} <span>of</span> ${total} collected`;
    bar.innerHTML = Array.from({ length: Math.max(total, 1) }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");

    const c = country();
    const k = document.querySelector('[data-screen="album"] .ttl .k');
    const h1 = document.querySelector('[data-screen="album"] .ttl h1');
    const lede = document.querySelector('[data-screen="album"] .ttl > p:not(.sub)');
    if (k && h1) {
      if (c.id === "am") {
        k.textContent = "STAMPD · ARMENIA";
        h1.textContent = "Armenia";
        if (lede) lede.textContent = "Stamp anywhere you visit.";
      } else if (c.id === "it") {
        k.textContent = "STAMPD · ITALY";
        h1.textContent = "Italy";
        if (lede) lede.textContent = "Stamp anywhere you visit.";
      } else {
        k.textContent = "STAMPD · SAMPLE";
        h1.textContent = "Sample";
        if (lede) lede.textContent = "Pick a country for a full album.";
      }
    }

    const sub = document.getElementById("album-sub");
    if (sub) {
      const chapters = Object.keys(chapterCounts()).filter((key) => key !== "All").length;
      if (c.id === "am" || c.id === "it") {
        sub.textContent = `${total} icons in ${chapters} chapters · ${c.name}`;
      } else {
        sub.textContent = `${total} icons in ${chapters} chapters · sample`;
      }
    }

    const trevi = stamps.find((s) => s.icon === "trevi");
    const showTreviToast = !!(trevi && trevi.state !== "earned" && !state.treviEarned);
    toast.classList.toggle("hidden", !showTreviToast);
  }

  function selectCountry(id) {
    const resolved = resolveCountryId(id);
    const row = countriesAll().find((c) => c.id === resolved);
    if (!row || row.status === "coming_soon") {
      softToast("Coming soon");
      return;
    }
    state.countryId = resolved;
    localStorage.setItem("stampd-preview-country", resolved);
    rebuildStampsFromPlaces();
    if (state.screen === "home") renderHome();
    if (state.screen === "album") renderAlbum();
  }

  function openCountryGallery(id) {
    const resolved = resolveCountryId(id);
    const row = countriesAll().find((c) => c.id === resolved);
    if (!row || row.status === "coming_soon") {
      softToast("Coming soon");
      return;
    }
    state.countryId = resolved;
    localStorage.setItem("stampd-preview-country", resolved);
    rebuildStampsFromPlaces();
    showScreen("album");
  }

  function formatCoords(lat, lng) {
    if (typeof lat !== "number" || typeof lng !== "number") return "Coordinates unavailable";
    const ns = lat >= 0 ? "N" : "S";
    const ew = lng >= 0 ? "E" : "W";
    return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
  }

  function openDetail(iconId) {
    state.detailIcon = iconId;
    showScreen("detail");
  }

  function renderDetail() {
    const iconId = state.detailIcon;
    const stamp = stamps.find((s) => s.icon === iconId);
    const place = placeById(iconId);
    const hero = document.getElementById("detail-hero");
    const title = document.getElementById("detail-title");
    const desc = document.getElementById("detail-desc");
    const meta = document.getElementById("detail-meta");
    const photo = document.getElementById("detail-photo");
    if (!hero || !stamp) return;

    const opts = {
      ...STAMP_OPTS,
      icon: stamp.icon,
      color: stamp.color,
      state: stamp.state,
      note: stamp.note,
      name: stamp.placeName,
      w: 200,
      h: 244,
      P: 12,
      labelSize: 13,
    };
    if (stamp.level) opts.level = stamp.level;
    if (stamp.here && stamp.state === "locked") opts.here = true;
    hero.innerHTML = digitalStamp(opts);

    const name = (place && place.name) || stamp.placeName || stamp.icon.replace(/^./, (ch) => ch.toUpperCase());
    title.textContent = name;
    const tbTitle = document.getElementById("detail-topbar-title");
    if (tbTitle) tbTitle.textContent = title.textContent || "Stamp";

    const description =
      (place && place.description && String(place.description).trim()) || "Description coming soon.";
    desc.textContent = description;

    const dist = distanceLabelFor(stamp) || "Distance unavailable";
    const coords =
      place && typeof place.lat === "number" && typeof place.lng === "number"
        ? formatCoords(place.lat, place.lng)
        : "Coordinates unavailable";
    meta.innerHTML = `
      <div class="meta-row"><span class="meta-k">Distance</span><span class="meta-v">${dist}</span></div>
      <div class="meta-row"><span class="meta-k">Coordinates</span><span class="meta-v">${coords}</span></div>`;

    const src = (place && (place.photo || place.photo_url)) || null;
    const safeName = String(name)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
    function photoPlaceholder() {
      return (
        '<div class="detail-photo-ph"><span class="ph-name">' +
        safeName +
        '</span><span class="ph-sub">Photo coming soon</span></div>'
      );
    }
    if (src) {
      const img = document.createElement("img");
      img.className = "detail-photo";
      img.alt = name;
      img.loading = "lazy";
      img.src = src;
      img.addEventListener("error", () => {
        photo.innerHTML = photoPlaceholder();
      });
      photo.innerHTML = "";
      photo.appendChild(img);
    } else {
      photo.innerHTML = photoPlaceholder();
    }
  }

  function openCheckin() {
    const bd = document.getElementById("checkin-modal");
    const preview = document.getElementById("checkin-stamp");
    const earned = document.getElementById("earned-banner");
    const confirmBtn = document.getElementById("confirm-stamp");
    const title = document.getElementById("checkin-title");
    const lede = document.getElementById("checkin-lede");

    earned.classList.remove("on");
    confirmBtn.style.display = "";
    document.getElementById("cancel-stamp").style.display = "";
    document.getElementById("done-stamp").style.display = "none";
    title.textContent = "Collect Trevi Fountain?";
    lede.textContent = "Confirm collecting Trevi for October. Sample content — monthly rule.";
    preview.innerHTML = digitalStamp({
      ...STAMP_OPTS,
      icon: "trevi",
      color: "sky",
      state: "locked",
      here: true,
      note: "You're here",
      w: 140,
      h: 170,
    });
    bd.classList.add("on");
  }

  function closeCheckin() {
    document.getElementById("checkin-modal").classList.remove("on");
  }

  function confirmStamp() {
    const trevi = stamps.find((s) => s.icon === "trevi");
    if (trevi && trevi.state !== "earned") {
      trevi.state = "earned";
      trevi.here = false;
      trevi.color = "sky";
      trevi.note = "Collected Oct 2026";
      state.treviEarned = true;
      state.collected = Math.min(stamps.length, state.collected + 1);
    }
    const preview = document.getElementById("checkin-stamp");
    const earned = document.getElementById("earned-banner");
    const confirmBtn = document.getElementById("confirm-stamp");
    const title = document.getElementById("checkin-title");
    const lede = document.getElementById("checkin-lede");

    preview.innerHTML = digitalStamp({
      ...STAMP_OPTS,
      icon: "trevi",
      color: "sky",
      state: "earned",
      note: "Collected Oct 2026",
      w: 140,
      h: 170,
    });
    earned.classList.add("on");
    confirmBtn.style.display = "none";
    document.getElementById("cancel-stamp").style.display = "none";
    document.getElementById("done-stamp").style.display = "";
    title.textContent = "Trevi stamped";
    lede.textContent = "Added to your album for October.";
    renderAlbum();
  }

  function wire() {
    document.getElementById("fab-pin").innerHTML = symbolPin({ size: 28, mode: "white" });

    document.querySelectorAll(".tab [data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.tab;
        if (t === "countries") showScreen("home");
        else if (t === "album") showScreen("album");
        else if (t === "support") showScreen("support");
        else if (t === "map") showScreen("map");
        else if (t === "trade") showScreen("trade");
        else if (t === "me") showScreen("me");
        else if (t === "stamp") {
          showScreen("album");
          const trevi = stamps.find((s) => s.icon === "trevi");
          if (trevi && trevi.state !== "earned") openCheckin();
          else softToast("Pick Italy to try Trevi check-in");
        }
      });
    });

    document.getElementById("open-passport").addEventListener("click", () => showScreen("album"));
    document.getElementById("passport-book").addEventListener("click", () => showScreen("album"));

    document.getElementById("album-back").addEventListener("click", () => showScreen("home"));
    const faq = document.getElementById("support-faq");
    if (faq) faq.addEventListener("click", () => softToast("FAQ coming soon"));
    const supportBack = document.getElementById("support-back");
    if (supportBack) supportBack.addEventListener("click", () => showScreen("home"));
    document.getElementById("detail-back").addEventListener("click", () => showScreen("album"));

    document.getElementById("stamp-it").addEventListener("click", openCheckin);
    document.getElementById("confirm-stamp").addEventListener("click", confirmStamp);
    document.getElementById("cancel-stamp").addEventListener("click", closeCheckin);
    document.getElementById("checkin-modal").addEventListener("click", (e) => {
      if (e.target.id === "checkin-modal") closeCheckin();
    });
    document.getElementById("done-stamp").addEventListener("click", () => {
      closeCheckin();
      showScreen("album");
    });
  }

  function tryGeolocation() {
    if (!navigator.geolocation) {
      state.geoMode = "yerevan";
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          state.geoMode = "geolocation";
          resolve();
        },
        () => {
          state.userPos = null;
          state.geoMode = "yerevan";
          resolve();
        },
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 600000 }
      );
    });
  }

  function chapterCounts() {
    const counts = { All: stamps.length };
    stamps.forEach((s) => {
      const ch = s.chapter || "Other";
      counts[ch] = (counts[ch] || 0) + 1;
    });
    return counts;
  }

  function renderChips() {
    const el = document.getElementById("stamp-chips");
    if (!el) return;
    const counts = chapterCounts();
    const order = ["All", "Monuments", "Foods", "Visit", "Seasonal"];
    const keys = order.filter((k) => k === "All" || counts[k]);
    Object.keys(counts).forEach((k) => {
      if (!keys.includes(k)) keys.push(k);
    });
    if (!counts[state.chip]) state.chip = "All";
    el.innerHTML = keys
      .map(
        (k) =>
          `<button type="button" class="chip ${k === state.chip ? "on" : ""}" data-chip="${k}">${k} <b>${counts[k] || 0}</b></button>`
      )
      .join("");
    el.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.chip = chip.dataset.chip;
        renderAlbum();
      });
    });
  }

  function loadPlaces() {
    return fetch("data/places.json")
      .then((r) => {
        if (!r.ok) throw new Error("places.json " + r.status);
        return r.json();
      })
      .then((data) => {
        state.placesData = data;
        /* Force locked red if any legacy hex sneaks in */
        if (Array.isArray(data.countries)) {
          data.countries.forEach((c) => {
            if (c.family === "red") c.cloth_hex = CLOTH.red;
          });
        }
        rebuildStampsFromPlaces();
      })
      .catch((err) => {
        console.warn("places.json load failed; using empty fallback", err);
        state.placesData = {
          home: { name: "Yerevan", lat: 40.1777, lng: 44.5126 },
          places: [],
          countries: [
            { id: "am", name: "Armenia", family: "red", cloth_hex: CLOTH.red, status: "live", lat: 40.1777, lng: 44.5126 },
            { id: "it", name: "Italy", family: "green", cloth_hex: CLOTH.green, status: "live", lat: 41.9028, lng: 12.4964 },
          ],
        };
        rebuildStampsFromPlaces();
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wire();
    Promise.all([loadPlaces(), tryGeolocation(), loadMe()]).then(() => {
      const resolved = resolveCountryId(state.countryId);
      state.countryId = resolved;
      localStorage.setItem("stampd-preview-country", resolved);
      if (localStorage.getItem("stampd-preview-country") === "default") {
        localStorage.setItem("stampd-preview-country", resolved);
      }
      rebuildStampsFromPlaces();
      showScreen("home");
    });
  });
})();
