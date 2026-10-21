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
css/style.css         industrial brutalism sheet (1px borders, no radius, #e8861d amber accent)
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
- The one external reference: Google Fonts stylesheet in `index.html` (Archivo, IBM Plex Mono,
  Newsreader). Self-host if the host must be fully offline.
- OG image: none yet — add `assets/og.jpg` (room.jpg crop 1200x630) + one line og:image tags
  when desired.

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
