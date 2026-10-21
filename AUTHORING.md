# AUTHORING — adding a new object (the repeatable recipe)

Everything in UNPACKED is data. A new trending product is four edits + one image hunt,
then the validators and screenshots tell you it's safe. One object takes 1–2 hours once
you know the shape.

## The three contracts (break these and things vanish or dupe)

1. **Stop ids = IMG keys.** Every journey stop's `id` must have a line in `descent.js`'s
   `IMG` map (`"ceiling-fan-copper-04": "mine"` → loads `assets/img/mine.jpg`). A missing
   entry = black slide. `check-imgs.js` catches both directions (missing / unused).
2. **Node names merge the graph.** The finale graph joins chains by node `name`, at any
   echelon — reuse an EXISTING name exactly to share a node:
   `"Crude Oil Well"`, `"Iron Ore Mine"`, `"Copper Mine"`, `"Bauxite Mine"`, `"Cassiterite
   Mine"`, `"Kaolin Mine"`, `"Silica Sand Quarry"`, `"Feldspar Quarry"`, `"Spruce Forest"`,
   `"Soda-Lime Glass Batch"`, `"Combed Cotton Yarn"`, `"Cotton Field"`.
   A new material with no shared name is fine too — it just stands alone at its echelon
   (e.g. `"Rattan Grove"`, `"Teak Plantation"`).
3. **Echelons count down to ground.** Object = E0, part/case = E1, machine/tooling = E2,
   raw material = E3, the ground it came from = E4. `check-journey.js` enforces the
   ladder (echelons must be non-decreasing along the walk).

Conventions the UI assumes: room stop is `stop: 0, kind: "room"`; object stop is `stop: 1,
kind: "object"` (this is where the buy button renders); picker label = `stops.length - 1`
"STOPS DEEP"; room spec "How deep we go" = total stops INCLUDING the room; every room stop
says `"Objects in room": "10"` — bump the number when you add an object.

## Recipe

### 1. Pick the object
Something people already own and don't think about. Trending is better than timeless
(search traffic), mass-market is better than exotic (every reader has one). Write down
its chain first, on paper: 2–3 parts → the machine that makes each → the material → the
ground. If you can't walk it to E4 in your head, pick another object.

### 2. Wire the content chain — `js/content.js`
Append at the end (before the closing `],\n};`), following the exact node shape of the
ceiling-fan chain (it's the newest, cleanest example). Per node: `id`, `name`, `echelon`,
`description` (2 sentences, physical, no adjectives you can't photograph), `specs` (4,
real numbers with units), `history` (ONE dated fact, ≤ 20 words), `process` (4 steps,
verb-first, ≤ 8 words each), `color` (hex from the file's muted palette), `inputs`
(node ids this node is made from).

```js
{
  id: "airbuds-01", name: "Wireless Earbuds", echelon: 0,
  description: "...", specs: [...], history: "...", process: [...],
  color: "#37474F",
  inputs: ["airbuds-battery-01", "airbuds-driver-01"]
}
```

### 3. Walk the journey — `js/journey.js`
Append the object (see the `ceiling-fan` block at the end of the file — copy its shape):
`id` (chain id, kebab-case), `name`, `tagline` (one dark-witty line for the picker card),
then `stops`. Voice rules: object + parts speak first-person ("I'm a switch…"); machines
and materials speak third-person ("Blades are born here…"); one idea per screen; 3 specs
per stop; kicker = "Start here" / "The object" / "A part" / "The machine" / "The
material" / "The source". Every stop needs `image` (a DESCRIPTION of the photo — the IMG
map decides the actual file), `annotations` (2, with x/y in % of the SOURCE PHOTO — the renderer inverts the stage's background:cover crop so dots land on the subject at any viewport; labels auto-flip left when they'd collide with the text column; #anno is hidden ≤860px), `zoom`
({x, y, scale} — where the camera rests).

Room stop: copy the shared room description + Diderot history verbatim from another
chain; annotations point at YOUR object's real position in room.jpg plus one "another
chain" neighbor; zoom lands on your object. Authored coords are PHOTO-space % for room.jpg
(1920x1280); the stage's background:cover crop is inverted automatically. Known subject
positions in room.jpg (photo %): candle (50,69), cane daybed weave (47,56), left barrel
chair (29,56), left lamp (42,47), right lamp (54,47), books (42,76)/(59,76), fans
(41,28)/(61,24), right doorway (79,41).

### 4. Hunt the images (Commons)
Queries that work: object name + "close up/macro/disassembled/teardown"; machine type +
"workshop/factory line"; material + "sheets/coils/pile". Category pages beat search:
`Category:Bookbinding`, `Category:Screws`. Reject anything with faces, museum-white
backdrops, or engravings. The warm CSS grade (`#stage .img` filter) unifies color, so
favor composition and subject over palette match.

If Commons api.php 429s (it will), bypass it — no API key needed:
```
https://commons.wikimedia.org/wiki/Special:FilePath/<File:Name without prefix>?width=1600
```
Record every file title you use — the RECOVERY-NOTE image list is provenance.

### 5. Map them — `js/descent.js` IMG block
One line per stop. Keep the `// object name` comment grouping. Reusing an existing file
(e.g. `"mine"` for two different mines) is correct, not lazy — the app does it on purpose.

### 6. Room count + narration
Every room stop's `"Objects in room"` spec → new count. Keyboard room narration says
"Eight things…" — bump the word ("Nine things…"). House style keeps that narration under
20 words, ends on the invitation.

### 7. Affiliate link — `js/affiliate.js`
Add the chain id to `links` with search words (or a full URL with `{tag}`). The buy button
renders itself on the object stop with the FTC disclosure. Empty string = no button.

### 8. Validate — don't trust your eyes, trust the scripts
```
node check-journey.js     # stops sequence, echelon ladder, room specs
node check-imgs.js        # IMG map <-> assets/img/*.jpg, both directions
node serve.js             # :8931 (or any static server)
```

Then LOOK at each stop: annotation lands on the thing it names? labels sit on dark areas?
zoom frames the subject? If a label drowns on a bright region, move the x/y — contrast
beats cleverness.

**`shot.js` — true-viewport screenshots with a layout check:**
```
node shot.js "http://localhost:8931/index.html" 390 844 out.png 5000 [--evalfile file.js]
```
It drives headless Edge over CDP (`Emulation.setDeviceMetricsOverride`), so it can render
genuine 360/390/480px viewports, prints `{iw, sw, sh, bad[]}` where `bad` flags elements
overflowing the viewport (`sw > iw` = horizontal overflow bug), and writes a PNG. Capture
at 390 (phones) and 1600 (desktop) for every new object. It runs in REAL time — set
`waitMs` long enough for boot + image load + any driver timers (~4.5s per scripted step).

**To script a specific stop** (no URL router exists): copy `index.html` to
`test-open.html` and append a driver before `</body>` that reads `?d=` (object index
0-9), `?s=` (ArrowRight steps), `?r=1` (ArrowLeft to the room stop — the driver waits
2600ms after Left so the room transition settles before stepping), `?g=1` (open the
full finale; works from home via the "g" key), and dispatches
`document.dispatchEvent(new KeyboardEvent("keydown", {key}))` — descent binds keydown on
`document`; digits 1-9/0 open objects from home, ≥1400ms between ArrowRight steps.
Delete `test-open.html` when done.

**Headless pitfalls already burned once — don't relearn them:**
- `--window-size=390` silently floors at ~492px and the PNG comes out as a CROP of the
  larger layout. Use `shot.js` (emulation), never `--window-size`, for mobile checks.
- Plain `--dump-dom` runs never pump `requestAnimationFrame` → finale stats show zeros
  and `#finale-quote` renders empty. Not a bug; screenshot mode pumps frames.
- Under `--virtual-time-budget` the rAF clock and `performance.now()` disagree, so
  `countUp` prints negative garbage in captures. Real-time runs (shot.js) settle at the
  true values (77 / 82 / 4 / 8 / 5). `countUp` is also clamped to ≥0 as of session 3.
- Reused headless profiles serve stale cached JS — use a fresh `--user-data-dir`
  (shot.js makes a temp one per run) or you'll debug yesterday's build.

## What NOT to do
- No faces in images (the app's people-free rule holds the documentary tone).
- No numbers you can't defend — "0.4 kg of copper" survives scrutiny; "2.4× more durable" doesn't.
- No second accent color, no border-radius, no shadows — the brutalism rules in `brand.md` hold.
- Don't extend a journey past 9 stops or under 5; the pip bar and the ladder both assume it.
