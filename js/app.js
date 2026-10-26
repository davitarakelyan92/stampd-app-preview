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
    galleryFromCountries: false,
    galleryFromMe: false,
    chromeReturn: "home", // screen to return to from stamps-list / balance
    coinsPreview: null, // local override for demo bumps; null = use me.json
    tradeOfferPlaceId: null,
    tradeOfferStep: "countries", // countries | stamps
    tradeOfferCountry: null,
    tradeCountdownTimer: null,
    detailFromStampsList: false,
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

  window.stampdPlaceChapter = function (id) {
    const p = placeById(id);
    return (p && p.chapter) || null;
  };

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

  function photoForPlace(placeOrId) {
    if (!placeOrId) return "";
    const place = typeof placeOrId === "string" ? placeById(placeOrId) : placeOrId;
    if (!place) return "";
    const raw = place.photo || place.image || "";
    if (!raw) return "";
    return String(raw);
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
      photo: place.photo || place.image || "",
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
    /* Order: collected → open → unavailable. Reserve 1 open + 1 unavailable
       when present so the 4-up still shows all three states (Arp). */
    const out = [];
    const reserveOpen = buckets.open.length ? 1 : 0;
    const reserveUnavail = buckets.unavailable.length ? 1 : 0;
    const maxCollected = Math.min(buckets.collected.length, Math.max(0, 4 - reserveOpen - reserveUnavail));
    for (let i = 0; i < maxCollected; i++) {
      out.push({ place: buckets.collected.shift(), kind: "collected" });
    }
    const maxOpen = Math.min(buckets.open.length, Math.max(0, 4 - out.length - reserveUnavail));
    for (let i = 0; i < maxOpen; i++) {
      out.push({ place: buckets.open.shift(), kind: "open" });
    }
    while (out.length < 4 && buckets.unavailable.length) {
      out.push({ place: buckets.unavailable.shift(), kind: "unavailable" });
    }
    while (out.length < 4 && buckets.open.length) {
      out.push({ place: buckets.open.shift(), kind: "open" });
    }
    while (out.length < 4 && buckets.collected.length) {
      out.push({ place: buckets.collected.shift(), kind: "collected" });
    }
    return out;
  }

  function thumbHtml(entry) {
    const place = entry.place;
    const kind = entry.kind;
    const cls =
      kind === "collected" ? "is-collected" : kind === "unavailable" ? "is-unavailable" : "is-open";
    const stroke =
      kind === "collected" ? "#1B2747" : kind === "unavailable" ? "#C8C4BC" : "#A3AABA";
    /* Always draw place line-art (or chapter graphic mark) — never a photo face */
    let icon = "";
    if (typeof wiIcon === "function") {
      icon = wiIcon(place.id, { size: 18, stroke, sw: 2.2 });
    } else if (typeof wiIconDef === "function") {
      const d = wiIconDef(place.id);
      icon = `<svg width="18" height="18" viewBox="0 0 64 64" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${d.line}"/></svg>`;
    }
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
      const chromeOnCountries =
        (name === "stamps-list" || name === "balance") && state.chromeReturn === "home";
      const chromeOnTrade =
        (name === "stamps-list" || name === "balance") && state.chromeReturn === "trade";
      const chromeOnMe =
        (name === "stamps-list" || name === "balance") && state.chromeReturn === "me";
      const on =
        (tab === "countries" &&
          (name === "home" ||
            chromeOnCountries ||
            (state.galleryFromCountries && (name === "album" || name === "detail")))) ||
        (tab === "support" && name === "support") ||
        (tab === "map" && name === "map") ||
        (tab === "trade" && (name === "trade" || chromeOnTrade)) ||
        (tab === "me" &&
          (name === "me" ||
            chromeOnMe ||
            (state.galleryFromMe && (name === "album" || name === "detail"))));
      btn.classList.toggle("on", on);
    });
    if (name === "home") renderHome();
    if (name === "album") renderAlbum();
    if (name === "support") renderSupport();
    if (name === "trade") renderTrade();
    if (name === "me") renderMe();
    if (name === "detail") renderDetail();
    if (name === "stamps-list") renderStampsList();
    if (name === "balance") renderBalance();
    if (name === "home" || name === "trade" || name === "me") renderBalanceChrome();
  }

  function renderHome() {
    const c = country();
    state.countryId = c.id;
    renderCountriesLists();
    renderBalanceChrome();
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


  /* ── Coins / Trade helpers (Kar me.json v2 aliases) ── */
  function stampsCollectedCount() {
    const d = state.meData;
    if (!d) return 0;
    if (typeof d.stamps_collected === "number") return d.stamps_collected;
    if (d.profile && typeof d.profile.stamps_collected === "number") return d.profile.stamps_collected;
    const ids = d.collected_place_ids;
    return Array.isArray(ids) ? ids.length : 0;
  }

  function coinsBalance() {
    if (typeof state.coinsPreview === "number") return state.coinsPreview;
    const d = state.meData;
    if (!d) return 0;
    if (typeof d.coins === "number") return d.coins;
    if (d.profile && typeof d.profile.coins === "number") return d.profile.coins;
    return 0;
  }

  function syncCoinsFromMe() {
    if (state.meData && typeof state.coinsPreview !== "number") {
      state.coinsPreview = coinsBalance();
    }
  }

  function bumpCoins(amount, toastMsg) {
    const base = coinsBalance();
    state.coinsPreview = base + amount;
    renderBalanceChrome();
    if (state.screen === "me") renderMe();
    if (state.screen === "trade") renderTrade();
    if (toastMsg) softToast(toastMsg);
  }

  /** Prefer duplicates[{id,count}] (count = extras/spares). Fall back to duplicate_place_ids. */
  function duplicateEntries() {
    const d = state.meData || {};
    const out = [];
    const seen = new Set();
    if (Array.isArray(d.duplicates)) {
      d.duplicates.forEach((row) => {
        if (!row || !row.id) return;
        const extras = typeof row.count === "number" ? row.count : typeof row.extras === "number" ? row.extras : 1;
        if (extras < 1) return;
        out.push({ id: row.id, extras });
        seen.add(row.id);
      });
    }
    const ids =
      (Array.isArray(d.duplicate_place_ids) && d.duplicate_place_ids) ||
      (d.trade && Array.isArray(d.trade.duplicate_place_ids) && d.trade.duplicate_place_ids) ||
      [];
    ids.forEach((id) => {
      if (!id || seen.has(id)) return;
      out.push({ id, extras: 1 });
      seen.add(id);
    });
    return out;
  }

  function tradeOffers() {
    const d = state.meData || {};
    if (Array.isArray(d.trade_offers) && d.trade_offers.length) return d.trade_offers;
    if (d.trade && Array.isArray(d.trade.exchange_offers)) return d.trade.exchange_offers;
    return [];
  }

  function countryNameForPlace(place) {
    if (!place) return "";
    const code = String(place.country || "").toUpperCase();
    const row = countriesAll().find((c) => String(c.id || "").toUpperCase() === code || String(c.code || "").toUpperCase() === code);
    return (row && row.name) || code || "";
  }

  function balanceChromeHtml() {
    const stamps = stampsCollectedCount();
    const coins = coinsBalance();
    const stampSvg =
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 10h6M9 14h4"/></svg>';
    const coinSvg =
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/></svg>';
    return `<button type="button" class="balance-pill stamps" data-chrome-stamps title="Stamps collected" aria-label="Stamps collected, ${stamps}">${stampSvg}<span>${stamps}</span></button><button type="button" class="balance-pill coins" data-chrome-coins title="Coins" aria-label="Coins, ${coins}">${coinSvg}<span>${coins}</span></button>`;
  }

  function renderBalanceChrome() {
    document.querySelectorAll("[data-balance-chrome]").forEach((el) => {
      el.innerHTML = balanceChromeHtml();
      el.querySelectorAll("[data-chrome-stamps]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          openStampsList();
        });
      });
      el.querySelectorAll("[data-chrome-coins]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          openBalance();
        });
      });
    });
  }

  function rememberChromeReturn() {
    if (state.screen === "stamps-list" || state.screen === "balance") return;
    if (state.screen === "home" || state.screen === "trade" || state.screen === "me") {
      state.chromeReturn = state.screen;
    } else if (state.galleryFromMe) {
      state.chromeReturn = "me";
    } else if (state.galleryFromCountries) {
      state.chromeReturn = "home";
    } else {
      state.chromeReturn = "home";
    }
  }

  function openStampsList() {
    rememberChromeReturn();
    showScreen("stamps-list");
  }

  function openBalance() {
    rememberChromeReturn();
    showScreen("balance");
  }

  function closeChromeOverlay() {
    const back = state.chromeReturn || "home";
    showScreen(back);
  }

  function ownedCopyCount(dup) {
    /* duplicates[].count = extras/spares; total copies = 1 collected + extras */
    const extras = dup && typeof dup.extras === "number" ? dup.extras : 1;
    return 1 + Math.max(0, extras);
  }

  function stampColorForId(id, index) {
    const existing = stamps.find((s) => s.icon === id);
    if (existing && existing.color) return existing.color;
    let h = 0;
    const s = String(id || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return STAMP_COLORS[(typeof index === "number" ? index : h) % STAMP_COLORS.length];
  }

  function copiesForPlaceId(id) {
    const dups = duplicateEntries();
    const row = dups.find((d) => d.id === id);
    if (row) return ownedCopyCount(row);
    const collected = collectedIdSet();
    return collected.has(id) ? 1 : 0;
  }

  /** Sample "available again" countdown — deterministic per place, soft-ticks. */
  function tradeCountdownMs(placeId) {
    let h = 0;
    const s = String(placeId || "x");
    for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
    const total = 4 * 3600e3 + (h % (20 * 3600e3)); /* 4–24h sample window */
    const elapsed = (Date.now() / 1000 | 0) % Math.floor(total / 1000);
    return total - elapsed * 1000;
  }

  function formatCountdown(ms) {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
    return `${m}m ${String(s).padStart(2, "0")}s`;
  }

  function tradeStampHtml(dup, index) {
    const place = placeById(dup.id);
    const name = (place && place.name) || dup.id;
    const color = stampColorForId(dup.id, index);
    const opts = {
      ...STAMP_OPTS,
      icon: dup.id,
      color,
      state: "earned",
      note: "",
      name,
      w: 78,
      h: 96,
      P: 6,
      labelSize: 8.5,
      hideLabel: true,
      photo: (place && (place.photo || place.image)) || photoForPlace(dup.id) || "",
    };
    const svg = typeof digitalStamp === "function" ? digitalStamp(opts) : "";
    const copies = ownedCopyCount(dup);
    return `<div class="trade-stamp-wrap">${svg}<span class="trade-count" aria-label="${copies} copies">×${copies}</span></div>`;
  }

  function listStampCardHtml(place, index) {
    const id = place.id;
    const name = place.name || id;
    const color = stampColorForId(id, index);
    const copies = copiesForPlaceId(id);
    const opts = {
      ...STAMP_OPTS,
      icon: id,
      color,
      state: "earned",
      note: "",
      name,
      w: 118,
      h: 146,
      P: 8,
      labelSize: 10,
      photo: place.photo || place.image || photoForPlace(id) || "",
    };
    const svg = typeof digitalStamp === "function" ? digitalStamp(opts) : "";
    const safe = String(name).replace(/"/g, "&quot;");
    return `<button type="button" class="stamps-grid-card" data-stamp-open="${id}" aria-label="${safe}">
      <div class="stamps-grid-stamp">${svg}${copies > 1 ? `<span class="trade-count" aria-label="${copies} copies">×${copies}</span>` : `<span class="trade-count" aria-label="1 copy">×1</span>`}</div>
    </button>`;
  }

  function renderStampsList() {
    const root = document.getElementById("stamps-list-root");
    if (!root) return;
    const ids = (state.meData && state.meData.collected_place_ids) || [];
    const places = ids.map((id) => placeById(id)).filter(Boolean);
    const byCountry = {};
    places.forEach((p) => {
      const code = String(p.country || "?").toUpperCase();
      if (!byCountry[code]) byCountry[code] = [];
      byCountry[code].push(p);
    });
    const countryOrder = Object.keys(byCountry).sort((a, b) => {
      const na = countryNameForPlace({ country: a }) || a;
      const nb = countryNameForPlace({ country: b }) || b;
      return na.localeCompare(nb);
    });

    if (!places.length) {
      root.innerHTML = `<p class="stamps-list-lede">No collected stamps yet.</p>`;
      return;
    }

    let html = `<p class="stamps-list-lede">${places.length} collected · grouped by country &amp; chapter</p>`;
    let stampIdx = 0;
    countryOrder.forEach((code) => {
      const list = sortPlaces(byCountry[code]);
      const cname = countryNameForPlace({ country: code }) || code;
      html += `<div class="stamps-country-block"><div class="stamps-country-k">${cname}</div>`;
      const byCh = {};
      list.forEach((p) => {
        const ch = p.chapter || "Other";
        if (!byCh[ch]) byCh[ch] = [];
        byCh[ch].push(p);
      });
      const chapters = Object.keys(byCh).sort((a, b) => chapterRank(a) - chapterRank(b));
      chapters.forEach((ch) => {
        html += `<div class="stamps-chapter-k">${ch}</div><div class="stamps-grid">`;
        byCh[ch].forEach((p) => {
          html += listStampCardHtml(p, stampIdx++);
        });
        html += `</div>`;
      });
      html += `</div>`;
    });
    root.innerHTML = html;
    root.querySelectorAll("[data-stamp-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.stampOpen;
        const place = placeById(id);
        if (place && place.country) {
          const code = String(place.country).toLowerCase();
          const row = countriesAll().find(
            (c) => String(c.id).toLowerCase() === code || String(c.code || "").toLowerCase() === code
          );
          if (row && row.status !== "coming_soon") {
            state.countryId = row.id;
            rebuildStampsFromPlaces();
          }
        }
        state.detailFromStampsList = true;
        openDetail(id);
      });
    });
  }

  function renderBalance() {
    const root = document.getElementById("balance-root");
    if (!root) return;
    const coins = coinsBalance();
    const ledger = (state.meData && (state.meData.coin_ledger_sample || state.meData.coin_ledger)) || [];
    const coinSvg =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/></svg>';
    let ledgerHtml = "";
    if (Array.isArray(ledger) && ledger.length) {
      ledgerHtml =
        `<div class="balance-ledger"><div class="bl-k">Recent</div>` +
        ledger
          .slice(0, 6)
          .map((row) => {
            const label = row.label || row.note || row.reason || "Coins";
            const amt = typeof row.amount === "number" ? row.amount : typeof row.coins === "number" ? row.coins : 0;
            const cls = amt >= 0 ? "plus" : "minus";
            const sign = amt > 0 ? "+" : "";
            return `<div class="bl-row"><span>${label}</span><span class="amt ${cls}">${sign}${amt}</span></div>`;
          })
          .join("") +
        `</div>`;
    }
    root.innerHTML = `
      <div class="balance-hero">
        <div class="bh-k">Your coins</div>
        <div class="bh-v">${coinSvg}<span>${coins}</span></div>
        <div class="bh-sub">Preview balance · sample top-up &amp; send</div>
      </div>
      <div class="balance-actions">
        <button type="button" class="btn-primary" id="bal-topup">Top up</button>
        <button type="button" class="btn-secondary" id="bal-send">Send</button>
        <button type="button" class="btn-secondary" id="bal-withdraw">Withdraw</button>
      </div>
      ${ledgerHtml}`;
    const top = document.getElementById("bal-topup");
    const send = document.getElementById("bal-send");
    const wit = document.getElementById("bal-withdraw");
    if (top)
      top.addEventListener("click", () => {
        bumpCoins(50, "+50 coins · top up (demo)");
        renderBalance();
      });
    if (send) send.addEventListener("click", () => softToast("Send coins — preview stub"));
    if (wit) wit.addEventListener("click", () => softToast("Withdraw — preview stub"));
  }

  function liveCountriesForOffer() {
    return sortLiveCountries(liveCountries()).filter((c) => c && c.status !== "coming_soon");
  }

  function fillTradeOfferBody() {
    const body = document.getElementById("trade-offer-body");
    const back = document.getElementById("offer-back");
    const title = document.getElementById("trade-offer-title");
    const lede = document.getElementById("trade-offer-lede");
    if (!body) return;
    const give = placeById(state.tradeOfferPlaceId);
    const giveName = (give && give.name) || state.tradeOfferPlaceId || "stamp";

    if (state.tradeOfferStep === "stamps" && state.tradeOfferCountry) {
      const code = String(state.tradeOfferCountry.id || state.tradeOfferCountry.code || "").toUpperCase();
      const cname = state.tradeOfferCountry.name || code;
      if (title) title.textContent = cname;
      if (lede) lede.textContent = `Choose a stamp to exchange for your ${giveName}.`;
      if (back) back.hidden = false;
      const places = sortPlaces(placesForCountryCode(code));
      if (!places.length) {
        body.innerHTML = `<p class="trade-offer-empty">No stamps in this collection yet.</p>`;
        return;
      }
      const byCh = {};
      places.forEach((p) => {
        const ch = p.chapter || "Other";
        if (!byCh[ch]) byCh[ch] = [];
        byCh[ch].push(p);
      });
      const chapters = Object.keys(byCh).sort((a, b) => chapterRank(a) - chapterRank(b));
      let html = "";
      chapters.forEach((ch) => {
        html += `<div class="trade-offer-ch">${ch}</div>`;
        byCh[ch].forEach((p) => {
          const safe = String(p.name || p.id).replace(/"/g, "&quot;");
          let icon = "";
          if (typeof wiIcon === "function") icon = wiIcon(p.id, { size: 22, stroke: "#1B2747", sw: 2.2 });
          html += `<button type="button" class="trade-pick-row" data-want="${p.id}">
            <span class="sr-thumb">${icon}</span>
            <span class="sr-meta"><span class="sr-name">${safe}</span><span class="sr-sub">${ch}</span></span>
          </button>`;
        });
      });
      body.innerHTML = html;
      body.querySelectorAll("[data-want]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const want = placeById(btn.dataset.want);
          const wantName = (want && want.name) || btn.dataset.want;
          closeTradeOfferSheet();
          softToast(`Offered against ${wantName}`);
        });
      });
      return;
    }

    /* countries step */
    if (title) title.textContent = "Make an offer";
    if (lede) lede.textContent = `Exchange your ${giveName} — pick a collection, then a stamp.`;
    if (back) back.hidden = true;
    const countries = liveCountriesForOffer();
    if (!countries.length) {
      body.innerHTML = `<p class="trade-offer-empty">No collections available.</p>`;
      return;
    }
    body.innerHTML = countries
      .map((c) => {
        const code = String(c.id || c.code || "").toUpperCase();
        const n = placesForCountryCode(code).length;
        return `<button type="button" class="trade-pick-country" data-offer-country="${c.id}">
          <span class="tpc-name">${c.name || code}</span>
          <span class="tpc-sub">${n} stamps</span>
        </button>`;
      })
      .join("");
    body.querySelectorAll("[data-offer-country]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = countriesAll().find((c) => c.id === btn.dataset.offerCountry);
        if (!row) return;
        state.tradeOfferStep = "stamps";
        state.tradeOfferCountry = row;
        fillTradeOfferBody();
      });
    });
  }

  function openTradeOfferSheet(placeId) {
    state.tradeOfferPlaceId = placeId;
    state.tradeOfferStep = "countries";
    state.tradeOfferCountry = null;
    fillTradeOfferBody();
    const bd = document.getElementById("trade-offer-sheet");
    if (bd) bd.classList.add("on");
  }

  function closeTradeOfferSheet() {
    state.tradeOfferPlaceId = null;
    state.tradeOfferStep = "countries";
    state.tradeOfferCountry = null;
    const bd = document.getElementById("trade-offer-sheet");
    if (bd) bd.classList.remove("on");
  }

  function refreshTradeCountdowns() {
    document.querySelectorAll("[data-countdown-for]").forEach((el) => {
      const id = el.getAttribute("data-countdown-for");
      const v = el.querySelector(".tc-v");
      const label = formatCountdown(tradeCountdownMs(id));
      if (v) v.textContent = label;
      else el.innerHTML = `<span class="tc-k">Again in</span><span class="tc-v">${label}</span>`;
    });
  }

  function ensureTradeCountdownTicker() {
    if (state.tradeCountdownTimer) return;
    state.tradeCountdownTimer = setInterval(() => {
      if (state.screen !== "trade") return;
      refreshTradeCountdowns();
    }, 1000);
  }

  function renderTrade() {
    const root = document.getElementById("trade-root");
    if (!root) return;
    renderBalanceChrome();
    ensureTradeCountdownTicker();
    if (state.meStatus === "loading" || state.meStatus === "idle") {
      root.innerHTML = `<div class="trade-empty"><p class="trade-empty-title">Loading trades…</p><p class="trade-empty-sub">Fetching your duplicates.</p></div>`;
      if (state.meStatus === "idle") loadMe().then(renderTrade);
      return;
    }

    const dups = duplicateEntries();
    const offers = tradeOffers();
    const rules = (state.meData && state.meData.coin_rules) || {};
    const chapterBonus = rules.chapter_complete_coins || 50;
    const countryBonus = rules.country_complete_coins || 200;

    const callout = `<div class="trade-callout">
      <p>Complete a country set to earn coins. Chapter +${chapterBonus} · full country +${countryBonus}. Duplicates don’t mint coins — they power Trade.</p>
      <button type="button" class="btn-primary" id="demo-complete-set">Demo: complete a set (+${chapterBonus})</button>
    </div>`;

    let listHtml;
    if (!dups.length) {
      listHtml = `<div class="trade-empty"><p class="trade-empty-title">No duplicates yet</p><p class="trade-empty-sub">Revisit a place you’ve already stamped to earn a spare for exchange.</p></div>`;
    } else {
      listHtml =
        `<div class="trade-section-k">Your duplicates</div><div class="trade-list">` +
        dups
          .map((dup, i) => {
            const place = placeById(dup.id);
            const name = (place && place.name) || dup.id;
            const country = countryNameForPlace(place);
            const copies = ownedCopyCount(dup);
            const stampHtml = tradeStampHtml(dup, i);
            const cd = formatCountdown(tradeCountdownMs(dup.id));
            return `<div class="trade-card" data-dup="${dup.id}">
              <div class="trade-card-main">
                <div class="trade-thumb">${stampHtml}</div>
                <div class="trade-info">
                  <p class="trade-name">${name}</p>
                  <p class="trade-meta">${country || "Stamp"} · ${copies} ${copies === 1 ? "copy" : "copies"}</p>
                </div>
                <div class="trade-countdown" data-countdown-for="${dup.id}" title="Available again">
                  <span class="tc-k">Again in</span>
                  <span class="tc-v">${cd}</span>
                </div>
              </div>
              <div class="trade-actions">
                <button type="button" class="btn-primary" data-offer="${dup.id}">Make an offer</button>
                <button type="button" class="btn-secondary" data-offer-coins="${dup.id}">Exchange for Coins</button>
              </div>
            </div>`;
          })
          .join("") +
        `</div>`;
    }

    let offersHtml = "";
    if (offers.length) {
      offersHtml =
        `<div><div class="trade-section-k">Open offers</div><div class="trade-offers">` +
        offers
          .map((o) => {
            const give = placeById(o.give_place_id);
            const want = placeById(o.want_place_id);
            const giveName = (give && give.name) || o.give_place_id;
            const wantName = (want && want.name) || o.want_place_id || "a stamp";
            const st = String(o.status || "open").toLowerCase();
            return `<div class="trade-offer">
              <div class="trade-offer-row">
                <p class="trade-offer-note">${o.note || `${giveName} → ${wantName}`}</p>
                <span class="trade-status ${st}">${st}</span>
              </div>
              <p class="trade-offer-sub">Give ${giveName} · want ${wantName}</p>
            </div>`;
          })
          .join("") +
        `</div></div>`;
    }

    root.innerHTML = callout + listHtml + offersHtml;

    const demo = document.getElementById("demo-complete-set");
    if (demo) {
      demo.addEventListener("click", () => {
        bumpCoins(chapterBonus, `+${chapterBonus} coins · chapter complete (demo)`);
      });
    }
    root.querySelectorAll("[data-offer]").forEach((btn) => {
      btn.addEventListener("click", () => openTradeOfferSheet(btn.dataset.offer));
    });
    root.querySelectorAll("[data-offer-coins]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const place = placeById(btn.dataset.offerCoins);
        const name = (place && place.name) || btn.dataset.offerCoins;
        softToast(`Listed ${name} for 40 coins`);
      });
    });
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

  const ACH_THEME_STYLE = {
    milestone: { accent: "#FF5B4A", tint: "#FFE4DE", ink: "#C8372A" },
    chapter: { accent: "#2E9BEA", tint: "#DCEFFB", ink: "#1471B8" },
    country: { accent: "#1B2747", tint: "#E4E8F0", ink: "#1B2747" },
    seasonal: { accent: "#6B3FC4", tint: "#EDE6FA", ink: "#6B3FC4" },
    travel: { accent: "#FFA234", tint: "#FFE8C8", ink: "#A35A00" },
    distance: { accent: "#34D1A0", tint: "#D5F5EA", ink: "#0F7F5F" },
  };

  function achThemeStyle(theme) {
    return ACH_THEME_STYLE[theme] || ACH_THEME_STYLE.milestone;
  }

  function claimedAchievementIds() {
    try {
      const raw = localStorage.getItem("stampd-ach-claimed");
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (_) {
      return new Set();
    }
  }

  function markAchievementClaimed(id) {
    const set = claimedAchievementIds();
    set.add(id);
    localStorage.setItem("stampd-ach-claimed", JSON.stringify([...set]));
  }

    function achievementIcon(id, earned, theme) {
    if (typeof window.achievementIconSvg === "function") {
      return window.achievementIconSvg(id, theme);
    }
    if (window.WI_ACHIEVEMENT_ICONS && id && window.WI_ACHIEVEMENT_ICONS[id]) {
      return window.WI_ACHIEVEMENT_ICONS[id];
    }
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

    const claimed = claimedAchievementIds();
    const achHtml = achievements
      .map((a) => {
        const earned = !!a.earned_at;
        const title = a.title || a.name || "Achievement";
        const desc = a.description || a.desc || "";
        const reward = Number(a.coin_reward) || 30;
        const style = achThemeStyle(a.theme);
        const isClaimed = claimed.has(a.id);
        let cta;
        if (!earned) {
          cta = `<button type="button" class="me-ach-cta is-locked-hint" disabled>Locked · +${reward} coins</button>`;
        } else if (isClaimed) {
          cta = `<button type="button" class="me-ach-cta is-claimed" disabled>Coins collected</button>`;
        } else {
          cta = `<button type="button" class="me-ach-cta" data-ach-claim="${a.id}" data-ach-coins="${reward}">Collect ${reward} coins</button>`;
        }
        return `<div class="me-ach ${earned ? "" : "locked"}" style="--ach-accent:${style.accent};--ach-tint:${style.tint};--ach-ink:${style.ink}">
          <div class="me-ach-ico">${achievementIcon(a.id, earned, a.theme)}</div>
          <p class="me-ach-title">${title}</p>
          <p class="me-ach-desc">${desc}</p>
          <span class="me-ach-reward"><b>+${reward}</b> coins</span>
          ${cta}
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
          <div class="meta-row"><span class="meta-k">Stamps collected</span><span class="meta-v">${profile.stamps_collected ?? stampsCollectedCount()}</span></div>
          <div class="meta-row"><span class="meta-k">Coins</span><span class="meta-v">${coinsBalance()}</span></div>
          <div class="meta-row"><span class="meta-k">Member since</span><span class="meta-v">${memberLabel}</span></div>
        </div>
      </div>
    </div>`;

    root.querySelectorAll("[data-me-country]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openMeCountryCollection(btn.dataset.meCountry);
      });
    });

    root.querySelectorAll("[data-ach-claim]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.achClaim;
        const coins = Number(btn.dataset.achCoins) || 0;
        if (!id || claimedAchievementIds().has(id)) return;
        markAchievementClaimed(id);
        const cur = coinsBalance();
        state.coinsPreview = cur + coins;
        renderBalanceChrome();
        renderMe();
        const toast = document.getElementById("checkin-toast");
        if (toast) {
          toast.textContent = `+${coins} coins from achievement`;
          toast.classList.add("on");
          setTimeout(() => toast.classList.remove("on"), 2200);
        }
      });
    });
    renderBalanceChrome();
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
        if (typeof state.coinsPreview !== "number") {
          state.coinsPreview =
            typeof data.coins === "number"
              ? data.coins
              : data.profile && typeof data.profile.coins === "number"
                ? data.profile.coins
                : 0;
        }
        rebuildStampsFromPlaces();
        renderBalanceChrome();
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
          photo: s.photo || photoForPlace(s.icon) || "",
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
    if (k && h1) {
      /* Davit: lede is STAMPD only — country name lives in the big title */
      k.textContent = "STAMPD";
      if (c.id === "am") {
        h1.textContent = "Armenia";
      } else if (c.id === "it") {
        h1.textContent = "Italy";
      } else {
        h1.textContent = c.name || "Gallery";
      }
    }

    const sub = document.getElementById("album-sub");
    if (sub) {
      const chapters = Object.keys(chapterCounts()).filter((key) => key !== "All").length;
      sub.textContent = `${total} icons in ${chapters} chapters`;
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
    state.galleryFromCountries = true;
    state.galleryFromMe = false;
    showScreen("album");
  }

  function openMeCountryCollection(id) {
    const resolved = resolveCountryId(id);
    const row = countriesAll().find((c) => c.id === resolved || String(c.id).toLowerCase() === String(id).toLowerCase());
    if (!row || row.status === "coming_soon") {
      softToast("Coming soon");
      return;
    }
    state.countryId = row.id;
    localStorage.setItem("stampd-preview-country", row.id);
    rebuildStampsFromPlaces();
    state.galleryFromMe = true;
    state.galleryFromCountries = false;
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
      photo: stamp.photo || (place && (place.photo || place.image)) || photoForPlace(stamp.icon) || "",
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
    const hasCoords =
      place && typeof place.lat === "number" && typeof place.lng === "number";
    const mapsUrl = hasCoords
      ? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
      : null;
    const mapCta = mapsUrl
      ? `<a class="detail-map-cta" href="${mapsUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open in Google Maps" title="Open in Google Maps"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-6.5-5.2-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.8 12 21 12 21z" fill="#fff"/><circle cx="12" cy="10.8" r="2.35" fill="#FF5B4A"/></svg></a>`
      : "";
    meta.innerHTML = `
      <div class="meta-rows">
        <div class="meta-row"><span class="meta-k">Distance</span><span class="meta-v">${dist}</span></div>
        <div class="meta-row"><span class="meta-k">Coordinates</span><span class="meta-v">${coords}</span></div>
      </div>
      ${mapCta}`;

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
      photo: photoForPlace("trevi") || "",
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
      photo: photoForPlace("trevi") || "",
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
        if (t !== "stamp") {
          state.galleryFromCountries = false;
          state.galleryFromMe = false;
        }
        if (t === "countries") showScreen("home");
        else if (t === "support") showScreen("support");
        else if (t === "map") showScreen("map");
        else if (t === "trade") showScreen("trade");
        else if (t === "me") showScreen("me");
        else if (t === "stamp") {
          /* FAB: open check-in when Trevi available; else current-country gallery (Countries tab stays on) */
          const needIt = state.countryId !== "it";
          if (needIt) {
            state.countryId = "it";
            localStorage.setItem("stampd-preview-country", "it");
            rebuildStampsFromPlaces();
          }
          const trevi = stamps.find((s) => s.icon === "trevi");
          if (trevi && trevi.state !== "earned" && !state.treviEarned) {
            state.galleryFromCountries = true;
            showScreen("album");
            openCheckin();
          } else {
            openCountryGallery(state.countryId || firstLiveCountryId());
            softToast("Gallery · Stamp FAB");
          }
        }
      });
    });

    const offerCancel = document.getElementById("offer-cancel");
    const offerBack = document.getElementById("offer-back");
    const offerSheet = document.getElementById("trade-offer-sheet");
    if (offerCancel) offerCancel.addEventListener("click", closeTradeOfferSheet);
    if (offerBack) {
      offerBack.addEventListener("click", () => {
        state.tradeOfferStep = "countries";
        state.tradeOfferCountry = null;
        fillTradeOfferBody();
      });
    }
    if (offerSheet) {
      offerSheet.addEventListener("click", (e) => {
        if (e.target.id === "trade-offer-sheet") closeTradeOfferSheet();
      });
    }


    document.getElementById("album-back").addEventListener("click", () => {
      if (state.galleryFromMe) {
        state.galleryFromMe = false;
        showScreen("me");
        return;
      }
      state.galleryFromCountries = false;
      showScreen("home");
    });
    const stampsListBack = document.getElementById("stamps-list-back");
    if (stampsListBack) stampsListBack.addEventListener("click", closeChromeOverlay);
    const balanceBack = document.getElementById("balance-back");
    if (balanceBack) balanceBack.addEventListener("click", closeChromeOverlay);
    const faq = document.getElementById("support-faq");
    if (faq) faq.addEventListener("click", () => softToast("FAQ coming soon"));
    const supportBack = document.getElementById("support-back");
    if (supportBack) supportBack.addEventListener("click", () => showScreen("home"));
    document.getElementById("detail-back").addEventListener("click", () => {
      if (state.detailFromStampsList) {
        state.detailFromStampsList = false;
        showScreen("stamps-list");
        return;
      }
      showScreen("album");
    });

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
      const params = new URLSearchParams(location.search || "");
      const smokeCountry = (params.get("country") || params.get("smokeCountry") || "").trim();
      const smokeDetail = (params.get("detail") || params.get("smokeDetail") || "").trim();
      const resolved = resolveCountryId(smokeCountry || state.countryId);
      state.countryId = resolved;
      localStorage.setItem("stampd-preview-country", resolved);
      if (localStorage.getItem("stampd-preview-country") === "default") {
        localStorage.setItem("stampd-preview-country", resolved);
      }
      rebuildStampsFromPlaces();
      if (smokeCountry) {
        openCountryGallery(resolved);
        if (smokeDetail) openDetail(smokeDetail);
      } else {
        showScreen("home");
      }
    });
  });
})();
