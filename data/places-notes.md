# Stampd places — world catalog (v4)

**Files:**
- `places.json` · **Updated:** 26 Oct 2026 (Asia/Yerevan) · **version 4**
- `countries.json` · synced `countries[]` (+ `cloth_families`, `cover_ui`)
- `me.json` · sample profile kept; `collected_place_ids` unchanged; country list expanded to 50
- Photos: `app-preview/assets/places/<id>.jpg` and/or `photo_url` (Commons)

**System:** WGS84 decimal degrees · sources cited per row (Wikipedia / Nominatim / official festival pages)

## Mos keys (intact / extended)

`home`, `places[]` (`id`, `name`, `city`, `country`, `country_name`, **`country_id`**, `chapter`, `lat`, `lng`, `description`, `photo` / `photo_url`, `photo_credit`, `photo_source`, `precision`, `seasonal`, `seasonal_label`, …), `countries[]` (`id`, `name`, `family`, `cloth_hex`, `status`, `lat`, `lng`).

### Chapter strings (exact)
- Monuments → `Monuments`
- eat → `Foods`
- visit → `Visit`
- seasonal → `Seasonal`

### Cover UI (unchanged requirement)
- Show **country name only** on passport covers
- Hide family name / cloth hex / Stampd logo lockup as cover title

## Counts

| | Count |
| --- | ---: |
| Countries (excl. default) | **50** (all `status: live`) |
| Default / unset cloth row | 1 |
| Places (incl. lantern sample) | **812** |
| Places in 50-country catalog | **811** |
| Monuments | 253 |
| Visit | 252 |
| Foods | 255 |
| Seasonal | 52 |

Target formula ≈ 16 × 50 = 800. Actual catalog rows ≈ 811 (AM/IT keep extras above 16).

### AM / IT (formula met; extras kept)

| Country | Monuments | Foods | Visit | Seasonal | Total | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Armenia (am) | 5 | 10 | 5 | 1 | 21 | Kept all prior foods; added Visit `sevanavank` |
| Italy (it) | 8 | 5 | 7 | 2 | 22 | Kept prior monuments/visits/seasonals; added Foods `testaccio-market`, `porta-palazzo` |

### Retained well-known ids
**AM:** amberd, ararat, cascade-yerevan, caucasus-pandok, dargett, dolmama, etchmiadzin, garni, geghard, gum-market, in-vino, lavash, pak-shuka, pandok-yerevan, republic-square, sevanavank, sherep, the-club, vernissage, wine-days, zvartnots

**IT:** castel-santangelo, colosseum, duomo-milan, florence-cathedral, galleria-vittorio, gelato, mercato-centrale, palio-siena, pantheon, piazza-navona, pizza, pompeii, ponte-vecchio, porta-palazzo, positano, rialto-bridge, spanish-steps, testaccio-market, tower-of-pisa, trevi, venice-carnival, villa-borghese

**Also retained:** `eiffel` (FR), `taj` (IN), `lantern` (sample_icons / TW — no cloth row)

## Cloth families (locked hex — flag hue → family, not exact flag colour)

| Family | Hex |
| --- | --- |
| blue | `#1B2747` |
| red | `#8B1E2D` |
| green | `#1E3B32` |
| black | `#1A1A1E` |
| orange | `#7A3F18` |

### Country → family (all live)

- **blue** `#1B2747`: ar, au, cl, co, fi, fr, gr, il, nz, se, uk, us
- **red** `#8B1E2D`: am, at, ca, ch, cn, cz, dk, ge, hr, hu, id, jp, kr, ma, my, no, pe, ph, pl, pt, sg, th, tr, vn
- **green** `#1E3B32`: ae, br, ie, it, mx, sa, za
- **black** `#1A1A1E`: be, de, eg, ke
- **orange** `#7A3F18`: es, in, nl

## Photo strategy (pragmatic at ~800 scale)

1. **Kept** all prior local JPEGs under `assets/places/` (AM/IT/sample set).
2. **Downloaded** additional Commons thumbs (resized via `iiurlwidth=1200`) into `assets/places/<id>.jpg` where feasible (cap in build run).
3. **URL-only**: many rows set `photo: null` + `photo_url` / `photo_credit` / `photo_source` pointing at Wikimedia Commons (stable File page + thumb URL). Mos may hot-cache or download later.
4. **Remaining without photo**: listed in build log as still needing a Commons match — use branded placeholder until filled. Do **not** hotlink random blogs.

Re-check live counts after any photo pass; see validation section below for the numbers at last write.

## Home

| Place | lat | lng | Source |
| --- | ---: | ---: | --- |
| Yerevan | 40.1777 | 44.5126 | OSM Nominatim · Yerevan |

## Per-country chapter matrix (Monuments / Foods / Visit / Seasonal / Total)

| id | M | F | V | S | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| ae | 5 | 5 | 5 | 1 | 16 |
| am | 5 | 10 | 5 | 1 | 21 |
| ar | 5 | 5 | 5 | 1 | 16 |
| at | 5 | 5 | 5 | 1 | 16 |
| au | 5 | 5 | 5 | 1 | 16 |
| be | 5 | 5 | 5 | 1 | 16 |
| br | 5 | 5 | 5 | 1 | 16 |
| ca | 5 | 5 | 5 | 1 | 16 |
| ch | 5 | 5 | 5 | 1 | 16 |
| cl | 5 | 5 | 5 | 1 | 16 |
| cn | 5 | 5 | 5 | 1 | 16 |
| co | 5 | 5 | 5 | 1 | 16 |
| cz | 5 | 5 | 5 | 1 | 16 |
| de | 5 | 5 | 5 | 1 | 16 |
| dk | 5 | 5 | 5 | 1 | 16 |
| eg | 5 | 5 | 5 | 1 | 16 |
| es | 5 | 5 | 5 | 1 | 16 |
| fi | 5 | 5 | 5 | 1 | 16 |
| fr | 5 | 5 | 5 | 1 | 16 |
| ge | 5 | 5 | 5 | 1 | 16 |
| gr | 5 | 5 | 5 | 1 | 16 |
| hr | 5 | 5 | 5 | 1 | 16 |
| hu | 5 | 5 | 5 | 1 | 16 |
| id | 5 | 5 | 5 | 1 | 16 |
| ie | 5 | 5 | 5 | 1 | 16 |
| il | 5 | 5 | 5 | 1 | 16 |
| in | 5 | 5 | 5 | 1 | 16 |
| it | 8 | 5 | 7 | 2 | 22 |
| jp | 5 | 5 | 5 | 1 | 16 |
| ke | 5 | 5 | 5 | 1 | 16 |
| kr | 5 | 5 | 5 | 1 | 16 |
| ma | 5 | 5 | 5 | 1 | 16 |
| mx | 5 | 5 | 5 | 1 | 16 |
| my | 5 | 5 | 5 | 1 | 16 |
| nl | 5 | 5 | 5 | 1 | 16 |
| no | 5 | 5 | 5 | 1 | 16 |
| nz | 5 | 5 | 5 | 1 | 16 |
| pe | 5 | 5 | 5 | 1 | 16 |
| ph | 5 | 5 | 5 | 1 | 16 |
| pl | 5 | 5 | 5 | 1 | 16 |
| pt | 5 | 5 | 5 | 1 | 16 |
| sa | 5 | 5 | 5 | 1 | 16 |
| se | 5 | 5 | 5 | 1 | 16 |
| sg | 5 | 5 | 5 | 1 | 16 |
| th | 5 | 5 | 5 | 1 | 16 |
| tr | 5 | 5 | 5 | 1 | 16 |
| uk | 5 | 5 | 5 | 1 | 16 |
| us | 5 | 5 | 5 | 1 | 16 |
| vn | 5 | 5 | 5 | 1 | 16 |
| za | 5 | 5 | 5 | 1 | 16 |

## New icon ids needing icons.js or generic fallback

Mos: reuse stamp icons for `ararat, colosseum, eiffel, gelato, lantern, pantheon, pizza, taj, trevi`.

All other place ids need a new icon or generic placeholder. Full list (803 ids) is long — treat **any id not in the reuse set** as fallback. High-priority first monuments per country are a good icon batch order.

Sample of new ids (first 80): aalborg-food, aarhus-den-gamle, aarhus-festuge, aarhus-market, abha-food, abisko, abu-dhabi-fish, abu-simbel, acre-market, acropolis-museum, adelaide-central, aggtelek, ait-benhaddou, akershus, al-ain-oasis, al-qattara, albert-cuyp, alexandria-corniche, alexandria-fish, alfama, alhambra, alula, amazon-manaus, amber-fort, amberd, amboseli, anne-frank-house, annecy, antalya-kaleici, antwerp-eat-street, antwerp-zoo, arashiyama, ardennes, asir-mountains, aswan-souk, atacama, atomium, auckland-night, ayutthaya-wat-mahathat, bab-bou-jeloud, baguio-market, bahai-gardens, balik-ekmek-eminonu, banaue, bandung-food, banff, barranco-food, barranquilla-carnival, barranquilla-food, basel-markt, batu-caves, batumi-boulevard, bay-of-islands, beehive, belem-tower, belfry-bruges, belo-horizonte-market, ben-thanh, bergen-fest, bergen-fish, bern-market, bialowieza, big-ben, binondo, blue-mosque, blue-mountains, bo-kaap-food, bohemian-switzerland, boqueria, boracay, bordeaux-marches, borobudur, borough-market, bosphorus, botanic-gardens, boulders-beach, brandenburg-gate, brasilia-cathedral, brisbane-markets, british-museum …

## Shortfalls / honesty notes

- AM Foods remain at **10** (above formula) by design — Davit’s earlier Armenia eat list kept.
- IT Monuments **8**, Visit **7**, Seasonal **2** (above formula) — prior Rome/Italy set kept; Foods raised to **5**.
- `lantern` remains `catalog: sample_icons` (TW) without a Taiwan cloth country in the 50.
- Some Foods rows use **city** or **neighbourhood** precision (famous market / food street) where a single restaurant pin would be misleading — descriptions state that honestly.
- Seasonal entries are real festivals/events with Wikipedia (or official) `source` URLs.
- Coordinates for major landmarks match commonly cited WGS84 points; capitals in `countries.json` are capital-city pins, not centroids.
- No VBET / past-employer / client content.
- Descriptions are original visitor-facing copy; no invented rankings, prices, or stats.


## Photo counts (final, 26 Oct 2026 Asia/Yerevan)

| Kind | Count |
| --- | ---: |
| Local `assets/places/<id>.jpg` | **123** |
| URL-only (`photo_url` Commons) | **616** |
| No photo yet (placeholder) | **73** |
| Files on disk in assets/places | **123** |

Mos: prefer `photo` when set; else load `photo_url`; else branded placeholder.

## Validation snapshot (at notes write)

- JSON parses: yes (builder wrote pretty JSON)
- Countries: 50 + default
- Places: 812
- Unique ids: required
- Every place has lat/lng + description + Mos country keys

Photo local / URL-only / none: **re-count after photo jobs finish** with:

```bash
python3 -c "import json;p=json.load(open('places.json'))['places'];print(sum(1 for x in p if (x.get('photo') or '').startswith('assets/')), sum(1 for x in p if x.get('photo_url') and not (x.get('photo') or '').startswith('assets/')), sum(1 for x in p if not x.get('photo') and not x.get('photo_url')))"
```

## Places still without photo (73)

Use branded placeholder until Commons match found. Mostly Foods neighbourhood rows:

tsukiji-outer, dezertirebi, kutaisi-market, signagi-wine, amazon-manaus, global-village, al-qattara, san-sebastian-old-town, ciya-sofrasi, gaziantep-baklava, old-cairo-food, ramadan-cairo, bo-kaap-food, joburg-market, mombasa-old-town-food, nakumatt-note, kisumu-food, shanghai-yuyuan-bazaar, guangzhou-food, jeonju-hanok-food, insadong, chiang-mai-night, phuket-sunday, jimbaran, bandung-food, puebla-food, mendoza-andes, salta-plaza, mendoza-bodegas, rosario-food, cordoba-guemes, valpo-food, concepcion-food, punta-arenas-food, trujillo-food, medellin-mercado, cali-food, barranquilla-food, orebro-castle, kungsleden, goteborg-market, fika-gamla, tromso-food, legoland-billund-note, odense-food, aalborg-food, markthal-food, utrecht-foodhall, chocolate-sablon, antwerp-eat-street, ghent-food, liege-waffles, zurich-market, bern-market, linz-market, graz-farmers, krakow-cloth-hall, gdansk-olong, poznan-stary, karlstejn, ostrava-food, pecs-food, killarney-food, penang-hawker, ipoh-food, iloilo-food, jaffa-food, haifa-food, diriyah-food, jeddah-balad-food, riyadh-takhasusi, khobar-corniche-food, abha-food
