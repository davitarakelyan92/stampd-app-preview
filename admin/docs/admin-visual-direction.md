# Stampd Admin — visual direction (draft)

Desktop-first product ops console. Same brand as the mobile app; denser, table-forward, no marketing chrome.

## Brand tokens (locked — do not invent)

| Role | Token | Hex |
|------|--------|-----|
| Primary accent | Coral | `#FF5B4A` |
| Primary actions | Coral 600 | `#C8372A` |
| Sidebar / ink navy | Navy | `#1B2747` |
| Muted text | Navy 600 | `#5C6680` |
| Page ground | Shell | `#FFF7F1` |
| Cards | White | `#FFFFFF` |
| Soft panel | Paper | `#F4ECDA` |
| Dividers | Line | `#E3E1DA` |
| Body text | Ink | `#2A2420` |
| Seasonal only | Twilight | `#6B3FC4` |

**Cloth families** (covers only — never as UI chrome): Blue `#1B2747` · Red `#8B1E2D` · Green `#1E3B32` · Black `#1A1A1E` · Orange `#7A3F18`.

**Type:** Plus Jakarta Sans (product locked). Nar floated Inter / Inter Tight for admin — see open decisions.

**Mark:** Pin Stamp only. Sidebar lockup = white pin + white “Stampd” on Coral strip, or white pin on navy + coral wordmark pill. No gold, no foil, no second logo.

## Layout system

- **Viewport target:** 1440×900 (also fine at 1280+).
- **Sidebar:** 248px fixed left. Navy fill, white/muted nav labels, Coral active rail (3px) + coral-50 tint on active row.
- **Top bar:** 56px. White or shell, 1px line bottom. Global search (places, users, countries), env badge (`Staging` / `Prod`), admin avatar + name.
- **Content column:** max-width ~1160px inside fluid main; 24px gutters; 8px spacing grid (`--s-1`…`--s-5` from product tokens).
- **Cards:** white, 1px `#E3E1DA`, radius 14px (`--r-m`), soft shadow optional (`0 1px 2px rgba(27,39,71,.06)`).
- **Density:** compact tables (row height ~44–48px); forms 8/12/16 rhythm; KPI cards 1×4 then chart + activity.

## Sidebar IA

1. Overview  
2. Countries  
3. Places / stamps  
4. Users  
5. Ads / promotions  
6. Trade & coins  
7. Moderation  
8. Settings  

Footer of sidebar: “Admin · Stampd” + version stub.

## Component patterns

### Buttons
- **Primary:** Coral 600 fill, white text, radius 8px, weight 700. One primary per toolbar.
- **Secondary:** white + navy text + line border.
- **Ghost:** text-only navy/muted.
- **Destructive:** quiet danger — text `#B42318` or outline `#F04438` / fill `#FEF3F2`. **Do not** use cloth red `#8B1E2D` for delete.

### Status chips
- Live / Active → mint 100 + mint 700  
- Coming soon / Draft → sunny 100 + sunny 700  
- Seasonal → twilight 100 + twilight  
- Suspended / Flagged → coral-50 + coral 600  
- Locked / Disabled → lock-bg + lock grey  

### Tables
- Sticky header, navy-50 header fill, 11–12px uppercase tracking labels optional or 13px medium navy.
- Left-aligned text; right-align numbers (coins, stamps).
- Row hover navy-50; selected row coral-50.
- Inline actions: icon buttons (edit / archive / more) — SVG only, 16–18px stroke.

### Forms
- Labels 12px muted, inputs white + line border, focus ring Coral `#FF5B4A` at 2px / 20% opacity.
- Toggles: track navy-200 / on = Coral; thumb white.
- Drag handles on Countries: six-dot grip muted — visual cue only in this mock.

### Charts / sparklines
- Placeholder bars or SVG path in navy + coral accent. No third-party chart chrome in v1 mock.

## Iconography
Inline SVG only (same rule as app). Stroke ~1.75–2 on 20×20 viewBox. No raster tab or chrome icons.

## Tone
Feels like Stampd product ops: warm shell ground, coral sparingly, navy structure. Not Bootstrap grey admin, not analytics SaaS purple.
