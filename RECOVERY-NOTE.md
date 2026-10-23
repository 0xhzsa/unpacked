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
