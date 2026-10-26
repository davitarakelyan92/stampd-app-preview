# Stampd places — AM + IT content dataset (v3)

**Files:**
- `places.json` · **Updated:** 26 Oct 2026 (Asia/Yerevan) · **version 3**
- `countries.json` · same `countries[]` objects as inside `places.json` (Mos may load either)
- Photos: `app-preview/assets/places/<id>.jpg`

**System:** WGS84 decimal degrees · sources: OSM Nominatim, Wikipedia, official festival sites (cited per row)

## Mos keys (intact)

`home`, `places[]` (`id`, `name`, `country`, `lat`, `lng`, `description`, `photo`, `chapter`, …), `countries[]` (`id`, `name`, `family`, `cloth_hex`, `status`, `lat`, `lng`).

### Chapter strings (album chips — exact)
- Monuments → `Monuments`
- eat → `Foods`
- visit → `Visit`
- seasonal → `Seasonal`

### Cover UI requirement (Davit via Nar — Mos builds; do not treat as done in app.js)

Documented on `cover_ui` in both JSON files:
- Show **country name only** on each passport cover (not the Stampd / Pin Stamp logo lockup as the cover title)
- **Remove** colour/family name and hex labels from the cover face (no “family red”, no `#8B1E2D` on the cover UI)

## Counts (exact)

| Country | Monuments | Foods | Visit | Seasonal | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Armenia (AM) | 5 | 10 | 4 | 1 | **20** |
| Italy (IT) | 8 | 3 | 7 | 2 | **20** |
| sample_icons (FR/IN/TW) | — | — | — | — | **3** (eiffel, taj, lantern) |
| **Grand total places** |  |  |  |  | **43** |

## Seasonal entries

| id | seasonal_label | country | host / reference | source |
| --- | --- | --- | --- | --- |
| wine-days | **Wine days** | AM | Yerevan — Saryan / Tumanyan / Moskovyan (approx Saryan St) | [yerewinedays.am](https://www.yerewinedays.am/en/yerevan-wine-days/) · [Wikipedia · Yerevan Wine Days](https://en.wikipedia.org/wiki/Yerevan_Wine_Days) — official name «Yerevan Wine Days»; usually first Fri–Sun of June (2026: 5–7 Jun) |
| venice-carnival | Venice Carnival | IT | Piazza San Marco reference | [carnevale.venezia.it](https://carnevale.venezia.it/en/) |
| palio-siena | Palio di Siena | IT | Piazza del Campo | [Wikipedia · Palio di Siena](https://en.wikipedia.org/wiki/Palio_di_Siena) — usually 2 Jul & 16 Aug |
| lantern | Lantern Festival | TW | sample_icons only; CKS Memorial Hall approx | (prior v2) |

## Home

| Place | lat | lng | Source |
| --- | ---: | ---: | --- |
| Yerevan | 40.1777 | 44.5126 | OSM Nominatim · Yerevan |

## Armenia places (20)

| id | name | city | chapter | lat | lng | precision | photo |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| caucasus-pandok | Caucasus Pandok | Yerevan | Foods | 40.1795 | 44.5228 | venue | `assets/places/caucasus-pandok.jpg` |
| dargett | Dargett Craft Beer | Yerevan | Foods | 40.1836 | 44.5081 | venue | `assets/places/dargett.jpg` |
| dolmama | Dolmama | Yerevan | Foods | 40.1805 | 44.5159 | venue | `assets/places/dolmama.jpg` |
| gum-market | GUM Market | Yerevan | Foods | 40.1674 | 44.5149 | venue | `assets/places/gum-market.jpg` |
| in-vino | In Vino | Yerevan | Foods | 40.1871 | 44.5089 | venue | `assets/places/in-vino.jpg` |
| lavash | Lavash | Yerevan | Foods | 40.1831 | 44.5163 | venue | `assets/places/lavash.jpg` |
| pak-shuka | Pak Shuka | Yerevan | Foods | 40.1787 | 44.5039 | venue | `assets/places/pak-shuka.jpg` |
| pandok-yerevan | Pandok Yerevan | Yerevan | Foods | 40.179 | 44.5101 | venue | `assets/places/pandok-yerevan.jpg` |
| sherep | Sherep | Yerevan | Foods | 40.1784 | 44.5111 | venue | `assets/places/sherep.jpg` |
| the-club | The Club | Yerevan | Foods | 40.1866 | 44.5119 | venue | `assets/places/the-club.jpg` |
| amberd | Amberd Fortress | Byurakan area | Monuments | 40.3885 | 44.2263 | venue | `assets/places/amberd.jpg` |
| etchmiadzin | Etchmiadzin Cathedral | Vagharshapat | Monuments | 40.1618 | 44.2911 | venue | `assets/places/etchmiadzin.jpg` |
| garni | Garni Temple | Garni | Monuments | 40.1123 | 44.7302 | venue | `assets/places/garni.jpg` |
| geghard | Geghard Monastery | Goght area | Monuments | 40.1403 | 44.8184 | venue | `assets/places/geghard.jpg` |
| zvartnots | Zvartnots Cathedral | near Vagharshapat | Monuments | 40.1651 | 44.3371 | venue | `assets/places/zvartnots.jpg` |
| wine-days | Yerevan Wine Days | Yerevan | Seasonal | 40.1869 | 44.509 | approximate | `assets/places/wine-days.jpg` |
| ararat | Mount Ararat | Artashat area | Visit | 39.8784 | 44.5763 | approximate | `assets/places/ararat.jpg` |
| cascade-yerevan | Cascade | Yerevan | Visit | 40.1908 | 44.5142 | venue | `assets/places/cascade-yerevan.jpg` |
| republic-square | Republic Square | Yerevan | Visit | 40.1785 | 44.5139 | venue | `assets/places/republic-square.jpg` |
| vernissage | Vernissage | Yerevan | Visit | 40.1746 | 44.52 | venue | `assets/places/vernissage.jpg` |

## Italy places (20)

| id | name | city | chapter | lat | lng | precision | photo |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| gelato | Gelato | Rome | Foods | 41.8989 | 12.4731 | city | `assets/places/gelato.jpg` |
| mercato-centrale | Mercato Centrale | Florence | Foods | 43.7766 | 11.2532 | venue | `assets/places/mercato-centrale.jpg` |
| pizza | Pizza al taglio | Naples | Foods | 40.8359 | 14.2486 | city | `assets/places/pizza.jpg` |
| castel-santangelo | Castel Sant'Angelo | Rome | Monuments | 41.9031 | 12.4663 | venue | `assets/places/castel-santangelo.jpg` |
| colosseum | Colosseum | Rome | Monuments | 41.8909 | 12.4919 | venue | `assets/places/colosseum.jpg` |
| duomo-milan | Milan Cathedral | Milan | Monuments | 45.4642 | 9.1916 | venue | `assets/places/duomo-milan.jpg` |
| florence-cathedral | Florence Cathedral | Florence | Monuments | 43.7731 | 11.2566 | venue | `assets/places/florence-cathedral.jpg` |
| pantheon | Pantheon | Rome | Monuments | 41.8986 | 12.4768 | venue | `assets/places/pantheon.jpg` |
| pompeii | Pompeii | Pompei | Monuments | 40.7498 | 14.4953 | venue | `assets/places/pompeii.jpg` |
| tower-of-pisa | Leaning Tower of Pisa | Pisa | Monuments | 43.723 | 10.3966 | venue | `assets/places/tower-of-pisa.jpg` |
| trevi | Trevi Fountain | Rome | Monuments | 41.901 | 12.4833 | venue | `assets/places/trevi.jpg` |
| palio-siena | Palio di Siena | Siena | Seasonal | 43.318 | 11.3314 | venue | `assets/places/palio-siena.jpg` |
| venice-carnival | Venice Carnival | Venice | Seasonal | 45.4343 | 12.3387 | approximate | `assets/places/venice-carnival.jpg` |
| galleria-vittorio | Galleria Vittorio Emanuele II | Milan | Visit | 45.4656 | 9.19 | venue | `assets/places/galleria-vittorio.jpg` |
| piazza-navona | Piazza Navona | Rome | Visit | 41.8989 | 12.4731 | venue | `assets/places/piazza-navona.jpg` |
| ponte-vecchio | Ponte Vecchio | Florence | Visit | 43.768 | 11.2532 | venue | `assets/places/ponte-vecchio.jpg` |
| positano | Positano | Positano | Visit | 40.6287 | 14.4855 | city | `assets/places/positano.jpg` |
| rialto-bridge | Rialto Bridge | Venice | Visit | 45.4381 | 12.3357 | venue | `assets/places/rialto-bridge.jpg` |
| spanish-steps | Spanish Steps | Rome | Visit | 41.9058 | 12.4825 | venue | `assets/places/spanish-steps.jpg` |
| villa-borghese | Villa Borghese | Rome | Visit | 41.9144 | 12.4848 | venue | `assets/places/villa-borghese.jpg` |

## sample_icons (not counted in AM+IT)

| id | name | city | chapter | lat | lng | precision | photo |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| lantern | Lantern Festival | Taipei | Seasonal | 25.0346 | 121.5218 | approximate | `assets/places/lantern.jpg` |
| eiffel | Eiffel Tower | Paris | Monuments | 48.8583 | 2.2945 | venue | `assets/places/eiffel.jpg` |
| taj | Taj Mahal | Agra | Monuments | 27.175 | 78.0421 | venue | `assets/places/taj.jpg` |

`catalog: "sample_icons"` on eiffel, taj, lantern. AM+IT rows use `catalog: "am_it"`.

## Countries / passports (12 including default)

Cloth families (locked showcase `06-covers.html`): blue `#1B2747` · red `#8B1E2D` · green `#1E3B32` · black `#1A1A1E` · orange `#7A3F18`.

| id | name | family | cloth_hex | status | lat | lng |
| --- | --- | --- | --- | --- | ---: | ---: |
| default | Default / unset | blue | #1B2747 | **live** | 40.1777 | 44.5126 |
| am | Armenia | red | #8B1E2D | **live** | 40.1777 | 44.5126 |
| jp | Japan | red | #8B1E2D | coming_soon | 35.6769 | 139.7639 |
| ge | Georgia | red | #8B1E2D | coming_soon | 41.6935 | 44.8014 |
| it | Italy | green | #1E3B32 | **live** | 41.8933 | 12.4829 |
| br | Brazil | green | #1E3B32 | coming_soon | -15.7940 | -47.8828 |
| ae | UAE | green | #1E3B32 | coming_soon | 24.4538 | 54.3774 |
| fr | France | blue | #1B2747 | coming_soon | 48.8589 | 2.3200 |
| us | USA | blue | #1B2747 | coming_soon | 38.8951 | -77.0364 |
| uk | United Kingdom | blue | #1B2747 | coming_soon | 51.5074 | -0.1278 |
| de | Germany | black | #1A1A1E | coming_soon | 52.5174 | 13.3951 |
| in | India | orange | #7A3F18 | coming_soon | 28.6139 | 77.2090 |

No Taiwan cloth row (lantern remains sample_icons only). Country points are **capitals** (default uses Yerevan placeholder).

## New ids needing icons.js or generic fallback

Mos: reuse stamp icons for `colosseum`, `trevi`, `pantheon`, `pizza`, `gelato`, `ararat`, `eiffel`, `taj`, `lantern`. All other ids need a new icon or generic placeholder:

- `duomo-milan`
- `florence-cathedral`
- `tower-of-pisa`
- `castel-santangelo`
- `pompeii`
- `mercato-centrale`
- `spanish-steps`
- `villa-borghese`
- `ponte-vecchio`
- `piazza-navona`
- `rialto-bridge`
- `positano`
- `galleria-vittorio`
- `venice-carnival`
- `palio-siena`
- `garni`
- `geghard`
- `etchmiadzin`
- `amberd`
- `zvartnots`
- `cascade-yerevan`
- `republic-square`
- `vernissage`
- `gum-market`
- `dolmama`
- `pandok-yerevan`
- `sherep`
- `lavash`
- `in-vino`
- `the-club`
- `pak-shuka`
- `caucasus-pandok`
- `dargett`
- `wine-days`

## Approximate / city / seasonal notes (distance UX)

1. **pizza** — city proxy (Naples / Plebiscito), not a shop  
2. **gelato** — city proxy (Rome / Navona), not a shop  
3. **positano** — town centroid  
4. **ararat** — Khor Virap viewpoint (AM), not Ararat summit (TR)  
5. **wine-days** — approximate Saryan Street; festival spans Saryan/Tumanyan/Moskovyan and moves layout yearly  
6. **venice-carnival** — Piazza San Marco reference; programme spreads citywide  
7. **lantern** — approximate festival reference (CKS Memorial Hall)  
8. **pompeii** — ticket / entrance area; site is large  
9. Several **AM Foods** photos are **representative dish / street / market** images, not restaurant dining-room shots — see `photo_note` on each row (dolmama, pandok-yerevan, sherep, lavash, in-vino, caucasus-pandok, dargett, the-club)

## Photo inventory

All 43 places have local `assets/places/<id>.jpg` (>10 KB). New downloads: **34** (plus 9 retained from v2). Licenses: Wikimedia Commons free licenses (CC BY / CC BY-SA / Public domain) only.

| id | path | bytes | credit | license | commons |
| --- | --- | ---: | --- | --- | --- |
| amberd | `assets/places/amberd.jpg` | 427,561 | Սարո Հովհաննիսյան · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:The_fortress_of_Amberd_2019-05-06.jpg |
| ararat | `assets/places/ararat.jpg` | 676,152 | Andrew Behesnilian ( MrAndrew47 ) · CC BY-SA 3.0 |  | https://commons.wikimedia.org/wiki/File%3AKhor_Virap_Monastery_and_Mount_Ararat%2C_Armenia.jpg |
| cascade-yerevan | `assets/places/cascade-yerevan.jpg` | 349,677 | Vyacheslav Argenberg · CC BY 4.0 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Yerevan%2C_Cascade_of_Yerevan%2C_Armenia.jpg |
| castel-santangelo | `assets/places/castel-santangelo.jpg` | 183,617 | Andreas Tille · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:RomaCastelSantAngelo.jpg |
| caucasus-pandok | `assets/places/caucasus-pandok.jpg` | 393,161 | Grasshalm · CC0 | CC0 | https://commons.wikimedia.org/wiki/File:Armenian_table_feast.jpg |
| colosseum | `assets/places/colosseum.jpg` | 675,213 | Nicholas Hartmann · CC BY-SA 4.0 |  | https://commons.wikimedia.org/wiki/File%3ARome_Colosseum_exterior_2.jpg |
| dargett | `assets/places/dargett.jpg` | 336,952 | Gnangcomapp · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:WA_beer_taps_gn1.jpg |
| dolmama | `assets/places/dolmama.jpg` | 285,300 | Rs4815 · CC BY-SA 3.0 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Armenian_dish_dolma_2.jpg |
| duomo-milan | `assets/places/duomo-milan.jpg` | 484,326 | Terragio67 · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Duomo_%28Milano%29_2022.jpg |
| eiffel | `assets/places/eiffel.jpg` | 1,449,375 | Benh LIEU SONG · Public domain |  | https://commons.wikimedia.org/wiki/File%3ATour_Eiffel_Wikimedia_Commons.jpg |
| etchmiadzin | `assets/places/etchmiadzin.jpg` | 95,358 | Author of the photo is Heretiq · Public domain | Public domain | https://commons.wikimedia.org/wiki/File:Echmiadzin-cathedral.jpg |
| florence-cathedral | `assets/places/florence-cathedral.jpg` | 529,825 | Livioandronico2013 · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Dome_of_Cattedrale_di_Santa_Maria_del_Fiore_%28Florence%29.jpg |
| galleria-vittorio | `assets/places/galleria-vittorio.jpg` | 387,605 | C messier · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Galleria_Vittorio_Emanuele_II_2382.jpg |
| garni | `assets/places/garni.jpg` | 291,518 | Diego Delso · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Templo_de_Garni%2C_Armenia%2C_2016-10-02%2C_DD_03.jpg |
| geghard | `assets/places/geghard.jpg` | 233,974 | Diego Delso · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Monasterio_de_Geghard%2C_Armenia%2C_2016-10-02%2C_DD_65-74_PAN.jpg |
| gelato | `assets/places/gelato.jpg` | 967,389 | Basilicofresco · CC BY-SA 4.0 |  | https://commons.wikimedia.org/wiki/File%3AGelato_artigianale_italiano%2C_Bertinelli.jpg |
| gum-market | `assets/places/gum-market.jpg` | 459,151 | Poshotenk · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Spices_at_GUM_Market_in_Yerevan%2C_Armenia.jpg |
| in-vino | `assets/places/in-vino.jpg` | 261,960 | RG72 · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Stokejo_kaj_butiko_de_la_vinfabriko_Areni_02.jpg |
| lantern | `assets/places/lantern.jpg` | 361,737 | Taiwankengo · CC BY-SA 4.0 |  | https://commons.wikimedia.org/wiki/File%3A2019_Taipei_Lantern_Festival_X.jpg |
| lavash | `assets/places/lavash.jpg` | 728,680 | Shaun Dunphy from Lindfield, United Kingdom · CC BY-SA 2.0 | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Traditional_lavash_bread_making_%285211763362%29.jpg |
| mercato-centrale | `assets/places/mercato-centrale.jpg` | 295,157 | Sailko · CC BY 3.0 | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Mercato_centrale_di_san_lorenzo_02.jpg |
| pak-shuka | `assets/places/pak-shuka.jpg` | 305,999 | Poshotenk · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Produce_market_in_Yerevan%2C_Armenia.jpg |
| palio-siena | `assets/places/palio-siena.jpg` | 489,558 | Ввласенко · CC BY-SA 3.0 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Rehearsal_for_the_Palio._Contrade_Civetta_%28Little_Owl%29._Siena%2C_Italy.jpg |
| pandok-yerevan | `assets/places/pandok-yerevan.jpg` | 382,255 | Armineaghayan · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Armenian_khorovats_barbecue_on_grill.jpg |
| pantheon | `assets/places/pantheon.jpg` | 728,196 | John Samuel · CC BY-SA 4.0 |  | https://commons.wikimedia.org/wiki/File%3APantheon_%28Rome%29_-_Exterior_01.jpg |
| piazza-navona | `assets/places/piazza-navona.jpg` | 511,641 | This Photo was taken by Wolfgang Moroder.  

Feel free to use my photos, but please mention me as the author and send me · CC BY-SA 3.0 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Piazza_Navona_Gange_fontana_dei_Fiumi_Roma.jpg |
| pizza | `assets/places/pizza.jpg` | 542,052 | Kos88 · CC BY-SA 4.0 |  | https://commons.wikimedia.org/wiki/File%3APizza_Margherita_in_Naples_2015.JPG |
| pompeii | `assets/places/pompeii.jpg` | 364,408 | Commonists · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Forum_%28Pompeii%29_and_the_Vesuvio.jpg |
| ponte-vecchio | `assets/places/ponte-vecchio.jpg` | 240,166 | Martin Falbisoner · CC BY-SA 3.0 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Ponte_Vecchio_at_dusk_1.JPG |
| positano | `assets/places/positano.jpg` | 486,860 | Bernard Gagnon · CC BY 4.0 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Positano_%28Italy%29_04.jpg |
| republic-square | `assets/places/republic-square.jpg` | 276,975 | Vyacheslav Argenberg · CC BY 4.0 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Yerevan%2C_Government_House%2C_Government_of_Armenia%2C_Republic_Square%2C_Armenia.jpg |
| rialto-bridge | `assets/places/rialto-bridge.jpg` | 403,812 | kallerna · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Ponte_di_Rialto_Venice_1.jpg |
| sherep | `assets/places/sherep.jpg` | 728,680 | Shaun Dunphy from Lindfield, United Kingdom · CC BY-SA 2.0 | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Traditional_lavash_bread_making_%285211763362%29.jpg |
| spanish-steps | `assets/places/spanish-steps.jpg` | 264,298 | Please credit "Family photos of Infrogmation" · CC BY 2.5 | CC BY 2.5 | https://commons.wikimedia.org/wiki/File:Spanish_Steps%2C_Rome%2C_September_1965.jpg |
| taj | `assets/places/taj.jpg` | 523,843 | Yann ; edited by King of Hearts · CC BY-SA 4.0 |  | https://commons.wikimedia.org/wiki/File%3ATaj_Mahal%2C_Agra%2C_India_edit2.jpg |
| the-club | `assets/places/the-club.jpg` | 326,450 | 23artashes · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Tumanyan_Street_Yerevan_37.jpg |
| tower-of-pisa | `assets/places/tower-of-pisa.jpg` | 377,411 | MHoser · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:The_Duomo_and_Tower_of_Pisa_at_sunrise.jpg |
| trevi | `assets/places/trevi.jpg` | 1,668,452 | Tomascastelazo · CC BY-SA 4.0 |  | https://commons.wikimedia.org/wiki/File%3AFontana_di_Trevi_by_TC.jpg |
| venice-carnival | `assets/places/venice-carnival.jpg` | 309,876 | Unofeld781 · CC BY-SA 3.0 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Carnevale_di_Venezia_Masks_2010.jpg |
| vernissage | `assets/places/vernissage.jpg` | 579,651 | Ji-Elle · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Yerevan_Vernissage-Souvenirs.jpg |
| villa-borghese | `assets/places/villa-borghese.jpg` | 319,380 | Diego Delso · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Templo_de_Asclepio%2C_Villa_Borghese%2C_Roma%2C_Italia%2C_2022-09-14%2C_DD_12.jpg |
| wine-days | `assets/places/wine-days.jpg` | 195,379 | Bogossi Production · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Yerevan_Wine_Days_Visitors.jpg |
| zvartnots | `assets/places/zvartnots.jpg` | 365,214 | Սարո Հովհաննիսյան · CC BY-SA 4.0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Zvartnots_Cathedral_2018-09-28.jpg |

## Rules followed

- Real places only; coords from Nominatim / Wikipedia / official pages — never invented  
- Descriptions original, visitor-friendly; no invented stats/prices/rankings  
- No VBET / past employer / client work  
- No personal data in files  
- Wine days = real **Yerevan Wine Days** (not a fictional festival)  
- Italy seasonals = Venice Carnival + Palio di Siena (sourced)

## UI FYI for Mos (unchanged product notes)

- Nav/label **Passport → Countries**
- Countries screen: cloth countries + **Coming Soon** (`status`)
- Stamp detail: icon · title · description · distance · lat/lng · photo
- Stamp card rows: image · name · collected date · **distance from you**


## Me screen
See [`me.json`](./me.json) and [`me-notes.md`](./me-notes.md) — sample profile, visited countries (passport covers), achievements.
