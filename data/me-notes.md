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
