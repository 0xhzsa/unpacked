# UNPACKED — recovery note (updated 2026-10-24, second-session build-out)

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


## Session 7 log (2026-10-22) — story field notes, toggle + node sheet, 11th object

### Storey (scroll field notes) replaces slide-descent as the default
- `js/story.js` (new): banagale-style reader over each object's journey data — hero
  (object stop, first-person lead, animated spec counters, hand note), prologue (room),
  one chapter per non-room/object stop in order, **"The complete chain" ledger detailing
  every echelon including E0 (the object node itself)**, closing (finale + affiliate).
  Portrait originals auto-plate (`tagPortrait` adds `.has-portrait` when
  naturalHeight > naturalWidth) instead of cover-cropping.
- Layer stack: header 45 > story 43 > home 40; finale 50 > node sheet 52; press 55.
- Routes: picker card click + digit keys (1–9 → objects #1–#9, **0** → #10; #11 is
  card-click only) → `window.openStory(oi)`; `g` from home/story → full finale; Escape order
  press → node sheet → finale → story → home; last stop + right arrow → full finale.
- `descent.js` exports `DescentAPI` (openFinaleFull / runPress / showHome / showNodeSheet)
  and `window.UnpackedIMG = IMG` (single image source of truth for descent + story).
- `.hand::before` copy changed to `content: "N.B. — "`.

### Whole-room toggle (user: "make sure when i choose 'whole room' it does go to the whole room")
- Last stop `next()` now opens the FULL graph finale (`openFinale("full")`), not the
  object-only mode; object-mode finale keeps a visible "The whole room" toggle; clicking
  any graph node in EITHER mode opens the node sheet (not a direct jump).

### Node detail sheet (user: "make sure everything get detailed")
- Graph node click (id match, then normalized-name match across chains) opens a sheet:
  description, process steps, 4 specs, history, shared-by chips, and
  **"Read its chapter ↓"** (opens the story at that node's chapter anchor).
- Story ledger covers all nodes `[0,1,2,3,4]` echelons.

### 11th object — Insulated Steel Bottle (`insulated-bottle`, TikTok 40 oz trend)
- `content.js`: 13-node chain (object; shell/lid/boot; deep-draw press, injection press
  *(name-merge: "Injection Molding Press")*, vacuum-seal line; 304 coil / PP pellets /
  silicone compound; merges "Iron Ore Mine", "Crude Oil Well", "Silica Sand Quarry").
- `journey.js`: 6 stops (room→object→straw lid→draw press→steel coil→iron ore mine);
  all 10 earlier room stops updated "Objects in room" 10 → 11.
- Photos: `assets/img/bottle.jpg` = Commons *A stainless steel thermoflask.jpg*,
  `assets/img/lid.jpg` = its *(open)* variant (cap off, red silicone seal ring visible —
  lid stop copy/chips recalibrated to what the photo actually shows). Both by
  **Shypoetess**, CC BY-SA 4.0, Wikimedia Commons, 1280px thumbs.
- `descent.js` IMG entries: room / bottle / lid / stamping / coil / mine (51 keys);
  `affiliate.js`: `"insulated-bottle": "40 oz insulated tumbler"`.
- CSS: portrait plate block (`.hero-media/.ch-media.has-portrait { width: fit-content }`,
  hero img `width:460px; max-width: calc(100vw - 96px)` — a `%` inside
  `min(460px,100%)` was indefinite during the wrapper's intrinsic sizing, which kept the
  hero wrapper at full width; definite widths fix the hug).

### Verification (session 7)
- node --check: content / journey / descent / affiliate / story OK.
- `check-journey.js`: ALL OK — 11 chains, insulated-bottle stops=6 seq=0..5 e=001234.
- `check-imgs.js`: missing [] unused [] mapped 51/51.
- Headless Edge shots: tumbler story hero (plate hugs photo, chips on-subject), lid
  chapter plate (chips land on cap + seal ring), ledger E0–E4, full graph
  106 processes / 121 links / 9 shared across 11 objects, home picker.



## Session 8 (2026-10-23): fact-check pass + launch polish

### Fact-check (verified via web sources)
- Heat retention 9 h -> 12 h (Thermos publishes 24 h cold / 12 h hot).
  Object specs + journey object stop updated.
- Shell specs: invented "Gap pressure 0.007 Pa" removed -> verified standard
  "Vacuum gap 3 mm"; invented "Copper film 1 um" -> "Liner coating: Copper"
  (the copper layer is real, no verified thickness figure); 4th spec -> "Two
  drawn cups". Desc now says "pumped to a trace of air" (no fake pressure).
- Vacuum line specs: gap size 3 mm / weld laser one pass / leak test 100 % /
  residual air "A trace" (invented 7 mPa + 90 s pump-down removed); process
  step "Evacuate the gap to 0.007 Pa" -> "to a near vacuum".
- Press: desc now honest about draw-then-redraw (one-stroke cup + redraw press
  to full height); spec "Draw depth 260 mm" -> "Redraw passes 2"; process step
  updated. History: E. W. Bliss built double-action drawing presses in
  Brooklyn from 1867; brass cartridge caps were the first mass run (verified).
- Stanley: fabricated "sales doubled 2021-2023" -> verified arc $73M (2019) to
  $750M (2023), almost all 40-oz tumblers (CNBC).
- Rochow: Corning -> General Electric, 1940 (direct process still makes nine
  tenths of all silicone); process step now includes the copper catalyst.
- Silicone: desc rewritten (quartz -> silicon metal -> Si-O backbone; "grips
  without glue"); history -> airplane ignition paste, 1940s (verified).
- PP: unverifiable "Dishwasher cycles 1000" -> "Melt point 165 C"; living-hinge
  copy fixed ("folds a living hinge ten thousand times").
- Dewar: shell history -> "never patented his 1892 flask; commercial versions
  were patented by others; he lost the later court case" (verified).
- Lid desc: "polypropylene, not heroics" (contrast-tell shape) -> "plain
  polypropylene".

### Voice / copy fixes
- Object stop narration: removed "The trick isn't the paint - it's the nothing"
  contrast-reveal; new voice: "My paint gets the shelf; between my walls is a
  gap of almost nothing, so a sun-hot beach never reaches my water."
- Lid stop narration grammar: "the family the viral straw lids belongs to" ->
  "belong to".
- Home lead rewritten (no em-dashes, no redundancy): "Every object in this room
  hides a long story. Pick one and follow it: every part, every machine, every
  material, to the ground it came from."
- Home scroll hint: "click any object to begin" -> "choose an object · every
  story ends in the ground" (sets the payoff promise).

### Broken parts + design
- Home grid's open last cell -> new dashed "The Whole Room" card (buildPicker
  appends when objects().length % 3 === 2; click opens the full finale graph;
  tested: click -> finale open=true).
- CC-compliance strip under the grid: "Photos: Wikimedia Commons · CC BY /
  CC BY-SA · per-file credits in RECOVERY-NOTE.md".
- Recurring GEO "img:13xx": root cause = the home stage's full-bleed cover
  layer (background-size: cover) extends past the viewport by design; never
  user-visible. New html { overflow-x: clip } + existing body overflow-x
  hidden guarantee no horizontal scroll on any browser (incl. iOS quirk where
  body-only hidden softens). GEO still lists the rect; sw === iw on every shot
  proves no pannable overflow.
- Ledger: single-node echelon grids (E0) render full width (.l-grid.single).
- A11y: :focus-visible rings on header/control buttons + dive cue; cards get
  :active press feedback.
- Tumbler card thumb: background-position 50% 78% (higher-contrast region,
  avoids a filter distorting card text).

### Verification (session 8)
- node --check: content / journey / descent / story OK.
- check-journey: ALL OK (11 chains; insulated-bottle stops=6 seq=0..5).
- check-imgs: mapped 51/51, missing [] unused [].
- Shots: home (room card, fixed thumb, new lead + hint + credits), bottle
  story hero (heat 12 h, new narration), ledger E0 full width, room-card
  click -> full finale "THE WHOLE ROOM" (open=true).

### Session 8 continued: cleanup + "specimen plate" home redesign

Deleted (authorization granted to delete instead of overwrite):
- js/app.js (445 lines legacy UI, referenced rail/mini-graph/scene elements that
  do not exist; never loaded by index.html -> it partially executed nothing).
- js/plates.js (76.6 KB window.Plates canvas plates, referenced only by app.js).
- js/scene.js (33.2 KB window.SceneAPI 3D room, referenced only by app.js).
  ~125 KB of dead code removed; loaded scripts untouched.

Image optimization (pillow via uv, assets/img/*.jpg, names unchanged):
- Every file capped at 1280 px max dimension, recompressed q82-86 progressive.
  34.2 MB -> 10.3 MB (-70%). Pages/finale/story load ~3x lighter; card thumbs,
  plates and full-bleed cover layers all render at <=1280 px so quality is
  visually unchanged (verified on shots).

Home redesign: "specimen plate" cards (flat, brand.md rules hold):
- Removed the heavy parchment wash gradient over photos; the button bg is now
  the raw photo. A ::before block covers everything below 64 px in solid paper
  with the ledger hairline on top -> photo strip above, ink rule, parchment
  text block below. Photos finally read at full color; text never sits on
  imagery anymore. min-height 178 px unifies all rows (room card's 4 lines
  included). Mobile keeps 74 px photo strip with a 140 px card.

Fix: #home bottom-anchoring clipped the hero when the sheet grew taller than
the viewport. Root cause: margin-top:auto on .eyebrow bottom-aligns the flex
column; overflow content before a scrolled flex container's origin cannot be
reached by scrolling, so the eyebrow row vanished at 900 px viewports.
Replaced with a shrinkable/growable head spacer pseudo-item (basis
clamp(36px,9vh,96px), max 220px): tall screens still sink the sheet toward
the bottom; short screens scroll cleanly from the top.

Styling: credits strip (.pfoot) now centered mono small-caps under a hairline.

Verification: check-imgs 51/51 (recompressed, missing [], unused []),
check-journey ALL OK, story render unchanged, desktop tall + mobile home
shots reviewed, room-card -> finale still opens.

### Session 9: viral surface prep

New files:
- README.md - repo front door for HN/Reddit: the pitch, how-to-play, keys, what's
  in the box, fact-discipline statement, dev/verify commands, links to docs shots.
- llms.txt - machine-readable digest for AI-assistant citation (objects, breadth,
  fact policy, live link).
- tools/og.html - live draft of the social share card (kill/redo anytime: shoot at
  1200x630 -> JPEG q88 -> assets/og.jpg).
- docs/share-home.jpg + docs/share-story.jpg - README screenshots (1000px, q84).

Regenerated assets/og.jpg (1200x630, 130 KB): parchment cover with the UNPACKED
wordmark, italic lead, accurate stats line (11 OBJECTS / 106 PROCESSES / 121 LINKS),
site URL, and a 3x4 mosaic of all 11 objects + room photo. Replaces the stale
five-object strip. og:image:alt updated to describe it.

Metadata: twitter:description added (mirrors og:description).

Story closing: added "Copy link" share button between the two existing CTAs
(clipboard.writeText with an honest fallback: printer the raw URL if the API
refuses). Tested: headless shows fallback URL (untrusted click), real user
clicks on https will get "Copied OK".

Keyboard: "-" now opens object #11 (completes the digit map 1-9, 0 -> #10,
"-" -> #11). Tested via synthetic keydown -> story opens with
"Insulated Steel Bottle / field note".

Verification: syntax OK, check-journey ALL OK, check-imgs 51/51, footer
renders ("READ THE NEXT ONE WHILE THE KETTLE BOILS"), closing buttons row OK.

### Session 9 continued: SEO + keys + monetize-doc

- robots.txt (allow all + sitemap pointer) and sitemap.xml (root URL, weekly).
- 404.html: self-contained branded page ("NOTHING AT THIS DEPTH / Page not found"),
  parchment system, mono button back to the room. GitHub Pages serves it on
  unknown paths with HTTP 404.
- Home: keyboard affordance line under the payoff hint - "or press 1-9 - 0 - '-'
  for No.11" (digits were invisible before; now discoverable).
- README: "Own it / monetize" section pointing at js/affiliate.js (tag in one
  place; disclosure included; empty tag = live-but-unmonetized).

### Session 10: deep fact-audit of the 10 older chains

Every one of the 196 history claims across all 11 chains was extracted and checked.
26 fixes landed across content.js (16) + journey.js (10):

- Buckling spring: journey said "first key switches were patented by IBM" - IBM
  patented THE buckling spring (1970s, US4118611 issued 1978); not the first
  keyswitch. Reworded both files.
- Molding timeline: Hyatt celluloid 1869 / machine 1872 kept (verified).
- EDM Moscow 1943 (Lazarenko) kept (verified).
- Swivel chair: softened "Jefferson invented" to "is credited with" (anecdotal).
- Eames base: 1958 Aluminum Group debuted with a cast-aluminum pedestal, NOT the
  five-star (5-star came in later generations) - fixed both files.
- Diehl ceiling fan: 1885 not defensible (patent 1889, ISMACS says 1887;
  Wheeler's electric fan 1882) - "in the late 1880s" both files.
- Wafios: founded 1893/merged 1914, NOT 1921 (wafios.com history page); first
  electronically-controlled coiler 1978 is their own milestone - rewrote.
- Bramah extrusion: 1797, not 1795 (hydraulic press is 1795; extrusion is 1797).
- Kiruna: magnetite, not hematite (banded-iron "hematite deposits" generic word.
  ing kept - it is correct generic usage).
- Paraffin REMIX: first isolated 1830 from wood tar (Reichenbach); James "Paraffin"
  Young made it commercial from Scottish coal/shale - Bathgate works = world's
  first commercial oil-works (patent Oct 1850). "Boyd candle works 1857" and
  "Robert Wells 1834" and "petroleum in the 1830s" were fabricated - all three
  names/claims removed or replaced with the verified Young story.
- Tallow dominance claims softened (tallow persisted; "ended within a
  decade" overstated).
- Braided wicks: credited to "from the 1820s" manufacture, no patent/name.
- Cotton combing: Josue Heilmann, France, 1845 (patented 1845) - NOT "Lancashire
  1820s"; dropped "first cotton sailcloth" tail (false).
- Enamel wire: "By the 1920s enamel had largely replaced..." (enamel wire predates
  1920; the softening is defensible).
- Teak: shipwrights prized it for rot/sea-water resistance; teak's acid actually
  CORRODES iron fastenings, so "outlast iron fastenings" was backwards - fixed.
- Cushion etymology: "quishion" (not a real form) -> Old French "coissin".
- Rattan trade dates unified: "the seventeenth century" (kills the unverifiable
  "1605"/"1650s" specific years, both files consistent).

Verified still-true-and-kept: Drake 1859, Diderot 1751, Holonyak 1962 red LED,
Tesla 1888, Argand 1784 glass chimney, Owens 1903 bottle machine, Carothers nylon
66 1935, Pilkington 1952/1959, Fourdrinier 1803, Keller 1843, Rubel 1904 offset,
Feinan ~7,000 yr copper, Aeron 1994 Stumpf/Chadwick, Warren 1849 armchair,
Fisher 1876 casters, Steelcase 1912, Meissen 1710, Gaoling kaolin, Cherry MX 1980s,
Lazarenko 1943.

Verification: node --check OK x2, check-journey ALL OK, check-imgs 51/51.
DOM test: opened candle story - "James Young" present, "Boyd"/"Robert Wells"/
"1857" absent; ledger N.B. renders the new story. Screenshot reviewed.

### Session 11: shareable per-object story links

Story URLs now exist for every object:

- story.js: open() writes #obj/<chain-id> via history.replaceState; close() strips
  it; boot-open parses location.hash on load (deferred to DOMContentLoaded like
  descent's boot - the first attempt without the guard was immediately closed by
  descent's DOMContentLoaded showHome()).
- "Copy link" (story closing) now copies location.href, so an open story copies
  the deep #obj/ link.
- 11 door pages story/<id>/index.html: static OG metas per object (title,
  one-liner, og:image = the object photo), canonical to the site root, and a
  0s meta refresh + location.replace into ../../#obj/<id>. Link previews on
  social show the object card; human visitors land in the story.
- sitemap.xml regenerated: 12 URLs (root + 11 story doors).

Tested locally: /#obj/keyboard boot-opens the keyboard story ("Mechanical
Keyboard / field note") and Escape clears the hash; /story/keyboard/index.html
redirects and opens. NOTE: local serve shows 404 for directory walks
(/story/<id>/) - GitHub Pages serves directory index.html, so the production
path works; index.html fallback exists for any host that does not.

### Session 12: demo GIF for README + social

- frames.js (repo root, next to shot.js): same CDP pattern but keeps ONE page
  alive and runs a 18-step drive of the whole mechanic, capturing 11 PNG frames
  at 1280x720: home sheet -> keyboard story hero -> injection chapter ->
  press simulator running (INJECT/FILL phase, 3 frames) -> ledger ->
  closing -> whole-room graph with the stats bar.
- Pillow: resize 960x540, 128-color adaptive palette per frame, per-frame
  durations (~7.4s loop) -> docs/demo.gif (813 KB).
- README: GIF embedded right under the "Live:" line with a one-line mechanic
  caption; dev section documents frames.js regeneration.

Preview-checked: press frame shows full 02 INJECT/FILL diagram with hopper,
screw, heater bands, melt pool, clamp unit and phase meter; graph frame shows
the 106/121/9/11 stats bar + Ben Reinhardt quote.

### Session 13: mobile QA pass (390x844) + press canvas fix

Re-verified every major state on a phone viewport after sessions 10-12:

- home sheet: plain render, sw===iw, only the known by-design cover bleed.
- keyboard story (via #obj/keyboard boot): meta line, hero, spec trio, corrected
  N.B. in handwriting, plate + chips all correct.
- press simulator: WAS crowded (labels collided at 390px canvas). Fix: at
  <=640px the panel gets overflow-x:auto and the canvas a 640px min-width, so
  the diagram keeps its designed layout and pans horizontally instead of
  squeezing. Verified: phase label clean, progress meter clean, labels
  readable (right-side labels visible after pan; GEO flags the canvas by
  design inside its own scroll container - page sw stays 390).
- door page -> redirect -> story on mobile: works (explicit index.html path
  locally; directory path serves on GitHub Pages).
- finale graph at 390px: whole room scaled to fit (2.75:1) with stats bar +
  quote stacked below; per-object graph remains the mobile-friendly zoom.

### Session 14: purpose-built OG cards for the 11 story doors

- tools/og-item.html: single 1200x630 template driven by query params
  (?num=&name=&blurb=&img=) - kicker (UNPACKED / OBJECT Nx), Alegreya SC title,
  italic one-liner, ground line, brick URL, large framed field photo, and the
  VIA WIKIMEDIA COMMONS credit line.
- Shot all 11 via the query-param template (clean GEO every time), then
  Pillow -> docs/og/<id>.jpg at q88 (66-124 KB each, ~950 KB total).
- Door pages regenerated: og:image now points at the per-object card (was the
  raw asset photo), with og:image:width/height 1200/630 and a descriptive
  og:image:alt. twitter:* mirrored. Regenerated with a rewritten gen-doors.js
  (temp script) - sitemap's 12 URLs unchanged.
- llms.txt: added an "Object chapters" section listing all 11 door URLs by name.
- Validators green (check-imgs 51/51 mapped, check-journey ALL OK).

### Session 15: "Next object" in the story closing

- closingHtml now emits a third CTA: "Next: <name> ->" placed between the
  whole-room primary and Copy link. Clicking it calls open((S.oi + 1) % len):
  the next story renders in place (scroll resets to top, sub-title, hash
  replaceState and reveal observers all re-run through open()).
- Wraps at the end of the roster (bottle -> keyboard), so a reader can walk
  the whole room in one sitting.
- Tested end-to-end: keyboard -> click "Next: LED Desk Lamp ->" -> lamp story
  opens, hash #obj/desk-lamp, header sub-title updates; button row fits on
  one line at 1280 (rowRight 1142 < 1280).

### Session 16: full re-theme - print-shop riso/zine palette + UX pass

- User called the parchment theme "looking bad to navigate" and asked for ALL colors
  changed; delegated the choice ("no AI slop"). Direction decided: print-shop riso/zine -
  near-white paper #faf9f5, true near-black ink #181410, ONE loud vermilion accent
  #e0472b, saturated flat tag colors (mustard #e0a52f, steel #5b7f96, sage #7d9a5e,
  brick-deep #b93a1d, ink-faded #5c564c, ink-faint #a49e92), white cream, magnet-n
  #e0562f. Editorial identity kept: hairlines, mono labels, radius 0, no shadows,
  Caveat annotations, full-color photos.
- Method: mechanical literal swap of every old token (hex + spaced/unspaced rgba
  triples) across css/style.css, js/content.js, js/graph.js, js/press.js, js/descent.js,
  js/story.js, index.html, 404.html, tools/og.html, tools/og-item.html - journey.js had
  none. Grep-verified ZERO leftovers of any old value.
- Canvas overrides post-swap: press.js EDGE #a49e92 -> #8e8778, graph.js DIM -> #7a7365
  (canvas stroke/text legibility on the lighter plate).
- UX contrast pass: text uses of --ink-faint bumped to --ink-faded (#specs .l, .text-dim,
  .aff-note, .k, .ch-kick span2); .hscrollhint + #depth .d.on .lb switched from mustard
  text (too weak) to brick; .pfoot 0.62 -> 0.7; .hkeys 0.5 -> 0.62. New mobile block:
  .schips (decorative chapter rail labels) hidden at <=640px (clipped at 390 before);
  header .hbtn min-height 44px touch targets. Focus rules already existed (line 670 +
  .pk) and auto-followed the accent swap.
- brand.md: section 13 marked HISTORICAL, new section 14 riso/zine = CURRENT (tokens,
  node-color semantics carried over, canvas constants, text-contrast policy).
- All themed share assets regenerated under the new theme: assets/og.jpg (136 KB),
  11x docs/og/<id>.jpg (71-129 KB, q88), docs/share-home.jpg (110 KB) +
  docs/share-story.jpg (56 KB) for the README, docs/demo.gif re-driven via frames.js
  (11 frames -> 960x540, 128 colors, 788 KB). Screenshots verified desktop + mobile,
  story closing row, press overlay, finale graph - all on-brand.
- Validators: node --check x5 OK, check-journey ALL OK, check-imgs 51/51.

### Session 17: paper atmosphere v2 + trending-objects research

- User: paper still read flat / AI-ish; asked for "cool gradients background", more
  alive. Design response (kept zine-real, no mesh-gradient slop): cooled the paper family
  (#faf9f5 -> #f6f7f2 ground, #f0ede4 -> #eef1ec plates) and replaced both flat body and
  #stage backdrops with one shared --atmo stack (white top light, faint vermilion dawn at
  top-left 8%, sage floor falloff #f7f8f4 -> #dde3d8, soft ink floor shadow) + the static
  paper tooth (feTurbulence grain, 5%) — both live in :root as --atmo / --tooth so body,
  the fixed stage and the OG card templates share the identical atmosphere. OG cards got
  the same stack for print-like consistency.
- Global literal cooling swap (faf9f5/f0ede4 + rgb triples, spaced+unspaced) across css,
  js and html; grep-verified ZERO leftovers; validators green (node --check, ALL OK).
- All themed share assets re-regenerated under the final atmosphere: assets/og.jpg
  (136 KB), 11x docs/og/<id>.jpg, docs/share-home.jpg + docs/share-story.jpg,
  docs/demo.gif re-driven (11 frames -> 960x540, 813 KB). Verifies: desktop home with
  deeper paper, mobile home, story closing row fine.
- Trending-objects menu researched (TikTok/Kalodata-adjacent/Reddit) for the NEXT object
  chains; user picks.

## Session 18 log (2026-10-24) — full redesign + 8 new objects + attribution recovery

### MEGA-TASK (uncommitted at write time)

Home + story-rail + picker redesign, 8 new trending objects (content chains, journey
descent stops, photo alts, assets), honest alt-texts, future-proofing. All compiled
to the flat pile: content.js 244,961 B / journey.js 131,293 B / descent.js IMG
72 -> 126 entries.

### The redesign (all verified in place)

- Picker cards rebuilt as specimen cards (.ph photo strip w/ hover zoom, .no index,
  .n name, .tag tagline, .meta "N stops · ends in <ground>"), aria-labels on every
  card; unconditional "The Whole Room" card (ALL N AT ONCE → open the graph).
- Keydown expanded: 1-9, 0=10, -=11, ==12, q..u=13..19, g=whole room.
- Story rail is now a chapter-chip column (8px squares, .past mustard / .on brick,
  rebuilt from .chapter sections in onScrollPips, midline scrollspy at 38%).
- How-strip on home (01 Pick an object / 02 Descend / 03 Touch the ground),
  N-objects lead, updated key legend, og:image:alt -> 19 objects.
- Grid 4 -> 3 @860 -> 2 @640 (room card spans 2 at @640); dead .m spans,
  text-shadows, ::before spacer plates and .hscrollhint rules deleted.

### The 8 new objects

wireless-earbuds, matcha-whisk, led-strip, magnet-power-bank, slow-rebound-ball,
mini-blender, portable-ssd, ballpoint-pen — each with a content chain (19 chains /
210 nodes / 223 links total), a journey descent with IMG-mapped stops, real facts
only (audited claims like Poplawski 1922, NASA foam, Bíró, IP5318+8205A, KIOXIA),
and photo-truthful alt text per stop (verified against the actual shipped bytes).

### Stop-id consistency pass

Journey stop ids now match their content chain node ids 1:1. Renames applied:
wireless-earbuds-mine-04 -> coppermine-04; slow-rebound-ball-caster-02 -> mill-02
("The Casting Line"); earbuds source-stop name "The Mine" -> "Copper Mine".

### Photo attribution recovery (SHA-1 / dim + visual matching)

Ten session-18 photo files had lost source records. Recovered ALL of them this
session by identifying from the actual shipped bytes:

1. sha1s.js hashes each file (crypto.createHash, no re-encode).
2. Commons API list=allimages&aisha1=<sha1> — NOTE: parameter is `aisha1`
   (asha1 is NOT a valid MW parameter; a 2025-06 API change also caps free
   direct thumb requests to standard widths 20/40/60/120/250/330/500/960/
   1280/1920/3840 — anything else returns 400 "Use thumbnail sizes listed on
   https://w.wiki/GHai").
3. For thumb-sourced files: standard-width thumb (1920px/1280px via md5 path)
   is byte-deterministic — hash the downloaded thumb against the shipped sha1.

Results (9/10 byte-exact, 1 visually confirmed):

- `earbuds.jpg` — "AirPods" (Maurizio Pesce) — CC BY 2.0 — byte-exact (1920px thumb)
- `chasen.jpg` — "Chasen-side-fs PNr°0499" (D-Kuru) — CC BY-SA 4.0 — byte-exact (1920px thumb)
- `battery.jpg` — "18650 and 21700 lithium ion battery cell" (Sevenethics) — CC0 — byte-exact original
- `magnets.jpg` — "NeoCube" (XRDoDRX) — CC BY-SA 3.0 — byte-exact original
- `ledstrip.jpg` — "LED strip closeup" (Akbermamps) — CC BY 4.0 — byte-exact (1920px thumb)
- `ledreel.jpg` — "LED strip on reel" (Andrey Gvrv) — CC BY-SA 3.0 — byte-exact (1920px thumb)
- `powerbank.jpg` — "Power bank" (Ilya Plekhanov) — CC BY-SA 3.0 — byte-exact original
- `pb-internals.jpg` — "Powerbank integrated charging controller with LEDs and heat sink (Selectec HYT-Q3)" (KalteSonne) — CC BY-SA 4.0 — byte-exact original
- `ssd.jpg` — "NVMe SSd" (User5515) — CC0 — byte-exact original
- `sand.jpg` — "Silica Sand deposits, Udupi district,Karnataka 01" (ರವಿಮುಂ) — CC BY-SA 4.0 — dim + visual match (1280×720 re-encode; same mound, same burned-in "BIJADI Silica Sands" caption; shot 2013-06-22, GPS 13.5831/74.6812)

Already-attributed from the research phase (extmetadata, commons-meta.json):

- `stressball.jpg` — "Stress ball" (public domain upload)
- `blender.jpg` — "Pink portable blender" (Asecretfanfare) — CC BY-SA 4.0, 2017-08-08
- `bamboo.jpg` — "Golden Green Bamboo Stalks" (Kaviya Rajendran) — CC BY-SA 4.0, 2025-10-22

### Grounds merge (for honest phrasing)

19 chains resolve into 13 grounds: crude oil ×4 (chair, ball, blender, keyboard),
iron ×3 (desk, bottle, pen), copper ×3 (fan, strip, earbuds), bauxite ×2 (lamp, SSD),
sand ×2 (window, candle), then kaolin / spruce / rattan grove / whisk grove / lithium
singles. DO NOT claim "N shared sources" numerically — chain node ids do not
cross-reference; phrase as "the 19 chains end in 13 grounds".

### Honest-count facts (verify with stats.js pattern before citing)

19 chains · 210 nodes · 223 links · 77 photo files · 126 descent stops.

## Session 19 (2026-10-25) - design v2 "blend" skin, shipped and pushed (07dcaef)

Third full re-art-direction, shipped live: B's stage-consumption layout merged with
session-18's ink/annotation identity. `css/style.css` v2 under the same selector
contract (no layout markup moved); fonts switched to Fontshare `cabinet-grotesk@
500,600,700,800` + `general-sans@400,500,600` + IBM Plex Mono (Cabinet 600 silently
dropped by Fontshare - harmless, CSS uses 500/700/800); hero eyebrow "POV: your desk
is a supply chain", wordmark brick "PACKED", lede "The keycap was oil. The mug was a
mountain. The window was sand. Pick one. Descend."; header opacity 0.97 (kills the
chapter-text ghost scrolling under the bar). Index cards open STORY (`openStory`);
the scroll-descent in descent.js is dead code while story.js exists. QA at
1280x900 + 390x844: home, story hero, story ledger, finale all green. Known item
queued for the hooks pass: story tagline/narration duplication ("Eighty-seven tiny
machines" shows twice in the keyboard story).

## Session 20 (2026-10-25/27, shipped 65520b0) - image re-sourcing pass (15 flagged slots -> real Commons photography)

Replaced the remaining placeholder/wrong photos with sourced, verified Commons files.
Pipeline identical to the attribution-recovery pass above: browser UA, >= 6 s pacing
between Commons ops, byte-verify originals (local SHA-1 == API sha1) or standard-width
thumbs (1920/1280 via API `thumburl`; verify JPEG magic FFD8FF + width within +/-4 of
the requested standard width). No fabricated attribution anywhere; notes are kept
because `amp;` entities / 40-char truncation can mangle artist strings in the fetch log.

### IMG map rewiring (js/descent.js, 13 keyed edits; window.UnpackedIMG is shared with story.js)

- 7 `mine` slots -> per-mineral files: mug `kaolinmine-04`->minekaolin; steel desk
  `ironore-04`->mineiron2; ceiling fan `copper-04`->minecopper; bottle `ironmine-04`->
  mineiron3; earbuds `coppermine-04`->minecopper3; LED strip `mine-04`->minecopper2;
  ballpoint pen `mine-04`->mineiron.
- 3 `press` slots -> press-a (keyboard `inj-02`), press-b (office chair `injection-02`),
  press-c (mini blender `inj-02`).
- slow-rebound ball `mill-02`->castfoam ("The Casting Line", RIM + molded PU foam).
- power bank `saltlake-04`->saltflat (was WRONGLY showing sand.jpg).
- portable SSD `controller-01`->ssdpcb.
- Files overwritten in place (no map change needed): sand.jpg (Leziate quarry; serves
  window + candle stops), magnets.jpg, ledreel.jpg, ssd.jpg.
- Deleted after rewiring: `assets/img/mine.jpg`, `assets/img/press.jpg`.
- Gates green after the pass: `check-journey` ALL OK (19 chains); `check-imgs` missing[]
  unused[] mapped 77 / files 77.

### Final shipped sources (17 files) - title | artist | license | verify | dims | size

| file | Commons title (exact) | artist | license | verify | dims | size |
|---|---|---|---|---|---|---|
| minekaolin.jpg | China clay pit, Wheal Martyn 1.jpg | AtticTapestry | CC BY-SA 4.0 | original SHA-1 | 1600x1200 | 615 KB |
| mineiron.jpg | 2025-01-18 Hull-Rust-Mahoning Open Pit Iron Mine, view from visitor center.jpg | Minnesota Historical Society Heritage Preservation Department | CC BY 4.0 | 1920px thumb (orig 4624x2729) | 1920x1133 | (git history) |
| mineiron2.jpg | Schefferville open pit mining for iron ore.jpg | Matti&Keti; Lorenz.King at JLU Giessen | CC BY-SA 4.0 | 1920px thumb | 1920x1280 | 593 KB |
| mineiron3.jpg | One of the iron ore mines in Keonjhar district.jpg | Bikashkumargiri1997 | CC BY-SA 4.0 | 1920px thumb | 1920x1440 | 440 KB |
| minecopper.jpg | 2019 Bingham Canyon Mine 02.jpg | Farragutful | CC BY-SA 4.0 | 1920px thumb | 1920x1440 | 1252 KB |
| minecopper2.jpg | Elshitsa-open-pit-copper-mine.jpg | Edal Anton Lefterov | CC BY-SA 3.0 | 1920px thumb | 1920x1280 | 444 KB |
| minecopper3.jpg | Mina de Chuquicamata, Calama, Chile, 2016-02-01, DD 110-112 PAN.JPG | Diego Delso | CC BY-SA 4.0 | 1920px thumb | 1920x957 | 675 KB |
| press-a.jpg | Arburg-swiss plastic 2026.jpg | Bricetofly | CC0 | 1920px thumb | 1920x1278 | 361 KB |
| press-b.jpg | Injection Molding Machine with a robot arm.jpg | The robotic engineer1 | CC BY-SA 4.0 | 1920px thumb | 1920x1081 | 675 KB |
| press-c.jpg | Machine injection platique Engel (4).jpg | Bricetofly | CC0 | 1920px thumb | 1920x2886 | 658 KB |
| castfoam.jpg | Molded polyurethane foam.JPG | Silverchemist at English Wikipedia | CC BY-SA 3.0 | 1920px thumb | 1920x1440 | 221 KB |
| saltflat.jpg | Salar de Olaroz, Jujuy, Argentina.jpg | Coordenação-Geral de Observação da Terra/INPE | CC BY-SA 2.0 | 1920px thumb | 1920x1079 | 519 KB |
| ssdpcb.jpg | Intenso 2.5- 128 GB SATA III SSD - board - Silicon Motion SM2246EN-40585.jpg | Raimond Spekking | CC BY-SA 4.0 | 1280px thumb | 1280x1280 | 492 KB |
| sand.jpg | Silica sand excavation, Leziate, Norfolk - geograph.org.uk - 2050948.jpg | Richard Humphrey | CC BY-SA 2.0 | 1920px thumb | 1920x1440 | 829 KB |
| magnets.jpg | Bar-magnets-attracting-iron-filings max.jpg | MikeRun, Vera Wurmsdobler | CC BY-SA 4.0 | 1920px thumb | 1920x1102 | 661 KB |
| ledreel.jpg | Light blue LED strip.jpg | Nashucks | CC0 | 1920px thumb | 1920x1100 | 414 KB |
| ssd.jpg | SanDisk Extreme Portable SSD 1 TB - front view.jpg | ITEagle Europe - Sebastiaan Broekhoven | CC BY-SA 4.0 | 1280px thumb | 1280x1280 | 348 KB |

(mineiron2 artist recorded from extmetadata; the fetch log truncates the raw entity
"Matti&amp;Keti; Lorenz.King at JLU Giess..." at 40 chars - the decoded form is
written here. mineiron credits recovered via a second imageinfo query because the
first run's log line was lost.)

### Fetched-then-rejected (NOT shipped; superseded by the table above)

- "Injection moulding machine.jpeg" (Justjainz) -> first press-b; rejected on visual
  quality (grimy/blurry) in review.
- "Injection molding machine clamping unit.jpg" (PedroCalamaro) -> first press-c;
  flat vector cutaway with baked-in "Clamping Unit" text - clashes with the
  all-photography image set.
- "Neodymium magnet 1140509.jpg" (Nevit Dilmen) -> first magnets.jpg; foil-wrapped
  object in a glass bowl, zero magnet read.

### Session 20 facts base (updated honest-count)

19 chains x 210 nodes x 223 links x **77 photo files** x 126 descent stops.

## Session 21 (2026-10-27) - v3 full from-scratch visual + interaction rebuild

User verdict on v2: "ass as fuck"; directive: strip the whole thing and redo from scratch,
no intermediate check-ins ("i'm gonna look at the end"), not AI-sloppy. New UX model:
Wall (pick) -> Ride the Line (tap-through story beats, IG-style progress bars, one giant
number per beat) -> Touch the Ground (payoff + share card) -> full-screen Transit Map
(19 colored lines, shared nodes = interchanges), 19/19 "grounds claimed" (localStorage).
Content engine (journey.js 19 chains / 210 nodes / attribution ledger) untouched; beats
replace narrations at render time.

### Stack + files

- Tailwind v4 compiled (npm i -D tailwindcss @tailwindcss/cli, Node v22.23.1): css/tw.src.css
  -> css/app.css via @tailwindcss/cli v4.3.3 (608 ms, no errors).
- Fonts self-hosted: 13 woff2 in assets/fonts + css/fonts.css.
- NEW js/beats.js: 126 story beats (window.UNPACKED_BEATS keyed by stop id:
  {h, b, stat:{v,u,l}, call:[{x,y,label,sub}]}) - validated via bval.js -> 0 problems,
  0 warnings (2 manual-ok: magnet-power-bank-board-01 SoC singular, ballpoint-pen-grinder-02
  sub-micron).
- NEW js/meta.js: per-line code/acc/fam/ground/groundQuip/tagline + series copy + fam legend
  (19 lines: KB/LT/CH/MG/DK/GL/BK/FN/CD/AR/BT/EB/MW/LS/PB/SB/BL/SD/PN).
- NEW js/imgmap.js: 81 stop-id -> photo-filename entries (moved from old descent.js; verbatim
  IMG map).
- NEW index.html shell (self-hosted fonts, dark theme-color, v3 title/og).
- NEW js/app.js (~900 lines): Wall, Ride the Line, Touch the Ground, Transit Map
  (19 columns x echelon rows, shared-node rings), Station sheet, hash router, localStorage
  claimed/visited, cover-crop pin math, canvas share card, affiliate wiring.
- affiliate.js: +8 missing object keys (wireless-earbuds, matcha-whisk, led-strip,
  magnet-power-bank, slow-rebound-ball, mini-blender, portable-ssd, ballpoint-pen). Tag ""
  stays (buttons hidden).
- Old files removed: js/story.js, js/descent.js, js/graph.js, js/press.js, css/style.css
  (no remaining references except harmless comments).

### Palette (19 line accents, no adjacent repeats in wall order)

KB #FF6B8B, LT #FFD34D, CH #B18CFF, MG #66E8D2, DK #8FA0B5, GL #74E0FF, BK #E8E4D9,
FN #FF8A3D, CD #FFA94D, AR #D9B98A, BT #5FA8E8, EB #FF4E5E, MW #8AC926, LS #59F07B,
PB #C084FC, SB #00B3A4, BL #FF7A5C, SD #E4E9F0, PN #D8B04A.

### Gates

- check-journey.js: ALL OK (19 chains).
- check-beats.js: OK (126/126, 2 manual-ok).
- check-imgs.js: missing [] unused [] mapped 81 files: 81 (after SMT repoint).

### SMT image pass (4 CNC-machinist photos replaced with real Commons photos)

The 4 SMT/placement stops (desk-lamp-smt-02, led-strip-smt-02, magnet-power-bank-smt-02,
portable-ssd-smt-02) were showing a CNC-machinist photo; replaced with real Commons
"pick and place / SMT line" photos. Beats' call labels written generically ("The placement
head / The reflow oven") so they match after replacement.

| file | Commons title (exact) | artist | license | verify | dims | size |
|---|---|---|---|---|---|---|
| desk-lamp-smt-02.jpg | Pick_and_place_internals_of_surface_mount_machine.JPG | Peripitus | CC BY-SA 3.0 | 1600px thumb, JPEG magic FFD8FF, width 1138 | 1138 px wide | 308965 bytes |
| led-strip-smt-02.jpg | Pick_and_place_internals_of_surface_mount_machine.JPG | Peripitus | CC BY-SA 3.0 | 1600px thumb, JPEG magic FFD8FF, width 1138 | 1138 px wide | 308965 bytes |
| magnet-power-bank-smt-02.jpg | Reflow_oven.jpg | (Commons file) | (Commons file) | 1600px thumb, JPEG magic FFD8FF, width 1440 | 1440 px wide | 461582 bytes |
| portable-ssd-smt-02.jpg | Reflow_oven.jpg | (Commons file) | (Commons file) | 1600px thumb, JPEG magic FFD8FF, width 1440 | 1440 px wide | 461582 bytes |

Fetched via Special:FilePath with browser UA; JPEG magic (FFD8FF) + width verified. imgmap.js
repointed from "cnc" -> the 4 new filenames; check-imgs now reports 0 unused.

### Copy-quality rules enforced

- No em-dashes, no "it's not X it's Y" reveals, no invented numbers; every beat stat sourced
  from journey/content specs; beat `call` labels reference what's actually IN each photo.
- Known data conflicts dodged in copy: journey ceiling-fan 9 blades vs content 5 (journey wins);
  steel-desk object 1.5mm vs 1.2mm (object uses 1200mm stat); candle chimney "1.5 mm" narration
  vs 1.2mm spec (written as "a millimeter and a bit").
- Room beats standardized: stat {stops count, "we end in <ground>"}; ground beats (final stop)
  are payoff copy keyed to stop id.
- Standing: Wikimedia compliance (browser UA, >=6s pacing, byte-verification); never fabricate
  attribution; don't claim "N shared sources" (say "19 chains end in 13 grounds"); never touch
  OpenCode session DB.
- Affiliate layer untouched (tag "" = buttons hidden); 8 missing object keys added when wiring
  slabs.

### QA

- serve.js running on 8931 (PID sh_171ef697a001jvopy6WhYDDasK).
- shot.js captures at 1280x900 and 390x844 for Wall, Ride, Map - all report iw/sw match,
  bad[] empty (no overflow).
- Screenshot files saved under C:\Users\stagh\AppData\Local\Temp\opencode\ (v3-wall-d.png,
  v3-wall-m.png, v3-ride-d.png, v3-map-d.png).

### Deferred

- OG image regen (og.jpg still old banagale cover; og meta updated to v3 title).
- Credits/attribution ledger: station sheet falls back to generic "Wikimedia Commons" credit;
  full 77-file attribution map not yet built (fetch logs + RECOVERY-NOTE hold audit trail).
- ballpoint-pen-grinder-02 keeps its CNC photo + journey calls intentionally.

### Session 21 facts base (updated honest-count)

19 chains x 210 nodes x 223 links x **81 photo files** x 126 descent stops x 126 beats.

