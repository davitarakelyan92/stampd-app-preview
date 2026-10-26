/* Stampd Admin — working catalog editor (localStorage + export) */
(function () {
  const LS_KEY = "stampd-admin-v1";
  const DATA_BASE = "../data/";
  const ASSET_PREFIX = "../";
  const PAGE_SIZE = 40;

  const CLOTH = {
    blue: "#1B2747",
    red: "#8B1E2D",
    green: "#1E3B32",
    black: "#1A1A1E",
    orange: "#7A3F18",
  };

  const state = {
    placesDoc: null,
    countriesDoc: null,
    meDoc: null,
    extras: null,
    snapshot: null,
    dirty: false,
    placeFilter: "all",
    placeQuery: "",
    placePage: 0,
    selectedCountryId: null,
    selectedAdId: null,
    selectedTicketId: null,
    modal: null,
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("on"), 2600);
  }

  function deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function stableStringify(obj) {
    return JSON.stringify(obj);
  }

  function markDirty(flag) {
    state.dirty = !!flag;
    const pill = $("#dirty-pill");
    pill.classList.toggle("on", state.dirty);
    pill.classList.toggle("is-dirty", state.dirty);
    pill.classList.toggle("is-clean", !state.dirty);
    pill.textContent = state.dirty ? "Unsaved changes" : "All changes saved";
    $("#env-label").textContent = "Preview";
  }

  function recomputeDirty() {
    if (!state.snapshot) return;
    const cur = packWorking();
    markDirty(stableStringify(cur) !== stableStringify(state.snapshot));
  }

  function defaultExtras(me) {
    const profile = (me && me.profile) || {};
    return {
      version: 1,
      updated: new Date().toISOString().slice(0, 10),
      ads: [
        {
          id: "ad-wine-days",
          title: "Wine Days · Armenia",
          body: "Limited seasonal stamps this week in Yerevan.",
          slot: "Countries banner",
          style: "Seasonal (twilight)",
          starts: "2026-10-27",
          ends: "2026-10-31",
          status: "seasonal",
        },
        {
          id: "ad-trade-bonus",
          title: "Trade bonus weekend",
          body: "Extra visibility for open offers.",
          slot: "Trade strip",
          style: "Standard coral CTA",
          starts: "2026-11-01",
          ends: "2026-11-02",
          status: "scheduled",
        },
        {
          id: "ad-italy-complete",
          title: "Complete Italy · +200",
          body: "Finish the Italy catalog for a country bonus.",
          slot: "Me card",
          style: "Navy informational",
          starts: "2026-10-01",
          ends: "2026-12-31",
          status: "live",
        },
      ],
      users: [
        {
          id: "me",
          display_name: profile.display_name || "Ani Sargsyan",
          email: "ani@example.stampd",
          home_city: profile.home_city || "Yerevan",
          home_country: profile.home_country || "AM",
          passport_country_id: profile.active_passport_country_id || "am",
          coins: me.coins != null ? me.coins : profile.coins || 0,
          collected_place_ids: deepClone(me.collected_place_ids || []),
          status: "active",
          is_primary: true,
        },
      ],
      tickets: [
        {
          id: "t-1042",
          who: profile.display_name || "Ani Sargsyan",
          type: "Trade",
          subject: "Trade dispute · Colosseum",
          preview: "Peer cancelled after I sent Colosseum — coins stuck?",
          status: "open",
          messages: [
            { from: "user", text: "I traded Colosseum for Trevi. They cancelled after I confirmed.", when: "today 14:12" },
            { from: "agent", text: "Thanks — looking at the trade ledger now.", when: "14:28" },
          ],
        },
        {
          id: "t-1043",
          who: "Luca Romano",
          type: "Support",
          subject: "Passport cloth",
          preview: "Can I change passport cloth without resetting album?",
          status: "open",
          messages: [{ from: "user", text: "Can I change passport cloth without resetting album?", when: "yesterday" }],
        },
      ],
      roles: [
        { id: "admin", name: "Admin", catalog: true, users: true, moderation: true, manage_roles: true },
        { id: "editor", name: "Editor", catalog: true, users: false, moderation: false, manage_roles: false },
        { id: "support", name: "Support", catalog: false, users: false, moderation: true, manage_roles: false },
      ],
    };
  }

  function packWorking() {
    return {
      places: state.placesDoc,
      countries: state.countriesDoc,
      me: state.meDoc,
      extras: state.extras,
    };
  }

  function persist() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(packWorking()));
      recomputeDirty();
    } catch (e) {
      toast("Save failed — storage full? Export instead.");
      console.error(e);
    }
  }

  function saveWorking() {
    persist();
    toast("Saved to this browser");
  }

  function syncCountriesIntoPlaces() {
    if (!state.placesDoc || !state.countriesDoc) return;
    state.placesDoc.countries = deepClone(state.countriesDoc.countries);
    state.placesDoc.cloth_families = deepClone(state.countriesDoc.cloth_families);
    state.placesDoc.cover_ui = deepClone(state.countriesDoc.cover_ui);
  }

  function syncPrimaryUserToMe() {
    const primary = (state.extras.users || []).find((u) => u.is_primary) || state.extras.users[0];
    if (!primary || !state.meDoc) return;
    state.meDoc.profile = state.meDoc.profile || {};
    state.meDoc.profile.display_name = primary.display_name;
    state.meDoc.profile.home_city = primary.home_city;
    state.meDoc.profile.home_country = primary.home_country;
    state.meDoc.profile.active_passport_country_id = primary.passport_country_id;
    state.meDoc.profile.favorite_country_id = primary.passport_country_id;
    state.meDoc.profile.coins = Number(primary.coins) || 0;
    state.meDoc.profile.stamps_collected = (primary.collected_place_ids || []).length;
    state.meDoc.coins = Number(primary.coins) || 0;
    state.meDoc.stamps_collected = (primary.collected_place_ids || []).length;
    state.meDoc.collected_place_ids = deepClone(primary.collected_place_ids || []);
  }

  function countryById(id) {
    return (state.countriesDoc.countries || []).find((c) => c.id === id);
  }

  function placeCountFor(countryId) {
    return (state.placesDoc.places || []).filter((p) => p.country_id === countryId).length;
  }

  function photoUrl(photo) {
    if (!photo) return "";
    if (/^https?:/i.test(photo)) return photo;
    return ASSET_PREFIX + photo.replace(/^\//, "");
  }

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 9);
  }

  /* —— Navigation —— */
  function show(id) {
    $$(".view").forEach((v) => {
      const on = v.dataset.view === id;
      v.classList.toggle("on", on);
      v.hidden = !on;
    });
    $$("#nav button[data-go]").forEach((b) => {
      const on = b.dataset.go === id;
      b.classList.toggle("active", on);
      if (on) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    history.replaceState(null, "", "#" + id);
    $("#content").scrollTop = 0;
    renderView(id);
  }

  function renderAll() {
    const hash = (location.hash || "#overview").slice(1);
    const id = $$(".view").some((v) => v.dataset.view === hash) ? hash : "overview";
    show(id);
  }

  function renderView(id) {
    if (id === "overview") renderOverview();
    if (id === "countries") renderCountries();
    if (id === "places") renderPlaces();
    if (id === "users") renderUsers();
    if (id === "ads") renderAds();
    if (id === "trade") renderTrade();
    if (id === "moderation") renderModeration();
    if (id === "settings") renderSettings();
  }

  /* —— Overview —— */
  function renderOverview() {
    const countries = state.countriesDoc.countries.filter((c) => c.id !== "default");
    const live = countries.filter((c) => c.status === "live").length;
    const soon = countries.filter((c) => c.status !== "live").length;
    const places = state.placesDoc.places.length;
    const coins = state.meDoc.coins || 0;
    const stamps = (state.meDoc.collected_place_ids || []).length;
    const trades = (state.meDoc.trade_offers || []).length;
    $("#kpi-row").innerHTML = [
      kpi("Countries live", live, soon ? soon + " coming soon" : "All live"),
      kpi("Places", places.toLocaleString(), "In the catalog"),
      kpi("Stamps collected", stamps, "On your preview profile"),
      kpi("Coins", coins, trades ? trades + " open trade offers" : "No open trades"),
    ].join("");
    const chapters = {};
    state.placesDoc.places.forEach((p) => {
      chapters[p.chapter || "—"] = (chapters[p.chapter || "—"] || 0) + 1;
    });
    const chRows = Object.entries(chapters)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k, v]) => `<div class="rule-stat"><div class="l">${esc(k)}</div><div class="r">${v}</div></div>`)
      .join("");
    $("#ov-mix").innerHTML = chRows || "<p class='empty-hint'>No places</p>";
    const adsN = (state.extras.ads || []).length;
    const ticketsN = (state.extras.tickets || []).length;
    $("#ov-activity").innerHTML = `
      <ul class="activity">
        <li><span class="dot"></span><div><div class="t">${places.toLocaleString()} places across ${countries.length} countries</div><div class="m">Ready to explore in the app</div></div></li>
        <li><span class="dot mint"></span><div><div class="t">${stamps} stamps collected · ${coins} coins</div><div class="m">Your preview traveller</div></div></li>
        <li><span class="dot sky"></span><div><div class="t">${adsN} promo${adsN === 1 ? "" : "s"} · ${ticketsN} support ticket${ticketsN === 1 ? "" : "s"}</div><div class="m">Growth &amp; ops</div></div></li>
        <li><span class="dot tw"></span><div><div class="t">${state.dirty ? "You have unsaved changes" : "Everything is saved in this browser"}</div><div class="m">${state.dirty ? "Click Save to keep them" : "Export when you want them in the app"}</div></div></li>
      </ul>
      <p class="files-note">Files used by the app: <code>places.json</code>, <code>countries.json</code>, <code>me.json</code>, <code>admin-extras.json</code></p>`;
  }

  function kpi(k, v, d) {
    return `<div class="kpi"><div class="k">${esc(k)}</div><div class="v">${esc(String(v))}</div><div class="d flat">${esc(d)}</div></div>`;
  }

  /* —— Countries —— */
  function renderCountries() {
    const list = state.countriesDoc.countries.filter((c) => c.id !== "default");
    const live = list.filter((c) => c.status === "live");
    const soon = list.filter((c) => c.status !== "live");
    $("#live-count").textContent = live.length + " live";
    $("#soon-count").textContent = soon.length + " queued";
    $("#clist-live").innerHTML = live.map((c, i) => countryRow(c, i, live.length, true)).join("") || emptyLi("No live countries");
    $("#clist-soon").innerHTML = soon.map((c) => countryRow(c, 0, 0, false)).join("") || emptyLi("None queued — toggle a live country off");
  }

  function emptyLi(t) {
    return `<li style="justify-content:center;color:var(--muted);font-weight:600">${esc(t)}</li>`;
  }

  function countryRow(c, i, n, isLive) {
    const nPlaces = placeCountFor(c.id);
    const hex = c.cloth_hex || CLOTH[c.family] || "#1B2747";
    const sel = state.selectedCountryId === c.id ? " selected" : "";
    const move = isLive
      ? `<button type="button" class="icon-btn" data-c-up="${esc(c.id)}" title="Move up" ${i === 0 ? "disabled" : ""}>↑</button>
         <button type="button" class="icon-btn" data-c-down="${esc(c.id)}" title="Move down" ${i === n - 1 ? "disabled" : ""}>↓</button>`
      : "";
    return `<li class="${sel}" data-cid="${esc(c.id)}">
      <span class="grip" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <span class="cloth" style="background:${esc(hex)}" title="${esc(c.family || "")}"></span>
      <div class="grow" data-c-edit="${esc(c.id)}"><b>${esc(c.name)}</b><span>${esc(c.family || "—")} · ${nPlaces} places</span></div>
      ${move}
      <button type="button" class="icon-btn" data-c-edit="${esc(c.id)}" aria-label="Edit">✎</button>
      <button type="button" class="toggle ${c.status === "live" ? "on" : ""}" data-c-toggle="${esc(c.id)}" aria-label="Live"></button>
    </li>`;
  }

  function moveCountry(id, dir) {
    const arr = state.countriesDoc.countries;
    const idx = arr.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const liveIdxs = arr.map((c, i) => ({ c, i })).filter((x) => x.c.id !== "default" && x.c.status === "live");
    const pos = liveIdxs.findIndex((x) => x.c.id === id);
    const swapWith = liveIdxs[pos + dir];
    if (!swapWith) return;
    const j = swapWith.i;
    const tmp = arr[idx];
    arr[idx] = arr[j];
    arr[j] = tmp;
    syncCountriesIntoPlaces();
    persist();
    renderCountries();
  }

  function toggleCountry(id) {
    const c = countryById(id);
    if (!c || c.id === "default") return;
    c.status = c.status === "live" ? "coming_soon" : "live";
    syncCountriesIntoPlaces();
    persist();
    renderCountries();
  }

  function openCountryEditor(id) {
    const c = id ? countryById(id) : null;
    const isNew = !c;
    const draft = c
      ? deepClone(c)
      : { id: "", name: "", family: "blue", cloth_hex: CLOTH.blue, status: "coming_soon", lat: 0, lng: 0, note: "" };
    openModal(
      isNew ? "Add country" : "Edit country",
      `
      <div class="field"><label>ID (slug)</label><input id="f-cid" value="${esc(draft.id)}" ${isNew ? "" : "readonly"}></div>
      <div class="field"><label>Name</label><input id="f-cname" value="${esc(draft.name)}"></div>
      <div class="field-row">
        <div class="field"><label>Cloth family</label>
          <select id="f-cfamily">${Object.keys(CLOTH)
            .map((k) => `<option value="${k}" ${draft.family === k ? "selected" : ""}>${k}</option>`)
            .join("")}</select>
        </div>
        <div class="field"><label>Cloth hex</label><input id="f-chex" value="${esc(draft.cloth_hex || "")}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Lat</label><input id="f-clat" type="number" step="any" value="${draft.lat ?? ""}"></div>
        <div class="field"><label>Lng</label><input id="f-clng" type="number" step="any" value="${draft.lng ?? ""}"></div>
      </div>
      <div class="field"><label>Status</label>
        <select id="f-cstatus">
          <option value="live" ${draft.status === "live" ? "selected" : ""}>live</option>
          <option value="coming_soon" ${draft.status !== "live" ? "selected" : ""}>coming_soon</option>
        </select>
      </div>
      <div class="field"><label>Note</label><textarea id="f-cnote">${esc(draft.note || "")}</textarea></div>
      `,
      [
        isNew
          ? null
          : {
              label: "Delete",
              className: "btn btn-sm btn-danger",
              onClick: () => {
                if (!confirm("Remove country " + draft.name + "?")) return;
                state.countriesDoc.countries = state.countriesDoc.countries.filter((x) => x.id !== draft.id);
                syncCountriesIntoPlaces();
                persist();
                closeModal();
                renderCountries();
              },
            },
        { label: "Cancel", className: "btn btn-secondary", onClick: closeModal },
        {
          label: "Save",
          className: "btn btn-primary",
          onClick: () => {
            const idVal = $("#f-cid").value.trim().toLowerCase();
            const name = $("#f-cname").value.trim();
            if (!idVal || !name) return toast("ID and name required");
            const family = $("#f-cfamily").value;
            const hex = $("#f-chex").value.trim() || CLOTH[family];
            const next = {
              ...(c || {}),
              id: idVal,
              name,
              family,
              cloth_hex: hex,
              status: $("#f-cstatus").value,
              lat: numOr($("#f-clat").value, 0),
              lng: numOr($("#f-clng").value, 0),
              note: $("#f-cnote").value.trim() || null,
            };
            if (isNew) {
              if (countryById(idVal)) return toast("ID already exists");
              state.countriesDoc.countries.push(next);
            } else {
              Object.assign(c, next);
            }
            syncCountriesIntoPlaces();
            persist();
            closeModal();
            renderCountries();
          },
        },
      ].filter(Boolean)
    );
  }

  /* —— Stamp graphic (shared WI_ICONS / WI_COL) —— */
  const STAMP_COLOR_ORDER = ["coral", "sky", "sunny", "mint", "twilight"];
  const STAMP_COLOR_LABEL = {
    coral: "Coral",
    sunny: "Sunny",
    sky: "Sky",
    mint: "Mint",
    twilight: "Twilight",
  };

  function installStampChapterLookup() {
    window.stampdPlaceChapter = function (name) {
      const places = (state.placesDoc && state.placesDoc.places) || [];
      const byId = places.find((p) => p.id === name);
      if (byId && byId.chapter) return byId.chapter;
      const prev = state.stampPreview;
      if (prev && prev.icon === name && prev.chapter) return prev.chapter;
      const via = places.find((p) => String(p.stamp_icon || "").trim() === name);
      return (via && via.chapter) || null;
    };
  }

  function stampColorKeys() {
    const map = typeof WI_COL === "object" && WI_COL ? WI_COL : {};
    const known = STAMP_COLOR_ORDER.filter((k) => map[k]);
    const extra = Object.keys(map).filter((k) => known.indexOf(k) === -1);
    return known.concat(extra);
  }

  function stampIconChoices() {
    const map = typeof WI_ICONS === "object" && WI_ICONS ? WI_ICONS : {};
    return Object.keys(map)
      .map((key) => ({ key, label: (map[key] && map[key].label) || key }))
      .sort((a, b) => a.label.localeCompare(b.label) || a.key.localeCompare(b.key));
  }

  function sampleStampColor(id, chapter) {
    if (chapter === "Seasonal") return "twilight";
    const keys = stampColorKeys();
    if (!keys.length) return "coral";
    let h = 0;
    const s = String(id || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return keys[h % keys.length];
  }

  function readStampForm() {
    const id = ($("#f-pid") && $("#f-pid").value.trim()) || "place";
    const name = ($("#f-pname") && $("#f-pname").value.trim()) || id;
    const chapter = ($("#f-pch") && $("#f-pch").value.trim()) || "Visit";
    const custom = ($("#f-picon-custom") && $("#f-picon-custom").value.trim()) || "";
    const selected = ($("#f-picon") && $("#f-picon").value) || "__default";
    const iconLocked = !!(custom || (selected && selected !== "__default"));
    const icon = custom || (selected !== "__default" ? selected : id);
    const colorSel = ($("#f-pcolor") && $("#f-pcolor").value) || "__default";
    const colorLocked = colorSel !== "__default" && stampColorKeys().indexOf(colorSel) !== -1;
    const color = colorLocked ? colorSel : sampleStampColor(id, chapter);
    const labelRaw = ($("#f-plabel") && $("#f-plabel").value.trim()) || "";
    const label = labelRaw || name;
    return { id, name, chapter, icon, color, label, labelRaw, iconLocked, colorLocked, custom, selected };
  }

  function renderDigitalStamp(opts, chapter) {
    if (typeof digitalStamp !== "function") return "";
    state.stampPreview = { icon: opts.icon, chapter: chapter || "" };
    try {
      return digitalStamp(opts);
    } finally {
      state.stampPreview = null;
    }
  }

  function miniStampHtml(p) {
    const icon = (p.stamp_icon && String(p.stamp_icon).trim()) || p.id;
    const color =
      p.stamp_color && stampColorKeys().indexOf(String(p.stamp_color).trim()) !== -1
        ? String(p.stamp_color).trim()
        : sampleStampColor(p.id, p.chapter);
    const svg = renderDigitalStamp(
      {
        icon,
        color,
        state: "earned",
        name: (p.stamp_label && String(p.stamp_label).trim()) || p.name || p.id,
        w: 72,
        h: 90,
        P: 2,
        hideLabel: true,
        hideBadge: true,
        photo: "",
      },
      p.chapter
    );
    if (!svg) return "";
    return `<span class="stamp-mini" aria-hidden="true">${svg}</span>`;
  }

  function refreshStampPreview() {
    const host = $("#stamp-preview");
    if (!host) return;
    const draft = readStampForm();
    const svg = renderDigitalStamp(
      {
        icon: draft.icon,
        color: draft.color,
        state: "earned",
        name: draft.label,
        w: 120,
        h: 156,
        P: 4,
        hideBadge: true,
        photo: "",
      },
      draft.chapter
    );
    const known = typeof WI_ICONS === "object" && WI_ICONS && WI_ICONS[draft.icon];
    const artNote = known
      ? known.label
      : "Chapter mark (no line icon for this key yet)";
    const colorNote = draft.colorLocked
      ? STAMP_COLOR_LABEL[draft.color] || draft.color
      : draft.chapter === "Seasonal"
        ? "Default · seasonal is twilight"
        : "Default · app color varies by place";
    host.innerHTML = svg
      ? `${svg}<span class="stamp-preview-cap">${esc(artNote)}<br>${esc(colorNote)}</span>`
      : `<span class="stamp-preview-cap">Stamp preview unavailable</span>`;
  }

  function bindStampPreview() {
    ["f-pid", "f-pname", "f-pch", "f-picon", "f-picon-custom", "f-pcolor", "f-plabel"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        if (id === "f-picon-custom" && el.value.trim()) {
          const sel = $("#f-picon");
          if (sel) sel.value = "__default";
        }
        refreshStampPreview();
      });
      el.addEventListener("change", () => {
        if (id === "f-picon" && el.value !== "__default") {
          const custom = $("#f-picon-custom");
          if (custom) custom.value = "";
        }
        refreshStampPreview();
      });
    });
    refreshStampPreview();
  }

  function applyStampFields(next) {
    const draft = readStampForm();
    if (draft.iconLocked && draft.icon && draft.icon !== next.id) next.stamp_icon = draft.icon;
    else delete next.stamp_icon;
    if (draft.colorLocked) next.stamp_color = draft.color;
    else delete next.stamp_color;
    if (draft.labelRaw) next.stamp_label = draft.labelRaw;
    else delete next.stamp_label;
  }

  /* —— Places —— */
  function filteredPlaces() {
    let list = state.placesDoc.places.slice();
    if (state.placeFilter !== "all") {
      list = list.filter((p) => p.country_id === state.placeFilter);
    }
    const q = state.placeQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.id || "").toLowerCase().includes(q) ||
          (p.city || "").toLowerCase().includes(q) ||
          (p.chapter || "").toLowerCase().includes(q) ||
          (p.country_name || "").toLowerCase().includes(q)
      );
    }
    return list;
  }

  function renderPlaces() {
    const countries = state.countriesDoc.countries.filter((c) => c.id !== "default");
    const pills = [`<button type="button" data-pf="all" class="${state.placeFilter === "all" ? "on" : ""}">All</button>`]
      .concat(
        countries.slice(0, 12).map(
          (c) =>
            `<button type="button" data-pf="${esc(c.id)}" class="${state.placeFilter === c.id ? "on" : ""}">${esc(c.name)}</button>`
        )
      )
      .join("");
    $("#place-filters").innerHTML = pills;

    const list = filteredPlaces();
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.placePage >= pages) state.placePage = pages - 1;
    const start = state.placePage * PAGE_SIZE;
    const page = list.slice(start, start + PAGE_SIZE);
    $("#place-count-label").textContent = `Showing ${page.length ? start + 1 : 0}–${start + page.length} of ${list.length}`;
    $("#places-tbody").innerHTML = page
      .map((p) => {
        const src = photoUrl(p.photo);
        const thumb = src
          ? `<img class="thumb" src="${esc(src)}" alt="" onerror="this.classList.add('ph');this.removeAttribute('src')">`
          : `<div class="thumb ph" aria-hidden="true">◇</div>`;
        const stamp = miniStampHtml(p);
        return `<tr>
          <td><div class="row-name">${stamp}${thumb}<div><b>${esc(p.name)}</b><span>${esc(p.id)} · ${esc(p.city || "")}</span></div></div></td>
          <td>${esc(p.country_name || p.country_id || "")}</td>
          <td><span class="chip chip-chapter">${esc(p.chapter || "—")}</span></td>
          <td class="num" style="font-variant-numeric:tabular-nums;font-size:12px">${esc(String(p.lat ?? "—"))}, ${esc(String(p.lng ?? "—"))}</td>
          <td><div class="row-actions">
            <button type="button" class="icon-btn" data-p-edit="${esc(p.id)}" aria-label="Edit">✎</button>
            <button type="button" class="icon-btn danger" data-p-del="${esc(p.id)}" aria-label="Delete">🗑</button>
          </div></td>
        </tr>`;
      })
      .join("");
    $("#places-pager").innerHTML = `
      <button type="button" id="pg-prev" ${state.placePage <= 0 ? "disabled" : ""}>Prev</button>
      <span>Page ${state.placePage + 1} / ${pages}</span>
      <button type="button" id="pg-next" ${state.placePage >= pages - 1 ? "disabled" : ""}>Next</button>`;
  }

  function openPlaceEditor(id) {
    const p = id ? state.placesDoc.places.find((x) => x.id === id) : null;
    const isNew = !p;
    const draft = p
      ? deepClone(p)
      : {
          id: "",
          name: "",
          city: "",
          country: "AM",
          country_name: "Armenia",
          country_id: "am",
          chapter: "Monuments",
          lat: 0,
          lng: 0,
          description: "",
          photo: "",
          in_app_preview: true,
        };
    const countryOpts = state.countriesDoc.countries
      .filter((c) => c.id !== "default")
      .map((c) => `<option value="${esc(c.id)}" ${draft.country_id === c.id ? "selected" : ""}>${esc(c.name)}</option>`)
      .join("");
    const icons = stampIconChoices();
    const currentIcon = draft.stamp_icon != null ? String(draft.stamp_icon).trim() : "";
    const iconInList = currentIcon && icons.some((i) => i.key === currentIcon);
    const iconOpts =
      `<option value="__default" ${!iconInList ? "selected" : ""}>Default — place id</option>` +
      icons
        .map(
          (i) =>
            `<option value="${esc(i.key)}" ${iconInList && i.key === currentIcon ? "selected" : ""}>${esc(i.label)} · ${esc(i.key)}</option>`
        )
        .join("");
    const colors = stampColorKeys();
    const currentColor = draft.stamp_color != null ? String(draft.stamp_color).trim() : "";
    const colorInList = currentColor && colors.indexOf(currentColor) !== -1;
    const colorOpts =
      `<option value="__default" ${!colorInList ? "selected" : ""}>Default</option>` +
      colors
        .map((k) => {
          const hex = window.WI_COL && WI_COL[k] ? WI_COL[k][0] : "";
          const label = STAMP_COLOR_LABEL[k] || k;
          return `<option value="${esc(k)}" ${colorInList && k === currentColor ? "selected" : ""}>${esc(label)}${hex ? " · " + esc(hex) : ""}</option>`;
        })
        .join("");
    const customIcon = currentIcon && !iconInList ? currentIcon : "";
    openModal(
      isNew ? "Add place" : "Edit place",
      `
      <div class="field"><label>ID</label><input id="f-pid" value="${esc(draft.id)}" ${isNew ? "" : "readonly"}></div>
      <div class="field"><label>Name</label><input id="f-pname" value="${esc(draft.name)}"></div>
      <div class="field-row">
        <div class="field"><label>City</label><input id="f-pcity" value="${esc(draft.city || "")}"></div>
        <div class="field"><label>Chapter</label><input id="f-pch" value="${esc(draft.chapter || "")}"></div>
      </div>
      <div class="field"><label>Country</label><select id="f-pcountry">${countryOpts}</select></div>
      <div class="field-row">
        <div class="field"><label>Lat</label><input id="f-plat" type="number" step="any" value="${draft.lat ?? ""}"></div>
        <div class="field"><label>Lng</label><input id="f-plng" type="number" step="any" value="${draft.lng ?? ""}"></div>
      </div>
      <div class="field"><label>Photo path</label><input id="f-pphoto" value="${esc(draft.photo || "")}" placeholder="assets/places/….jpg"></div>
      <div class="field"><label>Description</label><textarea id="f-pdesc" rows="4">${esc(draft.description || "")}</textarea></div>
      <div class="stamp-edit">
        <div>
          <div class="field"><label>Stamp icon</label><select id="f-picon">${iconOpts}</select></div>
          <div class="field"><label>Custom icon key</label><input id="f-picon-custom" value="${esc(customIcon)}" placeholder="Leave blank to use the menu" autocomplete="off"></div>
          <div class="field"><label>Stamp color</label><select id="f-pcolor">${colorOpts}</select></div>
          <div class="field"><label>Stamp label</label><input id="f-plabel" value="${esc(draft.stamp_label || "")}" placeholder="Place name" autocomplete="off"></div>
          <p class="stamp-note">Graphic only — photos never go on the stamp face. A key that isn’t drawn yet uses that chapter’s mark.</p>
        </div>
        <div class="stamp-preview" id="stamp-preview" aria-live="polite"></div>
      </div>
      `,
      [
        { label: "Cancel", className: "btn btn-secondary", onClick: closeModal },
        {
          label: "Save",
          className: "btn btn-primary",
          onClick: () => {
            const idVal = $("#f-pid").value.trim();
            const name = $("#f-pname").value.trim();
            if (!idVal || !name) return toast("ID and name required");
            const cid = $("#f-pcountry").value;
            const co = countryById(cid);
            const next = {
              ...(p || { precision: "venue", note: null, source: null, source_label: null, photo_credit: null, photo_source: null, image_credit: null, image_source: null, catalog: null, in_app_preview: true }),
              id: idVal,
              name,
              city: $("#f-pcity").value.trim(),
              chapter: $("#f-pch").value.trim() || "Monuments",
              country_id: cid,
              country_name: co ? co.name : cid,
              country: (co && (co.id || "").toUpperCase()) || draft.country,
              lat: numOr($("#f-plat").value, 0),
              lng: numOr($("#f-plng").value, 0),
              photo: $("#f-pphoto").value.trim() || null,
              description: $("#f-pdesc").value.trim() || null,
            };
            applyStampFields(next);
            if (isNew) {
              if (state.placesDoc.places.some((x) => x.id === idVal)) return toast("ID exists");
              state.placesDoc.places.push(next);
            } else {
              Object.assign(p, next);
              if (!Object.prototype.hasOwnProperty.call(next, "stamp_icon")) delete p.stamp_icon;
              if (!Object.prototype.hasOwnProperty.call(next, "stamp_color")) delete p.stamp_color;
              if (!Object.prototype.hasOwnProperty.call(next, "stamp_label")) delete p.stamp_label;
            }
            persist();
            closeModal();
            renderPlaces();
          },
        },
      ]
    );
    bindStampPreview();
  }

  function deletePlace(id) {
    if (!confirm("Delete place " + id + "?")) return;
    state.placesDoc.places = state.placesDoc.places.filter((p) => p.id !== id);
    (state.extras.users || []).forEach((u) => {
      u.collected_place_ids = (u.collected_place_ids || []).filter((x) => x !== id);
    });
    syncPrimaryUserToMe();
    persist();
    renderPlaces();
  }

  /* —— Users —— */
  function renderUsers() {
    const rows = (state.extras.users || [])
      .map((u) => {
        const initials = (u.display_name || "?")
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const pass = countryById(u.passport_country_id);
        const st = u.status || "active";
        const chip =
          st === "active" ? "chip-live" : st === "flagged" ? "chip-flag" : "chip-draft";
        return `<tr>
          <td><div class="row-name"><div class="av" style="width:32px;height:32px">${esc(initials)}</div><div><b>${esc(u.display_name)}</b><span>${esc(u.email || "")}${u.is_primary ? " · primary" : ""}</span></div></div></td>
          <td>${esc(u.home_city || "")}</td>
          <td>${esc(pass ? pass.name : u.passport_country_id || "")}</td>
          <td class="num">${(u.collected_place_ids || []).length}</td>
          <td class="num">${Number(u.coins) || 0}</td>
          <td><span class="chip ${chip}">${esc(st)}</span></td>
          <td><div class="row-actions">
            <button type="button" class="icon-btn" data-u-edit="${esc(u.id)}" aria-label="Edit">✎</button>
            <button type="button" class="icon-btn danger" data-u-del="${esc(u.id)}" aria-label="Delete" ${u.is_primary ? "disabled" : ""}>🗑</button>
          </div></td>
        </tr>`;
      })
      .join("");
    $("#users-tbody").innerHTML = rows || `<tr><td colspan="7" class="empty-hint">No users</td></tr>`;
  }

  function openUserEditor(id) {
    const u = id ? state.extras.users.find((x) => x.id === id) : null;
    const isNew = !u;
    const draft = u
      ? deepClone(u)
      : {
          id: uid("user"),
          display_name: "",
          email: "",
          home_city: "",
          home_country: "AM",
          passport_country_id: "am",
          coins: 0,
          collected_place_ids: [],
          status: "active",
          is_primary: false,
        };
    const countryOpts = state.countriesDoc.countries
      .filter((c) => c.id !== "default")
      .map((c) => `<option value="${esc(c.id)}" ${draft.passport_country_id === c.id ? "selected" : ""}>${esc(c.name)}</option>`)
      .join("");
    openModal(
      isNew ? "Add user" : "Edit user",
      `
      <div class="field"><label>Display name</label><input id="f-uname" value="${esc(draft.display_name)}"></div>
      <div class="field"><label>Email</label><input id="f-uemail" value="${esc(draft.email || "")}"></div>
      <div class="field-row">
        <div class="field"><label>Home city</label><input id="f-ucity" value="${esc(draft.home_city || "")}"></div>
        <div class="field"><label>Coins</label><input id="f-ucoins" type="number" value="${Number(draft.coins) || 0}"></div>
      </div>
      <div class="field"><label>Passport country</label><select id="f-upass">${countryOpts}</select></div>
      <div class="field"><label>Status</label>
        <select id="f-ustatus">
          ${["active", "paused", "flagged"].map((s) => `<option value="${s}" ${draft.status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label>Collected place IDs (comma-separated)</label>
        <textarea id="f-ucoll" rows="3">${esc((draft.collected_place_ids || []).join(", "))}</textarea>
      </div>
      `,
      [
        { label: "Cancel", className: "btn btn-secondary", onClick: closeModal },
        {
          label: "Save",
          className: "btn btn-primary",
          onClick: () => {
            const name = $("#f-uname").value.trim();
            if (!name) return toast("Name required");
            const coll = $("#f-ucoll")
              .value.split(/[\s,]+/)
              .map((s) => s.trim())
              .filter(Boolean);
            const next = {
              ...(u || draft),
              display_name: name,
              email: $("#f-uemail").value.trim(),
              home_city: $("#f-ucity").value.trim(),
              coins: numOr($("#f-ucoins").value, 0),
              passport_country_id: $("#f-upass").value,
              status: $("#f-ustatus").value,
              collected_place_ids: coll,
            };
            if (isNew) state.extras.users.push(next);
            else Object.assign(u, next);
            syncPrimaryUserToMe();
            persist();
            closeModal();
            renderUsers();
          },
        },
      ]
    );
  }

  /* —— Ads —— */
  function renderAds() {
    const ads = state.extras.ads || [];
    $("#ads-tbody").innerHTML =
      ads
        .map((a) => {
          const chip =
            a.status === "live" ? "chip-live" : a.status === "seasonal" ? "chip-seasonal" : a.status === "scheduled" ? "chip-soon" : "chip-draft";
          return `<tr class="${state.selectedAdId === a.id ? "selected" : ""}">
            <td><b>${esc(a.title)}</b></td>
            <td>${esc(a.slot || "")}</td>
            <td>${esc((a.starts || "") + " → " + (a.ends || ""))}</td>
            <td><span class="chip ${chip}">${esc(a.status || "draft")}</span></td>
            <td><div class="row-actions">
              <button type="button" class="icon-btn" data-a-edit="${esc(a.id)}">✎</button>
              <button type="button" class="icon-btn danger" data-a-del="${esc(a.id)}">🗑</button>
            </div></td>
          </tr>`;
        })
        .join("") || `<tr><td colspan="5" class="empty-hint">No promos</td></tr>`;
    const a = ads.find((x) => x.id === state.selectedAdId) || ads[0];
    if (a) {
      state.selectedAdId = a.id;
      $("#ad-compose").innerHTML = `
        <div class="field"><label>Title</label><input id="ad-title" value="${esc(a.title)}"></div>
        <div class="field"><label>Body</label><textarea id="ad-body">${esc(a.body || "")}</textarea></div>
        <div class="field-row">
          <div class="field"><label>Slot</label>
            <select id="ad-slot">${["Countries banner", "Trade strip", "Me card"]
              .map((s) => `<option ${a.slot === s ? "selected" : ""}>${s}</option>`)
              .join("")}</select>
          </div>
          <div class="field"><label>Status</label>
            <select id="ad-status">${["draft", "scheduled", "seasonal", "live"]
              .map((s) => `<option value="${s}" ${a.status === s ? "selected" : ""}>${s}</option>`)
              .join("")}</select>
          </div>
        </div>
        <div class="field-row">
          <div class="field"><label>Starts</label><input type="date" id="ad-starts" value="${esc(a.starts || "")}"></div>
          <div class="field"><label>Ends</label><input type="date" id="ad-ends" value="${esc(a.ends || "")}"></div>
        </div>
        <div class="banner-mock" aria-hidden="true">
          <div><div class="t">${esc(a.title)}</div><div class="s">${esc(a.body || "")}</div></div>
          <span class="cta">See stamps</span>
        </div>
        <div class="ph-actions" style="margin-top:14px;justify-content:flex-end">
          <button type="button" class="btn btn-primary" id="ad-save">Save promo</button>
        </div>`;
    } else {
      $("#ad-compose").innerHTML = `<p class="empty-hint">Select a promo or click Schedule promo.</p>`;
    }
  }

  function saveAdCompose() {
    const a = (state.extras.ads || []).find((x) => x.id === state.selectedAdId);
    if (!a) return;
    a.title = $("#ad-title").value.trim();
    a.body = $("#ad-body").value.trim();
    a.slot = $("#ad-slot").value;
    a.status = $("#ad-status").value;
    a.starts = $("#ad-starts").value;
    a.ends = $("#ad-ends").value;
    persist();
    renderAds();
    toast("Promo saved");
  }

  /* —— Trade —— */
  function renderTrade() {
    const rules = state.meDoc.coin_rules || {};
    const trade = state.meDoc.trade || {};
    $("#trade-rules").innerHTML = `
      <div class="card">
        <div class="card-h"><h2>Collection bonuses</h2><span class="chip chip-live">coin_rules</span></div>
        <div class="card-b">
          <div class="field"><label>Chapter complete coins</label><input type="number" id="tr-chapter" value="${rules.chapter_complete_coins ?? 50}"></div>
          <div class="field"><label>Country complete coins</label><input type="number" id="tr-country" value="${rules.country_complete_coins ?? 200}"></div>
          <div class="field"><label>Seasonal collect coins</label><input type="number" id="tr-seasonal" value="${rules.seasonal_collect_coins ?? 10}"></div>
          <div class="field"><label>Welcome grant coins</label><input type="number" id="tr-welcome" value="${rules.welcome_grant_coins ?? 100}"></div>
          <div class="field"><label>Ordinary first collect coins</label><input type="number" id="tr-ordinary" value="${rules.ordinary_first_collect_coins ?? 0}"></div>
          <div class="field"><label>Summary</label><textarea id="tr-summary" rows="3">${esc(rules.summary || "")}</textarea></div>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h2>Trade</h2><span class="chip chip-draft">me.trade / offers</span></div>
        <div class="card-b">
          <div class="field"><label>Duplicate place IDs (comma-separated)</label>
            <textarea id="tr-dups" rows="3">${esc(((trade.duplicate_place_ids || state.meDoc.duplicate_place_ids) || []).join(", "))}</textarea>
          </div>
          <p class="note"><b>Open trade offers:</b> ${(state.meDoc.trade_offers || []).length}. Edit JSON via Export → edit → Import for deep offer changes.</p>
          <ul class="activity" style="margin-top:8px">
            ${(state.meDoc.trade_offers || [])
              .map(
                (o) =>
                  `<li><span class="dot"></span><div><div class="t">${esc(o.give_place_id)} → ${esc(o.want_place_id)}</div><div class="m">${esc(o.status)} · ${esc(o.note || "")}</div></div></li>`
              )
              .join("") || "<li><div class='m'>No offers</div></li>"}
          </ul>
        </div>
      </div>`;
  }

  function saveTradeRules() {
    state.meDoc.coin_rules = state.meDoc.coin_rules || {};
    state.meDoc.coin_rules.chapter_complete_coins = numOr($("#tr-chapter").value, 50);
    state.meDoc.coin_rules.country_complete_coins = numOr($("#tr-country").value, 200);
    state.meDoc.coin_rules.seasonal_collect_coins = numOr($("#tr-seasonal").value, 10);
    state.meDoc.coin_rules.welcome_grant_coins = numOr($("#tr-welcome").value, 100);
    state.meDoc.coin_rules.ordinary_first_collect_coins = numOr($("#tr-ordinary").value, 0);
    state.meDoc.coin_rules.summary = $("#tr-summary").value.trim();
    const dups = $("#tr-dups")
      .value.split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    state.meDoc.duplicate_place_ids = dups;
    state.meDoc.trade = state.meDoc.trade || {};
    state.meDoc.trade.duplicate_place_ids = dups;
    persist();
    toast("Trade & coin rules saved");
  }

  /* —— Moderation —— */
  function renderModeration() {
    const tickets = state.extras.tickets || [];
    const openN = tickets.filter((t) => t.status === "open").length;
    $("#mod-open-count").textContent = openN + " open";
    $("#mod-list").innerHTML = tickets
      .map(
        (t) => `<li class="${state.selectedTicketId === t.id ? "on" : ""}" data-t-sel="${esc(t.id)}">
        <div class="who"><span>${esc(t.who)}</span><span class="chip ${t.type === "Trade" ? "chip-flag" : "chip-soon"}">${esc(t.type)}</span></div>
        <div class="preview">${esc(t.preview || t.subject)}</div>
      </li>`
      )
      .join("");
    const t = tickets.find((x) => x.id === state.selectedTicketId) || tickets[0];
    if (!t) {
      $("#mod-detail").innerHTML = `<p class="empty-hint" style="padding:24px">No tickets</p>`;
      return;
    }
    state.selectedTicketId = t.id;
    $("#mod-detail").innerHTML = `
      <div class="card-h">
        <h2>${esc(t.subject || t.id)}</h2>
        <div style="display:flex;gap:8px">
          <select id="t-status">${["open", "pending", "closed"].map((s) => `<option value="${s}" ${t.status === s ? "selected" : ""}>${s}</option>`).join("")}</select>
          <button type="button" class="btn btn-sm btn-danger" data-t-del="${esc(t.id)}">Delete</button>
        </div>
      </div>
      <div class="msgs">
        ${(t.messages || [])
          .map(
            (m) =>
              `<div class="bubble ${m.from === "agent" ? "agent" : "user"}">${esc(m.text)}<span class="when">${esc(m.when || "")}</span></div>`
          )
          .join("")}
      </div>
      <div class="compose-bar">
        <input type="text" id="t-reply" placeholder="Reply as Support…" aria-label="Reply">
        <button type="button" class="btn btn-primary" id="t-send">Send</button>
      </div>`;
  }

  /* —— Settings —— */
  function renderSettings() {
    const roles = state.extras.roles || [];
    $("#roles-tbody").innerHTML = roles
      .map(
        (r) => `<tr>
        <td><b>${esc(r.name)}</b><div class="edit-meta">${esc(r.id)}</div></td>
        <td class="check">${r.catalog ? "✓" : "—"}</td>
        <td class="check">${r.users ? "✓" : "—"}</td>
        <td class="check">${r.moderation ? "✓" : "—"}</td>
        <td class="check">${r.manage_roles ? "✓" : "—"}</td>
        <td><div class="row-actions">
          <button type="button" class="icon-btn" data-r-edit="${esc(r.id)}">✎</button>
          <button type="button" class="icon-btn danger" data-r-del="${esc(r.id)}">🗑</button>
        </div></td>
      </tr>`
      )
      .join("");
  }

  function openRoleEditor(id) {
    const r = id ? state.extras.roles.find((x) => x.id === id) : null;
    const isNew = !r;
    const draft = r || { id: uid("role"), name: "", catalog: false, users: false, moderation: false, manage_roles: false };
    openModal(
      isNew ? "Add role" : "Edit role",
      `
      <div class="field"><label>Name</label><input id="f-rname" value="${esc(draft.name)}"></div>
      <label class="inline-check"><input type="checkbox" id="f-rcat" ${draft.catalog ? "checked" : ""}> Catalog</label>
      <label class="inline-check"><input type="checkbox" id="f-rusers" ${draft.users ? "checked" : ""}> Users / coins</label>
      <label class="inline-check"><input type="checkbox" id="f-rmod" ${draft.moderation ? "checked" : ""}> Moderation</label>
      <label class="inline-check"><input type="checkbox" id="f-rmanage" ${draft.manage_roles ? "checked" : ""}> Manage roles</label>
      `,
      [
        { label: "Cancel", className: "btn btn-secondary", onClick: closeModal },
        {
          label: "Save",
          className: "btn btn-primary",
          onClick: () => {
            const name = $("#f-rname").value.trim();
            if (!name) return toast("Name required");
            const next = {
              ...(r || draft),
              name,
              catalog: $("#f-rcat").checked,
              users: $("#f-rusers").checked,
              moderation: $("#f-rmod").checked,
              manage_roles: $("#f-rmanage").checked,
            };
            if (isNew) state.extras.roles.push(next);
            else Object.assign(r, next);
            persist();
            closeModal();
            renderSettings();
          },
        },
      ]
    );
  }

  /* —— Modal helpers —— */
  function openModal(title, bodyHtml, actions) {
    $("#modal-title").textContent = title;
    $("#modal-body").innerHTML = bodyHtml;
    $("#modal-foot").innerHTML = "";
    (actions || []).forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = a.className || "btn btn-secondary";
      b.textContent = a.label;
      b.addEventListener("click", a.onClick);
      $("#modal-foot").appendChild(b);
    });
    const m = $("#modal");
    m.hidden = false;
    m.classList.add("on");
  }

  function closeModal() {
    const m = $("#modal");
    m.classList.remove("on");
    m.hidden = true;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function numOr(v, d) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  }

  /* —— Export / Import / Reset —— */
  function downloadJSON(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  function doExport() {
    syncCountriesIntoPlaces();
    syncPrimaryUserToMe();
    const stamp = new Date().toISOString().slice(0, 10);
    state.placesDoc.updated = stamp;
    state.countriesDoc.updated = stamp;
    state.meDoc.updated = stamp;
    state.extras.updated = stamp;
    downloadJSON("places.json", state.placesDoc);
    setTimeout(() => downloadJSON("countries.json", state.countriesDoc), 200);
    setTimeout(() => downloadJSON("me.json", state.meDoc), 400);
    setTimeout(() => downloadJSON("admin-extras.json", state.extras), 600);
    toast("Export started — 4 JSON files");
  }

  function doImport(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        // Accept either a packed {places,countries,me,extras} or a single doc
        if (data.places && data.places.places) {
          state.placesDoc = data.places;
          if (data.countries) state.countriesDoc = data.countries;
          if (data.me) state.meDoc = data.me;
          if (data.extras) state.extras = data.extras;
        } else if (Array.isArray(data.places) || (data.places && data.version && data.coordinate_system)) {
          // single places.json
          state.placesDoc = data;
        } else if (data.countries && Array.isArray(data.countries) && data.cloth_families) {
          state.countriesDoc = data;
        } else if (data.profile || data.coin_rules) {
          state.meDoc = data;
        } else if (data.ads || data.tickets || data.roles) {
          state.extras = Object.assign(state.extras || defaultExtras(state.meDoc), data);
        } else if (data.placesDoc || data.places) {
          // packed alternate
          if (data.placesDoc) state.placesDoc = data.placesDoc;
          if (data.countriesDoc) state.countriesDoc = data.countriesDoc;
          if (data.meDoc) state.meDoc = data.meDoc;
          if (data.extras) state.extras = data.extras;
        } else {
          throw new Error("Unrecognized JSON shape");
        }
        persist();
        state.snapshot = deepClone(packWorking());
        markDirty(false);
        renderAll();
        toast("Imported " + file.name);
      } catch (e) {
        console.error(e);
        toast("Import failed: " + e.message);
      }
    };
    reader.readAsText(file);
  }

  function doReset() {
    if (!confirm("Discard local edits and reload from the published data files?")) return;
    localStorage.removeItem(LS_KEY);
    boot(true);
  }

  /* —— Events —— */
  function bind() {
    $("#nav").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-go]");
      if (btn) show(btn.dataset.go);
    });
    $("#ov-new-place")?.addEventListener("click", () => {
      show("places");
      openPlaceEditor(null);
    });
    $("#btn-save").addEventListener("click", saveWorking);
    $("#btn-export").addEventListener("click", doExport);
    $("#btn-reset").addEventListener("click", doReset);
    $("#btn-import").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) doImport(f);
      e.target.value = "";
    });
    $("#modal-close").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e) => {
      if (e.target.id === "modal") closeModal();
    });
    $("#global-search").addEventListener("input", (e) => {
      state.placeQuery = e.target.value;
      state.placePage = 0;
      const view = $$(".view.on")[0];
      if (view && view.dataset.view === "places") renderPlaces();
      else if (e.target.value.trim()) show("places");
    });

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-c-toggle]");
      if (t) return toggleCountry(t.getAttribute("data-c-toggle"));
      const up = e.target.closest("[data-c-up]");
      if (up) return moveCountry(up.getAttribute("data-c-up"), -1);
      const down = e.target.closest("[data-c-down]");
      if (down) return moveCountry(down.getAttribute("data-c-down"), 1);
      const ce = e.target.closest("[data-c-edit]");
      if (ce) return openCountryEditor(ce.getAttribute("data-c-edit"));
      const pf = e.target.closest("[data-pf]");
      if (pf) {
        state.placeFilter = pf.getAttribute("data-pf");
        state.placePage = 0;
        return renderPlaces();
      }
      if (e.target.id === "pg-prev") {
        state.placePage = Math.max(0, state.placePage - 1);
        return renderPlaces();
      }
      if (e.target.id === "pg-next") {
        state.placePage++;
        return renderPlaces();
      }
      const pe = e.target.closest("[data-p-edit]");
      if (pe) return openPlaceEditor(pe.getAttribute("data-p-edit"));
      const pd = e.target.closest("[data-p-del]");
      if (pd) return deletePlace(pd.getAttribute("data-p-del"));
      const ue = e.target.closest("[data-u-edit]");
      if (ue) return openUserEditor(ue.getAttribute("data-u-edit"));
      const ud = e.target.closest("[data-u-del]");
      if (ud) {
        const id = ud.getAttribute("data-u-del");
        const u = state.extras.users.find((x) => x.id === id);
        if (u && u.is_primary) return toast("Cannot delete primary user");
        if (!confirm("Delete user?")) return;
        state.extras.users = state.extras.users.filter((x) => x.id !== id);
        persist();
        return renderUsers();
      }
      const ae = e.target.closest("[data-a-edit]");
      if (ae) {
        state.selectedAdId = ae.getAttribute("data-a-edit");
        return renderAds();
      }
      const ad = e.target.closest("[data-a-del]");
      if (ad) {
        const id = ad.getAttribute("data-a-del");
        if (!confirm("Delete promo?")) return;
        state.extras.ads = state.extras.ads.filter((x) => x.id !== id);
        if (state.selectedAdId === id) state.selectedAdId = null;
        persist();
        return renderAds();
      }
      if (e.target.id === "ad-save") return saveAdCompose();
      if (e.target.id === "btn-save-trade") return saveTradeRules();
      const ts = e.target.closest("[data-t-sel]");
      if (ts) {
        state.selectedTicketId = ts.getAttribute("data-t-sel");
        return renderModeration();
      }
      const td = e.target.closest("[data-t-del]");
      if (td) {
        const id = td.getAttribute("data-t-del");
        state.extras.tickets = state.extras.tickets.filter((x) => x.id !== id);
        state.selectedTicketId = null;
        persist();
        return renderModeration();
      }
      if (e.target.id === "t-send") {
        const ticket = state.extras.tickets.find((x) => x.id === state.selectedTicketId);
        const input = $("#t-reply");
        if (!ticket || !input || !input.value.trim()) return;
        ticket.messages = ticket.messages || [];
        ticket.messages.push({ from: "agent", text: input.value.trim(), when: "now" });
        ticket.status = $("#t-status") ? $("#t-status").value : ticket.status;
        persist();
        return renderModeration();
      }
      if (e.target.id === "t-status" || (e.target.closest && e.target.id === "t-status")) {
        /* handled on change below */
      }
      const re = e.target.closest("[data-r-edit]");
      if (re) return openRoleEditor(re.getAttribute("data-r-edit"));
      const rd = e.target.closest("[data-r-del]");
      if (rd) {
        const id = rd.getAttribute("data-r-del");
        if (!confirm("Delete role?")) return;
        state.extras.roles = state.extras.roles.filter((x) => x.id !== id);
        persist();
        return renderSettings();
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.id === "t-status") {
        const ticket = state.extras.tickets.find((x) => x.id === state.selectedTicketId);
        if (ticket) {
          ticket.status = e.target.value;
          persist();
          renderModeration();
        }
      }
    });

    $("#btn-add-country").addEventListener("click", () => openCountryEditor(null));
    $("#btn-add-place").addEventListener("click", () => openPlaceEditor(null));
    $("#btn-add-user").addEventListener("click", () => openUserEditor(null));
    $("#btn-add-ad").addEventListener("click", () => {
      const a = {
        id: uid("ad"),
        title: "New promo",
        body: "",
        slot: "Countries banner",
        style: "Standard coral CTA",
        starts: new Date().toISOString().slice(0, 10),
        ends: "",
        status: "draft",
      };
      state.extras.ads.push(a);
      state.selectedAdId = a.id;
      persist();
      renderAds();
    });
    $("#btn-add-ticket").addEventListener("click", () => {
      const t = {
        id: uid("t"),
        who: "New user",
        type: "Support",
        subject: "New ticket",
        preview: "Describe the issue…",
        status: "open",
        messages: [],
      };
      state.extras.tickets.push(t);
      state.selectedTicketId = t.id;
      persist();
      renderModeration();
    });
    $("#btn-add-role").addEventListener("click", () => openRoleEditor(null));
  }

  async function fetchJSON(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(path + " → " + res.status);
    return res.json();
  }

  async function boot(forceRemote) {
    $("#boot").hidden = false;
    $("#boot").textContent = "Loading Stampd catalog…";
    try {
      let packed = null;
      if (!forceRemote) {
        try {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) packed = JSON.parse(raw);
        } catch (_) {}
      }
      if (packed && packed.places && packed.countries && packed.me) {
        state.placesDoc = packed.places;
        state.countriesDoc = packed.countries;
        state.meDoc = packed.me;
        state.extras = packed.extras || defaultExtras(packed.me);
      } else {
        const [places, countries, me] = await Promise.all([
          fetchJSON(DATA_BASE + "places.json"),
          fetchJSON(DATA_BASE + "countries.json"),
          fetchJSON(DATA_BASE + "me.json"),
        ]);
        state.placesDoc = places;
        state.countriesDoc = countries;
        state.meDoc = me;
        state.extras = defaultExtras(me);
        persist();
      }
      // Fresh snapshot from remote for dirty detection
      const [p2, c2, m2] = await Promise.all([
        fetchJSON(DATA_BASE + "places.json"),
        fetchJSON(DATA_BASE + "countries.json"),
        fetchJSON(DATA_BASE + "me.json"),
      ]);
      state.snapshot = {
        places: p2,
        countries: c2,
        me: m2,
        extras: defaultExtras(m2),
      };
      // If we loaded from LS, compare; if just seeded, mark clean vs remote+default extras
      if (!forceRemote && packed) {
        recomputeDirty();
      } else {
        state.snapshot = deepClone(packWorking());
        markDirty(false);
      }
      $("#boot").hidden = true;
      renderAll();
    } catch (e) {
      console.error(e);
      $("#boot").className = "err";
      $("#boot").textContent = "Failed to load data: " + e.message;
    }
  }

  installStampChapterLookup();
  bind();
  boot(false);
  window.__stampdAdminShow = show;
  window.__stampdAdminState = state;
})();
