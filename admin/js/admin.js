/* Stampd Admin UI. Reads StampdStore and renders the ops console. */
(function () {
  const Store = window.StampdStore;
  const PAGE = 40;
  const SLOTS = ["Countries banner", "Trade strip", "Me card"];
  const STYLES = ["Seasonal (twilight)", "Standard coral CTA", "Navy informational"];
  const ROLE_NAMES = ["Admin", "Editor", "Support"];
  const CAPS = [
    ["overview", "Overview / KPIs"],
    ["countries", "Countries reorder & live toggle"],
    ["places", "Places CRUD"],
    ["ads", "Ads schedule"],
    ["trade", "Trade & coin rules"],
    ["users_read", "Users read"],
    ["users_write", "Users delete / mint coins"],
    ["moderation", "Moderation inbox"],
    ["roles", "Manage roles"],
  ];

  const ui = {
    view: "overview",
    q: "",
    chapter: "All",
    country: "All",
    sort: "catalog",
    page: 1,
    ticket: null,
    promo: null,
    pop: false,
    keepView: null,
    renderedView: null,
  };

  const ICON_EDIT =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 11.5V13h1.5L11 6.5 9.5 5 3 11.5zM12.2 5.3l-1.5-1.5 1.1-1.1a1 1 0 011.4 0l.1.1a1 1 0 010 1.4l-1.1 1.1z" stroke="currentColor" stroke-width="1.3"/></svg>';
  const ICON_DEL =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 4h10M6 4V3h4v1M5 4v8.5a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
    );
  }

  function fmt(n) {
    return Number(n || 0).toLocaleString("en-US");
  }

  function familyLabel(family) {
    const value = String(family || "");
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  }

  function safeHex(hex) {
    return /^#[0-9A-Fa-f]{3,8}$/.test(hex || "") ? hex : "#1B2747";
  }

  function initials(name) {
    return (
      String(name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase() || "•"
    );
  }

  function relTime(iso) {
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return "";
    const seconds = Math.round((Date.now() - t) / 1000);
    if (Math.abs(seconds) < 45) return "just now";
    if (seconds > 0 && seconds < 3600) return Math.floor(seconds / 60) + " min ago";
    if (seconds > 0 && seconds < 86400) return Math.floor(seconds / 3600) + " h ago";
    return String(iso).slice(0, 10);
  }

  function toast(message) {
    const el = document.getElementById("toast");
    el.hidden = false;
    el.textContent = message;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 4200);
  }

  function download(name, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2) + "\n"], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2500);
  }

  function csvCell(value) {
    const text = value == null ? "" : String(value);
    if (/[",\n]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
  }

  function state() {
    return Store.state;
  }

  function filteredPlaces() {
    let list = Store.places().slice();
    if (ui.chapter !== "All") list = list.filter((p) => p.chapter === ui.chapter);
    if (ui.country !== "All") list = list.filter((p) => p.country_id === ui.country);
    if (ui.view === "places" && ui.q) {
      const q = ui.q.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.id, p.city, p.country_name, p.country, p.chapter].some((v) =>
          String(v || "").toLowerCase().includes(q)
        )
      );
    }
    if (ui.sort === "name") list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    else if (ui.sort === "country") {
      list.sort(
        (a, b) =>
          String(a.country_name || "").localeCompare(String(b.country_name || "")) ||
          String(a.name).localeCompare(String(b.name))
      );
    } else if (ui.sort === "collected") {
      const counts = Store.collectCounts();
      list.sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0) || String(a.name).localeCompare(String(b.name)));
    }
    return list;
  }

  function countryOptions(selected, includeAll) {
    let html = includeAll ? '<option value="All"' + (selected === "All" ? " selected" : "") + ">All countries</option>" : "";
    Store.countries().forEach((c) => {
      const count = Store.placeCount(c.id);
      html +=
        '<option value="' +
        esc(c.id) +
        '"' +
        (c.id === selected ? " selected" : "") +
        ">" +
        esc(c.name) +
        " · " +
        count +
        "</option>";
    });
    return html;
  }

  function thumb(photo, alt) {
    if (!photo) return '<div class="thumb ph" aria-hidden="true"></div>';
    return (
      '<img class="thumb" alt="' +
      esc(alt || "") +
      '" src="' +
      esc(Store.assetUrl(photo)) +
      '" onerror="this.outerHTML=\'<div class=&quot;thumb ph&quot;></div>\'">'
    );
  }

  function placeFlags(p) {
    if (p.chapter === "Seasonal" || p.seasonal) return '<span class="chip chip-seasonal">Seasonal</span>';
    if (p.in_app_preview === false) return '<span class="chip chip-draft">Draft</span>';
    return '<span class="chip chip-live">Live</span>';
  }

  function userChip(status) {
    if (status === "paused") return '<span class="chip chip-draft">Paused</span>';
    if (status === "flagged") return '<span class="chip chip-flag">Flagged</span>';
    return '<span class="chip chip-live">Active</span>';
  }

  function promoChip(promo) {
    if (promo.style && promo.style.indexOf("Seasonal") === 0) return '<span class="chip chip-seasonal">Seasonal</span>';
    if (promo.status === "scheduled") return '<span class="chip chip-soon">Scheduled</span>';
    if (promo.status === "draft") return '<span class="chip chip-draft">Draft</span>';
    return '<span class="chip chip-live">Live</span>';
  }

  function openDialog(opts) {
    const dlg = document.getElementById("modal");
    dlg.classList.toggle("wide", !!opts.wide);
    dlg.innerHTML =
      '<form>' +
      '<div class="hd"><h2>' +
      esc(opts.title) +
      '</h2><button type="button" class="icon-btn" data-close aria-label="Close">×</button></div>' +
      '<div class="bd"><div class="form-error" id="form-error"></div>' +
      opts.body +
      "</div>" +
      '<div class="ft"><button type="button" class="btn btn-secondary" data-close>Cancel</button>' +
      (opts.submitLabel
        ? '<button type="submit" class="btn ' +
          (opts.danger ? "btn-danger" : "btn-primary") +
          '">' +
          esc(opts.submitLabel) +
          "</button>"
        : "") +
      "</div></form>";
    dlg.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => dlg.close()));
    dlg.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const err = opts.onSubmit ? opts.onSubmit(new FormData(event.target), dlg) : null;
      const box = dlg.querySelector("#form-error");
      if (err) {
        box.textContent = err;
        return;
      }
      dlg.close();
    });
    if (opts.mount) opts.mount(dlg);
    if (!dlg.open) dlg.showModal();
  }

  function mountStamps(dlg, selected) {
    const ids = new Set(selected || []);
    dlg._ids = ids;
    const box = dlg.querySelector("#stamp-tags");
    const find = dlg.querySelector("#stamp-find");
    const hits = dlg.querySelector("#stamp-hits");
    function paint() {
      const rows = [...ids];
      box.innerHTML = rows.length
        ? rows
            .map((id) => {
              const place = Store.placeById(id);
              return (
                '<span class="tag">' +
                esc(place ? place.name : id) +
                '<button type="button" data-rm="' +
                esc(id) +
                '" aria-label="Remove stamp">×</button></span>'
              );
            })
            .join("")
        : '<span class="empty-hint">No stamps yet.</span>';
    }
    paint();
    box.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-rm]");
      if (!btn) return;
      ids.delete(btn.dataset.rm);
      paint();
    });
    find.addEventListener("input", () => {
      const q = find.value.trim().toLowerCase();
      if (!q) {
        hits.innerHTML = "";
        return;
      }
      const list = Store.places()
        .filter((p) => !ids.has(p.id) && (String(p.name || "").toLowerCase().includes(q) || p.id.includes(q)))
        .slice(0, 8);
      hits.innerHTML = list.length
        ? list
            .map(
              (p) =>
                '<button type="button" data-add="' +
                esc(p.id) +
                '">' +
                esc(p.name) +
                " · " +
                esc(p.id) +
                "</button>"
            )
            .join("")
        : '<div class="empty-hint" style="padding:8px">No matches</div>';
    });
    hits.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-add]");
      if (!btn) return;
      ids.add(btn.dataset.add);
      find.value = "";
      hits.innerHTML = "";
      paint();
    });
  }

  function openPlaceForm(place) {
    const row = place || {
      id: "",
      name: "",
      city: "",
      country_id: "am",
      chapter: "Monuments",
      lat: "",
      lng: "",
      precision: "venue",
      description: "",
      photo: "",
      photo_credit: "",
      photo_source: "",
      catalog: "world_v4",
      in_app_preview: true,
      seasonal: false,
      seasonal_label: "",
      note: "",
      source: "",
    };
    const chapters = Store.CHAPTERS.slice();
    Store.places().forEach((p) => {
      if (p.chapter && !chapters.includes(p.chapter)) chapters.push(p.chapter);
    });
    openDialog({
      title: place ? "Edit place" : "Add place",
      wide: true,
      submitLabel: place ? "Save place" : "Add place",
      body:
        '<input type="hidden" name="original" value="' +
        esc(place ? place.id : "") +
        '">' +
        '<div class="field-row"><div class="field"><label>Id</label><input name="id" required value="' +
        esc(row.id) +
        '" placeholder="garni"></div>' +
        '<div class="field"><label>Name</label><input name="name" required value="' +
        esc(row.name) +
        '"></div></div>' +
        '<div class="field-row"><div class="field"><label>City</label><input name="city" value="' +
        esc(row.city || "") +
        '"></div>' +
        '<div class="field"><label>Country</label><select name="country_id">' +
        countryOptions(row.country_id, false) +
        "</select></div></div>" +
        '<div class="field-row"><div class="field"><label>Chapter</label><select name="chapter">' +
        chapters
          .map((ch) => '<option' + (ch === row.chapter ? " selected" : "") + ">" + esc(ch) + "</option>")
          .join("") +
        '</select></div><div class="field"><label>Precision</label><select name="precision">' +
        ["venue", "city", "approximate", "island"]
          .map((p) => '<option' + (p === (row.precision || "venue") ? " selected" : "") + ">" + esc(p) + "</option>")
          .join("") +
        "</select></div></div>" +
        '<div class="field-row"><div class="field"><label>Latitude</label><input name="lat" inputmode="decimal" value="' +
        esc(row.lat) +
        '"></div><div class="field"><label>Longitude</label><input name="lng" inputmode="decimal" value="' +
        esc(row.lng) +
        '"></div></div>' +
        '<div class="field"><label>Description</label><textarea name="description">' +
        esc(row.description || "") +
        "</textarea></div>" +
        '<div class="field-row"><div class="field"><label>Photo path</label><input name="photo" value="' +
        esc(row.photo || "") +
        '" placeholder="assets/places/' +
        esc(row.id || "id") +
        '.jpg"></div><div class="field"><label>Catalog</label><input name="catalog" value="' +
        esc(row.catalog || "world_v4") +
        '"></div></div>' +
        '<img class="photo-preview" alt="" ' +
        (row.photo ? 'src="' + esc(Store.assetUrl(row.photo)) + '"' : "hidden") +
        ">" +
        '<div class="field-row"><div class="field"><label>Photo credit</label><input name="photo_credit" value="' +
        esc(row.photo_credit || "") +
        '"></div><div class="field"><label>Photo source URL</label><input name="photo_source" value="' +
        esc(row.photo_source || "") +
        '"></div></div>' +
        '<div class="field-row"><div class="field"><label>Seasonal label</label><input name="seasonal_label" value="' +
        esc(row.seasonal_label || "") +
        '"></div><div class="field"><label>Source URL</label><input name="source" value="' +
        esc(row.source || "") +
        '"></div></div>' +
        '<div class="field"><label>Note</label><input name="note" value="' +
        esc(row.note || "") +
        '"></div>' +
        '<label class="checkline"><input type="checkbox" name="in_app_preview" value="1"' +
        (row.in_app_preview === false ? "" : " checked") +
        "> In app preview</label>" +
        '<label class="checkline"><input type="checkbox" name="seasonal" value="1"' +
        (row.seasonal || row.chapter === "Seasonal" ? " checked" : "") +
        "> Seasonal stamp</label>",
      mount(dlg) {
        const photo = dlg.querySelector('[name="photo"]');
        const img = dlg.querySelector(".photo-preview");
        const chapter = dlg.querySelector('[name="chapter"]');
        const seasonal = dlg.querySelector('[name="seasonal"]');
        photo.addEventListener("input", () => {
          const src = Store.assetUrl(photo.value.trim());
          if (!src) {
            img.hidden = true;
            return;
          }
          img.hidden = false;
          img.src = src;
        });
        chapter.addEventListener("change", () => {
          if (chapter.value === "Seasonal") seasonal.checked = true;
        });
      },
      onSubmit(fd) {
        return Store.savePlace(
          {
            id: fd.get("id"),
            name: fd.get("name"),
            city: fd.get("city"),
            country_id: fd.get("country_id"),
            chapter: fd.get("chapter"),
            lat: fd.get("lat"),
            lng: fd.get("lng"),
            precision: fd.get("precision"),
            description: fd.get("description"),
            photo: fd.get("photo"),
            photo_credit: fd.get("photo_credit"),
            photo_source: fd.get("photo_source"),
            catalog: fd.get("catalog"),
            seasonal_label: fd.get("seasonal_label"),
            source: fd.get("source"),
            note: fd.get("note"),
            in_app_preview: fd.get("in_app_preview") === "1",
            seasonal: fd.get("seasonal") === "1",
          },
          fd.get("original") || ""
        );
      },
    });
  }

  function openCountryForm(row) {
    const isNew = !row;
    const data = row || {
      id: "",
      name: "",
      family: "blue",
      status: "live",
      lat: "",
      lng: "",
      note: "",
    };
    const group = Store.countries().filter((c) =>
      data.status === "live" ? c.status === "live" && c.id !== "default" : c.id !== "default" && c.status !== "live"
    );
    const index = Math.max(1, group.findIndex((c) => c.id === data.id) + 1);
    openDialog({
      title: isNew ? "Add country" : "Edit country",
      submitLabel: isNew ? "Add country" : "Save country",
      body:
        '<div class="field-row"><div class="field"><label>Id</label><input name="id" required value="' +
        esc(data.id) +
        '"' +
        (isNew ? "" : " readonly") +
        '></div><div class="field"><label>Name</label><input name="name" required value="' +
        esc(data.name) +
        '"></div></div>' +
        '<div class="field-row"><div class="field"><label>Cloth family</label><select name="family">' +
        Store.FAMILIES.map(
          (family) =>
            '<option value="' +
            family +
            '"' +
            (family === data.family ? " selected" : "") +
            ">" +
            familyLabel(family) +
            " · " +
            esc(Store.clothHex(family)) +
            "</option>"
        ).join("") +
        '</select></div><div class="field"><label>Status</label><select name="status"><option value="live"' +
        (data.status === "live" ? " selected" : "") +
        '>Available</option><option value="coming_soon"' +
        (data.status !== "live" ? " selected" : "") +
        ">Coming soon</option></select></div></div>" +
        '<div class="field-row"><div class="field"><label>Order in that list</label><input name="order" type="number" min="1" value="' +
        (isNew ? "" : index || 1) +
        '"></div><div class="field"><label>Note</label><input name="note" value="' +
        esc(data.note || "") +
        '"></div></div>' +
        '<div class="field-row"><div class="field"><label>Latitude</label><input name="lat" value="' +
        esc(data.lat) +
        '"></div><div class="field"><label>Longitude</label><input name="lng" value="' +
        esc(data.lng) +
        '"></div></div>' +
        '<p class="empty-hint">Cloth hex follows the family. Order is the array order exported in countries.json and places.json.</p>',
      onSubmit(fd) {
        return Store.saveCountry(
          {
            id: fd.get("id"),
            name: fd.get("name"),
            family: fd.get("family"),
            status: fd.get("status"),
            lat: fd.get("lat"),
            lng: fd.get("lng"),
            note: fd.get("note"),
            order: fd.get("order"),
          },
          isNew
        );
      },
    });
  }

  function openUserForm(user) {
    const row = user || {
      id: "",
      name: "",
      email: "",
      home_city: "",
      home_country: "",
      passport_country_id: "am",
      coins: 0,
      status: "active",
      bio: "",
      member_since: new Date().toISOString().slice(0, 10),
      collected_place_ids: [],
      primary: false,
    };
    const visited = new Set(
      (state().meDoc.countries || []).filter((c) => c.visited).map((c) => c.id)
    );
    openDialog({
      title: user ? "Edit user" : "Add user",
      wide: true,
      submitLabel: user ? "Save user" : "Add user",
      body:
        '<input type="hidden" name="original" value="' +
        esc(row.id) +
        '">' +
        (row.primary ? '<p class="note"><b>Sample profile.</b> Saving writes this traveller through to me.json.</p>' : "") +
        '<div class="field-row"><div class="field"><label>Name</label><input name="name" required value="' +
        esc(row.name) +
        '"></div><div class="field"><label>Email</label><input name="email" type="email" required value="' +
        esc(row.email) +
        '"></div></div>' +
        '<div class="field-row"><div class="field"><label>Home city</label><input name="home_city" value="' +
        esc(row.home_city || "") +
        '"></div><div class="field"><label>Home country code</label><input name="home_country" value="' +
        esc(row.home_country || "") +
        '" placeholder="AM"></div></div>' +
        '<div class="field-row"><div class="field"><label>Passport country</label><select name="passport_country_id">' +
        countryOptions(row.passport_country_id, false) +
        '</select></div><div class="field"><label>Coins</label><input name="coins" type="number" value="' +
        esc(row.coins) +
        '"></div></div>' +
        '<div class="field-row"><div class="field"><label>Status</label><select name="status">' +
        ["active", "paused", "flagged"]
          .map((s) => '<option' + (s === row.status ? " selected" : "") + ">" + s + "</option>")
          .join("") +
        '</select></div><div class="field"><label>Member since</label><input name="member_since" type="date" value="' +
        esc(row.member_since || "") +
        '"></div></div>' +
        '<div class="field"><label>Bio</label><textarea name="bio">' +
        esc(row.bio || "") +
        "</textarea></div>" +
        '<div class="field"><label>Collected stamps</label><div id="stamp-tags" class="tag-row"></div><input id="stamp-find" placeholder="Search places to add a stamp" autocomplete="off"><div id="stamp-hits" class="hit-list"></div></div>' +
        (row.primary
          ? '<div class="field"><label>Countries visited (sample profile)</label><div class="scroll-box">' +
            (state().meDoc.countries || [])
              .map(
                (c) =>
                  '<label><input type="checkbox" name="visited" value="' +
                  esc(c.id) +
                  '"' +
                  (visited.has(c.id) ? " checked" : "") +
                  "> " +
                  esc(c.name) +
                  "</label>"
              )
              .join("") +
            "</div></div>"
          : ""),
      mount(dlg) {
        mountStamps(dlg, row.collected_place_ids || []);
      },
      onSubmit(fd, dlg) {
        const payload = {
          name: fd.get("name"),
          email: fd.get("email"),
          home_city: fd.get("home_city"),
          home_country: fd.get("home_country"),
          passport_country_id: fd.get("passport_country_id"),
          coins: fd.get("coins"),
          status: fd.get("status"),
          bio: fd.get("bio"),
          member_since: fd.get("member_since"),
          collected_place_ids: [...dlg._ids],
        };
        if (row.primary) payload.visited = fd.getAll("visited");
        return Store.saveUser(payload, fd.get("original") || "");
      },
    });
  }

  function openBulk() {
    const list = filteredPlaces();
    if (!list.length) {
      toast("No places in the current filter.");
      return;
    }
    openDialog({
      title: "Bulk edit " + fmt(list.length) + " places",
      submitLabel: "Apply to " + fmt(list.length),
      body:
        '<p class="empty-hint">Applies to the current filter, not only this page. Leave a field blank to keep it.</p>' +
        '<div class="field"><label>Chapter</label><select name="chapter"><option value="">No change</option>' +
        Store.CHAPTERS.map((ch) => "<option>" + esc(ch) + "</option>").join("") +
        '</select></div><div class="field"><label>In app preview</label><select name="preview"><option value="">No change</option><option value="on">Live</option><option value="off">Draft</option></select></div>' +
        '<div class="field"><label>Move to country</label><select name="country_id"><option value="">No change</option>' +
        Store.countries()
          .map((c) => '<option value="' + esc(c.id) + '">' + esc(c.name) + "</option>")
          .join("") +
        '</select></div><div class="field"><label>Catalog flag</label><input name="catalog" placeholder="world_v4"></div>',
      onSubmit(fd) {
        return Store.bulkPlaces(
          list.map((p) => p.id),
          {
            chapter: fd.get("chapter"),
            preview: fd.get("preview"),
            country_id: fd.get("country_id"),
            catalog: String(fd.get("catalog") || "").trim(),
          }
        );
      },
    });
  }

  function openCoins() {
    const users = state().extras.users;
    openDialog({
      title: "Adjust coins",
      submitLabel: "Apply",
      body:
        '<div class="field"><label>User</label><select name="user">' +
        users
          .map((u) => '<option value="' + esc(u.id) + '">' + esc(u.name) + " · " + fmt(u.coins) + "</option>")
          .join("") +
        '</select></div><div class="field"><label>Change</label><input name="delta" type="number" placeholder="50 or -10"></div>' +
        '<div class="field"><label>Reason</label><input name="reason" placeholder="Shown on the sample ledger for the profile user"></div>',
      onSubmit(fd) {
        return Store.adjustCoins(fd.get("user"), fd.get("delta"), fd.get("reason"));
      },
    });
  }

  function openTicketForm() {
    openDialog({
      title: "New ticket",
      submitLabel: "Add ticket",
      body:
        '<div class="field-row"><div class="field"><label>From</label><input name="from" required></div><div class="field"><label>Type</label><select name="type"><option>Support</option><option>Trade</option><option>Account</option></select></div></div>' +
        '<div class="field"><label>Subject</label><input name="subject"></div><div class="field"><label>Message</label><textarea name="text" required></textarea></div>',
      onSubmit(fd) {
        const err = Store.saveTicket({
          from: fd.get("from"),
          type: fd.get("type"),
          subject: fd.get("subject"),
          text: fd.get("text"),
        });
        if (!err) ui.ticket = state().extras.tickets[0] && state().extras.tickets[0].id;
        return err;
      },
    });
  }

  function openInvite() {
    openDialog({
      title: "Invite admin",
      submitLabel: "Invite",
      body:
        '<div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Email</label><input name="email" type="email" required></div>' +
        '<div class="field"><label>Role</label><select name="role"><option>Editor</option><option>Admin</option><option>Support</option></select></div>',
      onSubmit(fd) {
        return Store.saveMember({ name: fd.get("name"), email: fd.get("email"), role: fd.get("role") });
      },
    });
  }

  function confirmRemove(title, body, label, run) {
    openDialog({
      title: title,
      danger: true,
      submitLabel: label,
      body: '<p class="empty-hint">' + body + "</p>",
      onSubmit() {
        const err = run();
        if (err) return err;
        return null;
      },
    });
  }

  function removeCountry(row) {
    const count = Store.placeCount(row.id);
    openDialog({
      title: "Remove " + row.name,
      body:
        "<p>" +
        fmt(count) +
        " places currently use this country. Removing the country drops it from both catalog files. Places can stay, with a country id that no longer has a cloth row, or be deleted with it.</p>",
      mount(dlg) {
        const ft = dlg.querySelector(".ft");
        ft.innerHTML =
          '<button type="button" class="btn btn-secondary" data-close>Cancel</button>' +
          '<button type="button" class="btn btn-secondary" data-mode="keep">Keep places</button>' +
          '<button type="button" class="btn btn-danger" data-mode="places">Remove ' +
          fmt(count) +
          " places too</button>";
        ft.querySelector("[data-close]").addEventListener("click", () => dlg.close());
        ft.querySelector("[data-mode=keep]").addEventListener("click", () => {
          const err = Store.deleteCountry(row.id, false);
          if (err) toast(err);
          else dlg.close();
        });
        ft.querySelector("[data-mode=places]").addEventListener("click", () => {
          const err = Store.deleteCountry(row.id, true);
          if (err) toast(err);
          else dlg.close();
        });
      },
    });
  }

  function searchHits(q) {
    const n = q.toLowerCase();
    const hits = [];
    let countriesN = 0;
    Store.countries().forEach((c) => {
      if (countriesN >= 4) return;
      if (String(c.name || "").toLowerCase().includes(n) || String(c.id).includes(n)) {
        countriesN += 1;
        hits.push({ kind: "country", id: c.id, label: c.name, meta: c.id + " · " + familyLabel(c.family) });
      }
    });
    let placesN = 0;
    Store.places().forEach((p) => {
      if (placesN >= 6) return;
      if (
        String(p.name || "").toLowerCase().includes(n) ||
        String(p.id).includes(n) ||
        String(p.city || "").toLowerCase().includes(n)
      ) {
        placesN += 1;
        hits.push({ kind: "place", id: p.id, label: p.name, meta: (p.country_name || "") + " · " + (p.chapter || "") });
      }
    });
    state().extras.users.forEach((u) => {
      if (hits.filter((h) => h.kind === "user").length >= 3) return;
      if (String(u.name || "").toLowerCase().includes(n) || String(u.email || "").toLowerCase().includes(n)) {
        hits.push({ kind: "user", id: u.id, label: u.name, meta: u.email });
      }
    });
    return hits;
  }

  function goHit(hit) {
    ui.pop = false;
    if (hit.kind === "place") {
      ui.view = "places";
      ui.q = hit.id;
      ui.chapter = "All";
      ui.country = "All";
      ui.page = 1;
    } else if (hit.kind === "country") {
      ui.view = "countries";
      ui.q = hit.label;
    } else {
      ui.view = "users";
      ui.q = hit.label;
    }
    render();
  }

  function renderOverview() {
    const k = Store.kpis();
    const chapters = ["Monuments", "Foods", "Visit", "Seasonal"];
    const max = Math.max(1, ...chapters.map((ch) => k.chapters[ch] || 0));
    const bars = chapters
      .map((ch) => {
        const n = k.chapters[ch] || 0;
        const klass = ch.toLowerCase();
        return (
          '<div class="col"><i class="' +
          klass +
          '" style="height:' +
          Math.max(8, Math.round((n / max) * 100)) +
          '%"></i><span>' +
          esc(ch) +
          "</span><b>" +
          fmt(n) +
          "</b></div>"
        );
      })
      .join("");
    const activity = (state().extras.activity || []).slice(0, 5);
    const facts = [
      [fmt(k.places) + " places in the catalog", "Places"],
      [k.live + " countries available · " + k.soon + " coming soon", "Countries"],
      [(state().meDoc.profile.display_name || "Profile") + " · " + fmt(k.profileStamps) + " stamps · " + fmt(k.profileCoins) + " coins", "Sample profile"],
      [fmt(k.offers) + " trade offers · " + k.achievementsEarned + " of " + k.achievements + " achievements earned", "me.json"],
    ];
    const items = activity
      .map(
        (a) =>
          '<li><span class="dot"></span><div><div class="t">' +
          esc(a.text) +
          '</div><div class="m">Just now in this browser · ' +
          esc(relTime(a.at)) +
          "</div></div></li>"
      )
      .join("");
    const factHtml = facts
      .map(
        (f, i) =>
          '<li><span class="dot ' +
          ["", "mint", "sky", "tw"][i] +
          '"></span><div><div class="t">' +
          esc(f[0]) +
          '</div><div class="m">' +
          esc(f[1]) +
          "</div></div></li>"
      )
      .join("");
    return (
      '<div class="ph"><div><h1>Overview</h1><p>Counts from the loaded catalog, the sample profile, and the stub travellers stored in this browser.</p></div>' +
      '<div class="ph-actions"><button type="button" class="btn btn-secondary" data-act="export-csv">Export CSV</button>' +
      '<button type="button" class="btn btn-primary" data-act="add-place">+ New place</button></div></div>' +
      '<div class="kpi-row">' +
      kpi("kpi-places", "Places", fmt(k.places), (k.chapters.world_v4 ? "" : "") + "Full places.json catalog") +
      kpi("kpi-countries", "Countries", fmt(k.live), fmt(k.soon) + " coming soon · " + k.def + " default cloth") +
      kpi("kpi-stamps", "Stamps collected", fmt(k.stamps), fmt(k.profileStamps) + " on the sample profile") +
      kpi("kpi-coins", "Coins", fmt(k.coins), fmt(k.profileCoins) + " on the sample profile") +
      kpi("kpi-offers", "Trade offers", fmt(k.offers), fmt(k.open) + " open · " + fmt(k.pending) + " pending") +
      "</div>" +
      '<div class="grid-2"><div class="card"><div class="card-h"><h2>Places by chapter</h2><span class="chip chip-live">Catalog</span></div><div class="card-b"><div class="chart labeled">' +
      bars +
      '</div></div></div><div class="card"><div class="card-h"><h2>Recent activity</h2></div><div class="card-b" style="padding-top:4px;padding-bottom:4px"><ul class="activity">' +
      items +
      factHtml +
      "</ul></div></div></div>"
    );
  }

  function kpi(id, label, value, sub) {
    return (
      '<div class="kpi" id="' +
      id +
      '"><div class="k">' +
      esc(label) +
      '</div><div class="v">' +
      value +
      '</div><div class="d flat">' +
      esc(sub) +
      "</div></div>"
    );
  }

  function countryRow(c, index, draggable) {
    const count = Store.placeCount(c.id);
    return (
      "<li" +
      (draggable ? ' data-drag="' + esc(c.id) + '"' : "") +
      ">" +
      (draggable
        ? '<span class="grip" draggable="true" data-drag-handle="' +
          esc(c.id) +
          '" title="Drag to reorder" aria-label="Reorder ' +
          esc(c.name) +
          '"><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="ord">' +
          (index + 1) +
          "</span>"
        : '<span class="ord"></span>') +
      '<span class="cloth" style="background:' +
      safeHex(c.cloth_hex) +
      '" title="' +
      esc(familyLabel(c.family)) +
      '"></span><div class="grow"><b>' +
      esc(c.name) +
      "</b><span>" +
      esc(familyLabel(c.family)) +
      " · " +
      fmt(count) +
      " places</span></div>" +
      '<button type="button" class="toggle' +
      (c.status === "live" ? " on" : "") +
      '" data-act="toggle-country" data-id="' +
      esc(c.id) +
      '" aria-pressed="' +
      (c.status === "live") +
      '" aria-label="' +
      (c.status === "live" ? "Set coming soon" : "Set available") +
      '"></button>' +
      '<button type="button" class="icon-btn" data-act="edit-country" data-id="' +
      esc(c.id) +
      '" aria-label="Edit ' +
      esc(c.name) +
      '">' +
      ICON_EDIT +
      "</button>" +
      '<button type="button" class="icon-btn danger" data-act="delete-country" data-id="' +
      esc(c.id) +
      '" aria-label="Remove ' +
      esc(c.name) +
      '">' +
      ICON_DEL +
      "</button></li>"
    );
  }

  function renderCountries() {
    const q = ui.q.toLowerCase();
    const match = (c) =>
      !q || String(c.name || "").toLowerCase().includes(q) || String(c.id).includes(q) || String(c.family || "").includes(q);
    const def = Store.countries().find((c) => c.id === "default");
    const live = Store.countries().filter((c) => c.id !== "default" && c.status === "live" && match(c));
    const soon = Store.countries().filter((c) => c.id !== "default" && c.status !== "live" && match(c));
    const liveCount = Store.countries().filter((c) => c.id !== "default" && c.status === "live").length;
    const soonCount = Store.countries().filter((c) => c.id !== "default" && c.status !== "live").length;
    return (
      '<div class="ph"><div><h1>Countries</h1><p>Available vs coming soon, cloth family, and catalog order. Both countries.json and the countries list inside places.json stay in step.</p></div>' +
      '<div class="ph-actions"><button type="button" class="btn btn-secondary" data-act="import">Import catalog</button>' +
      '<button type="button" class="btn btn-primary" data-act="add-country">Add country</button></div></div>' +
      '<div class="split"><div class="card list-card"><div class="card-h"><h2>Available now</h2><span class="chip chip-live">' +
      liveCount +
      ' live</span></div><div class="card-b"><div class="list-scroll"><ul class="clist">' +
      (def && match(def)
        ? '<li><span class="ord"></span><span class="cloth" style="background:' +
          safeHex(def.cloth_hex) +
          '"></span><div class="grow"><b>' +
          esc(def.name) +
          '</b><span>Default cloth · not a traveller country</span></div><span class="chip chip-draft">System</span>' +
          '<button type="button" class="icon-btn" data-act="edit-country" data-id="default" aria-label="Edit default">' +
          ICON_EDIT +
          "</button></li>"
        : "") +
      live.map((c, i) => countryRow(c, i, true)).join("") +
      "</ul></div>" +
      '<p class="note"><b>Reorder:</b> drag the handle. The toggle writes <b>live</b> or <b>coming_soon</b>, which is what the app already reads.</p></div></div>' +
      '<div class="card list-card"><div class="card-h"><h2>Coming soon</h2><span class="chip chip-soon">' +
      soonCount +
      ' queued</span></div><div class="card-b"><div class="list-scroll"><ul class="clist">' +
      (soon.length
        ? soon.map((c, i) => countryRow(c, i, false)).join("")
        : '<li><div class="grow"><b>None queued</b><span>Toggle a live country off to move it here.</span></div></li>') +
      "</ul></div></div></div></div>"
    );
  }

  function renderPlaces() {
    const list = filteredPlaces();
    const pages = Math.max(1, Math.ceil(list.length / PAGE));
    if (ui.page > pages) ui.page = pages;
    if (ui.page < 1) ui.page = 1;
    const start = (ui.page - 1) * PAGE;
    const slice = list.slice(start, start + PAGE);
    const counts = Store.collectCounts();
    const rows = slice
      .map((p) => {
        const collected = counts[p.id] || 0;
        return (
          "<tr><td><div class=\"row-name\">" +
          thumb(p.photo, p.name) +
          "<div><b>" +
          esc(p.name) +
          "</b><span>" +
          esc(p.id) +
          " · " +
          esc(p.city || "—") +
          "</span></div></div></td><td>" +
          esc(p.country_name || p.country || "—") +
          '</td><td><span class="chip chip-chapter">' +
          esc(p.chapter || "—") +
          "</span></td><td>" +
          placeFlags(p) +
          '</td><td class="num">' +
          (collected ? fmt(collected) : "—") +
          '</td><td><div class="row-actions"><button type="button" class="icon-btn" data-act="edit-place" data-id="' +
          esc(p.id) +
          '" aria-label="Edit ' +
          esc(p.name) +
          '">' +
          ICON_EDIT +
          '</button><button type="button" class="icon-btn danger" data-act="delete-place" data-id="' +
          esc(p.id) +
          '" aria-label="Delete ' +
          esc(p.name) +
          '">' +
          ICON_DEL +
          "</button></div></td></tr>"
        );
      })
      .join("");
    const from = list.length ? start + 1 : 0;
    const to = Math.min(list.length, start + PAGE);
    return (
      '<div class="ph"><div><h1>Places / stamps</h1><p>All ' +
      fmt(Store.places().length) +
      " catalog rows. Collected counts are how many stub users hold that stamp.</p></div>" +
      '<div class="ph-actions"><button type="button" class="btn btn-secondary" data-act="bulk">Bulk edit</button>' +
      '<button type="button" class="btn btn-primary" data-act="add-place">Add place</button></div></div>' +
      '<div class="toolbar"><div class="filter-pills">' +
      ["All", "Monuments", "Foods", "Visit", "Seasonal"]
        .map(
          (ch) =>
            '<button type="button" data-act="chapter" data-chapter="' +
            esc(ch) +
            '"' +
            (ui.chapter === ch ? ' class="on"' : "") +
            ">" +
            esc(ch) +
            "</button>"
        )
        .join("") +
      '</div><select id="place-country" aria-label="Filter by country">' +
      countryOptions(ui.country, true) +
      '</select><select id="place-sort" aria-label="Sort places"><option value="catalog"' +
      (ui.sort === "catalog" ? " selected" : "") +
      '>Catalog order</option><option value="name"' +
      (ui.sort === "name" ? " selected" : "") +
      '>Name</option><option value="country"' +
      (ui.sort === "country" ? " selected" : "") +
      '>Country</option><option value="collected"' +
      (ui.sort === "collected" ? " selected" : "") +
      '>Collected</option></select><div class="spacer"></div><span class="empty-hint">Showing ' +
      from +
      "–" +
      to +
      " of " +
      fmt(list.length) +
      "</span></div>" +
      '<div class="table-wrap"><table class="data"><thead><tr><th>Place</th><th>Country</th><th>Chapter</th><th>Status</th><th class="num">Collected</th><th></th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="6"><span class="empty-hint">No places match.</span></td></tr>') +
      "</tbody></table></div>" +
      '<div class="pager"><button type="button" class="btn btn-secondary btn-sm" data-act="page" data-page="' +
      (ui.page - 1) +
      '"' +
      (ui.page <= 1 ? " disabled" : "") +
      ">Previous</button><span>Page " +
      ui.page +
      " of " +
      pages +
      '</span><button type="button" class="btn btn-secondary btn-sm" data-act="page" data-page="' +
      (ui.page + 1) +
      '"' +
      (ui.page >= pages ? " disabled" : "") +
      ">Next</button></div>"
    );
  }

  function renderUsers() {
    const q = ui.view === "users" ? ui.q.toLowerCase() : "";
    const users = state().extras.users.filter(
      (u) =>
        !q ||
        String(u.name || "").toLowerCase().includes(q) ||
        String(u.email || "").toLowerCase().includes(q) ||
        String(u.home_city || "").toLowerCase().includes(q)
    );
    const passport = (id) => {
      const c = Store.countryById(id);
      return c ? c.name : id || "—";
    };
    const rows = users
      .map((u) => {
        return (
          '<tr><td><div class="row-name"><div class="av" style="width:32px;height:32px">' +
          esc(initials(u.name)) +
          "</div><div><b>" +
          esc(u.name) +
          (u.primary ? " · profile" : "") +
          "</b><span>" +
          esc(u.email) +
          "</span></div></div></td><td>" +
          esc(u.home_city || "—") +
          "</td><td>" +
          esc(passport(u.passport_country_id)) +
          '</td><td class="num">' +
          fmt((u.collected_place_ids || []).length) +
          '</td><td class="num">' +
          fmt(u.coins) +
          "</td><td>" +
          userChip(u.status) +
          '</td><td><div class="row-actions"><button type="button" class="icon-btn" data-act="edit-user" data-id="' +
          esc(u.id) +
          '" aria-label="Edit ' +
          esc(u.name) +
          '">' +
          ICON_EDIT +
          '</button><button type="button" class="icon-btn danger" data-act="delete-user" data-id="' +
          esc(u.id) +
          '" aria-label="Delete ' +
          esc(u.name) +
          '">' +
          ICON_DEL +
          "</button></div></td></tr>"
        );
      })
      .join("");
    return (
      '<div class="ph"><div><h1>Users</h1><p>Stub travellers for this preview. The profile row is the person in me.json. There is no account server.</p></div>' +
      '<div class="ph-actions"><button type="button" class="btn btn-secondary" data-act="adjust-coins">Adjust coins</button>' +
      '<button type="button" class="btn btn-primary" data-act="add-user">Add user</button></div></div>' +
      '<div class="table-wrap"><table class="data"><thead><tr><th>User</th><th>Home</th><th>Passport</th><th class="num">Stamps</th><th class="num">Coins</th><th>Status</th><th></th></tr></thead><tbody>' +
      rows +
      "</tbody></table></div>" +
      '<p class="note"><b>Destructive:</b> delete uses quiet danger, not cloth red. Emails are fictional and end in example.stampd.</p>'
    );
  }

  function renderAds() {
    const promos = state().extras.promos;
    if (!ui.promo) ui.promo = (promos[0] && promos[0].id) || "new";
    const current = promos.find((p) => p.id === ui.promo) || {
      id: "",
      title: "",
      body: "",
      slot: SLOTS[0],
      style: STYLES[0],
      starts: "",
      ends: "",
      status: "draft",
      cta: "See stamps",
    };
    const bannerClass = current.style && current.style.indexOf("Seasonal") === 0 ? "seasonal" : current.style && current.style.indexOf("Navy") === 0 ? "navy" : "coral";
    const rows = promos
      .map((p) => {
        const windowText = p.starts || p.ends ? (p.starts || "…") + " – " + (p.ends || "…") : "Always on";
        return (
          '<tr class="is-link' +
          (p.id === ui.promo ? " on" : "") +
          '" data-act="pick-promo" data-id="' +
          esc(p.id) +
          '"><td><b>' +
          esc(p.title) +
          "</b></td><td>" +
          esc(p.slot) +
          "</td><td>" +
          esc(windowText) +
          "</td><td>" +
          promoChip(p) +
          "</td></tr>"
        );
      })
      .join("");
    return (
      '<div class="ph"><div><h1>Ads / promotions</h1><p>In-app slots only: Countries banner, Trade strip, Me card. Stored in admin-extras.json on export.</p></div>' +
      '<div class="ph-actions"><button type="button" class="btn btn-primary" data-act="new-promo">Schedule promo</button></div></div>' +
      '<div class="ads-layout"><div class="card"><div class="card-h"><h2>Scheduled</h2></div><div class="table-wrap" style="border:0;border-radius:0;box-shadow:none"><table class="data"><thead><tr><th>Promo</th><th>Slot</th><th>Window</th><th>Status</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="4"><span class="empty-hint">No promos yet.</span></td></tr>') +
      '</tbody></table></div></div><div class="card"><div class="card-h"><h2>Compose</h2>' +
      promoChip(current) +
      '</div><div class="card-b"><form id="promo-form"><input type="hidden" name="id" value="' +
      esc(current.id || "") +
      '"><div class="field"><label>Title</label><input name="title" value="' +
      esc(current.title) +
      '"></div><div class="field"><label>Body</label><textarea name="body">' +
      esc(current.body || "") +
      '</textarea></div><div class="field-row"><div class="field"><label>Slot</label><select name="slot">' +
      SLOTS.map((s) => '<option' + (s === current.slot ? " selected" : "") + ">" + esc(s) + "</option>").join("") +
      '</select></div><div class="field"><label>Style</label><select name="style">' +
      STYLES.map((s) => '<option' + (s === current.style ? " selected" : "") + ">" + esc(s) + "</option>").join("") +
      '</select></div></div><div class="field-row"><div class="field"><label>Starts</label><input type="date" name="starts" value="' +
      esc(current.starts || "") +
      '"></div><div class="field"><label>Ends</label><input type="date" name="ends" value="' +
      esc(current.ends || "") +
      '"></div></div><div class="field"><label>Button label</label><input name="cta" value="' +
      esc(current.cta || "See stamps") +
      '"></div><div class="banner-mock ' +
      bannerClass +
      '" aria-hidden="true"><div><div class="t">' +
      esc(current.title || "Promo title") +
      '</div><div class="s">' +
      esc(current.slot || "") +
      '</div></div><span class="cta">' +
      esc(current.cta || "See stamps") +
      "</span></div>" +
      '<div class="ph-actions" style="margin-top:14px;justify-content:flex-end">' +
      (current.id
        ? '<button type="button" class="btn btn-danger" data-act="delete-promo" data-id="' + esc(current.id) + '">Delete</button>'
        : "") +
      '<button type="submit" class="btn btn-secondary" value="draft">Save draft</button>' +
      '<button type="submit" class="btn btn-secondary" value="scheduled">Schedule</button>' +
      '<button type="submit" class="btn btn-primary" value="live">Publish</button></div></form></div></div></div>'
    );
  }

  function renderTrade() {
    const rules = state().meDoc.coin_rules || {};
    const settings = (state().meDoc.trade && state().meDoc.trade.settings) || {};
    const ruleRow = (key, label, hint) =>
      '<div class="rule-stat"><div class="l">' +
      esc(label) +
      "<small>" +
      esc(hint) +
      '</small></div><div class="r"><input class="big" id="coin-' +
      key +
      '" data-bind="coin" data-key="' +
      key +
      '" type="number" value="' +
      esc(rules[key] != null ? rules[key] : 0) +
      '"><em>coins</em></div></div>';
    const offers = (state().meDoc.trade && state().meDoc.trade.exchange_offers) || [];
    const offerRows = offers
      .map((o, i) => {
        const badGive = o.give_place_id && !Store.placeById(o.give_place_id);
        const badWant = o.want_place_id && !Store.placeById(o.want_place_id);
        return (
          "<tr><td><input data-bind=\"offer\" data-index=\"" +
          i +
          '" data-key="give_place_id" value="' +
          esc(o.give_place_id || "") +
          '"' +
          (badGive ? ' class="warn-inline"' : "") +
          '></td><td><input data-bind="offer" data-index="' +
          i +
          '" data-key="want_place_id" value="' +
          esc(o.want_place_id || "") +
          '"' +
          (badWant ? ' class="warn-inline"' : "") +
          '></td><td><select data-bind="offer" data-index="' +
          i +
          '" data-key="status">' +
          ["open", "pending", "done"]
            .map((s) => '<option' + (s === o.status ? " selected" : "") + ">" + s + "</option>")
            .join("") +
          '</select></td><td><input data-bind="offer" data-index="' +
          i +
          '" data-key="note" value="' +
          esc(o.note || "") +
          '"></td><td><button type="button" class="icon-btn danger" data-act="delete-offer" data-index="' +
          i +
          '" aria-label="Delete offer">' +
          ICON_DEL +
          "</button></td></tr>"
        );
      })
      .join("");
    const dups = state().meDoc.duplicates || [];
    const dupRows = dups
      .map((d, i) => {
        const place = Store.placeById(d.id);
        return (
          '<div class="rule-stat"><div class="l">' +
          esc(place ? place.name : d.id) +
          "<small>" +
          esc(d.id) +
          (place ? "" : " · unknown id") +
          '</small></div><div class="r"><input class="big" data-bind="dup" data-index="' +
          i +
          '" type="number" min="1" value="' +
          esc(d.count || 1) +
          '"><button type="button" class="icon-btn danger" data-act="delete-dup" data-index="' +
          i +
          '" aria-label="Remove duplicate">' +
          ICON_DEL +
          "</button></div></div>"
        );
      })
      .join("");
    const ledger = state().meDoc.coin_ledger_sample || [];
    const ledgerRows = ledger
      .map(
        (row, i) =>
          "<tr><td><input data-bind=\"ledger\" data-index=\"" +
          i +
          '" data-key="type" value="' +
          esc(row.type || "") +
          '"></td><td><input data-bind="ledger" data-index="' +
          i +
          '" data-key="coins" type="number" value="' +
          esc(row.coins != null ? row.coins : "") +
          '"></td><td><input data-bind="ledger" data-index="' +
          i +
          '" data-key="note" value="' +
          esc(row.note || "") +
          '"></td><td>' +
          esc(row.country || row.chapter || row.place_id || "") +
          '</td><td><button type="button" class="icon-btn danger" data-act="delete-ledger" data-index="' +
          i +
          '" aria-label="Delete ledger row">' +
          ICON_DEL +
          "</button></td></tr>"
      )
      .join("");
    return (
      '<div class="ph"><div><h1>Trade & coins</h1><p>Coin rules and trade offers from me.json. Sell rates stay empty until you set them — they are stored on trade.settings and the app ignores unknown keys.</p></div>' +
      '<div class="ph-actions"><button type="button" class="btn btn-secondary" data-act="add-offer">Add offer</button></div></div>' +
      '<div class="rules-grid"><div class="card"><div class="card-h"><h2>Collection bonuses</h2><span class="chip chip-live">me.json</span></div><div class="card-b">' +
      ruleRow("chapter_complete_coins", "Chapter complete", "All stamps in one chapter") +
      ruleRow("country_complete_coins", "Country complete", "Every place in a country") +
      ruleRow("seasonal_collect_coins", "Seasonal collect", "First time a seasonal stamp is collected") +
      ruleRow("welcome_grant_coins", "Welcome grant", "Preview starting coins") +
      ruleRow("ordinary_first_collect_coins", "Ordinary first collect", "A normal first collect") +
      '<div class="field" style="margin-top:12px"><label>Summary</label><textarea id="coin-summary" data-bind="summary">' +
      esc(rules.summary || "") +
      "</textarea></div></div></div>" +
      '<div class="card"><div class="card-h"><h2>Trade exchange</h2></div><div class="card-b">' +
      '<div class="rule-stat"><div class="l">Stamp exchange<small>Optional label, blank until set</small></div><div class="r"><input class="big" id="trade-stamp_exchange" data-bind="setting" data-key="stamp_exchange" value="' +
      esc(settings.stamp_exchange || "") +
      '" placeholder="1:1"></div></div>' +
      '<div class="rule-stat"><div class="l">Stamp buyout with coins<small>When a peer accepts coins</small></div><div class="r"><input class="big" id="trade-stamp_buyout_coins" data-bind="setting" data-key="stamp_buyout_coins" type="number" value="' +
      esc(settings.stamp_buyout_coins != null ? settings.stamp_buyout_coins : "") +
      '" placeholder="40"><em>coins</em></div></div>' +
      '<div class="rule-stat"><div class="l">Gift stamp cost<small>Send without a trade</small></div><div class="r"><input class="big" id="trade-gift_stamp_coins" data-bind="setting" data-key="gift_stamp_coins" type="number" value="' +
      esc(settings.gift_stamp_coins != null ? settings.gift_stamp_coins : "") +
      '" placeholder="25"><em>coins</em></div></div>' +
      '<div class="field"><label>Cross-chapter penalty (coins)</label><input id="trade-cross_chapter_penalty_coins" data-bind="setting" data-key="cross_chapter_penalty_coins" type="number" value="' +
      esc(settings.cross_chapter_penalty_coins != null ? settings.cross_chapter_penalty_coins : "") +
      '" placeholder="10"></div></div></div></div>' +
      '<div class="card" style="margin-top:14px"><div class="card-h"><h2>Exchange offers</h2><span class="chip chip-draft">' +
      offers.length +
      '</span></div><div class="table-wrap" style="border:0;border-radius:0;box-shadow:none"><table class="data"><thead><tr><th>Give</th><th>Want</th><th>Status</th><th>Note</th><th></th></tr></thead><tbody>' +
      (offerRows || '<tr><td colspan="5"><span class="empty-hint">No offers.</span></td></tr>') +
      "</tbody></table></div></div>" +
      '<div class="rules-grid" style="margin-top:14px"><div class="card"><div class="card-h"><h2>Duplicate spares</h2></div><div class="card-b">' +
      dupRows +
      '<div class="field" style="margin-top:8px"><label>Add place id</label><input id="dup-add" placeholder="colosseum"></div>' +
      '<button type="button" class="btn btn-secondary btn-sm" data-act="add-dup">Add spare</button></div></div>' +
      '<div class="card"><div class="card-h"><h2>Coin ledger sample</h2><button type="button" class="btn btn-secondary btn-sm" data-act="add-ledger">Add row</button></div>' +
      '<div class="table-wrap" style="border:0;border-radius:0;box-shadow:none"><table class="data"><thead><tr><th>Type</th><th>Coins</th><th>Note</th><th>Ref</th><th></th></tr></thead><tbody>' +
      ledgerRows +
      "</tbody></table></div></div></div>"
    );
  }

  function renderModeration() {
    const tickets = state().extras.tickets;
    if ((!ui.ticket || !tickets.some((t) => t.id === ui.ticket)) && tickets[0]) ui.ticket = tickets[0].id;
    const current = tickets.find((t) => t.id === ui.ticket) || null;
    const openCount = tickets.filter((t) => t.status === "open" || t.status === "escalated").length;
    const list = tickets
      .map((t) => {
        const last = t.messages[t.messages.length - 1];
        return (
          '<li class="' +
          (current && t.id === current.id ? "on" : "") +
          '" data-act="pick-ticket" data-id="' +
          esc(t.id) +
          '"><div class="who"><span>' +
          esc(t.from) +
          "</span>" +
          (t.type === "Trade"
            ? '<span class="chip chip-flag">Trade</span>'
            : t.type === "Account"
              ? '<span class="chip chip-draft">Account</span>'
              : '<span class="chip chip-soon">Support</span>') +
          '</div><div class="preview">' +
          esc(last ? last.text : t.subject) +
          "</div></li>"
        );
      })
      .join("");
    const msgs = current
      ? current.messages
          .map(
            (m) =>
              '<div class="bubble ' +
              (m.role === "agent" ? "agent" : "user") +
              '">' +
              esc(m.text) +
              '<span class="when">' +
              esc(m.who || "") +
              " · " +
              esc(relTime(m.at)) +
              "</span></div>"
          )
          .join("")
      : "";
    return (
      '<div class="ph"><div><h1>Moderation / support</h1><p>Sample inbox stored in this browser. Replies are not sent anywhere.</p></div>' +
      '<div class="ph-actions"><button type="button" class="btn btn-secondary" data-act="mark-read">Mark all read</button>' +
      '<button type="button" class="btn btn-primary" data-act="add-ticket">New ticket</button></div></div>' +
      '<div class="mod-layout"><div class="card" style="overflow:hidden"><div class="card-h"><h2>Inbox</h2><span class="chip chip-flag">' +
      openCount +
      ' open</span></div><ul class="thread-list">' +
      (list || '<li><div class="preview">Inbox is empty.</div></li>') +
      "</ul></div>" +
      (current
        ? '<div class="card thread-detail"><div class="card-h"><h2>Ticket #' +
          esc(current.id) +
          " · " +
          esc(current.subject) +
          '</h2><div class="ph-actions"><select id="ticket-status" data-id="' +
          esc(current.id) +
          '" aria-label="Ticket status">' +
          ["open", "pending", "escalated", "resolved"]
            .map((s) => '<option' + (s === current.status ? " selected" : "") + ">" + s + "</option>")
            .join("") +
          '</select><button type="button" class="btn btn-sm btn-danger" data-act="delete-ticket" data-id="' +
          esc(current.id) +
          '">Delete</button></div></div><div class="msgs">' +
          msgs +
          '</div><div class="compose-bar"><input id="reply-text" type="text" placeholder="Reply as Support…" aria-label="Reply"><button type="button" class="btn btn-primary" data-act="reply">Send</button></div></div>'
        : '<div class="card"><div class="card-b"><p class="empty-hint">Pick a ticket.</p></div></div>') +
      "</div>"
    );
  }

  function renderSettings() {
    const roles = state().extras.roles;
    const matrix = roles.matrix || {};
    const head =
      "<tr><th>Capability</th>" + ROLE_NAMES.map((role) => "<th>" + role + "</th>").join("") + "</tr>";
    const body = CAPS.map(([id, label]) => {
      const cells = ROLE_NAMES.map((role) => {
        const on = matrix[id] && matrix[id][role];
        return (
          '<td class="' +
          (on ? "check" : "dash") +
          '"><input type="checkbox" data-bind="role" data-cap="' +
          id +
          '" data-role="' +
          role +
          '"' +
          (on ? " checked" : "") +
          ' aria-label="' +
          esc(label + " " + role) +
          '"></td>'
        );
      }).join("");
      return "<tr><td>" + esc(label) + "</td>" + cells + "</tr>";
    }).join("");
    const members = (roles.members || [])
      .map(
        (m) =>
          "<tr><td><b>" +
          esc(m.name) +
          "</b><span style=\"display:block;color:var(--muted);font-size:12px\">" +
          esc(m.email) +
          '</span></td><td><select data-bind="member-role" data-id="' +
          esc(m.id) +
          '" aria-label="Role for ' +
          esc(m.name) +
          '">' +
          ROLE_NAMES.map((role) => '<option' + (role === m.role ? " selected" : "") + ">" + role + "</option>").join("") +
          '</select></td><td><button type="button" class="icon-btn danger" data-act="delete-member" data-id="' +
          esc(m.id) +
          '" aria-label="Remove ' +
          esc(m.name) +
          '">' +
          ICON_DEL +
          "</button></td></tr>"
      )
      .join("");
    const home = state().placesDoc.home || { name: "", lat: "", lng: "" };
    return (
      '<div class="ph"><div><h1>Settings / roles</h1><p>Editable stub. The matrix is saved with admin extras and does not block actions — there is no sign-in on this static page.</p></div>' +
      '<div class="ph-actions"><button type="button" class="btn btn-primary" data-act="invite">Invite admin</button></div></div>' +
      '<div class="card"><div class="card-h"><h2>Roles matrix</h2><span class="chip chip-draft">Stub</span></div><div class="card-b" style="padding:0"><table class="matrix"><thead>' +
      head +
      "</thead><tbody>" +
      body +
      "</tbody></table></div></div>" +
      '<div class="card" style="margin-top:14px"><div class="card-h"><h2>People</h2></div><div class="table-wrap" style="border:0;border-radius:0;box-shadow:none"><table class="data"><thead><tr><th>Name</th><th>Role</th><th></th></tr></thead><tbody>' +
      members +
      "</tbody></table></div></div>" +
      '<div class="card" style="margin-top:14px"><div class="card-h"><h2>Catalog home</h2><span class="chip chip-draft">places.json</span></div><div class="card-b"><div class="field-row"><div class="field"><label>Name</label><input id="home-name" data-bind="home" value="' +
      esc(home.name || "") +
      '"></div><div class="field"><label>Latitude</label><input id="home-lat" data-bind="home" value="' +
      esc(home.lat) +
      '"></div><div class="field"><label>Longitude</label><input id="home-lng" data-bind="home" value="' +
      esc(home.lng) +
      '"></div></div><p class="empty-hint">Used as the distance origin when the preview has no device location.</p></div></div>' +
      '<p class="note"><b>Support and coins:</b> the proposed matrix leaves minting coins with Admin. Change the checkboxes if you want a different stub. Nothing here calls an API.</p>'
    );
  }

  const VIEWS = {
    overview: renderOverview,
    countries: renderCountries,
    places: renderPlaces,
    users: renderUsers,
    ads: renderAds,
    trade: renderTrade,
    moderation: renderModeration,
    settings: renderSettings,
  };

  function renderChrome() {
    const dirty = Store.isDirty();
    const pill = document.getElementById("dirty-pill");
    if (!state().ready) {
      pill.className = "dirty";
      pill.textContent = state().error ? "Unavailable" : "Loading";
    } else {
      pill.className = "dirty " + (dirty ? "bad" : "clean");
      pill.textContent = dirty ? "Local edits" : "Matches repo";
    }
    const meta = document.getElementById("data-meta");
    const when = state().savedAt ? "Saved in this browser " + relTime(state().savedAt) : "Not saved to this browser yet";
    meta.textContent =
      state().error ||
      state().storageError ||
      (state().ready ? when + " · export JSON to commit into the app" : "Loading catalog…");
    document.getElementById("btn-save").className = "btn btn-sm " + (dirty ? "btn-primary" : "btn-secondary");
    const member = state().ready && state().extras.roles.members[0];
    if (member) {
      document.querySelector(".admin-chip .meta b").textContent = member.name;
      document.querySelector(".admin-chip .meta span").textContent = member.role;
      document.querySelector(".admin-chip .av").textContent = initials(member.name);
    }
    document.querySelectorAll("#nav button[data-go]").forEach((btn) => {
      const on = btn.dataset.go === ui.view;
      btn.classList.toggle("active", on);
      if (on) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
    const search = document.getElementById("global-search");
    const placeholders = {
      places: "Search places…",
      countries: "Search countries…",
      users: "Search users…",
    };
    search.placeholder = placeholders[ui.view] || "Search places, users, countries…";
    if (document.activeElement !== search && search.value !== ui.q) search.value = ui.q;
    const pop = document.getElementById("search-pop");
    if (!ui.pop || !ui.q || !state().ready) {
      pop.hidden = true;
      pop.innerHTML = "";
    } else {
      const hits = searchHits(ui.q);
      pop.hidden = false;
      pop.innerHTML = hits.length
        ? hits
            .map(
              (h) =>
                '<button type="button" data-kind="' +
                h.kind +
                '" data-id="' +
                esc(h.id) +
                '" data-label="' +
                esc(h.label) +
                '"><b>' +
                esc(h.label) +
                "</b><span>" +
                esc(h.kind) +
                " · " +
                esc(h.meta) +
                "</span></button>"
            )
            .join("")
        : '<div class="empty">No matches</div>';
    }
    if (ui.view) history.replaceState(null, "", "#" + ui.view);
  }

  function render() {
    const keep = ui.keepView && ui.keepView === ui.view;
    ui.keepView = null;
    const scroller = document.querySelector(".content");
    const top = scroller ? scroller.scrollTop : 0;
    const same = ui.renderedView === ui.view;
    renderChrome();
    if (!state().ready) {
      const view = document.querySelector('.view[data-view="' + ui.view + '"]');
      document.querySelectorAll(".view").forEach((el) => el.classList.toggle("on", el === view));
      if (view) {
        view.innerHTML = state().error
          ? '<div class="ph"><div><h1>Catalog unavailable</h1><p>' +
            esc(state().error) +
            '</p></div></div><p class="note"><b>Open this page over http</b> — GitHub Pages or a local static server — so admin can fetch data/places.json, data/countries.json, and data/me.json.</p>'
          : '<div class="ph"><div><h1>Overview</h1><p>Loading catalog…</p></div></div>';
      }
      return;
    }
    document.querySelectorAll(".view").forEach((el) => {
      const on = el.dataset.view === ui.view;
      el.classList.toggle("on", on);
      if (on && !keep) el.innerHTML = (VIEWS[ui.view] || renderOverview)();
    });
    if (scroller) scroller.scrollTop = same ? top : 0;
    ui.renderedView = ui.view;
  }

  function show(id) {
    if (!VIEWS[id]) id = "overview";
    ui.view = id;
    ui.pop = false;
    render();
  }

  async function exportJson() {
    const docs = Store.exportDocs();
    Store.persist();
    const names = ["places.json", "countries.json", "me.json", "admin-extras.json"];
    for (let i = 0; i < names.length; i += 1) {
      download(names[i], docs[names[i]]);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    toast("Downloaded places.json, countries.json, me.json, and admin-extras.json");
    render();
  }

  function exportCsv() {
    const headers = ["id", "name", "city", "country", "country_id", "country_name", "chapter", "lat", "lng", "catalog", "in_app_preview", "photo", "description"];
    const lines = [headers.join(",")];
    Store.places().forEach((p) => {
      lines.push(headers.map((key) => csvCell(p[key])).join(","));
    });
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "places.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast("Downloaded places.csv");
  }

  function onClick(event) {
    const actEl = event.target.closest("[data-act]");
    if (!actEl || actEl.disabled) return;
    const act = actEl.dataset.act;
    const id = actEl.dataset.id;
    if (act === "add-place") openPlaceForm(null);
    else if (act === "edit-place") openPlaceForm(Store.placeById(id));
    else if (act === "delete-place") {
      const place = Store.placeById(id);
      if (!place) return;
      confirmRemove("Delete " + place.name + "?", "This removes the catalog row and drops the id from collected stamps, duplicates, and offers.", "Delete place", () => Store.deletePlace(id));
    } else if (act === "bulk") openBulk();
    else if (act === "chapter") {
      ui.chapter = actEl.dataset.chapter;
      ui.page = 1;
      render();
    } else if (act === "page") {
      ui.page = Number(actEl.dataset.page);
      render();
    } else if (act === "add-country") openCountryForm(null);
    else if (act === "edit-country") openCountryForm(Store.countryById(id));
    else if (act === "delete-country") {
      const row = Store.countryById(id);
      if (row) removeCountry(row);
    } else if (act === "toggle-country") {
      const err = Store.toggleCountry(id);
      if (err) toast(err);
    } else if (act === "add-user") openUserForm(null);
    else if (act === "edit-user") openUserForm(state().extras.users.find((u) => u.id === id));
    else if (act === "delete-user") {
      const user = state().extras.users.find((u) => u.id === id);
      if (!user) return;
      confirmRemove("Remove " + user.name + "?", user.primary ? "Another traveller becomes the sample profile written into me.json." : "This only removes the stub user in this browser.", "Remove user", () => Store.deleteUser(id));
    } else if (act === "adjust-coins") openCoins();
    else if (act === "new-promo") {
      ui.promo = "new";
      render();
    } else if (act === "pick-promo") {
      ui.promo = id;
      render();
    } else if (act === "delete-promo") {
      Store.deletePromo(id);
      ui.promo = null;
    } else if (act === "add-offer") Store.addOffer();
    else if (act === "delete-offer") Store.deleteOffer(Number(actEl.dataset.index));
    else if (act === "add-dup") {
      const err = Store.addDuplicate(document.getElementById("dup-add").value.trim());
      if (err) toast(err);
    } else if (act === "delete-dup") Store.deleteDuplicate(Number(actEl.dataset.index));
    else if (act === "add-ledger") Store.addLedger();
    else if (act === "delete-ledger") Store.deleteLedger(Number(actEl.dataset.index));
    else if (act === "pick-ticket") {
      ui.ticket = id;
      Store.markRead(id);
      if (!Store.state.extras.tickets.find((t) => t.id === id && t.unread)) render();
    } else if (act === "mark-read") Store.markAllRead();
    else if (act === "add-ticket") openTicketForm();
    else if (act === "delete-ticket") {
      confirmRemove("Delete ticket #" + id + "?", "The sample thread is removed from this browser only.", "Delete ticket", () => {
        Store.deleteTicket(id);
        ui.ticket = null;
        return null;
      });
    } else if (act === "reply") {
      const err = Store.addMessage(ui.ticket, document.getElementById("reply-text").value);
      if (err) toast(err);
    } else if (act === "invite") openInvite();
    else if (act === "delete-member") {
      const err = Store.deleteMember(id);
      if (err) toast(err);
    } else if (act === "export-csv") exportCsv();
    else if (act === "import") document.getElementById("file-import").click();
  }

  function onChange(event) {
    const t = event.target;
    if (t.id === "place-country") {
      ui.country = t.value;
      ui.page = 1;
      render();
      return;
    }
    if (t.id === "place-sort") {
      ui.sort = t.value;
      render();
      return;
    }
    if (t.id === "ticket-status") {
      Store.setTicketStatus(t.dataset.id, t.value);
      return;
    }
    const bind = t.dataset.bind;
    if (!bind) return;
    if (bind === "coin") {
      ui.keepView = "trade";
      const err = Store.setCoinRule(t.dataset.key, t.value);
      if (err) toast(err);
    } else if (bind === "summary") {
      ui.keepView = "trade";
      Store.setSummary(t.value);
    } else if (bind === "setting") {
      ui.keepView = "trade";
      Store.setTradeSetting(t.dataset.key, t.value);
    } else if (bind === "offer") {
      ui.keepView = "trade";
      Store.setOffer(Number(t.dataset.index), { [t.dataset.key]: t.value });
    } else if (bind === "dup") {
      ui.keepView = "trade";
      Store.setDuplicate(Number(t.dataset.index), { count: t.value });
    } else if (bind === "ledger") {
      ui.keepView = "trade";
      Store.updateLedger(Number(t.dataset.index), t.dataset.key, t.value);
    } else if (bind === "role") {
      Store.setRole(t.dataset.cap, t.dataset.role, t.checked);
    } else if (bind === "member-role") {
      Store.setMemberRole(t.dataset.id, t.value);
    } else if (bind === "home") {
      const err = Store.setHome({
        name: document.getElementById("home-name").value,
        lat: document.getElementById("home-lat").value,
        lng: document.getElementById("home-lng").value,
      });
      if (err) toast(err);
    }
  }

  function boot() {
    const hash = (location.hash || "#overview").slice(1);
    if (VIEWS[hash]) ui.view = hash;
    document.getElementById("nav").addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-go]");
      if (!btn) return;
      ui.q = "";
      ui.pop = false;
      show(btn.dataset.go);
    });
    document.getElementById("content").addEventListener("click", onClick);
    document.getElementById("content").addEventListener("change", onChange);
    document.getElementById("content").addEventListener("submit", (event) => {
      const form = event.target;
      if (form.id !== "promo-form") return;
      event.preventDefault();
      const fd = new FormData(form);
      const status = (event.submitter && event.submitter.value) || "draft";
      if (status === "scheduled" && !fd.get("starts")) {
        toast("Add a start date to schedule.");
        return;
      }
      const err = Store.savePromo(
        {
          id: fd.get("id"),
          title: fd.get("title"),
          body: fd.get("body"),
          slot: fd.get("slot"),
          style: fd.get("style"),
          starts: fd.get("starts"),
          ends: fd.get("ends"),
          cta: fd.get("cta"),
        },
        status
      );
      if (err) toast(err);
      else {
        ui.promo = fd.get("id") || (state().extras.promos[0] && state().extras.promos[0].id);
        render();
        toast(status === "live" ? "Promo published in this browser" : "Promo saved in this browser");
      }
    });
    document.getElementById("btn-save").addEventListener("click", () => {
      Store.persist();
      toast(state().storageError || "Saved in this browser. Export JSON to commit it into the app.");
      render();
    });
    document.getElementById("btn-reset").addEventListener("click", () => {
      openDialog({
        title: "Reset to repo files?",
        danger: true,
        submitLabel: "Reset local copy",
        body: "<p>This clears the browser copy and reloads places.json, countries.json, and me.json from the site. Ads, extra users, tickets, and role edits in this browser go back to the built-in sample.</p>",
        onSubmit() {
          Store.reset();
          toast("Reloaded catalog files");
          return null;
        },
      });
    });
    document.getElementById("btn-export").addEventListener("click", () => exportJson());
    document.getElementById("btn-import").addEventListener("click", () => document.getElementById("file-import").click());
    document.getElementById("file-import").addEventListener("change", async (event) => {
      const files = [...event.target.files];
      const notes = [];
      for (const file of files) {
        try {
          const json = JSON.parse(await file.text());
          const err = Store.importObject(json);
          notes.push(err || file.name);
        } catch (err) {
          notes.push(file.name + " is not valid JSON");
        }
      }
      event.target.value = "";
      toast(notes.join(" · "));
    });
    const search = document.getElementById("global-search");
    search.addEventListener("input", () => {
      ui.q = search.value.trim();
      ui.page = 1;
      ui.pop = !!ui.q;
      render();
    });
    search.addEventListener("search", () => {
      ui.q = search.value.trim();
      ui.pop = !!ui.q;
      render();
    });
    search.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        ui.pop = false;
        render();
      }
      if (event.key === "Enter") {
        const first = document.querySelector("#search-pop button");
        if (first) {
          event.preventDefault();
          first.click();
        }
      }
    });
    document.getElementById("search-pop").addEventListener("click", (event) => {
      const btn = event.target.closest("button");
      if (!btn) return;
      goHit({ kind: btn.dataset.kind, id: btn.dataset.id, label: btn.dataset.label });
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".search") && ui.pop) {
        ui.pop = false;
        render();
      }
    });
    document.addEventListener("dragstart", (event) => {
      const handle = event.target.closest("[data-drag-handle]");
      if (!handle) return;
      event.dataTransfer.setData("text/plain", handle.dataset.dragHandle);
      event.dataTransfer.effectAllowed = "move";
    });
    document.addEventListener("dragover", (event) => {
      const li = event.target.closest("[data-drag]");
      if (!li) return;
      event.preventDefault();
      document.querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
      li.classList.add("drag-over");
    });
    document.addEventListener("drop", (event) => {
      const li = event.target.closest("[data-drag]");
      if (!li) return;
      event.preventDefault();
      li.classList.remove("drag-over");
      const from = event.dataTransfer.getData("text/plain");
      if (from && from !== li.dataset.drag) Store.reorderLive(from, li.dataset.drag);
    });
    document.addEventListener("dragend", () => {
      document.querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
    });
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        Store.persist();
        toast(state().storageError || "Saved in this browser");
        render();
      }
    });
    window.__stampdAdminShow = show;
    Store.subscribe(render);
    Store.load();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
