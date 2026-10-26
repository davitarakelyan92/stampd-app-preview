# Stampd UI chrome icons — vector only

**Rule (locked Oct 26, 2026):** Tab bar, Map CTA, balance chips, and other chrome marks are **inline SVG only** — never PNG/WebP/emoji/raster. `currentColor` so active Coral 600 / inactive muted inherit from the tab button.

## Tab — Trade
File: `assets/icons/ui-trade.svg` (also `ui-trade-24.svg` master).

Drop-in (22×22, matches Support/Me stroke 2.2):

```html
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h11"/><path d="M12 4.5 15.5 8 12 11.5"/><path d="M20 16H9"/><path d="M12 12.5 8.5 16 12 19.5"/></svg>
```

Already wired in `index.html` tab bar.

## Map CTA (stamp detail)
File: `assets/icons/ui-map-pin.svg` — white pin + Coral `#FF5B4A` hub (on Coral 600 button). Live in `app.js` `.detail-map-cta`.

## Balance chips
Inline SVG in `balanceChromeHtml()` — stamp rect + coin double-circle; Navy stroke; no gold fills.
