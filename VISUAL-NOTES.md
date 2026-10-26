# Stampd app-preview — visual fidelity notes (Arp)

Mos owns the scaffold (`index.html`, `css/`, `js/`). Arp will visual-QA later. Do not invent brand colours or bright flag hexes as cloths.

## Locked Round 2 (must match)

| Token | Hex | Use |
|---|---|---|
| Coral | `#FF5B4A` | App lead, center Stamp tab, accents |
| Coral 600 | `#C8372A` | Buttons / CTA fill |
| Navy | `#1B2747` | Default cloth, ink, chrome |
| Shell | `#FFF7F1` | App background |
| Paper | `#F4ECDA` | Paper surfaces |
| Twilight | `#6B3FC4` | Seasonal stamps **only** |

**Type:** Plus Jakarta Sans (from `../src/tokens/tokens.css` or Google Fonts). Weight 800–900 for titles/wordmark.

**Slogan (locked):** `Stamp anywhere you visit.` (`STAMPD_SLOGAN` in `logo.js`)

## Cover cloth families (navy-weight — NOT bright flag hexes)

| Family | Hex | Countries |
|---|---|---|
| Blue/navy | `#1B2747` | default, France, USA, UK |
| Red | `#8B1E2D` | Armenia, Japan, Georgia |
| Green | `#1E3B32` | Italy, Brazil, UAE |
| Black | `#1A1A1E` | Germany |
| Orange | `#7A3F18` | India |

Cover lockup = white Pin Stamp + white “Stampd” + slogan via `coverLockup({cloth})`. Light-cloth rule already in `logo.js`: luminance > 0.55 → navy type (do not darken cloth). All current family hexes are dark enough for white type.

## Components to reuse (relative from `app-preview/`)

```html
<link rel="stylesheet" href="../src/tokens/tokens.css">
<script src="../src/components/icons.js"></script>
<script src="../src/components/stamps.js"></script>
<script src="../src/components/logo.js"></script>
```

- **Pin Stamp:** `symbolPin`, `coverLockup`, `appIcon`, `stampdWord`, `STAMPD_SLOGAN`
- **Digital stamps:** `digitalStamp({ icon, color, state, note, here, ... })`
- **Seasonal:** `state:'seasonal'` + `color:'twilight'` → double violet frame + SEASONAL badge, **no glow** (already in `stamps.js`)
- **Chapter shapes (ink):** Monuments circle · Fountains oval · Natural wonders octagon · Foods ticket · Festivals scallop (`WI_SHAPE_BY_CHAPTER`)

## Screen visual cues (from Rome mock `src/pages/stampd/app-rome.html`)

1. **Passport / Home** — full cloth cover with `coverLockup`; recent stamps strip; progress pill (navy card, coral bar segments).
2. **Album** — 2-col grid of `digitalStamp`; chapter chips; include ≥1 seasonal.
3. **Check-in** — “You’re here” toast + coral **Stamp it** CTA (`#C8372A` button fill ok).
4. **Contact support** — mailto help screen (was Covers). Country cloth stays on Countries.
5. **Me** — stub is fine.

## Tab bar

Countries | Album | **Stamp** (center coral `#FF5B4A` raised button with white Pin Stamp) | Support | Me  
Active tab tint: coral 600 `#C8372A`. Phone frame 390×844 inside dark bezel (see `phone.css`).

## Countries screen (Arp locked · Oct 26)

- Tab label **Countries** (was Passport). CTA **Open album**. Country/cloth picking lives here (Available + Coming soon) — **Covers tab retired → Contact support**.
- Layout: topbar **Countries** → **Available now** → live cards → **Coming soon** → grey soon cards. **No Default/unset. No Change cover cloth.**
- Data: `data/places.json` v3 (Kar). Prefer `cloth_hex`; cloth red locked `#8B1E2D`. Do not invent TW cloth.

### Passport face
- Live country → `coverCountryFace({ cloth, name, size:36, withSlogan:false })` — name only; never slogan / Pin Stamp / family / hex on cloth.
- No Default/unset — cover always a live country via `coverCountryFace` (name only).

### Hero `.cover-meta` (under the book — NOT thumbs)
- Live: `<b>{Country name}</b>` 15px/800 navy + `{n} stamps available` 12.5px/600 muted.
- Always real country: **{Name}** + **{n} stamps available**.
- No hex / family / old pick-a-country variants. Meta `margin-top:12px`, centered, `line-height:1.4`.

### Available `.country-card` (live only)
- Row: `[mini cloth 44×62]` | name · `{collected} of {total} stamps` (`.stat` 12px/600 muted, mt 3px) · up to 4 thumbs (3 states). Tap → **Gallery/album** for that country (not select/check). Lists + thumbs sorted closest-first.
- Padding `12px 14px`; gap mini↔body `14px`. Selected: coral inset + check.
- **No** `.hx` family/hex on Available rows.

### `.stamp-thumbs` (Arp · 3 states)
- Up to **4** thumbs, ordered closest-first; prefer showing collected + open + unavailable when present.
- Size **28×34**, r6, icon centered; gap 6px; mt 8px; `pointer-events: none`.
- `.is-collected` — paper `#FFF`, border `#E3E1DA`, Navy icon, optional Coral `#C8372A` 10px check pip.
- `.is-open` — paper `#F7F8FA`, border `#E3E6EC`, icon `#A3AABA`, no badge.
- `.is-unavailable` — paper `#EEEAE3`, dashed `#C8C4BC`, icon `#C8C4BC` @ ~0.5 + light grayscale (seasonal locked / missing art).

### Coming Soon
- Unchanged grey + COMING SOON pill — **no** count, **no** thumbs. Tap → soft toast.

## Country cover face (locked Oct 26)
- Live country cloth: `coverCountryFace({cloth, name, size:36, withSlogan:false})` — **country name only**.
- No Default/unset cover state.
- Hero meta under the book shows country name + stamp count (not hex). Thumbs live on Available cards only.

## Distance row (`.stamp-dist`)

- Outside SVG under each `.stamp-card` — do **not** edit `stamps.js`.
- 11.5px / 600 / `var(--muted)` / lh 1.3 / ls 0 · margin-top 6px · max-width ~150 · center · min-height 16px.
- Copy always **`{N} km from you`** (or `{N} m from you` under 1 km). Geo when allowed; else home lat/lng stand-in — UI still says “from you”. Album grids + thumbs + live countries sorted closest-first.
- Show for earned / seasonal / gifted / resting / here-locked. Hide for plain locked.

## Phone frame

- `.scr` locked **390×844**. `.phone` 430× padding 20. `.preview-chrome` / `#phone-scale` 430. Do not reintroduce fluid aspect-ratio on `.scr`.

## Stamp detail

- Tap any `.stamp-card` in Album → full-screen detail (`data-screen="detail"`). Back → album.
- Stack: `digitalStamp` hero **200×244** → title → description (`places.json` `description` or “Description coming soon.”) → meta **Distance** + **Coordinates** (4 decimal places, e.g. `41.8909° N, 12.4919° E`) → photo 16:10.
- Photo from `photo` / `photo_url` (relative path ok). Null/missing/error → shell-tinted placeholder + place name + “Photo coming soon”.
- Do not invent photos; wait for Kar’s assets under `assets/places/`.

## Data chapters & icon fallback

- Kar chapter strings: `Monuments`, `Foods`, `Visit`, `Seasonal` (plus legacy Fountains / Festivals / Natural wonders in the Rome sample).
- Album chips accept **any** chapter from data; counts are computed.
- `chapter === "Seasonal"` → prefer `digitalStamp` `state:'seasonal'` + twilight when not earned/gifted.
- Unknown icon ids use `WI_ICON_FALLBACK` (generic pin) via `wiIconDef()` — album/detail must not crash.

## Do not

- Edit `exports/stampd/` or boards 01–09
- Use bright flag hexes (`#D90012`, `#009246`, etc.) as cloth
- Add glow/sparkles on seasonal stamps
- Publish externally

## Reference

- Rome clickable mock: `/workspace/design/world-icons-passport/src/pages/stampd/app-rome.html`
- App board: `07-app.html`
- Covers board: `06-covers.html` (Mos already refreshed — leave as-is)

## Country passport face (Davit / Arp Oct 26)
- Live cover shows **country name only** (Plus Jakarta Sans 900, white / navy on light cloth) — **not** Pin Stamp lockup, **not** slogan on the cloth.
- No Default / unset.
- No colour name or cloth family label on the cover face.
- Cloth red locked `#8B1E2D` (was `#6B2428` oxblood — Davit Oct 26: more reddish, still navy-weight).

## Chapter stamp shapes (locked Oct 26)
| Chapter | Shape |
|---|---|
| Monuments | circle |
| Fountains | oval |
| Natural wonders | octagon |
| Foods | ticket |
| Festivals | scallop |
| Visit | rounded (soft rounded-rect ≈18% corner; inkStamp) |
| Seasonal | **not a shape** — `digitalStamp` `state:'seasonal'` + twilight frame/badge only |

## Stamp detail (Arp QA nits applied)
- Meta block is a white card: border `#D5D9E3`, radius 14px, pad 14×16, gap 12px; values 15px/700 navy
- Title 28px/800; topbar shows truncated place name

## Me screen (Mos · Oct 26)
- Tab **Me** loads `data/me.json` (Kar). Fields when present: profile, countries visited (mini cloth covers via `coverCountryFace` / `coverLockup`), achievements, optional stats.
- If file missing: polite empty state “Profile coming soon” + Retry. Do not invent achievements or countries.
- Nav: Countries | Album | Stamp FAB | Support | Me.

## QA nits (Arp · Oct 26)
- **Me → Visited passports:** visited countries only (sample AM, IT); cloth = locked family hex (`CLOTH[family]`), e.g. AM `#8B1E2D`, IT `#1E3B32`. No pastel/coming-soon books.
- **Support → Email support:** Coral 600 `#C8372A` + coral shadow. Cloth red is for passport covers only.
- **Change cover cloth:** removed. Available row tap opens that country’s Gallery; album **Back** returns to Countries.


### Countries hero removed (Davit, 2026-10-26)
The `.cover-hero` block (big passport book, `.cover-meta` “N stamps available”, Open album button) was removed. Countries leads with Available now + Coming soon; tapping an Available card opens that country’s Gallery (with Back). Me visited mini covers unchanged.
Gallery opened from a Countries card keeps the **Countries** tab active (Album tab not highlighted); Back returns to the list. Tapping the Album tab directly still highlights Album.
