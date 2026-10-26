/* Stampd Admin — local working copy.
   Loads data/*.json, keeps edits in localStorage (stampd-admin-v1).
   Nothing here writes back to GitHub. */
(function () {
  const KEY = "stampd-admin-v1";
  const SCRIPT = document.currentScript && document.currentScript.src;
  const REPO = new URL("../../", SCRIPT || location.href);

  const CHAPTERS = ["Monuments", "Foods", "Visit", "Seasonal"];
  const FAMILIES = ["blue", "red", "green", "black", "orange"];

  const state = {
    ready: false,
    error: null,
    storageError: null,
    savedAt: null,
    placesDoc: null,
    countriesDoc: null,
    meDoc: null,
    extras: null,
    repoSig: "",
  };

  const listeners = [];
  let ignoreSaved = false;

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function emit() {
    listeners.forEach((fn) => fn(state));
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function touch(doc) {
    if (doc && typeof doc === "object") doc.updated = today();
  }

  function bundleOf(src) {
    return JSON.stringify({
      placesDoc: src.placesDoc,
      countriesDoc: src.countriesDoc,
      meDoc: src.meDoc,
      extras: src.extras,
    });
  }

  function isDirty() {
    if (!state.ready || !state.repoSig) return false;
    return bundleOf(state) !== state.repoSig;
  }

  function assetUrl(photo) {
    if (!photo) return "";
    const value = String(photo).trim();
    if (!value) return "";
    if (/^(https?:|data:)/i.test(value)) return value;
    return new URL(value.replace(/^\/+/, ""), REPO).href;
  }

  async function getJson(rel) {
    const res = await fetch(new URL(rel, REPO).href, { cache: "no-cache" });
    if (!res.ok) throw new Error(rel + " (" + res.status + ")");
    return res.json();
  }

  function seedExtras(me) {
    const profile = (me && me.profile) || {};
    const collected = ((me && me.collected_place_ids) || []).slice();
    return {
      version: 1,
      users: [
        {
          id: "user-ani",
          primary: true,
          name: profile.display_name || "Ani Sargsyan",
          email: "ani@example.stampd",
          home_city: profile.home_city || "Yerevan",
          home_country: profile.home_country || "AM",
          passport_country_id: profile.active_passport_country_id || "am",
          coins: Number(me && me.coins != null ? me.coins : profile.coins) || 0,
          status: "active",
          collected_place_ids: collected,
          member_since: profile.member_since || "2024-06-02",
          bio: profile.bio || "",
        },
        {
          id: "user-luca",
          primary: false,
          name: "Luca Romano",
          email: "luca@example.stampd",
          home_city: "Rome",
          home_country: "IT",
          passport_country_id: "it",
          coins: 520,
          status: "active",
          collected_place_ids: ["colosseum", "trevi", "pantheon", "pizza", "gelato"],
          member_since: "2025-04-11",
          bio: "Rome on weekends, stamps the rest of the week.",
        },
        {
          id: "user-mika",
          primary: false,
          name: "Mika Tanaka",
          email: "mika@example.stampd",
          home_city: "Tokyo",
          home_country: "JP",
          passport_country_id: "jp",
          coins: 95,
          status: "paused",
          collected_place_ids: ["eiffel", "taj", "lantern"],
          member_since: "2025-11-02",
          bio: "Paused while the next trip is planned.",
        },
        {
          id: "user-nino",
          primary: false,
          name: "Nino Papashvili",
          email: "nino@example.stampd",
          home_city: "Tbilisi",
          home_country: "GE",
          passport_country_id: "ge",
          coins: 40,
          status: "flagged",
          collected_place_ids: ["garni", "geghard"],
          member_since: "2026-01-19",
          bio: "Flagged sample — fictional traveller.",
        },
      ],
      promos: [
        {
          id: "promo-wine",
          title: "Wine Days · Armenia",
          body: "Limited seasonal stamps this week in Yerevan. Twilight frame on the album.",
          slot: "Countries banner",
          style: "Seasonal (twilight)",
          starts: "2026-10-27",
          ends: "2026-10-31",
          status: "live",
          cta: "See stamps",
        },
        {
          id: "promo-trade",
          title: "Trade bonus weekend",
          body: "Open a stamp-for-stamp offer and keep the spare in your trade pile.",
          slot: "Trade strip",
          style: "Standard coral CTA",
          starts: "2026-11-01",
          ends: "2026-11-02",
          status: "scheduled",
          cta: "Open Trade",
        },
        {
          id: "promo-italy",
          title: "Complete Italy · +200",
          body: "Every place in a live country still pays the country bonus.",
          slot: "Me card",
          style: "Navy informational",
          starts: "",
          ends: "",
          status: "live",
          cta: "View Italy",
        },
      ],
      tickets: [
        {
          id: "1042",
          type: "Trade",
          status: "open",
          unread: true,
          from: "Ani Sargsyan",
          subject: "Trade dispute",
          messages: [
            {
              role: "user",
              who: "Ani",
              at: "2026-10-26T14:12:00Z",
              text: "I traded Colosseum for Trevi. They cancelled after I confirmed — my stamp is gone and coins didn’t return.",
            },
            {
              role: "agent",
              who: "Support",
              at: "2026-10-26T14:28:00Z",
              text: "Thanks Ani — looking at the trade ledger now. Holding both sides until we confirm.",
            },
            {
              role: "user",
              who: "Ani",
              at: "2026-10-26T14:31:00Z",
              text: "OK. I still see Trevi as pending on my side.",
            },
          ],
        },
        {
          id: "1048",
          type: "Support",
          status: "open",
          unread: true,
          from: "Luca Romano",
          subject: "Passport cloth",
          messages: [
            {
              role: "user",
              who: "Luca",
              at: "2026-10-26T09:04:00Z",
              text: "Can I change passport cloth without resetting the album?",
            },
          ],
        },
        {
          id: "1051",
          type: "Account",
          status: "open",
          unread: true,
          from: "Nino Papashvili",
          subject: "Delete account",
          messages: [
            {
              role: "user",
              who: "Nino",
              at: "2026-10-25T16:40:00Z",
              text: "Please delete my account and export stamps.",
            },
          ],
        },
      ],
      roles: {
        matrix: {
          overview: { Admin: true, Editor: true, Support: true },
          countries: { Admin: true, Editor: true, Support: false },
          places: { Admin: true, Editor: true, Support: false },
          ads: { Admin: true, Editor: true, Support: false },
          trade: { Admin: true, Editor: true, Support: false },
          users_read: { Admin: true, Editor: true, Support: true },
          users_write: { Admin: true, Editor: false, Support: false },
          moderation: { Admin: true, Editor: false, Support: true },
          roles: { Admin: true, Editor: false, Support: false },
        },
        members: [{ id: "mem-arp", name: "Arp", email: "arp@example.stampd", role: "Admin" }],
      },
      activity: [],
    };
  }

  function fillExtras(extras, me) {
    const seed = seedExtras(me || state.meDoc || {});
    const src = extras && typeof extras === "object" ? extras : {};
    return {
      version: 1,
      users: Array.isArray(src.users) && src.users.length ? src.users : seed.users,
      promos: Array.isArray(src.promos) ? src.promos : seed.promos,
      tickets: Array.isArray(src.tickets) ? src.tickets : seed.tickets,
      roles: src.roles && src.roles.matrix ? src.roles : seed.roles,
      activity: Array.isArray(src.activity) ? src.activity : [],
    };
  }

  function syncCountryDocs() {
    if (!state.placesDoc || !state.countriesDoc) return;
    state.countriesDoc.countries = clone(state.placesDoc.countries || []);
    if (state.placesDoc.cloth_families) state.countriesDoc.cloth_families = clone(state.placesDoc.cloth_families);
    if (state.placesDoc.cover_ui) state.countriesDoc.cover_ui = clone(state.placesDoc.cover_ui);
  }

  function persist() {
    try {
      const savedAt = new Date().toISOString();
      localStorage.setItem(
        KEY,
        JSON.stringify({
          v: 1,
          savedAt: savedAt,
          placesDoc: state.placesDoc,
          countriesDoc: state.countriesDoc,
          meDoc: state.meDoc,
          extras: state.extras,
        })
      );
      state.savedAt = savedAt;
      state.storageError = null;
    } catch (err) {
      state.storageError =
        "This browser refused to store the catalog. Export JSON so these edits are not lost.";
    }
  }

  function commit(fn) {
    const result = fn();
    if (result === false) return;
    syncCountryDocs();
    persist();
    emit();
  }

  function log(text) {
    const list = state.extras.activity || (state.extras.activity = []);
    list.unshift({ id: "a" + Date.now(), text: text, at: new Date().toISOString() });
    if (list.length > 24) list.length = 24;
  }

  function countries() {
    return (state.placesDoc && state.placesDoc.countries) || [];
  }

  function places() {
    return (state.placesDoc && state.placesDoc.places) || [];
  }

  function countryById(id) {
    return countries().find((c) => c.id === id) || null;
  }

  function placeById(id) {
    return places().find((p) => p.id === id) || null;
  }

  function clothHex(family) {
    const map = (state.placesDoc && state.placesDoc.cloth_families) || {};
    return map[family] || "#1B2747";
  }

  function placeCount(countryId) {
    let n = 0;
    places().forEach((p) => {
      if (p.country_id === countryId) n += 1;
    });
    return n;
  }

  function alignMe(row) {
    if (!row || row.id === "default") return;
    const me = state.meDoc;
    me.countries = me.countries || [];
    let target = me.countries.find((c) => c.id === row.id);
    if (!target) {
      target = {
        id: row.id,
        name: row.name,
        visited: false,
        cloth_hex: row.cloth_hex,
        family: row.family,
        status: row.status,
        passport_cover: true,
        visited_at: null,
        stamps_earned: 0,
        stamps_total_in_catalog: placeCount(row.id),
      };
      me.countries.push(target);
    } else {
      target.name = row.name;
      target.cloth_hex = row.cloth_hex;
      target.family = row.family;
      target.status = row.status;
      target.stamps_total_in_catalog = placeCount(row.id);
    }
  }

  function alignMeOrder() {
    const order = countries().map((c) => c.id);
    const rank = (id) => {
      const i = order.indexOf(id);
      return i === -1 ? 9999 : i;
    };
    state.meDoc.countries.sort((a, b) => rank(a.id) - rank(b.id));
  }

  function recomputeEarned() {
    const ids = new Set(state.meDoc.collected_place_ids || []);
    const by = {};
    places().forEach((p) => {
      if (ids.has(p.id)) by[p.country_id] = (by[p.country_id] || 0) + 1;
    });
    (state.meDoc.countries || []).forEach((c) => {
      c.stamps_earned = by[c.id] || 0;
    });
  }

  function primaryUser() {
    return (state.extras.users || []).find((u) => u.primary) || null;
  }

  function pushPrimary() {
    const user = primaryUser();
    if (!user) return;
    const me = state.meDoc;
    me.profile = me.profile || {};
    me.profile.display_name = user.name;
    me.profile.home_city = user.home_city;
    me.profile.home_country = user.home_country;
    me.profile.active_passport_country_id = user.passport_country_id;
    me.profile.bio = user.bio || "";
    me.profile.member_since = user.member_since;
    me.profile.coins = Number(user.coins) || 0;
    me.profile.stamps_collected = (user.collected_place_ids || []).length;
    me.coins = Number(user.coins) || 0;
    me.stamps_collected = (user.collected_place_ids || []).length;
    me.collected_place_ids = (user.collected_place_ids || []).slice();
    recomputeEarned();
    touch(me);
  }

  function pullPrimary() {
    const user = primaryUser();
    if (!user) return;
    const profile = state.meDoc.profile || {};
    user.name = profile.display_name || user.name;
    user.home_city = profile.home_city || user.home_city;
    user.home_country = profile.home_country || user.home_country;
    user.passport_country_id = profile.active_passport_country_id || user.passport_country_id;
    user.bio = profile.bio || "";
    user.member_since = profile.member_since || user.member_since;
    user.coins = Number(state.meDoc.coins != null ? state.meDoc.coins : profile.coins) || 0;
    user.collected_place_ids = (state.meDoc.collected_place_ids || []).slice();
  }

  function writeDup(rows) {
    const clean = (rows || []).filter((r) => r && r.id);
    const me = state.meDoc;
    me.duplicates = clean.map((r) => ({ id: String(r.id), count: Math.max(1, Number(r.count) || 1) }));
    const ids = me.duplicates.map((r) => r.id);
    me.duplicate_place_ids = ids.slice();
    me.trade = me.trade || {};
    me.trade.duplicate_place_ids = ids.slice();
    touch(me);
  }

  function writeOffers(list) {
    const me = state.meDoc;
    me.trade = me.trade || {};
    me.trade.exchange_offers = list;
    me.trade_offers = clone(list);
    touch(me);
  }

  function assignCountry(place, countryId) {
    const row = countryById(countryId);
    if (!row) return;
    place.country_id = row.id;
    place.country = row.id === "default" ? "DEFAULT" : row.id.toUpperCase();
    place.country_name = row.name;
  }

  function renameRefs(oldId, newId) {
    const swap = (arr) => (Array.isArray(arr) ? arr.map((x) => (x === oldId ? newId : x)) : arr);
    const me = state.meDoc;
    me.collected_place_ids = swap(me.collected_place_ids);
    me.duplicate_place_ids = swap(me.duplicate_place_ids);
    if (me.trade) me.trade.duplicate_place_ids = swap(me.trade.duplicate_place_ids);
    (me.duplicates || []).forEach((d) => {
      if (d.id === oldId) d.id = newId;
    });
    const offers = (me.trade && me.trade.exchange_offers) || [];
    offers.forEach((o) => {
      if (o.give_place_id === oldId) o.give_place_id = newId;
      if (o.want_place_id === oldId) o.want_place_id = newId;
    });
    me.trade_offers = clone(offers);
    (me.coin_ledger_sample || []).forEach((row) => {
      if (row.place_id === oldId) row.place_id = newId;
    });
    state.extras.users.forEach((u) => {
      u.collected_place_ids = swap(u.collected_place_ids);
    });
  }

  function scrubPlace(id) {
    const drop = (arr) => (Array.isArray(arr) ? arr.filter((x) => x !== id) : arr);
    const me = state.meDoc;
    state.extras.users.forEach((u) => {
      u.collected_place_ids = drop(u.collected_place_ids);
    });
    me.duplicate_place_ids = drop(me.duplicate_place_ids);
    if (me.trade) {
      me.trade.duplicate_place_ids = drop(me.trade.duplicate_place_ids);
      me.trade.exchange_offers = (me.trade.exchange_offers || []).filter(
        (o) => o.give_place_id !== id && o.want_place_id !== id
      );
      me.trade_offers = clone(me.trade.exchange_offers);
    }
    me.duplicates = (me.duplicates || []).filter((d) => d.id !== id);
    pushPrimary();
  }

  function rebuildCountryArray(liveIds) {
    const all = countries();
    const by = new Map(all.map((c) => [c.id, c]));
    const next = [];
    if (by.has("default")) next.push(by.get("default"));
    liveIds.forEach((id) => {
      if (by.has(id)) next.push(by.get(id));
    });
    all
      .filter((c) => c.id !== "default" && c.status !== "live")
      .forEach((c) => next.push(c));
    state.placesDoc.countries = next;
    alignMeOrder();
  }

  function slugOk(id) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
  }

  function savedOk(saved) {
    return (
      saved &&
      saved.placesDoc &&
      Array.isArray(saved.placesDoc.places) &&
      saved.countriesDoc &&
      Array.isArray(saved.countriesDoc.countries) &&
      saved.meDoc &&
      saved.meDoc.profile &&
      saved.extras
    );
  }

  function applyRepo(placesDoc, countriesDoc, meDoc) {
    state.placesDoc = clone(placesDoc);
    state.countriesDoc = clone(countriesDoc);
    state.meDoc = clone(meDoc);
    state.extras = seedExtras(state.meDoc);
    state.savedAt = null;
    state.repoSig = bundleOf(state);
  }

  async function load() {
    try {
      const [placesDoc, countriesDoc, meDoc] = await Promise.all([
        getJson("data/places.json"),
        getJson("data/countries.json"),
        getJson("data/me.json"),
      ]);
      applyRepo(placesDoc, countriesDoc, meDoc);
      if (!ignoreSaved) {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          try {
            const saved = JSON.parse(raw);
            if (savedOk(saved)) {
              state.placesDoc = saved.placesDoc;
              state.countriesDoc = saved.countriesDoc;
              state.meDoc = saved.meDoc;
              state.extras = fillExtras(saved.extras, state.meDoc);
              state.savedAt = saved.savedAt || null;
              syncCountryDocs();
            }
          } catch (err) {
            /* keep repo seed */
          }
        }
      }
      state.ready = true;
      state.error = null;
    } catch (err) {
      state.ready = false;
      state.error = (err && err.message) || "Could not load catalog files.";
    }
    emit();
  }

  function reset() {
    return (async function () {
      localStorage.removeItem(KEY);
      ignoreSaved = true;
      await load();
      ignoreSaved = false;
    })();
  }

  function classify(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    if (obj.placesDoc && obj.meDoc) return "bundle";
    if (Array.isArray(obj.places)) return "places";
    if (obj.profile && (Array.isArray(obj.collected_place_ids) || obj.coin_rules)) return "me";
    if (Array.isArray(obj.users) || Array.isArray(obj.promos) || Array.isArray(obj.tickets) || (obj.roles && obj.roles.matrix))
      return "extras";
    if (Array.isArray(obj.countries)) return "countries";
    return null;
  }

  function importObject(obj) {
    const kind = classify(obj);
    if (!kind) return "Unrecognised JSON. Expected places, countries, me, or admin-extras.";
    commit(() => {
      if (kind === "bundle") {
        if (obj.placesDoc) state.placesDoc = obj.placesDoc;
        if (obj.countriesDoc) state.countriesDoc = obj.countriesDoc;
        if (obj.meDoc) state.meDoc = obj.meDoc;
        if (obj.extras) state.extras = fillExtras(obj.extras, state.meDoc);
        if (obj.placesDoc && Array.isArray(obj.placesDoc.countries)) syncCountryDocs();
        pullPrimary();
        log("Imported a full admin bundle");
        return;
      }
      if (kind === "places") {
        state.placesDoc = obj;
        if (Array.isArray(obj.countries)) syncCountryDocs();
        touch(state.placesDoc);
        log("Imported places.json");
        return;
      }
      if (kind === "countries") {
        state.countriesDoc = obj;
        state.placesDoc.countries = clone(obj.countries || []);
        if (obj.cloth_families) state.placesDoc.cloth_families = clone(obj.cloth_families);
        if (obj.cover_ui) state.placesDoc.cover_ui = clone(obj.cover_ui);
        touch(state.placesDoc);
        touch(state.countriesDoc);
        log("Imported countries.json");
        return;
      }
      if (kind === "me") {
        state.meDoc = obj;
        pullPrimary();
        touch(state.meDoc);
        log("Imported me.json");
        return;
      }
      state.extras = fillExtras(obj, state.meDoc);
      pushPrimary();
      log("Imported admin-extras.json");
    });
    return null;
  }

  function kpis() {
    const list = places();
    const rows = countries();
    const live = rows.filter((c) => c.id !== "default" && c.status === "live").length;
    const soon = rows.filter((c) => c.id !== "default" && c.status !== "live").length;
    const users = state.extras.users || [];
    const stamps = users.reduce((sum, u) => sum + ((u.collected_place_ids || []).length), 0);
    const coins = users.reduce((sum, u) => sum + (Number(u.coins) || 0), 0);
    const primary = primaryUser();
    const offers = (state.meDoc.trade && state.meDoc.trade.exchange_offers) || [];
    const chapters = {};
    list.forEach((p) => {
      const key = p.chapter || "Other";
      chapters[key] = (chapters[key] || 0) + 1;
    });
    const open = offers.filter((o) => String(o.status || "").toLowerCase() === "open").length;
    const pending = offers.filter((o) => String(o.status || "").toLowerCase() === "pending").length;
    const achievements = state.meDoc.achievements || [];
    return {
      places: list.length,
      live: live,
      soon: soon,
      def: rows.some((c) => c.id === "default") ? 1 : 0,
      stamps: stamps,
      coins: coins,
      profileStamps: primary ? (primary.collected_place_ids || []).length : 0,
      profileCoins: primary ? Number(primary.coins) || 0 : 0,
      offers: offers.length,
      open: open,
      pending: pending,
      users: users.length,
      chapters: chapters,
      achievements: achievements.length,
      achievementsEarned: achievements.filter((a) => a.earned_at).length,
    };
  }

  function collectCounts() {
    const map = {};
    (state.extras.users || []).forEach((u) => {
      (u.collected_place_ids || []).forEach((id) => {
        map[id] = (map[id] || 0) + 1;
      });
    });
    return map;
  }

  function toggleCountry(id) {
    if (id === "default") return "The default cloth stays available.";
    const row = countryById(id);
    if (!row) return "Country not found.";
    commit(() => {
      row.status = row.status === "live" ? "coming_soon" : "live";
      const all = countries();
      const index = all.findIndex((c) => c.id === id);
      const [item] = all.splice(index, 1);
      if (item.status === "live") {
        let at = all.findIndex((c) => c.id !== "default" && c.status !== "live");
        if (at < 0) at = all.length;
        all.splice(at, 0, item);
      } else {
        all.push(item);
      }
      alignMe(item);
      alignMeOrder();
      touch(state.placesDoc);
      touch(state.countriesDoc);
      touch(state.meDoc);
      log(item.name + (item.status === "live" ? " set to available" : " set to coming soon"));
    });
    return null;
  }

  function reorderLive(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;
    const live = countries().filter((c) => c.id !== "default" && c.status === "live");
    const ids = live.map((c) => c.id);
    const from = ids.indexOf(fromId);
    const to = ids.indexOf(toId);
    if (from < 0 || to < 0) return;
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    commit(() => {
      rebuildCountryArray(ids);
      touch(state.placesDoc);
      touch(state.countriesDoc);
      touch(state.meDoc);
      const row = countryById(moved);
      log("Reordered " + ((row && row.name) || moved));
    });
  }

  function saveCountry(data, isNew) {
    const id = String(data.id || "").trim().toLowerCase();
    const name = String(data.name || "").trim();
    if (!slugOk(id)) return "Id must be a lowercase slug (letters, numbers, hyphens).";
    if (!name) return "Name is required.";
    if (!FAMILIES.includes(data.family)) return "Pick a cloth family.";
    const lat = Number(data.lat);
    const lng = Number(data.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "Latitude and longitude must be numbers.";
    if (isNew && countryById(id)) return "That country id already exists.";
    if (!isNew && !countryById(id)) return "Country not found.";
    const status = data.status === "live" ? "live" : "coming_soon";
    commit(() => {
      let row = countryById(id);
      if (!row) {
        row = { id: id, source: "", source_label: null };
        countries().push(row);
      }
      const prev = row.status;
      row.name = name;
      row.family = data.family;
      row.cloth_hex = clothHex(data.family);
      row.status = status;
      row.lat = lat;
      row.lng = lng;
      row.note = data.note ? String(data.note) : null;
      if (id !== "default") alignMe(row);
      const group = countries().filter((c) => (status === "live" ? c.status === "live" && c.id !== "default" : c.status !== "live" && c.id !== "default"));
      const pos = Math.max(1, Math.min(group.length, Number(data.order) || group.length));
      if (prev !== status || Number(data.order)) {
        const liveIds = countries()
          .filter((c) => c.id !== "default" && c.status === "live")
          .map((c) => c.id);
        if (status === "live" && id !== "default") {
          const without = liveIds.filter((x) => x !== id);
          without.splice(pos - 1, 0, id);
          rebuildCountryArray(without);
        } else if (status !== "live") {
          rebuildCountryArray(liveIds.filter((x) => x !== id));
          const rest = countries().filter((c) => c.id !== "default" && c.status !== "live" && c.id !== id);
          rest.splice(pos - 1, 0, row);
          const next = [];
          const def = countryById("default");
          if (def) next.push(def);
          countries()
            .filter((c) => c.id !== "default" && c.status === "live")
            .forEach((c) => next.push(c));
          rest.forEach((c) => next.push(c));
          state.placesDoc.countries = next;
          alignMeOrder();
        }
      }
      touch(state.placesDoc);
      touch(state.countriesDoc);
      touch(state.meDoc);
      log((isNew ? "Added country " : "Updated country ") + name);
    });
    return null;
  }

  function deleteCountry(id, andPlaces) {
    if (id === "default") return "The default cloth row stays in the catalog.";
    const row = countryById(id);
    if (!row) return "Country not found.";
    commit(() => {
      if (andPlaces) state.placesDoc.places = places().filter((p) => p.country_id !== id);
      state.placesDoc.countries = countries().filter((c) => c.id !== id);
      state.meDoc.countries = (state.meDoc.countries || []).filter((c) => c.id !== id);
      touch(state.placesDoc);
      touch(state.countriesDoc);
      touch(state.meDoc);
      log("Removed " + row.name + (andPlaces ? " and its places" : ""));
    });
    return null;
  }

  function savePlace(data, originalId) {
    const id = String(data.id || "").trim().toLowerCase();
    const name = String(data.name || "").trim();
    const isNew = !originalId;
    if (!slugOk(id)) return "Id must be a lowercase slug (letters, numbers, hyphens).";
    if (!name) return "Name is required.";
    if (!countryById(data.country_id)) return "Pick a country.";
    if (!data.chapter) return "Pick a chapter.";
    const lat = Number(data.lat);
    const lng = Number(data.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "Latitude and longitude must be numbers.";
    if ((isNew || id !== originalId) && placeById(id)) return "That place id already exists.";
    if (!isNew && !placeById(originalId)) return "Place not found.";
    commit(() => {
      let row = isNew ? null : placeById(originalId);
      const prevCountry = row && row.country_id;
      if (!row) {
        row = {};
        places().push(row);
      }
      if (!isNew && id !== originalId) {
        renameRefs(originalId, id);
      }
      row.id = id;
      row.name = name;
      row.city = String(data.city || "").trim();
      assignCountry(row, data.country_id);
      row.chapter = data.chapter;
      row.lat = lat;
      row.lng = lng;
      row.precision = data.precision || "venue";
      row.note = data.note ? String(data.note) : null;
      row.in_app_preview = !!data.in_app_preview;
      row.description = String(data.description || "");
      row.photo = String(data.photo || "").trim() || "assets/places/" + id + ".jpg";
      row.photo_credit = String(data.photo_credit || "");
      row.photo_source = String(data.photo_source || "");
      row.image_credit = row.photo_credit;
      row.image_source = row.photo_source;
      row.catalog = String(data.catalog || "world_v4").trim() || "world_v4";
      if (data.source != null) row.source = String(data.source || "");
      if (!row.source_label) row.source_label = row.source_label || null;
      const seasonal = data.chapter === "Seasonal" || !!data.seasonal;
      if (seasonal) {
        row.seasonal = true;
        row.seasonal_label = String(data.seasonal_label || "").trim() || row.seasonal_label || name;
      } else {
        delete row.seasonal;
        delete row.seasonal_label;
      }
      [prevCountry, row.country_id].forEach((cid) => {
        if (!cid) return;
        const country = countryById(cid);
        if (country) alignMe(country);
      });
      pushPrimary();
      touch(state.placesDoc);
      touch(state.meDoc);
      log((isNew ? "Added place " : "Updated place ") + name);
    });
    return null;
  }

  function deletePlace(id) {
    const row = placeById(id);
    if (!row) return "Place not found.";
    commit(() => {
      const cid = row.country_id;
      state.placesDoc.places = places().filter((p) => p.id !== id);
      scrubPlace(id);
      const country = countryById(cid);
      if (country) alignMe(country);
      touch(state.placesDoc);
      log("Deleted place " + row.name);
    });
    return null;
  }

  function bulkPlaces(ids, patch) {
    const wanted = new Set(ids || []);
    if (!wanted.size) return "Nothing to update.";
    const has =
      patch.chapter || patch.preview || patch.catalog || patch.country_id;
    if (!has) return "Choose at least one change.";
    if (patch.country_id && !countryById(patch.country_id)) return "Pick a country.";
    commit(() => {
      const touched = new Set();
      places().forEach((p) => {
        if (!wanted.has(p.id)) return;
        if (patch.chapter) {
          p.chapter = patch.chapter;
          if (patch.chapter === "Seasonal") {
            p.seasonal = true;
            p.seasonal_label = p.seasonal_label || p.name;
          } else {
            delete p.seasonal;
            delete p.seasonal_label;
          }
        }
        if (patch.preview === "on") p.in_app_preview = true;
        if (patch.preview === "off") p.in_app_preview = false;
        if (patch.catalog) p.catalog = patch.catalog;
        if (patch.country_id) {
          touched.add(p.country_id);
          assignCountry(p, patch.country_id);
          touched.add(p.country_id);
        }
      });
      touched.forEach((cid) => {
        const country = countryById(cid);
        if (country) alignMe(country);
      });
      touch(state.placesDoc);
      touch(state.meDoc);
      log("Bulk-updated " + wanted.size + " places");
    });
    return null;
  }

  function saveUser(data, originalId) {
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    if (!name) return "Name is required.";
    if (!email || !email.includes("@")) return "Email is required.";
    const coins = Number(data.coins);
    if (!Number.isFinite(coins)) return "Coins must be a number.";
    const collected = Array.isArray(data.collected_place_ids) ? data.collected_place_ids.slice() : [];
    const unknown = collected.filter((id) => !placeById(id));
    if (unknown.length) return "Unknown place id: " + unknown[0];
    commit(() => {
      let user = originalId ? state.extras.users.find((u) => u.id === originalId) : null;
      if (!user) {
        let id = "user-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        if (!id || id === "user-") id = "user-new";
        let n = 2;
        const base = id;
        while (state.extras.users.some((u) => u.id === id)) {
          id = base + "-" + n;
          n += 1;
        }
        user = { id: id, primary: state.extras.users.length === 0 };
        state.extras.users.push(user);
      }
      user.name = name;
      user.email = email;
      user.home_city = String(data.home_city || "").trim();
      user.home_country = String(data.home_country || "").trim().toUpperCase();
      user.passport_country_id = data.passport_country_id || "am";
      user.coins = coins;
      user.status = data.status || "active";
      user.bio = String(data.bio || "");
      user.member_since = data.member_since || user.member_since || today();
      user.collected_place_ids = collected;
      if (user.primary) {
        if (Array.isArray(data.visited)) {
          const set = new Set(data.visited);
          (state.meDoc.countries || []).forEach((c) => {
            if (set.has(c.id)) {
              c.visited = true;
              if (!c.visited_at) c.visited_at = today();
            } else {
              c.visited = false;
              c.visited_at = null;
            }
          });
          state.meDoc.profile = state.meDoc.profile || {};
          state.meDoc.profile.countries_visited = state.meDoc.countries.filter((c) => c.visited).length;
        }
        pushPrimary();
      }
      log((originalId ? "Updated user " : "Added user ") + name);
    });
    return null;
  }

  function deleteUser(id) {
    const users = state.extras.users;
    const user = users.find((u) => u.id === id);
    if (!user) return "User not found.";
    if (users.length === 1) return "Keep at least one traveller so me.json has a profile.";
    commit(() => {
      state.extras.users = users.filter((u) => u.id !== id);
      if (user.primary) {
        state.extras.users[0].primary = true;
        pushPrimary();
      }
      log("Removed user " + user.name);
    });
    return null;
  }

  function adjustCoins(userId, delta, reason) {
    const user = state.extras.users.find((u) => u.id === userId);
    if (!user) return "User not found.";
    const amount = Number(delta);
    if (!Number.isFinite(amount) || amount === 0) return "Enter a non-zero coin change.";
    commit(() => {
      user.coins = Math.round((Number(user.coins) || 0) + amount);
      if (user.primary) {
        state.meDoc.coin_ledger_sample = state.meDoc.coin_ledger_sample || [];
        state.meDoc.coin_ledger_sample.push({
          type: "admin_adjust",
          coins: amount,
          note: reason || "Admin adjustment",
        });
        pushPrimary();
      }
      log((amount > 0 ? "+" : "") + amount + " coins · " + user.name);
    });
    return null;
  }

  function savePromo(data, status) {
    const title = String(data.title || "").trim();
    if (!title) return "Title is required.";
    commit(() => {
      const id = data.id || "promo-" + Date.now();
      let row = state.extras.promos.find((p) => p.id === id);
      if (!row) {
        row = { id: id };
        state.extras.promos.unshift(row);
      }
      row.title = title;
      row.body = String(data.body || "");
      row.slot = data.slot || "Countries banner";
      row.style = data.style || "Standard coral CTA";
      row.starts = data.starts || "";
      row.ends = data.ends || "";
      row.cta = data.cta || "See stamps";
      row.status = status || data.status || "draft";
      log((row.status === "live" ? "Published promo " : "Saved promo ") + title);
    });
    return null;
  }

  function deletePromo(id) {
    const row = state.extras.promos.find((p) => p.id === id);
    if (!row) return;
    commit(() => {
      state.extras.promos = state.extras.promos.filter((p) => p.id !== id);
      log("Removed promo " + row.title);
    });
  }

  function saveTicket(data) {
    const from = String(data.from || "").trim();
    const text = String(data.text || "").trim();
    if (!from || !text) return "Name and message are required.";
    commit(() => {
      const id = String(Date.now()).slice(-4);
      state.extras.tickets.unshift({
        id: id,
        type: data.type || "Support",
        status: "open",
        unread: true,
        from: from,
        subject: String(data.subject || "Support").trim() || "Support",
        messages: [{ role: "user", who: from.split(" ")[0], at: new Date().toISOString(), text: text }],
      });
      log("Opened ticket #" + id);
    });
    return null;
  }

  function addMessage(id, text) {
    const ticket = state.extras.tickets.find((t) => t.id === id);
    const body = String(text || "").trim();
    if (!ticket || !body) return "Write a reply first.";
    commit(() => {
      ticket.messages.push({ role: "agent", who: "Support", at: new Date().toISOString(), text: body });
      ticket.unread = false;
      log("Replied on ticket #" + id);
    });
    return null;
  }

  function setTicketStatus(id, status) {
    const ticket = state.extras.tickets.find((t) => t.id === id);
    if (!ticket) return;
    commit(() => {
      ticket.status = status;
      log("Ticket #" + id + " · " + status);
    });
  }

  function markAllRead() {
    commit(() => {
      state.extras.tickets.forEach((t) => {
        t.unread = false;
      });
      log("Marked moderation inbox read");
    });
  }

  function markRead(id) {
    const ticket = state.extras.tickets.find((t) => t.id === id);
    if (!ticket || !ticket.unread) return;
    commit(() => {
      ticket.unread = false;
    });
  }

  function deleteTicket(id) {
    commit(() => {
      state.extras.tickets = state.extras.tickets.filter((t) => t.id !== id);
      log("Removed ticket #" + id);
    });
  }

  function setCoinRule(key, value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "Enter a number.";
    commit(() => {
      state.meDoc.coin_rules = state.meDoc.coin_rules || {};
      state.meDoc.coin_rules[key] = n;
      touch(state.meDoc);
      log("Coin rule " + key + " = " + n);
    });
    return null;
  }

  function setSummary(text) {
    commit(() => {
      state.meDoc.coin_rules = state.meDoc.coin_rules || {};
      state.meDoc.coin_rules.summary = String(text || "");
      touch(state.meDoc);
    });
  }

  function setTradeSetting(key, raw) {
    commit(() => {
      const trade = state.meDoc.trade || (state.meDoc.trade = {});
      const empty = raw === "" || raw == null;
      if (empty) {
        if (trade.settings) delete trade.settings[key];
        if (trade.settings && !Object.keys(trade.settings).length) delete trade.settings;
      } else if (key === "stamp_exchange") {
        trade.settings = trade.settings || {};
        trade.settings[key] = String(raw);
      } else {
        const n = Number(raw);
        if (!Number.isFinite(n)) return false;
        trade.settings = trade.settings || {};
        trade.settings[key] = n;
      }
      touch(state.meDoc);
    });
  }

  function setDuplicate(index, patch) {
    const rows = (state.meDoc.duplicates || []).map((r) => ({ id: r.id, count: r.count }));
    if (!rows[index]) return;
    if (patch.id != null) rows[index].id = String(patch.id).trim();
    if (patch.count != null) rows[index].count = Number(patch.count) || 1;
    if (rows[index].id && !placeById(rows[index].id)) return;
    commit(() => writeDup(rows));
  }

  function addDuplicate(id) {
    if (!placeById(id)) return "Unknown place id.";
    const rows = (state.meDoc.duplicates || []).map((r) => ({ id: r.id, count: r.count }));
    if (rows.some((r) => r.id === id)) return "Already in the duplicate list.";
    rows.push({ id: id, count: 1 });
    commit(() => {
      writeDup(rows);
      log("Duplicate spare · " + id);
    });
    return null;
  }

  function deleteDuplicate(index) {
    const rows = (state.meDoc.duplicates || []).map((r) => ({ id: r.id, count: r.count }));
    rows.splice(index, 1);
    commit(() => writeDup(rows));
  }

  function setOffer(index, patch) {
    const list = clone((state.meDoc.trade && state.meDoc.trade.exchange_offers) || []);
    if (!list[index]) return;
    Object.assign(list[index], patch);
    commit(() => writeOffers(list));
  }

  function addOffer() {
    commit(() => {
      const list = clone((state.meDoc.trade && state.meDoc.trade.exchange_offers) || []);
      list.push({
        id: "offer-" + Date.now(),
        status: "open",
        give_place_id: "",
        want_place_id: "",
        want_country_id: "",
        note: "",
      });
      writeOffers(list);
      log("Added a trade offer");
    });
  }

  function deleteOffer(index) {
    const list = clone((state.meDoc.trade && state.meDoc.trade.exchange_offers) || []);
    list.splice(index, 1);
    commit(() => writeOffers(list));
  }

  function updateLedger(index, key, value) {
    const row = (state.meDoc.coin_ledger_sample || [])[index];
    if (!row) return;
    commit(() => {
      if (key === "coins") row.coins = Number(value) || 0;
      else if (value === "") delete row[key];
      else row[key] = value;
      touch(state.meDoc);
    });
  }

  function addLedger() {
    commit(() => {
      state.meDoc.coin_ledger_sample = state.meDoc.coin_ledger_sample || [];
      state.meDoc.coin_ledger_sample.push({ type: "admin_adjust", coins: 0, note: "" });
      touch(state.meDoc);
    });
  }

  function deleteLedger(index) {
    commit(() => {
      state.meDoc.coin_ledger_sample.splice(index, 1);
      touch(state.meDoc);
    });
  }

  function setRole(cap, role, on) {
    commit(() => {
      const matrix = state.extras.roles.matrix;
      matrix[cap] = matrix[cap] || {};
      matrix[cap][role] = !!on;
    });
  }

  function saveMember(data) {
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    if (!name || !email) return "Name and email are required.";
    commit(() => {
      state.extras.roles.members.push({
        id: "mem-" + Date.now(),
        name: name,
        email: email,
        role: data.role || "Editor",
      });
      log("Invited " + name);
    });
    return null;
  }

  function setMemberRole(id, role) {
    const member = state.extras.roles.members.find((m) => m.id === id);
    if (!member) return;
    commit(() => {
      member.role = role;
    });
  }

  function deleteMember(id) {
    if (state.extras.roles.members.length === 1) return "Keep at least one admin.";
    commit(() => {
      state.extras.roles.members = state.extras.roles.members.filter((m) => m.id !== id);
    });
    return null;
  }

  function setHome(patch) {
    const lat = Number(patch.lat);
    const lng = Number(patch.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "Home latitude and longitude must be numbers.";
    commit(() => {
      const home = state.placesDoc.home || (state.placesDoc.home = {});
      home.name = String(patch.name || "").trim() || home.name || "Home";
      home.lat = lat;
      home.lng = lng;
      touch(state.placesDoc);
      log("Updated catalog home");
    });
    return null;
  }

  const Store = {
    KEY: KEY,
    CHAPTERS: CHAPTERS,
    FAMILIES: FAMILIES,
    state: state,
    load: load,
    reset: reset,
    persist: persist,
    subscribe: function (fn) {
      listeners.push(fn);
    },
    isDirty: isDirty,
    assetUrl: assetUrl,
    classify: classify,
    importObject: importObject,
    kpis: kpis,
    collectCounts: collectCounts,
    countries: countries,
    places: places,
    countryById: countryById,
    placeById: placeById,
    clothHex: clothHex,
    placeCount: placeCount,
    toggleCountry: toggleCountry,
    reorderLive: reorderLive,
    saveCountry: saveCountry,
    deleteCountry: deleteCountry,
    savePlace: savePlace,
    deletePlace: deletePlace,
    bulkPlaces: bulkPlaces,
    saveUser: saveUser,
    deleteUser: deleteUser,
    adjustCoins: adjustCoins,
    savePromo: savePromo,
    deletePromo: deletePromo,
    saveTicket: saveTicket,
    addMessage: addMessage,
    setTicketStatus: setTicketStatus,
    markAllRead: markAllRead,
    markRead: markRead,
    deleteTicket: deleteTicket,
    setCoinRule: setCoinRule,
    setSummary: setSummary,
    setTradeSetting: setTradeSetting,
    setDuplicate: setDuplicate,
    addDuplicate: addDuplicate,
    deleteDuplicate: deleteDuplicate,
    setOffer: setOffer,
    addOffer: addOffer,
    deleteOffer: deleteOffer,
    updateLedger: updateLedger,
    addLedger: addLedger,
    deleteLedger: deleteLedger,
    setRole: setRole,
    saveMember: saveMember,
    setMemberRole: setMemberRole,
    deleteMember: deleteMember,
    setHome: setHome,
    exportDocs: function () {
      syncCountryDocs();
      return {
        "places.json": state.placesDoc,
        "countries.json": state.countriesDoc,
        "me.json": state.meDoc,
        "admin-extras.json": state.extras,
      };
    },
  };

  window.StampdStore = Store;
})();
