# Stampd Admin

Working product-ops console for the Stampd preview catalog. Edits live in the browser (`localStorage` key `stampd-admin-v1`) and can be exported as JSON for the app.

## Live

- https://davitarakelyan92.github.io/stampd-app-preview/admin/
- Deep links: `#overview` · `#countries` · `#places` · `#users` · `#ads` · `#trade` · `#moderation` · `#settings`
- App preview: https://davitarakelyan92.github.io/stampd-app-preview/

## Data sources

On first load the admin fetches:

- `../data/places.json` (~812 places)
- `../data/countries.json`
- `../data/me.json`

Ads, moderation tickets, extra users, and roles are seeded into **admin-extras** (not part of the app files until you export them).

## Edit → commit workflow

1. Change anything in the UI (countries, places, users, ads, trade rules, tickets, roles).
2. Click **Save** to keep a draft in this browser.
3. Click **Export** — downloads `places.json`, `countries.json`, `me.json`, and `admin-extras.json`.
4. Replace the matching files under `data/` in the repo (and keep `admin-extras.json` next to them if you want that extras seed).
5. Commit and push; Pages rebuilds the app + admin.
6. **Reset** discards the local draft and reloads from the published JSON.

**Import** accepts a single file: either one of those JSON docs, or a packed object `{ places, countries, me, extras }`.

## Brand

Coral `#FF5B4A` · Coral 600 `#C8372A` · Navy `#1B2747` · Plus Jakarta Sans. No VBET references.

## Local

```bash
cd /path/to/stampd-app-preview
python3 -m http.server 8855
# open http://127.0.0.1:8855/admin/
```
