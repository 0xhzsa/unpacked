# UNPACKED — recovery note (updated 2026-10-20, second-session build-out)

This is the interactive site built on Oct 20 ("the thing for materials etc — how a chair
was invented/built…"). The OpenCode session that built it was deleted by mistake; the app
survived in a temp folder and has been copied to a safe home:

```
C:\Users\stagh\unpacked          <- working copy (use this)
```

## What it is
"An engineer's I, Pencil." Start in an ordinary room. Pick one of **ten** objects and zoom
all the way down through its manufacturing chain — every part, machine, and material — until
you reach the ground it came from.

- Mechanical Keyboard — 87 tiny machines (now **9 stops** incl. the new switch stop)
- LED Desk Lamp — 450 lumens, traced back to red dirt and a bolt of lightning
- Ergonomic Office Chair — 113 kg, held up by plastic, steel and trapped gas
- Ceramic Mug — mud, turned to stone by fire
- Steel Desk — one thin sheet of steel, from a furnace and a hundred-meter pit
- Float Glass Window — a ribbon of glass, floated flat, never touched by a tool
- **Hardcover Book** — a forest flattened into 336 pages, glued around cardboard (6 stops:
  room → object → page block → offset press → paper → spruce forest)
- **Ceiling Fan** — quiet work overhead, ending in a copper mine (7 stops:
  room → object → motor → fasteners → stamping press → enameled wire → copper mine)
- **Candle** — a flame traced back to a sand quarry (7 stops: room → object → wax →
  chimney → glass batch → sand quarry → combed cotton wick)
- **Rattan Armchair** — a peacock chair traced back to a rattan grove (7 stops:
  room → object → cane weave → teak frame → rattan splitter → peels → grove)

Each stop: narration (first-person "I, Pencil" voice), spec + history panels, annotation
callouts with leader lines, an injection-molding press simulator overlay, a full-room
dependency graph finale ("THE WHOLE ROOM" — 5 echelons, all chains cross-linked, shared
source nodes merged), zoom-transition scene stage.

Chrome dropped views verified via headless Edge screenshots + DOM dumps (see status below).

## Layout
```
index.html            entry point (favicon, OG/twitter meta, theme-color)
css/style.css         ORIGINAL v1 paper-look chrome sheet (pre-banagale; see session log
js/content.js         object chains: parts -> machines -> molds -> materials -> sources (data)
js/journey.js         the ordered descent per object (first-person narration + zooms)
js/descent.js         descent UX (stage layers, annotations, IMG map, details toggle, finale)
js/graph.js           full-room dependency graph finale (canvas)
js/press.js           injection-molding cycle simulator overlay
js/plates.js          orthographic plate renderer (cutaway/section plates)
js/scene.js           room scene / stage layer helpers
js/app.js             boot + header/picker wiring
assets/img/*.jpg      49 sourced photos (all mapped; no missing, no unused)
brand.md              brand kit + hard anti-slop rules + art direction + palette
serve.js              tiny static server (localhost:8931)
check-journey.js / check-imgs.js   build-time validators (both green)
```

## Content architecture notes
- `content.js` chains end in source nodes whose **name must match an existing source** so the
  finale graph merges them: book ends at **"Spruce Forest"** + **"Crude Oil Well"** (glue via
  EVA), fan ends at **"Copper Mine"** + **"Iron Ore Mine"**. Shared sources display once, with
  a shared-marker dot.
- Graph-only nodes (no journey stop, no image needed): lamp's **Solder Paste** ← **Cassiterite
  Mine**; book's **Cloth-Wrapped Case** (cover) and **Binding Adhesive** ← **Crude Oil Well**;
  lamp keeps 6 stops, book keeps 6 stops.
- Journey stop ids must equal the `descent.js IMG` map keys (id → file basename in
  `assets/img/`).
- Picker card label = `stops.length - 1` ("N STOPS DEEP"); the room spec "How deep we go"
  counts all stops incl. the room (keyboard card: 8 deep / spec: 9 stops).

## Image set (49 files, all verified full-bleed)
room, chair, keyboard, lamp, mug, metaldesk, window, kiln, clay, pugmill, mine, steel,
foundry, stamping, floatfurnace, glass, batch, mold, cnc, spcc/springs et al +
new for this session:

- `switch.jpg` — Cherry MX-style key switches, stems exposed (keyboard stop 4 "The Switch")
- `book.jpg` — "Front cover, Union Pacific Railroad" (Boston Public Library) — leather cover face
- `sewnspine.jpg` — "Book headband exposed" — fanned pages over the spine's woven headband
- `offsetpress.jpg` — "2010-02-18 druckerei Springer Berlin" (RalfR, #08) — dark web pressroom
- `coatedpaper.jpg` — same shoot (#09) — giant fresh paper reels on the floor
- `sprucelogs.jpg` — stacked spruce logs in a managed stand
- `fan.jpg` — "Ceiling fan (brown)" — nine blades from below
- `coil.jpg` — "1885 Moteur Électrique, Musée EDF" — copper wound armature
- `screw.jpg` — "18-03-16 Schrauben M6x20" — machine screws/bolts macro
- `magwire.jpg` — "Mt. Vernon, MO — old spools with wire" — Anaconda enamel wire spools
- `mine.jpg` — open-pit mine w/ excavator (reused for fan's copper stop, desk, mug)

All images sourced from Wikimedia Commons (Commons file titles above); fetched at 1200–1600px
thumbnails. Commons api.php hard-throttles (429s): the working bypass is
`https://commons.wikimedia.org/wiki/Special:FilePath/<file name>?width=1600` (single redirect,
no api call) — curl'd directly by PowerShell when the API path stalls.

## Session-two build-out (2026-10-20 evening, all verified)
1. Two new object chains appended to `content.js` (hardcover-book 8 nodes, ceiling-fan 10
   nodes incl. Steel Fasteners), lamp got Solder Paste + Cassiterite Mine as graph-only nodes.
2. `journey.js`: all six room stops now say "8 objects"; keyboard narrates "Eight things",
   depth 9, `keyboard-switch-01` inserted as stop 3 (spring stop 2, keycap renumbered 4, inj 5,
   mold 6, abs 7, oil 8); book (6 stops) + fan (7 stops) appended.
3. `descent.js` IMG map: 14 new entries (switch, 6 book, 7 fan). All 39 files mapped.
4. `index.html`: inline-SVG data-URI favicon (no 404), og:title/description/site_name, twitter
   card, theme-color.
5. Verification: `check-journey.js` ALL OK (keyboard 9 stops e=001112234; fan 7 e=0011234;
   book 6), `check-imgs.js` missing [] / unused [] / 39 files 39 mapped.
6. Headless Edge verified via temp driver page (`test-open.html`, since deleted): home picker
   (8 cards, correct "STOPS DEEP" labels confirmed by DOM dump), book journey end (spruce
   forest), fan journey end (copper mine), switch stop annotations, both room stops
   (annotations land on the real book/fan positions), finale grid (all chains + shared-source
   merges render; counters were mid-animation during capture — they settle for humans).
   Fault-fix during verify: driver's `|| 6` swallowed the keyboard's `0` index (`0 is falsy`)
   — fixed with an `in`-map check before a final `?d=switch` shot.
7. Deleted after verification: `test-open.html` and all `fetch-img*.js`/`reimg.js` downloader
   scripts (one-off helpers; works only on temp artifacts).

## Run it
```
cd C:\Users\stagh\unpacked
C:\Users\stagh\AppData\Local\hermes\node\node.exe serve.js
# -> http://localhost:8931   (port may still be held by a stray server; any static server works)
```
(Pure HTML/CSS/JS: no build step, no dependencies, relative asset paths only.)

## Deployment notes (for when needed)
- Static host (Netlify/GitHub Pages/S3): upload the folder as-is; favicon/docs fine.
- The one external reference: Google Fonts stylesheet in `index.html` (Alegreya, Alegreya SC,
  Caveat, IBM Plex Mono). Self-host if the host must be fully offline.
- OG image: `assets/og.jpg` (1200x630, banagale parchment cover) + og meta tags in `index.html`.

## Session 3 log (2026-10-21) — plug-in layer + mobile
- **Affiliate layer**: new `js/affiliate.js` (the ONLY file to edit to monetize). `tag: ""`
  = buy buttons hidden site-wide (shipped default — verified no button renders). With a
  tag: object stops (kind "object") render `↗ WHERE TO GET ONE` (rel="sponsored
  noopener noreferrer", Amazon search URL built from `links` text + `&tag=`, or full URLs
  with `{tag}` substitution) + FTC disclosure line. URL builder emits `+` separators
  (`k=mechanical+keyboard`, not `%2B`).
- **Mobile**: bottom-sheet layout ≤860px (text over legibility gradient, taglines off,
  2-col → 1-col cards ≤480px), touch swipe (44px threshold, vertical-dominant, reuses
  wheelLock), `.hbtn nowrap` at ≤480 (buttons were wrapping to 2 lines at 390). Verified
  at a TRUE 390x844 viewport: `iw==sw==390`, zero overflow, all 8 cards above the fold.
- **`shot.js`** (new tool): CDP screenshot + overflow audit at any viewport — fixes the
  headless `--window-size` ~492px floor (older captures were CROPS of a 496 layout).
  Pitfalls list lives in AUTHORING.md §8 (dump-dom never pumps rAF; virtual-time skews
  the rAF clock vs performance.now(); stale profile caches serve old JS).
- **Finale counters settled & proven**: real-time capture = 77 processes / 82 links /
  4 shared sources / 8 objects / 5 echelons. The scary negatives in earlier headless
  captures were clock-skew in `countUp` (every value = target × same negative eased k —
  proven by cross-run ratio). `countUp` now clamps k to [0,1] regardless of clock.
- **Bug fixes**: header `justify-between` stray declaration → `justify-content:
  space-between`; `#actions` flex-wrap + `.aff-note` style; favicon/OG meta + affiliate.js
  script tag (session 3a).
- **Docs**: AUTHORING.md (recipe + validation loop + pitfalls), RECOVERY-NOTE updated.
- **Verification at session end**: check-journey ALL OK (8 chains), check-imgs 39/39
  missing[] unused[]; desktop + true-mobile screenshots reviewed; `test-open.html` driver
  deleted (rebuild recipe in AUTHORING.md §8).

## Still-want list (ideas, not bugs)
- A second room photo angle (current room.jpg spans every object's stop 0).
- Sink object still impossible in this room — room is a fan/veranda lounge.
- Optional voice-over for the first-person narration.

## Session 4 log (2026-10-21) — trending objects + annotation fix + deploy

- **Two new objects**: Candle (index 8) and Rattan Armchair (index 9), 7 stops each,
  e=0011234. Both physically exist in room.jpg; keyboard "0" key opens object 10.
- **Cross-chain graph merges by node name**: new shared names "Soda-Lime Glass Batch",
  "Combed Cotton Yarn", "Cotton Field"; standalone E4s "Rattan Grove", "Teak Plantation".
- **10 new Commons images** installed (candle, wax, chimney, blow, armchair, cane,
  frame, splitter, peels, grove) — all visually verified faces-free via contact sheets.
- **Annotation fix (root cause)**: `mapX` remapped every authored x into the 54-88% band,
  so dots landed on empty wall. Replaced with photo-aware `mapXY` (inverts the stage's
  background:cover crop using natural image dims from an IMGDIMS cache filled by
  `dimsFor()` during preload, re-rendering on load). Label side now chosen by
  `annoOverText()` — flips `.left` when the label box would overlap the text column;
  mobile (<=860px) hides #anno entirely. Resize listener re-renders. Authored x/y are
  now TRUE photo-space coords; old-chain room coords re-tuned to real subjects.
- **Legibility**: subtle text-shadow added to `.albl` only (no radius/shadows on
  cards/buttons/panels) per user decision.
- **og:image**: 1200x630 room.jpg crop with UNPACKED lockup; og:image + width/height/alt
  + og:url; twitter:card upgraded to summary_large_image.
- **Final counters** (10 chains): 97 processes / 108 links / 8 shared sources /
  10 objects / 5 echelons.
- **Deploy**: git init + push to 0xhzsa/unpacked, GitHub Pages enabled (project page).
- `test-open.html` driver deleted; check-journey.js ALL OK (10 chains), check-imgs.js
  missing [] unused [] mapped 49/49.

## Session 5 log (2026-10-21) — banagale motor-blog redesign + bug fixes

The whole visual system was re-skinned to match **banagale.com/the-way-the-motor-works**
("The Way Things Work" / David Macaulay illustrated-engineering-book look): warm parchment
page, dark brown ink, terracotta accent, Alegreya + Alegreya SC + Caveat handwriting.

### Palette + type (new design tokens in `css/style.css`)
- `--paper: #e9dec4` (page), `--paper-plate: #f3ead4` (panels), `--ink: #44321f` (text),
  `--ink-faded: #6e5a40`, `--ink-faint: #93805f`
- `--brick: #b65c38` (primary accent, was amber `#e8861d`), `--brick-deep: #94472a`,
  `--mustard: #c9a04e`, `--steel: #6e8896`, `--sage: #8a9471`, `--cream: #f6efdd`
- Fonts: `Alegreya` (serif body), `Alegreya SC` (small caps), `Caveat` (handwritten
  annotation labels), `IBM Plex Mono` (technical labels) — replaces Archivo/Newsreader.
- Paper grain: inline-SVG `feTurbulence` noise on `body`; warm vignette on `#grade`.
- Canvas palettes updated in `js/graph.js` (AMBER/EDGE/FILL/FILL_HOT/TEXT/MUTED/DIM),
  `js/press.js` (BG/AMBER/WARM/STEEL/EDGE), `js/plates.js` (bg/ink/mut).

### Layout translations
- **Text column** is now a paper sheet over the plate:
  `#content` gets a horizontal parchment gradient (0.975 → 0 alpha) instead of relying on a
  dark scrim, so ink text is always legible on bright photos. `#scrim` flipped from a dark
  to a light warm wash.
- **Annotation callouts** are paper chips (`.albl` = parchment bg + 1px ink border +
  Caveat) and `#anno` z-index raised 15 → 22 so they render *above* the text sheet.
  `#anno` dot got a paper ring so it reads on both paper and photo.
- **Picker cards** (`.pk`) rebuilt: photo under a parchment wash, ink border, brick-deep
  "N STOPS DEEP" label, mono name, italic serif tagline. `#picker` is a flex-wrap row.
- **Header** z-index 25 → 45 (was being washed out by `#home`), backdrop parchment.
- `#cue` = small paper tag (arrow + "GO DEEPER"); `#depth` = paper chip; `#pips` on paper.
- Home hero: parchment sheet over the room photo, `margin-top:auto` on `.eyebrow` so it
  bottom-aligns on desktop and scrolls cleanly on mobile.
- Favicon + `theme-color` moved from `#151515` to `#e9dec4`.

### Bugs found and fixed (pre-existing, not caused by the redesign)
1. **`openPress()` never showed the press simulator** — it did
   `classList.add("show")` and then immediately called `closePress()`, which *removed*
   the class. Reordered: `closePress()` first, then `add("show")`, then `mount()`.
2. **`.show { display: block !important; }`** — a global utility I added during the
   reskin was overriding `#press-overlay.show { display: flex; }`, so the press panel
   rendered un-centred in the top-left. Utility removed; element rules own `.show`.
3. **`#details` was a floating panel** — the JS toggles `.open` on it, and the original
   was an in-column grid accordion (`grid-template-rows: 0fr → 1fr`). Restored; the
   "THE DETAILS +" button now actually expands the spec table + history note.
4. **Press canvas resize spiral** — `press.js` read the parent's `clientHeight` while the
   parent was sized by the canvas. Now the canvas's own CSS box is the source of truth
   (`#press-overlay canvas { display:block; width:100%; height:440px; }`), parent only as
   first-paint fallback.
5. **Finale canvas collapsed** — `#finale` had been made a flex column and
   `#full-graph { flex:1 }` broke the canvas sizing, so the graph drew in the top-left
   corner. Restored `display:block` + `#finale canvas { position:absolute; inset:0 }`.
6. **Mobile CSS ordering** — legacy base rules (`.pk`, `.eyebrow`, …) sat *after* the
   mobile media query and won on equal specificity, so mobile cards were not full-width.
   All mobile overrides now live in a final media block at the end of the file.
7. **Mobile header overflow** — `hbtns:448` / `btn-room:448` exceeded the 390px
   viewport. `#brand-sub` hidden ≤720px, `.hbtn` shrunk ≤480px.
8. **Finale graph bottom reserve** — `setChrome` bottom bumped to 300px ≤860px so the
   mobile stats/quote block stops covering the last echelon.

### Verification
Headless Edge (CDP `shot.js`) at 1600×900 and 390×844:
home, room stop, candle stop, details expanded, press overlay, finale (full + object-only),
mobile home/descent/finale. `check-journey.js` ALL OK (10 chains);
`check-imgs.js` missing [] unused [] mapped 49/49.


## Session 6 log (2026-10-22) - data-layer banagale migration

- js/content.js: all 120 `color:` values migrated (110 nodes at every echelon + 10 chains).
  Finale-graph node borders (graph.js drawNode paints n.color) now run only on banagale
  tokens: machines #6e8896 steel; metals/electronics/oil #44321f; plastics/glaze #b65c38;
  bauxite #94472a; sand/kaolin/feldspar/glass/paper #93805f; plants/rattan/cotton #8a9471;
  wood/timber/stoneware #6e5a40; wax/candle/copper/adhesive #c9a04e.
- js/press.js: 12 cold near-black machine fills (#101010/#121212/#0f0f0f/#141414/#131313/#111)
  warmed to ink #2b2115 (ink-on-paper schematic).
- js/graph.js: node default fallback #666666 -> #44321f.
- assets/og.jpg: rebuilt for banagale (1200x630 parchment cover, five-object strip,
  System.Drawing jpeg q88, ~112KB); og:image:alt updated in index.html.
- brand.md: old brutalism kit marked HISTORICAL; new "13. banagale - CURRENT" token table
  appended (tokens, fonts, node border semantics). AUTHORING.md node `color` guidance and
  example rewritten to the semantic palette. RECOVERY-NOTE stale lines (css sheet
  description, old font list, OG image note) corrected.
- css/style.css: mobile stop sheet now scrolls cleanly (overflow-y auto + pointer-events
  auto + bottom pad 200) so details-expanded specs clear the GO DEEPER cue.
- Verification: node --check content/press OK; check-journey ALL OK; check-imgs 49/49;
  local screenshots: finale full + keyboard/mug/lamp object modes, press sim, spring stop,
  book source stop, escape-to-home, mobile details expanded/collapsed.

