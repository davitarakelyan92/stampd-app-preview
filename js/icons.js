/* World Icons — original landmark line art. 64×64 grid, 2.4 stroke, round caps/joins.
   Drawn from scratch for this project. `line` = the drawing, `fill` = silhouette used
   for the digital offset-colour block. */
window.WI_ICONS = {
  colosseum:{label:"Colosseum", chapter:"Monuments",
    line:`M5 54H59 M9 54V16H37V19.5H43V24.5H49V30H55V54 M9 26H49 M9 36H55 M9 45H55
      M13 19.5h3.5v3.5h-3.5z M21.5 19.5h3.5v3.5h-3.5z M30 19.5h3.5v3.5h-3.5z
      M11.5 36v-4.2a2.5 2.5 0 0 1 5 0V36 M18.5 36v-4.2a2.5 2.5 0 0 1 5 0V36 M25.5 36v-4.2a2.5 2.5 0 0 1 5 0V36 M32.5 36v-4.2a2.5 2.5 0 0 1 5 0V36 M39.5 36v-4.2a2.5 2.5 0 0 1 5 0V36
      M11.5 45v-4.2a2.5 2.5 0 0 1 5 0V45 M18.5 45v-4.2a2.5 2.5 0 0 1 5 0V45 M25.5 45v-4.2a2.5 2.5 0 0 1 5 0V45 M32.5 45v-4.2a2.5 2.5 0 0 1 5 0V45 M39.5 45v-4.2a2.5 2.5 0 0 1 5 0V45 M46.5 45v-4.2a2.5 2.5 0 0 1 5 0V45
      M11.5 54v-4.2a2.5 2.5 0 0 1 5 0V54 M18.5 54v-4.2a2.5 2.5 0 0 1 5 0V54 M25.5 54v-4.2a2.5 2.5 0 0 1 5 0V54 M32.5 54v-4.2a2.5 2.5 0 0 1 5 0V54 M39.5 54v-4.2a2.5 2.5 0 0 1 5 0V54 M46.5 54v-4.2a2.5 2.5 0 0 1 5 0V54`,
    fill:`M9 54V16H37V19.5H43V24.5H49V30H55V54Z`},
  eiffel:{label:"Eiffel Tower", chapter:"Monuments",
    line:`M32 4V11 M29 11H35 M30 11C29.5 28 23 43 12 56 M34 11C34.5 28 41 43 52 56
      M27.6 27H36.4 M20.5 41.5H43.5 M28 29.5L36 39 M36 29.5L28 39 M19 56Q32 41 45 56 M8 56H56`,
    fill:`M30 11C29.5 28 23 43 12 56H52C41 43 34.5 28 34 11Z`},
  ararat:{label:"Mount Ararat", chapter:"Natural wonders",
    line:`M3 52L24 16Q26 13 28 16L39.5 33.5L45 28.5Q47 26.6 49 28.5L61 52 M2 52H62
      M18.8 25L22 28.5L25.5 24.5L29 28.5L33.9 25 M42.3 31L44.5 33L46.8 31.2L48.6 33L50.3 31
      M50 8.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 1 1 0-9`,
    fill:`M3 52L24 16Q26 13 28 16L39.5 33.5L45 28.5Q47 26.6 49 28.5L61 52Z`},
  taj:{label:"Taj Mahal", chapter:"Monuments",
    line:`M5 55H59 M9 55V51H55V55 M18 51V33H46V51 M24 33C20.5 27 27 22.5 32 15.5C37 22.5 43.5 27 40 33 M32 15.5V8
      M28 51V44Q28 39 32 37Q36 39 36 44V51 M21 51V46.5Q21 43.5 23 42.5Q25 43.5 25 46.5V51 M39 51V46.5Q39 43.5 41 42.5Q43 43.5 43 46.5V51
      M18 33V31Q20 27 22 31V33 M42 33V31Q44 27 46 31V33
      M11 51V25 M53 51V25 M9 25Q11 20 13 25Z M51 25Q53 20 55 25Z M9.5 36H12.5 M51.5 36H54.5`,
    fill:`M18 51V33H24C20.5 27 27 22.5 32 15.5C37 22.5 43.5 27 40 33H46V51Z`},
  trevi:{label:"Trevi Fountain", chapter:"Fountains",
    line:`M8 40V16H56V40 M11 16V11H53V16 M28 11V7.5H36V11 M14 19V37 M19 19V37 M45 19V37 M50 19V37
      M26 40V27Q26 20.5 32 20Q38 20.5 38 27V40 M29 27.5H35 M28.5 32H35.5 M27.5 36.5H36.5
      M4 44H60 M27 40Q26 42.5 23.5 44 M37 40Q38 42.5 40.5 44 M32 38V44
      M8 51q3-3 6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0 M11 57q3-3 6 0t6 0t6 0t6 0t6 0t6 0t6 0`,
    fill:`M8 40V16H11V11H53V16H56V40Z`},
  pizza:{label:"Pizza al taglio", chapter:"Foods",
    line:`M10 15Q32 7 54 15L33 58Q32 59.6 31 58Z M12.8 20.6Q32 13.2 51.2 20.6
      M25 23a4 4 0 1 1 0 8a4 4 0 1 1 0-8 M39 26.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 1 1 0-7 M32 38.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 1 1 0-7
      M22 36.5q2.5-2.2 4.5 0q-2.5 1.8-4.5 0`,
    fill:`M10 15Q32 7 54 15L33 58Q32 59.6 31 58Z`},
  lantern:{label:"Lantern Festival", chapter:"Festivals",
    line:`M32 5V11 M26 11H38 M24 15Q32 10 40 15 M24 15C18 22 18 38 24 45H40C46 38 46 22 40 15Z M28 16C25.5 24 25.5 36 28 44 M36 16C38.5 24 38.5 36 36 44 M32 15V45 M26 45V49H38V45 M32 49V56 M29 56H35`,
    fill:`M24 15C18 22 18 38 24 45H40C46 38 46 22 40 15Z`},
  pantheon:{label:"Pantheon", chapter:"Monuments",
    line:`M6 55H58 M9 51H55V55 M20 19Q32 5 44 19 M9 26L32 13.5L55 26Z M11 26V30H53V26 M15 30V51 M21.5 30V51 M28 30V51 M36 30V51 M42.5 30V51 M49 30V51 M29 21.5H35`,
    fill:`M9 26L32 13.5L55 26V51H9Z`},
  gelato:{label:"Gelato", chapter:"Foods",
    line:`M22 31L32 58L42 31 M20 31H44 M21 31Q19.5 19.5 32 19Q44.5 19.5 43 31 M26 19.5Q25.5 10 32 10Q38.5 10 38 19.5 M25.5 37L38.5 37 M27.6 43H36.4 M29.8 49H34.2 M32 10V7`,
    fill:`M22 31L32 58L42 31Z M21 31Q19.5 19.5 32 19Q44.5 19.5 43 31Z`},
  star:{label:"World Icons star", chapter:"",
    line:`M32 6L36.5 27.5L58 32L36.5 36.5L32 58L27.5 36.5L6 32L27.5 27.5Z`,
    fill:`M32 6L36.5 27.5L58 32L36.5 36.5L32 58L27.5 36.5L6 32L27.5 27.5Z`},
  /* ——— Italy Monuments ——— */
  "duomo-milan":{label:"Milan Cathedral", chapter:"Monuments",
    line:`M6 56H58 M10 56V28 L16 18 L22 28 L28 12 L32 6 L36 12 L42 28 L48 18 L54 28 V56
      M16 28V56 M22 28V56 M28 28V56 M36 28V56 M42 28V56 M48 28V56
      M14 40H50 M14 48H50
      M18 32h3v4h-3z M25 32h3v4h-3z M36 32h3v4h-3z M43 32h3v4h-3z
      M20 44h3v4h-3z M27.5 44h3v4h-3z M34.5 44h3v4h-3z M42 44h3v4h-3z
      M32 6V2`,
    fill:`M10 56V28L16 18L22 28L28 12L32 6L36 12L42 28L48 18L54 28V56Z`},
  "florence-cathedral":{label:"Florence Cathedral", chapter:"Monuments",
    line:`M6 56H58 M10 56V42H54V56 M14 42V34H50V42
      M18 34C18 22 26 14 32 8C38 14 46 22 46 34
      M32 8V4 M28 4H36 M30 4V2H34V4
      M22 34H42 M26 26H38 M29 18H35
      M24 42V56 M32 42V56 M40 42V56
      M27 48h4v5h-4z M33 48h4v5h-4z`,
    fill:`M18 34C18 22 26 14 32 8C38 14 46 22 46 34H50V42H54V56H10V42H14V34Z`},
  "tower-of-pisa":{label:"Leaning Tower of Pisa", chapter:"Monuments",
    line:`M8 58H56
      M22 56 L28 10 H42 L36 56 Z
      M23.2 18H40.5 M24.5 26H39.2 M25.8 34H38 M27 42H36.8 M28.2 50H35.5
      M25 14a2.2 2.2 0 0 1 4.4 0 M31.5 12.5a2.2 2.2 0 0 1 4.4 0
      M24 22a2.2 2.2 0 0 1 4.4 0 M30.5 20.5a2.2 2.2 0 0 1 4.4 0 M37 22a2 2 0 0 1 4 0
      M25 30a2.2 2.2 0 0 1 4.4 0 M31.5 28.5a2.2 2.2 0 0 1 4.4 0
      M26.5 38a2.2 2.2 0 0 1 4.4 0 M33 36.5a2.2 2.2 0 0 1 4.4 0
      M28 46a2.2 2.2 0 0 1 4.4 0 M30 8H40`,
    fill:`M22 56L28 10H42L36 56Z`},
  "castel-santangelo":{label:"Castel Sant'Angelo", chapter:"Monuments",
    line:`M6 56H58 M10 56V40H54V56
      M16 40V34H48V40
      M20 34 a12 12 0 0 1 24 0
      M24 28 a8 8 0 0 1 16 0
      M32 16V10 M28 10H36 M32 10L30 6 M32 10L34 6
      M14 48H22 M42 48H50
      M18 44h4v6h-4z M42 44h4v6h-4z
      M28 40V56 M36 40V56`,
    fill:`M10 56V40H16V34H20a12 12 0 0 1 24 0H48V40H54V56Z`},
  "pompeii":{label:"Pompeii", chapter:"Monuments",
    line:`M4 56H60 M8 56V38 H18 V56 M22 56V30 H30 V56 M34 56V34 H42 V56 M46 56V40 H56 V56
      M8 38L14 28L18 38 M22 30L26 18L30 30 M34 34L38 24L42 34 M46 40L51 32L56 40
      M48 22 L54 10 L60 22 M52 16a2.5 2.5 0 1 1 0 0.1
      M10 46H16 M24 46H28 M36 46H40 M48 46H54`,
    fill:`M8 56V38L14 28L18 38V56Z M22 56V30L26 18L30 30V56Z M34 56V34L38 24L42 34V56Z M46 56V40L51 32L56 40V56Z`},
  /* ——— Italy Foods ——— */
  "mercato-centrale":{label:"Mercato Centrale", chapter:"Foods",
    line:`M6 54H58 M10 54V28H54V54
      M10 28L32 12L54 28
      M16 28V54 M24 28V54 M32 28V54 M40 28V54 M48 28V54
      M14 36H22 M26 36H38 M42 36H50
      M14 44H22 M26 44H38 M42 44H50
      M18 32a2.5 2.5 0 0 1 5 0 M29.5 32a2.5 2.5 0 0 1 5 0 M41 32a2.5 2.5 0 0 1 5 0
      M8 28H12 M52 28H56`,
    fill:`M10 54V28L32 12L54 28V54Z`},
  /* ——— Italy Visit ——— */
  "spanish-steps":{label:"Spanish Steps", chapter:"Visit",
    line:`M8 56H56
      M12 56H52 L46 48H18 Z
      M16 48H48 L42 40H22 Z
      M20 40H44 L38 32H26 Z
      M24 32H40 L36 24H28 Z
      M26 24H38 L34 16H30 Z
      M28 16H36 V10 H28 Z
      M30 10V6 H34 V10
      M22 52H42 M24 44H40 M26 36H38 M28 28H36`,
    fill:`M12 56H52L46 48H18L12 56Z M16 48H48L42 40H22Z M20 40H44L38 32H26Z M24 32H40L36 24H28Z M26 24H38L34 16H30Z M28 16H36V10H28Z`},
  "villa-borghese":{label:"Villa Borghese", chapter:"Visit",
    line:`M6 56H58 M10 56V40 H54 V56
      M14 40 L32 22 L50 40
      M20 40V56 M26 40V56 M32 40V56 M38 40V56 M44 40V56
      M18 48H46
      M12 34 Q16 26 20 34 M44 34 Q48 26 52 34
      M14 34V40 M18 34V40 M46 34V40 M50 34V40
      M28 28H36 M32 22V18`,
    fill:`M10 56V40L32 22L54 40V56Z`},
  "ponte-vecchio":{label:"Ponte Vecchio", chapter:"Visit",
    line:`M4 52 H60 M6 52 Q32 34 58 52
      M12 44 V26 H20 V44 M22 42 V22 H30 V42 M32 40 V20 H36 V40 M38 42 V22 H46 V42 M48 44 V26 H56 V44
      M12 26 H20 M22 22 H30 M32 20 H36 M38 22 H46 M48 26 H56
      M14 30 h4 v5 h-4 z M24 26 h4 v5 h-4 z M40 26 h4 v5 h-4 z M50 30 h4 v5 h-4 z
      M8 52 V58 M56 52 V58 M4 58 H14 M50 58 H60
      M16 52 Q32 42 48 52`,
    fill:`M12 44V26H20V44Z M22 42V22H30V42Z M32 40V20H36V40Z M38 42V22H46V42Z M48 44V26H56V44Z`},
  "piazza-navona":{label:"Piazza Navona", chapter:"Visit",
    line:`M16 10 H48 Q56 10 56 20 V44 Q56 54 48 54 H16 Q8 54 8 44 V20 Q8 10 16 10
      M32 18 V40 M24 26 H40
      M28 22 Q32 16 36 22
      M22 36 Q26 46 32 42 Q38 46 42 36
      M30 30 H34
      M14 16H22 M42 16H50`,
    fill:`M16 10H48Q56 10 56 20V44Q56 54 48 54H16Q8 54 8 44V20Q8 10 16 10Z`},
  "rialto-bridge":{label:"Rialto Bridge", chapter:"Visit",
    line:`M4 50 H60 M8 50 Q32 14 56 50
      M14 40 V28 H22 V40 M24 36 V24 H30 V36 M32 32 V18 H36 V32 M38 36 V24 H44 V36 M46 40 V28 H52 V40
      M16 32 h4 v4 h-4 z M26 28 h3 v4 h-3 z M39 28 h3 v4 h-3 z M48 32 h4 v4 h-4 z
      M10 50 V56 M54 50 V56 M4 56 H16 M48 56 H60
      M20 50 Q32 30 44 50`,
    fill:`M14 40V28H22V40Z M24 36V24H30V36Z M32 32V18H36V32Z M38 36V24H44V36Z M46 40V28H52V40Z`},
  "positano":{label:"Positano", chapter:"Visit",
    line:`M4 50 Q20 46 40 48 Q52 49 60 46 M4 56 H60
      M8 50 L12 36 H20 L18 50 Z
      M18 44 L22 28 H30 L28 48 Z
      M28 40 L32 22 H40 L38 46 Z
      M38 36 L42 18 H50 L48 44 Z
      M14 40h3v3h-3z M24 34h3v3h-3z M34 28h3v3h-3z M44 24h3v3h-3z
      M52 20 a3 3 0 1 1 0 0.1`,
    fill:`M8 50L12 36H20L18 50Z M18 44L22 28H30L28 48Z M28 40L32 22H40L38 46Z M38 36L42 18H50L48 44Z`},
  "galleria-vittorio":{label:"Galleria Vittorio Emanuele II", chapter:"Visit",
    line:`M8 56H56 M12 56V30 H52 V56
      M12 30 L32 10 L52 30
      M22 30V56 M42 30V56 M32 10V56
      M18 40H28 M36 40H46 M18 48H28 M36 48H46
      M28 22 H36 M30 16 H34
      M24 34a3 3 0 0 1 6 0 M34 34a3 3 0 0 1 6 0`,
    fill:`M12 56V30L32 10L52 30V56Z`},
  /* ——— Italy Seasonal ——— */
  "venice-carnival":{label:"Venice Carnival", chapter:"Seasonal",
    line:`M12 34 Q12 18 32 14 Q52 18 52 34 Q52 42 44 46 L40 54 H24 L20 46 Q12 42 12 34
      M20 30 Q24 26 28 30 M36 30 Q40 26 44 30
      M22 32 a3 3 0 1 1 0 0.1 M42 32 a3 3 0 1 1 0 0.1
      M28 38 Q32 42 36 38
      M32 14 V8 M26 10 H38
      M16 24 Q20 20 24 24 M40 24 Q44 20 48 24`,
    fill:`M12 34Q12 18 32 14Q52 18 52 34Q52 42 44 46L40 54H24L20 46Q12 42 12 34Z`},
  "palio-siena":{label:"Palio di Siena", chapter:"Seasonal",
    line:`M8 50 Q8 22 32 16 Q56 22 56 50 Q56 58 32 58 Q8 58 8 50
      M16 46 Q32 38 48 46
      M22 36 Q18 28 26 24 Q34 22 38 30 L42 28 L40 36 L34 34 Q30 40 22 36
      M38 30 L46 14 M44 16 H54 V26 H48
      M20 52 Q32 46 44 52`,
    fill:`M8 50Q8 22 32 16Q56 22 56 50Q56 58 32 58Q8 58 8 50Z`},
  "garni":{label:"Garni Temple", chapter:"Monuments",
    line:`M6 56H58 M10 56V38 H54 V56
      M10 38 L32 16 L54 38
      M16 38V56 M24 38V56 M32 38V56 M40 38V56 M48 38V56
      M14 46H50
      M28 28H36 M32 16V12
      M18 42h4v6h-4z M28 42h4v6h-4z M38 42h4v6h-4z M46 42h4v6h-4z`,
    fill:`M10 56V38L32 16L54 38V56Z`},
  "geghard":{label:"Geghard Monastery", chapter:"Monuments",
    line:`M4 50 L20 18 H44 L60 50 Z M4 50H60
      M22 50V30 H42 V50
      M26 30 L32 20 L38 30
      M32 20V14 M28 14H36
      M28 36H36 M28 42H36
      M30 36V48 M34 36V48
      M14 36 Q18 28 22 36 M42 36 Q46 28 50 36
      M8 44H16 M48 44H56`,
    fill:`M4 50L20 18H44L60 50Z`},
  "etchmiadzin":{label:"Etchmiadzin Cathedral", chapter:"Monuments",
    line:`M6 56H58 M12 56V40 H52 V56
      M18 40 L32 22 L46 40
      M32 22V14 M28 14H36 M30 14 Q32 8 34 14
      M16 40V34 Q20 28 24 34 V40
      M40 40V34 Q44 28 48 34 V40
      M22 48H42 M26 40V56 M38 40V56
      M28 44h3v5h-3z M33 44h3v5h-3z`,
    fill:`M12 56V40H18L32 22L46 40H52V56Z`},
  "amberd":{label:"Amberd Fortress", chapter:"Monuments",
    line:`M4 56 L14 40 H22 L18 56 Z M22 56 L28 34 H50 L54 56 Z
      M4 56H60
      M28 34V22 H36 V34 M38 34V26 H46 V34
      M28 22 L32 14 L36 22
      M14 40V34 H20 V40
      M30 40h4v6h-4z M40 40h4v6h-4z
      M8 48H16 M48 48H56
      M50 28 a2.5 2.5 0 1 1 0 0.1`,
    fill:`M4 56L14 40H22L18 56Z M22 56L28 34H50L54 56Z M28 34V22H36V34Z M38 34V26H46V34Z`},
  "zvartnots":{label:"Zvartnots Cathedral", chapter:"Monuments",
    line:`M32 10 a22 22 0 1 1 0 44 a22 22 0 1 1 0-44
      M32 18 a14 14 0 1 1 0 28 a14 14 0 1 1 0-28
      M18 32 H46 M32 18 V46
      M22 22 L42 42 M42 22 L22 42
      M14 32 a4 4 0 0 1 8 0 M42 32 a4 4 0 0 1 8 0
      M32 14 a4 4 0 0 1 0 8 M32 42 a4 4 0 0 1 0 8
      M6 56H58`,
    fill:`M32 10a22 22 0 1 1 0 44a22 22 0 1 1 0-44`},
  /* ——— Armenia Visit ——— */
  "cascade-yerevan":{label:"Cascade", chapter:"Visit",
    line:`M10 56H54
      M14 56 H50 L46 48 H18 Z
      M16 48 H48 L44 40 H20 Z
      M18 40 H46 L42 32 H22 Z
      M20 32 H44 L40 24 H24 Z
      M22 24 H42 L38 16 H26 Z
      M26 16 H38 V10 H26 Z
      M30 10 V6 H34 V10
      M28 12 H36
      M24 52H40 M26 44H38 M28 36H36 M30 28H34`,
    fill:`M14 56H50L46 48H18Z M16 48H48L44 40H20Z M18 40H46L42 32H22Z M20 32H44L40 24H24Z M22 24H42L38 16H26Z M26 16H38V10H26Z`},
  "republic-square":{label:"Republic Square", chapter:"Visit",
    line:`M10 40 Q10 20 32 16 Q54 20 54 40 Q54 52 32 54 Q10 52 10 40
      M16 36 H48 V48 H16 Z
      M20 36V48 M28 36V48 M36 36V48 M44 36V48
      M18 42H46
      M24 30 H40 V36 H24 Z
      M28 26 H36 V30 H28 Z
      M30 22 H34 V26 H30 Z`,
    fill:`M10 40Q10 20 32 16Q54 20 54 40Q54 52 32 54Q10 52 10 40Z`},
  "vernissage":{label:"Vernissage", chapter:"Visit",
    line:`M6 50H58 M8 50V28 H22 V50 M24 50V24 H40 V50 M42 50V28 H56 V50
      M8 28 L15 16 L22 28 M24 24 L32 10 L40 24 M42 28 L49 16 L56 28
      M12 34h6v8h-6z M28 30h8v10h-8z M46 34h6v8h-6z
      M14 38H18 M30 36H34 M48 38H52
      M10 44H20 M26 44H38 M44 44H54`,
    fill:`M8 50V28L15 16L22 28V50Z M24 50V24L32 10L40 24V50Z M42 50V28L49 16L56 28V50Z`},
  /* ——— Armenia Foods ——— */
  "gum-market":{label:"GUM Market", chapter:"Foods",
    line:`M8 52H56 M10 52V30 H54 V52
      M10 30 L32 14 L54 30
      M16 36 a5 6 0 1 1 0 0.1 M28 34 a5 7 0 1 1 0 0.1 M40 36 a5 6 0 1 1 0 0.1
      M18 42 H22 M30 42 H34 M42 42 H46
      M14 48H50
      M20 24 H24 M30 20 H34 M42 24 H46`,
    fill:`M10 52V30L32 14L54 30V52Z`},
  "dolmama":{label:"Dolmama", chapter:"Foods",
    line:`M10 40 Q10 20 32 16 Q54 20 54 40 Q54 52 32 54 Q10 52 10 40
      M18 34 Q22 28 28 34 Q24 38 18 34
      M26 30 Q32 24 38 30 Q34 36 26 30
      M34 34 Q40 28 46 34 Q42 40 34 34
      M22 42 Q28 38 34 42 Q30 46 22 42
      M16 28 Q20 24 24 28`,
    fill:`M10 40Q10 20 32 16Q54 20 54 40Q54 52 32 54Q10 52 10 40Z`},
  "pandok-yerevan":{label:"Pandok Yerevan", chapter:"Foods",
    line:`M8 52H56 M12 52V40 H52 V52
      M16 40 L20 16 M24 40 L28 14 M32 40 L36 16 M40 40 L44 14 M48 40 L52 18
      M18 22 H22 M26 20 H30 M34 22 H38 M42 20 H46 M50 24 H54
      M14 44H50
      M20 48H24 M30 48H34 M40 48H44`,
    fill:`M12 52V40H52V52Z M16 40L20 16H22L18 40Z M24 40L28 14H30L26 40Z M32 40L36 16H38L34 40Z M40 40L44 14H46L42 40Z M48 40L52 18H54L50 40Z`},
  "sherep":{label:"Sherep", chapter:"Foods",
    line:`M8 44 Q8 28 32 24 Q56 28 56 44 Q56 54 32 56 Q8 54 8 44
      M16 40 Q24 32 40 34 Q48 36 50 42 Q44 48 28 46 Q18 44 16 40
      M40 34 L48 28 M46 30 L52 32
      M22 38 a2 2 0 1 1 0 0.1
      M14 50H50`,
    fill:`M8 44Q8 28 32 24Q56 28 56 44Q56 54 32 56Q8 54 8 44Z`},
  "lavash":{label:"Lavash", chapter:"Foods",
    line:`M10 28 Q18 16 32 14 Q46 16 54 28 Q56 40 48 48 Q32 54 16 48 Q8 40 10 28
      M16 30 Q24 22 32 20 Q40 22 48 30
      M18 38 Q28 34 40 36 Q46 38 48 42
      M22 44 Q32 42 42 44
      M28 26 H36`,
    fill:`M10 28Q18 16 32 14Q46 16 54 28Q56 40 48 48Q32 54 16 48Q8 40 10 28Z`},
  "in-vino":{label:"In Vino", chapter:"Foods",
    line:`M14 12 H28 V20 Q28 28 22 34 V50 H20 V34 Q14 28 14 20 Z
      M16 12V8 H26 V12 M18 20H24 M18 28H24
      M36 28 H50 V52 H36 Z
      M38 28 Q38 20 43 18 Q48 20 48 28
      M40 36H46 M40 42H46 M40 48H46
      M42 18V12 M8 56H56`,
    fill:`M14 12H28V20Q28 28 22 34V50H20V34Q14 28 14 20Z M36 28H50V52H36Z`},
  "the-club":{label:"The Club", chapter:"Foods",
    line:`M10 56 V22 H54 V56 M10 22 L32 8 L54 22
      M24 56 V34 H40 V56
      M28 44 a3.5 3.5 0 1 1 0 0.1
      M18 30 H28 M36 30 H46
      M20 34 H26 M38 34 H44
      M30 14 H34
      M46 42 Q50 36 54 40 M52 38 L56 28 M54 30 a2 2 0 1 1 0 0.1`,
    fill:`M10 56V22L32 8L54 22V56Z`},
  "pak-shuka":{label:"Pak Shuka", chapter:"Foods",
    line:`M8 48 H28 V28 H8 Z M12 28 L18 18 L24 28
      M36 48 H56 V28 H36 Z M40 28 L46 16 L52 28
      M20 52 H44 V40 H20 Z
      M12 34h8v8h-8z M40 34h8v8h-8z
      M24 44h6v4h-6z M34 44h6v4h-6z
      M14 38H18 M42 38H46
      M6 56H58`,
    fill:`M8 48V28H28V48Z M36 48V28H56V48Z M20 52V40H44V52Z`},
  "caucasus-pandok":{label:"Caucasus Pandok", chapter:"Foods",
    line:`M8 48 H56 V54 H8 Z
      M14 48 V36 H26 V48 M28 48 V32 H36 V48 M38 48 V36 H50 V48
      M16 36 Q20 28 24 36 M30 32 Q32 24 34 32 M40 36 Q44 28 48 36
      M18 40H22 M30 38H34 M42 40H46
      M12 28 H20 M28 22 H36 M44 28 H52
      M6 56H58`,
    fill:`M8 48H56V54H8Z M14 48V36H26V48Z M28 48V32H36V48Z M38 48V36H50V48Z`},
  "dargett":{label:"Dargett Craft Beer", chapter:"Foods",
    line:`M16 22 H34 V30 Q34 50 25 54 H25 Q16 50 16 30 Z
      M18 22 V16 H32 V22 M20 30 H30 M20 38 H30 M20 46 H28
      M40 26 H50 V22 H54 V30 H50 V50 H40 V30 H44 V26
      M42 34 H48 M42 42 H48
      M8 58 H56
      M46 14 a3 3 0 1 1 0 0.1`,
    fill:`M16 22H34V30Q34 50 25 54Q16 50 16 30Z M40 26H50V50H40Z`},
  "wine-days":{label:"Yerevan Wine Days", chapter:"Seasonal",
    line:`M22 30 H38 V36 Q38 50 30 54 H30 Q22 50 22 36 Z
      M24 30 V24 H36 V30 M26 36 H34 M26 44 H34
      M10 14 H54 V22 H10 Z
      M14 14 L20 6 H44 L50 14
      M18 8 H46 M22 10 H42
      M30 22 V30
      M8 58 H56 M18 58 V54 H46 V58`,
    fill:`M22 30H38V36Q38 50 30 54Q22 50 22 36Z M10 14H54V22H10Z`},

  /* ——— Georgia Monuments ——— */
  "svetitskhoveli":{label:"Svetitskhoveli Cathedral", chapter:"Monuments",
    line:`M6 56H58 M12 56V40 H52 V56
      M16 40 L32 18 L48 40
      M32 18V10 M28 10H36 M30 10 Q32 4 34 10
      M18 40V34 Q22 28 26 34 V40
      M38 40V34 Q42 28 46 34 V40
      M22 48H42 M26 40V56 M38 40V56
      M28 44h3v5h-3z M33 44h3v5h-3z
      M20 36H24 M40 36H44`,
    fill:`M12 56V40H16L32 18L48 40H52V56Z`},
  "narikala":{label:"Narikala Fortress", chapter:"Monuments",
    line:`M4 56 L10 44 H18 L14 56 Z M18 56 L22 38 H50 L54 56 Z
      M4 56H60
      M22 38V26 H30 V38 M32 38V22 H42 V38 M44 38V28 H50 V38
      M22 26 L26 18 L30 26
      M32 22 L37 12 L42 22
      M12 44V38 H18 V44
      M24 44h4v6h-4z M36 44h4v6h-4z M46 44h3v5h-3z
      M8 50H16 M52 50H58
      M48 16 a2.5 2.5 0 1 1 0 0.1`,
    fill:`M4 56L10 44H18L14 56Z M18 56L22 38H50L54 56Z M22 38V26H30V38Z M32 38V22H42V38Z M44 38V28H50V38Z`},
  "gergeti":{label:"Gergeti Trinity Church", chapter:"Monuments",
    line:`M4 50 L24 14 L32 28 L40 10 L60 50 Z M4 50H60
      M26 50V34 H38 V50
      M28 34 L32 24 L36 34
      M32 24V18 M29 18H35 M30 18 Q32 12 34 18
      M30 40H34 M29 46H35
      M14 40 Q18 32 22 40 M42 38 Q46 30 50 38`,
    fill:`M4 50L24 14L32 28L40 10L60 50Z M26 50V34H38V50Z`},
  "gelati":{label:"Gelati Monastery", chapter:"Monuments",
    line:`M6 56H58 M10 56V42 H54 V56
      M14 42 L22 28 L30 42 M34 42 L42 24 L50 42
      M22 28V22 M20 22H24 M21 22 Q22 16 23 22
      M42 24V16 M39 16H45 M40 16 Q42 10 44 16
      M18 48H28 M36 48H50
      M20 42V56 M26 42V56 M38 42V56 M46 42V56
      M22 50h3v4h-3z M40 50h4v4h-4z`,
    fill:`M10 56V42H14L22 28L30 42H34L42 24L50 42H54V56Z`},
  "sameba":{label:"Holy Trinity Cathedral", chapter:"Monuments",
    line:`M6 58H58 M12 58V44 H52 V58
      M20 44 L32 8 L44 44
      M32 8V4 M28 4H36 M30 4 Q32 1 34 4
      M14 44V36 L20 28 L26 36 V44
      M38 44V36 L44 28 L50 36 V44
      M26 44V58 M38 44V58
      M24 50H40
      M28 48h3v5h-3z M33 48h3v5h-3z
      M16 40H20 M44 40H48`,
    fill:`M12 58V44H20L32 8L44 44H52V58Z`},
  /* ——— Georgia Visit ——— */
  "old-tbilisi":{label:"Old Tbilisi sulfur baths", chapter:"Visit",
    line:`M6 52H58 M8 52V40 H56 V52
      M12 40 Q16 22 22 40 M24 40 Q28 18 34 40 M36 40 Q40 22 46 40 M48 40 Q52 26 56 40
      M16 28 a2 2 0 1 1 0 0.1 M28 24 a2 2 0 1 1 0 0.1 M40 28 a2 2 0 1 1 0 0.1 M52 30 a1.8 1.8 0 1 1 0 0.1
      M14 46H22 M26 46H34 M38 46H46
      M10 56H54`,
    fill:`M8 52V40Q16 22 22 40Q28 18 34 40Q40 22 46 40Q52 26 56 40V52Z`},
  "kazbegi":{label:"Kazbegi / Stepantsminda", chapter:"Visit",
    line:`M4 52 L22 16 Q26 10 30 16 L38 30 L46 20 Q48 16 50 20 L60 52 Z
      M4 52H60
      M28 52V40 H36 V52
      M30 40 L32 34 L34 40
      M32 34V30 M30 30H34
      M18 36 Q22 28 26 36 M42 34 Q46 26 50 34
      M48 12 a3 3 0 1 1 0 0.1`,
    fill:`M4 52L22 16Q26 10 30 16L38 30L46 20Q48 16 50 20L60 52Z`},
  "svaneti":{label:"Ushguli", chapter:"Visit",
    line:`M4 56H60
      M8 56V28 H16 V56 M18 56V20 H28 V56 M30 56V32 H38 V56 M40 56V16 H52 V56
      M8 28 L12 20 L16 28 M18 20 L23 8 L28 20 M30 32 L34 24 L38 32 M40 16 L46 4 L52 16
      M10 40h4v8h-4z M21 36h4v10h-4z M33 42h3v6h-3z M44 34h4v12h-4z
      M12 48H14 M23 48H25 M45 48H48`,
    fill:`M8 56V28H16V56Z M18 56V20H28V56Z M30 56V32H38V56Z M40 56V16H52V56Z`},
  "prometheus-cave":{label:"Prometheus Cave", chapter:"Visit",
    line:`M8 54 H56 V58 H8 Z
      M10 54 Q10 20 32 12 Q54 20 54 54
      M18 54 Q18 30 32 24 Q46 30 46 54
      M22 28 L24 40 M28 22 L30 38 M36 22 L34 38 M42 28 L40 40
      M24 48 a3 4 0 1 1 0 0.1 M36 46 a3 4 0 1 1 0 0.1
      M32 12V8`,
    fill:`M10 54Q10 20 32 12Q54 20 54 54H10Z`},
  "batumi-boulevard":{label:"Batumi Boulevard", chapter:"Visit",
    line:`M4 46 Q20 42 40 44 Q52 45 60 42 M4 54 H60 M4 50 H60
      M12 46 V28 M10 28 Q12 18 14 28 M8 32 H16
      M26 46 V22 M24 22 Q26 10 28 22 M22 26 H30
      M42 46 V30 M40 30 Q42 20 44 30 M38 34 H46
      M52 18 a3 3 0 1 1 0 0.1
      M16 40H20 M30 38H34 M46 40H50`,
    fill:`M12 46V28Q12 18 14 28H10ZM26 46V22Q26 10 28 22H24ZM42 46V30Q42 20 44 30H40Z`},
  /* ——— Georgia Foods ——— */
  "dry-bridge":{label:"Dry Bridge Market", chapter:"Foods",
    line:`M4 48 H60 M8 48 Q32 28 56 48
      M14 42 V26 H22 V42 M24 40 V22 H32 V40 M34 40 V22 H42 V40 M44 42 V26 H52 V42
      M14 26 L18 16 L22 26 M24 22 L28 12 L32 22 M34 22 L38 12 L42 22 M44 26 L48 16 L52 26
      M16 32h4v5h-4z M26 28h4v5h-4z M36 28h4v5h-4z M46 32h4v5h-4z
      M10 48 V56 M54 48 V56 M4 56 H16 M48 56 H60
      M18 48 Q32 36 46 48`,
    fill:`M14 42V26H22V42Z M24 40V22H32V40Z M34 40V22H42V40Z M44 42V26H52V42Z`},
  "dezertirebi":{label:"Deserter's Bazaar", chapter:"Foods",
    line:`M6 54H58 M10 54V32 H54 V54
      M10 32 L32 14 L54 32
      M16 32V54 M24 32V54 M32 32V54 M40 32V54 M48 32V54
      M14 40 H22 M26 40 H38 M42 40 H50
      M14 48 H22 M26 48 H38 M42 48 H50
      M18 36 a2.5 2.5 0 0 1 5 0 M29.5 36 a2.5 2.5 0 0 1 5 0 M41 36 a2.5 2.5 0 0 1 5 0
      M20 24 H24 M30 20 H34 M42 24 H46`,
    fill:`M10 54V32L32 14L54 32V54Z`},
  "rustaveli-cafes":{label:"Rustaveli Avenue cafés", chapter:"Foods",
    line:`M8 56 V24 H56 V56 M8 24 L32 8 L56 24
      M18 56 V36 H30 V56 M34 56 V36 H46 V56
      M20 44 a3 3 0 1 1 0 0.1 M36 44 a3 3 0 1 1 0 0.1
      M14 30 H26 M38 30 H50
      M16 34 H24 M40 34 H48
      M28 14 H36
      M22 50 H26 M38 50 H42
      M48 40 Q52 34 56 38 M54 36 L58 28`,
    fill:`M8 56V24L32 8L56 24V56Z`},
  "kutaisi-market":{label:"Kutaisi central market", chapter:"Foods",
    line:`M6 52H58 M10 52V34 H54 V52
      M10 34 L18 22 L26 34 M28 34 L36 18 L44 34 M46 34 L52 24 L58 34
      M14 40 a4 5 0 1 1 0 0.1 M26 38 a4 6 0 1 1 0 0.1 M38 40 a4 5 0 1 1 0 0.1 M48 40 a3.5 4.5 0 1 1 0 0.1
      M16 46 H22 M28 46 H34 M40 46 H46
      M12 56H52`,
    fill:`M10 52V34L18 22L26 34H28L36 18L44 34H46L52 24L58 34V52H10Z`},
  "signagi-wine":{label:"Sighnaghi wine terraces", chapter:"Foods",
    line:`M8 50 Q16 42 28 44 Q36 46 40 40 Q48 34 56 38
      M8 54 H56 M10 46 H20 M24 44 H34 M38 40 H50
      M22 36 H38 V42 Q38 54 30 58 H30 Q22 54 22 42 Z
      M24 36 V30 H36 V36 M26 42 H34 M26 50 H34
      M42 28 Q46 20 50 28 Q48 34 42 28
      M44 22 L48 14 M46 16 H52`,
    fill:`M22 36H38V42Q38 54 30 58Q22 54 22 42Z`},
  /* ——— Georgia Seasonal ——— */
  "tbilisoba":{label:"Tbilisoba", chapter:"Seasonal",
    line:`M10 48 H54 V54 H10 Z
      M16 48 V34 H24 V48 M26 48 V28 H38 V48 M40 48 V34 H50 V48
      M16 34 L20 24 L24 34 M26 28 L32 14 L38 28 M40 34 L45 24 L50 34
      M32 14 V8 M28 10 H36
      M20 40H22 M30 36H34 M44 40H46
      M48 18 a3 3 0 1 1 0 0.1
      M6 58 H58
      M12 30 Q14 22 18 28 M46 28 Q50 20 54 26`,
    fill:`M10 48H54V54H10Z M16 48V34H24V48Z M26 48V28H38V48Z M40 48V34H50V48Z`},
  /* ——— AM / IT gaps ——— */
  "sevanavank":{label:"Sevanavank", chapter:"Visit",
    line:`M4 48 Q20 44 40 46 Q52 47 60 44 M4 54 H60
      M16 48 V34 H26 V48 M28 48 V30 H40 V48
      M16 34 L21 22 L26 34 M28 30 L34 16 L40 30
      M21 22 V16 M19 16H23 M20 16 Q21 12 22 16
      M34 16 V10 M31 10H37 M32 10 Q34 4 36 10
      M18 40H24 M30 38H38
      M12 44H20 M44 44H54`,
    fill:`M16 48V34L21 22L26 34V48Z M28 48V30L34 16L40 30V48Z`},
  "testaccio-market":{label:"Mercato di Testaccio", chapter:"Foods",
    line:`M6 52H58 M10 52V30 H54 V52
      M10 30 H54 M10 26 H54
      M16 30V52 M24 30V52 M32 30V52 M40 30V52 M48 30V52
      M14 38 H22 M26 38 H38 M42 38 H50
      M14 46 H22 M26 46 H38 M42 46 H50
      M18 34 a2.5 2.5 0 0 1 5 0 M29.5 34 a2.5 2.5 0 0 1 5 0 M41 34 a2.5 2.5 0 0 1 5 0
      M20 22 H24 M30 20 H34 M42 22 H46`,
    fill:`M10 52V30H54V52Z`},
  "porta-palazzo":{label:"Porta Palazzo Market", chapter:"Foods",
    line:`M4 50H60 M6 50V32 H20 V50 M22 50V28 H42 V50 M44 50V32 H58 V50
      M6 32 L13 18 L20 32 M22 28 L32 12 L42 28 M44 32 L51 18 L58 32
      M10 38h6v8h-6z M26 34h8v10h-8z M48 38h6v8h-6z
      M12 42H16 M28 40H34 M50 42H54
      M8 46H18 M24 46H40 M46 46H56
      M8 56H56`,
    fill:`M6 50V32L13 18L20 32V50Z M22 50V28L32 12L42 28V50Z M44 50V32L51 18L58 32V50Z`}
};

/* Chapter graphic marks when a place has no custom landmark icon (never a bare pin). */
window.WI_ICON_CHAPTER_FALLBACK = {
  Monuments: {
    label: "Monument",
    chapter: "Monuments",
    line: `M10 54H54 M16 54V28H48V54 M20 28V18H44V28 M24 18V12H40V18 M18 12H46 M28 36H36V54 M22 40H26 M38 40H42 M22 46H26 M38 46H42`,
    fill: `M20 28H44V18H20Z M16 54V28H48V54H16Z`
  },
  Fountains: {
    label: "Fountain",
    chapter: "Fountains",
    line: `M32 10c0 8-10 12-10 20a10 10 0 0 0 20 0c0-8-10-12-10-20z M18 52H46 M22 46H42 M26 40H38`,
    fill: `M32 14c-2 6-8 10-8 16a8 8 0 0 0 16 0c0-6-6-10-8-16z`
  },
  "Natural wonders": {
    label: "Nature",
    chapter: "Natural wonders",
    line: `M8 48L24 20L32 34L40 16L56 48Z M8 52H56`,
    fill: `M8 48L24 20L32 34L40 16L56 48Z`
  },
  Foods: {
    label: "Food",
    chapter: "Foods",
    line: `M12 38c0-10 8-16 20-16s20 6 20 16v4H12v-4z M18 28c2-6 8-10 14-10s12 4 14 10 M20 48H44 M24 52H40`,
    fill: `M14 38c0-8 7-14 18-14s18 6 18 14v2H14v-2z`
  },
  Festivals: {
    label: "Festival",
    chapter: "Festivals",
    line: `M32 8L36 20H48L38 28L42 40L32 32L22 40L26 28L16 20H28Z M18 50H46 M24 54H40`,
    fill: `M32 12L35 21H44L37 27L40 36L32 30L24 36L27 27L20 21H29Z`
  },
  Seasonal: {
    label: "Seasonal",
    chapter: "Seasonal",
    line: `M32 10v6 M32 48v6 M10 32h6 M48 32h6 M16 16l4 4 M44 44l4 4 M48 16l-4 4 M16 48l4-4 M32 20a12 12 0 1 1 0 24a12 12 0 1 1 0-24`,
    fill: `M32 22a10 10 0 1 1 0 20a10 10 0 1 1 0-20`
  },
  Visit: {
    label: "Visit",
    chapter: "Visit",
    line: `M10 46H54 M14 46V34L24 22L32 30L42 16L50 34V46 M24 46V38H28V46 M36 46V40H40V46`,
    fill: `M14 46V34L24 22L32 30L42 16L50 34V46H14Z`
  },
};
window.WI_ICON_FALLBACK = window.WI_ICON_CHAPTER_FALLBACK.Visit;

window.wiIconDef = function(name){
  if (WI_ICONS && WI_ICONS[name]) return WI_ICONS[name];
  /* Prefer chapter graphic from place data when available */
  let chapter = null;
  try {
    if (typeof window.stampdPlaceChapter === "function") chapter = window.stampdPlaceChapter(name);
  } catch (_) {}
  const fb = (chapter && WI_ICON_CHAPTER_FALLBACK[chapter]) || WI_ICON_FALLBACK;
  return Object.assign({ label: name }, fb);
};

window.wiIcon = function(name,{size=64,stroke="currentColor",sw=2.4,cls=""}={}){
  const i = wiIconDef(name);
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${i.line}"/></svg>`;
};
/* svg fragment (no outer svg) for embedding inside other svgs */
window.wiIconG = function(name,{x=0,y=0,size=64,stroke="#000",sw=2.4,fill=null,offset=0}={}){
  const i=wiIconDef(name), k=size/64;
  const f = fill ? `<path d="${i.fill}" fill="${fill}" fill-opacity="0.7" stroke="none" transform="translate(${offset/k} ${offset/k})"/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${k})">${f}<path d="${i.line}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
};
