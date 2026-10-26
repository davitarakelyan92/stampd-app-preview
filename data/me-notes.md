# Me screen — sample data

**File:** `me.json` (v1, 26 Oct 2026)  
**Audience:** Mos (Stampd app-preview)  
**Rules:** Fictional sample user (Ani Sargsyan — same sample name as earlier print mockups). Not a real person. No employer/client content.

## Fields Mos can render

### `profile`
- `display_name`, `home_city` (Yerevan), `home_country` (`AM`)
- `member_since` (ISO date)
- `bio` (one-liner)
- `stamps_collected`, `countries_visited`
- `favorite_country_id`, `active_passport_country_id` (for cover shelf highlight)

### `countries[]` — Countries I’ve been
One row per cloth country from `countries.json` (excluding `default`).
- `visited` true/false
- `cloth_hex`, `family`, `name`, `id` — enough to draw passport covers
- `visited_at`, `stamps_earned`, `stamps_total_in_catalog` when visited
- Visited in this sample: **am**, **it**. All others unvisited / coming_soon covers can still show as locked shelf slots.

### `collected_place_ids[]`
Stamp ids treated as earned in the preview (26 ids). AM-heavy + Italy trip mix.

### `achievements[]`
- `id`, `title`, `description`, `earned_at` (ISO date or `null` if locked), `theme`
- Themes: milestone, country, chapter, seasonal, travel, distance
- Locked examples: `italy-half`, `seasonal-collector`, `ten-countries`

## Counts in this sample
- Stamps collected: **26**
- Countries visited: **2** (Armenia, Italy)
- Achievements earned: **9** · locked: **3**

## Planned next step
Wire Me tab to this file; Arp/Mos add achievement art. Davit can rename the sample profile anytime.


## Trade + coins (v2)

**Fields Mos can wire**
- `coins` (number) — also mirrored on `profile.coins`
- `stamps_collected` — top-level and `profile.stamps_collected` (unique place ids in `collected_place_ids`)
- `duplicate_place_ids` — place ids with a spare copy for Trade (also under `trade.duplicate_place_ids`)
- `trade.exchange_offers[]` — stub: `id`, `status` (`open`|`pending`|`done`), `give_place_id`, `want_place_id`, optional `want_country_id`, `note`

**Coin rules used in this sample** (preview; Davit can change)
1. **Chapter complete** in a country (all catalog places in Monuments / Foods / Visit / Seasonal): **+50**
2. **Country complete** (every place in that country’s catalog): **+200** (stacks after chapter bonuses)
3. **Seasonal collect** (first time): **+10**
4. **Ordinary first collect**: **0** (keeps coins tied to completion + Trade)
5. **Welcome grant**: **+100** preview-only so Trade isn’t empty
6. **Duplicates** do not mint coins — they only enable exchange offers

**This sample’s derived balance:** **260** coins  
Ledger sample is in `coin_ledger_sample` (which chapters/seasonals actually completed against current places.json).

**AM/IT coherence**
- `collected_place_ids` unchanged (26 unique).
- Duplicates (spares): ['colosseum', 'trevi', 'gelato', 'garni', 'republic-square', 'pizza']
- Offers reference Italy wants (`pompeii`, `tower-of-pisa`, `positano`) that exist in places.json but are not yet collected.
