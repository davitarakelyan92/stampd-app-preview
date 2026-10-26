/* Stampd Me Achievements — per-id SVG marks (viewBox 0 0 24 24).
   Stroke line-art, currentColor so .me-ach-ico / .locked CSS can tint & mute.
   Seasonal spark may use twilight #6B3FC4 (still reads when locked via opacity). */
(function () {
  const S =
    'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

  function svg(inner) {
    return `<svg ${S}>${inner}</svg>`;
  }

  /** @type {Record<string, string>} */
  const WI_ACHIEVEMENT_ICONS = {
    /* First stamp — perforated postage stamp + pin hub */
    "first-stamp": svg(`
      <rect x="4.5" y="3.5" width="15" height="17" rx="1.6"/>
      <path d="M4.5 7.2h1.4M4.5 10.8h1.4M4.5 14.4h1.4M4.5 18h1.4"/>
      <path d="M18.1 7.2h1.4M18.1 10.8h1.4M18.1 14.4h1.4M18.1 18h1.4"/>
      <circle cx="12" cy="11.2" r="2.4"/>
      <path d="M12 13.6v4.2"/>
    `),

    /* Home cloth — passport cover + small home roof */
    "home-passport": svg(`
      <rect x="5" y="4" width="14" height="16" rx="1.8"/>
      <path d="M5 4.2v15.6" opacity=".35"/>
      <path d="M9.2 14.5V11.2L12 9l2.8 2.2v3.3"/>
      <path d="M10.4 14.5h3.2"/>
    `),

    /* Five monuments — classical column + five ticks on capital */
    "monument-five": svg(`
      <path d="M6.8 20.5h10.4"/>
      <path d="M9.2 20.5V11h5.6v9.5"/>
      <path d="M7 11h10"/>
      <path d="M7.8 8.5h8.4"/>
      <circle cx="8.6" cy="6.4" r="0.9" fill="currentColor" stroke="none"/>
      <circle cx="10.8" cy="6.4" r="0.9" fill="currentColor" stroke="none"/>
      <circle cx="13" cy="6.4" r="0.9" fill="currentColor" stroke="none"/>
      <circle cx="15.2" cy="6.4" r="0.9" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="4.2" r="0.9" fill="currentColor" stroke="none"/>
    `),

    /* Table for stamps — table + plate + fork cue */
    "foods-starter": svg(`
      <path d="M4.5 14h15"/>
      <path d="M7 14v5.5M17 14v5.5"/>
      <ellipse cx="11" cy="9" rx="4" ry="3.4"/>
      <ellipse cx="11" cy="9" rx="1.5" ry="1.2"/>
      <path d="M18.5 5.8v6.2"/>
      <path d="M17.3 5.8v2.8c0 1 .6 1.6 1.2 1.6"/>
      <path d="M19.7 5.8v2.8c0 1-.6 1.6-1.2 1.6"/>
    `),

    /* Wine days — glass + seasonal spark (twilight fill) */
    "wine-days-2026": svg(`
      <path d="M8.5 4.5h7l-1.6 7.2c-.35 1.55-1.7 2.6-3.3 2.6s-2.95-1.05-3.3-2.6Z"/>
      <path d="M12 14.3v4.7M9.2 19.5h5.6"/>
      <path d="M9.2 9.2h5.6" opacity=".55"/>
      <path fill="#6B3FC4" stroke="none" d="M17.6 4.2l.55 1.55 1.55.55-1.55.55-.55 1.55-.55-1.55-1.55-.55 1.55-.55Z"/>
    `),

    /* Two cloths — two mini passport covers */
    "two-countries": svg(`
      <rect x="3.2" y="5.5" width="8.2" height="11.5" rx="1.4"/>
      <path d="M3.2 5.7v11.1" opacity=".35"/>
      <rect x="12.6" y="7" width="8.2" height="11.5" rx="1.4"/>
      <path d="M12.6 7.2v11.1" opacity=".35"/>
    `),

    /* Rome weekend — three Colosseum arches */
    "rome-weekend": svg(`
      <path d="M4 19.5h16"/>
      <path d="M5.2 19.5V8.2h13.6V19.5"/>
      <path d="M5.2 11.2h13.6"/>
      <path d="M8.2 19.5v-5.2a1.8 1.8 0 0 1 3.6 0V19.5"/>
      <path d="M12.2 19.5v-5.2a1.8 1.8 0 0 1 3.6 0V19.5"/>
      <path d="M6.4 11.2V9.6a1.2 1.2 0 0 1 2.4 0v1.6"/>
      <path d="M15.2 11.2V9.6a1.2 1.2 0 0 1 2.4 0v1.6"/>
    `),

    /* Far from home — arc path + near/far pins */
    "far-from-home": svg(`
      <path d="M5.5 16.5c3.2-6.5 9.8-6.5 13 0" fill="none"/>
      <circle cx="6.2" cy="15.8" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M17.8 10.2c-1.7 0-3.1 1.35-3.1 3.05 0 2.15 3.1 4.85 3.1 4.85s3.1-2.7 3.1-4.85c0-1.7-1.4-3.05-3.1-3.05z"/>
      <circle cx="17.8" cy="13.1" r="1.15"/>
    `),

    /* Out and about — path + map pin (Visit chapter) */
    "visit-chapter": svg(`
      <path d="M4.5 17.5c2.2-1.2 3.6-3.6 5.2-5.4 1.4-1.55 3-2.6 4.8-2.6"/>
      <path d="M16.2 6.2c-1.85 0-3.35 1.45-3.35 3.25 0 2.35 3.35 5.35 3.35 5.35s3.35-3 3.35-5.35c0-1.8-1.5-3.25-3.35-3.25z"/>
      <circle cx="16.2" cy="9.35" r="1.2"/>
      <path d="M7.2 17.8h.01M10.5 14.2h.01" stroke-width="2.6"/>
    `),

    /* Italy halfway — boot outline + half-progress tick */
    "italy-half": svg(`
      <path d="M11.2 3.5c1.35.15 2.55 1.05 2.9 2.35.25.95.05 1.9-.55 2.65l-1.05 1.3c-.4.5-.35 1.25.15 1.7l2.05 1.85c.7.65.85 1.7.35 2.5l-1.35 2.15c-.4.65-1.15 1-1.9.9l-1.85-.2c-.55-.05-1.1.2-1.4.65l-1.05 1.55c-.45.65-1.4.8-2.05.3"/>
      <path d="M7.5 20.2c.55.35 1.35.25 1.75-.3l.7-1"/>
      <path d="M8.5 13.8h5.5"/>
      <path d="M14.8 13.8a4.2 4.2 0 0 1 0 6.4" opacity=".9"/>
    `),

    /* Season hopper — calendar + three ticks */
    "seasonal-collector": svg(`
      <rect x="4.5" y="5.8" width="15" height="13.8" rx="2"/>
      <path d="M4.5 9.5h15"/>
      <path d="M9 3.8v3.4M15 3.8v3.4"/>
      <path d="M7.2 13.3l1.3 1.3 2.4-2.6"/>
      <path d="M13.2 14.6l1.15 1.15 2.15-2.35"/>
      <path fill="#6B3FC4" stroke="none" d="M8.2 18.2a1.15 1.15 0 1 1 0-.02Zm4 0a1.15 1.15 0 1 1 0-.02Zm4 0a1.15 1.15 0 1 1 0-.02Z"/>
    `),

    /* Ten cloths — stacked covers + 10 mark */
    "ten-countries": svg(`
      <rect x="5.8" y="3.8" width="10.2" height="7.6" rx="1.2" opacity=".4"/>
      <rect x="4.6" y="6.8" width="10.2" height="7.6" rx="1.2" opacity=".65"/>
      <rect x="3.5" y="9.8" width="10.2" height="8.4" rx="1.3"/>
      <path d="M3.5 10v8" opacity=".35"/>
      <path d="M15.8 12.5v6.8"/>
      <rect x="17.2" y="12.5" width="3.6" height="6.8" rx="1.6"/>
    `),
  };

  /** Theme fallbacks if an id is missing (legacy). */
  const THEME_FALLBACK = {
    milestone: WI_ACHIEVEMENT_ICONS["first-stamp"],
    country: WI_ACHIEVEMENT_ICONS["home-passport"],
    chapter: WI_ACHIEVEMENT_ICONS["monument-five"],
    seasonal: WI_ACHIEVEMENT_ICONS["wine-days-2026"],
    travel: WI_ACHIEVEMENT_ICONS["rome-weekend"],
    distance: WI_ACHIEVEMENT_ICONS["far-from-home"],
  };

  function achievementIconSvg(id, theme) {
    if (id && WI_ACHIEVEMENT_ICONS[id]) return WI_ACHIEVEMENT_ICONS[id];
    if (theme && THEME_FALLBACK[theme]) return THEME_FALLBACK[theme];
    return svg(`<circle cx="12" cy="12" r="6"/><path d="M12 9v3.5l2 1.5"/>`);
  }

  window.WI_ACHIEVEMENT_ICONS = WI_ACHIEVEMENT_ICONS;
  window.achievementIconSvg = achievementIconSvg;
})();
