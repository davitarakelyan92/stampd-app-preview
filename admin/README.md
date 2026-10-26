# Stampd Admin

Desktop console for the Stampd catalog. It loads the same JSON the app preview uses, and every edit stays in this browser until you export it.

Coral `#FF5B4A` · Coral 600 `#C8372A` · Navy `#1B2747` · Plus Jakarta Sans.

## Open

GitHub Pages (after this folder is on `main`):

https://davitarakelyan92.github.io/stampd-app-preview/admin/

Locally, from the repo root:

```bash
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765/admin/

Deep links: `#overview` `#countries` `#places` `#users` `#ads` `#trade` `#moderation` `#settings`

`file://` will not work. The page fetches `data/places.json`, `data/countries.json`, and `data/me.json`.

## What is editable

| Section | Source |
| --- | --- |
| Overview | Counts from places, countries, stub users, and trade offers |
| Countries | `countries[]` in both `data/countries.json` and `data/places.json` (live / coming soon, order, cloth, name) |
| Places / stamps | All rows in `data/places.json` |
| Users | Sample profile from `data/me.json`, plus extra stub travellers |
| Ads / promotions | Admin-only promo slots |
| Trade & coins | `coin_rules`, offers, duplicates, and the ledger in `data/me.json` |
| Moderation | Sample tickets |
| Settings / roles | Stub matrix, people, and the catalog home point |

There is no account server and no write-back to GitHub. The roles matrix does not lock buttons.

## Save, reset, export, import

Edits are written to `localStorage` under `stampd-admin-v1` as you go. **Save** confirms that browser copy. The amber **Local edits** pill means the copy differs from the files last fetched from the site.

**Reset to repo** clears the browser copy and fetches the three JSON files again. Promo slots, extra users, tickets, and role edits return to the built-in sample.

**Export JSON** downloads four files:

- `places.json` — replace `data/places.json`
- `countries.json` — replace `data/countries.json`
- `me.json` — replace `data/me.json`
- `admin-extras.json` — users beyond the sample profile, promos, tickets, and roles. The app preview does not read this file. Keep it if you want those stubs in git; the sample profile itself is already inside `me.json`.

**Import JSON** accepts one or more of those files (or a bundle with `placesDoc` / `meDoc`). Shapes match the app files, including `coming_soon` on a country and the existing place fields (`id`, `name`, `chapter`, `country_id`, `lat`, `lng`, `photo`, `catalog`, …).

### Commit exported data into the app

1. Export from the admin.
2. Replace `data/places.json`, `data/countries.json`, and `data/me.json` with the downloads. Do not rename keys the app already reads.
3. Commit and push to `main`. The existing Pages workflow publishes the repo root, so `/admin/` updates with the rest of the site.
4. Hard-refresh the admin and choose **Reset to repo** so this browser drops the old local copy.

`admin-extras.json` is optional. Mock users other than the sample profile, ads, tickets, and the roles matrix live only there.

## Docs

- `docs/admin-visual-direction.md` — layout and tokens used by this UI
- `docs/admin-open-decisions.md` — proposals this build follows
