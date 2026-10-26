# Stampd — local app preview

Clickable mobile-first HTML preview for visual review. **Local static files only** — nothing is deployed.

Arp’s fidelity notes: [`VISUAL-NOTES.md`](./VISUAL-NOTES.md) (keep; do not delete).  
Places / distance data: [`data/places.json`](./data/places.json) (Kar) · notes [`data/places-notes.md`](./data/places-notes.md).

## Open

**File URL**

```
file:///workspace/design/world-icons-passport/app-preview/index.html
```

**Local server** (from this folder — preferred so `places.json` + geolocation work)

```bash
cd /workspace/design/world-icons-passport/app-preview && python3 -m http.server 8765 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8765/>.

Phone content is locked **390×844** inside a 430px bezel (`.phone-scale` shrinks on narrow viewports).

## Screens

| Screen | How to reach |
|---|---|
| **Countries** (cover hero + Available / Coming soon) | Default · **Countries** tab |
| Stamp album (Rome sample) | **Open album**, tap the book, or **Album** tab |
| Check-in / earn Trevi | **Stamp it** on the toast, or center **Stamp** FAB |
| Cover cloth picker (live only) | **Change cover cloth** or **Covers** tab |
| **Stamp detail** | Tap any stamp card in the album |

Map / Trade / Me are stubs.

### Distance on stamp cards

Album cards keep image · name · collected note, plus a `.stamp-dist` row (outside `digitalStamp` SVG). Uses `navigator.geolocation` when allowed; otherwise haversine from geo or home stand-in (`N km from you`). Plain locked stamps hide distance; earned / seasonal / gifted / resting / here-locked show it.

### Countries status

Driven by `places.json` `countries[].status` (`live` | `coming_soon`) Live: **Armenia**, **Italy** (no Default/unset). Coming soon: JP, GE, BR, AE, FR, US, UK, DE, IN. Available tap opens that country’s Gallery; Coming soon taps toast. No Change cover cloth.

## Brand (locked Round 2)

Reuses `js/logo.js`, `js/stamps.js`, `js/icons.js`, `css/tokens.css`.  
Coral `#FF5B4A` · Navy `#1B2747` · cloth families · Pin Stamp via `coverLockup` / `symbolPin` / `digitalStamp`.  
Slogan: **Stamp anywhere you visit.**

## Data-driven notes

Album chapter chips/counts and progress total come from the current stamp set (chapters merged from `places.json`). Kar’s fuller AM/IT set can expand `places[]` + stamp sample rows without rewriting chip HTML. Countries Available / Coming soon / distance / detail already read `places.json` live.
