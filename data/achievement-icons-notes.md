# Stampd Me Achievements — per-id SVG icons

**Locked Oct 26, 2026.** Theme glyphs (★/◆/▣) replaced with unique line-art per achievement `id`. Vector only; `currentColor` so `.me-ach-ico` Coral 600 / locked muted greys apply. Seasonal marks may use twilight `#6B3FC4` sparingly on spark/tick fills.

## Paths
- Preview map: `app-preview/js/achievement-icons.js` → `window.WI_ACHIEVEMENT_ICONS` + `window.achievementIconSvg(id, theme)`
- Mirror: `src/components/achievement-icons.js`
- Wired: `index.html` loads the script; `app.js` `achievementIcon(a.id, earned, a.theme)` looks up by id (theme fallback only if missing)
- Contact sheet: `/workspace/screenshots/stampd-achievement-icons.png`

## API
```js
// Preferred
achievementIconSvg("first-stamp", "milestone")
// Map
WI_ACHIEVEMENT_ICONS["rome-weekend"] // SVG string, viewBox 0 0 24 24, ~20×20 display
```

## Ids → concept
| id | Title | Mark |
|---|---|---|
| `first-stamp` | First stamp | Perforated postage stamp + pin hub |
| `home-passport` | Home cloth | Passport cover + home roof/door |
| `monument-five` | Five monuments | Classical column + five monument dots |
| `foods-starter` | Table for stamps | Table + plate + fork |
| `wine-days-2026` | Wine days | Wine glass + twilight spark |
| `two-countries` | Two cloths | Two mini passport covers |
| `rome-weekend` | Rome weekend | Three Colosseum arches |
| `far-from-home` | Far from home | Arc path + near/far pins |
| `visit-chapter` | Out and about | Path + map pin (Visit) |
| `italy-half` | Italy, halfway | Italy boot outline + half tick |
| `seasonal-collector` | Season hopper | Calendar + three seasonal ticks |
| `ten-countries` | Ten cloths | Stacked covers + “10” stroke |

## Mos
- Preview already wired — reload Me after pull.
- Card chrome (`.me-ach` / `.me-ach-ico`) unchanged; icons are 20×20 inside the 28px ico box.
- If React/native port: import the same map; do not reintroduce emoji theme glyphs.
- Locked cards keep the same SVG; CSS `.me-ach.locked` opacity + muted ico colour handles greying.
