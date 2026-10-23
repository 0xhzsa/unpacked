# UNPACKED — Brand Kit & Art Direction

**Project:** UNPACKED  
**Format:** Interactive website  
**Premise:** Start in a modern room. Zoom into any object. Unpack its entire manufacturing chain — raw material, tooling, process, logistics — the engineer's answer to "I, Pencil" (Leonard Read, 1958).  
**Art direction:** Print-shop riso/zine (2026-10-23 re-theme) — near-white paper ground,
true near-black ink linework, one loud vermilion accent, saturated flat tag colors,
hand-written annotations. Editorial structure (hairlines, mono labels, radius 0, no
shadows) unchanged from the parchment-era manual look. Live tokens in **§ 14 riso/zine —
CURRENT** (bottom of file). Superseded directions: § 1–12 industrial brutalism (historical),
§ 13 banagale parchment (historical).

---

> **⚠ HISTORICAL:** every section between here and § 13 documents the ORIGINAL
> "industrial brutalism" direction (near-black canvas, amber `#e8861d` accent, Archivo /
> Newsreader fonts). It shipped 2026-09 → 2026-10-21 and is superseded. Kept for
> archaeology only — do not build new surfaces from it. Many of its sections (Tailwind
> config, Sharp Grotesk stack) never matched the shipped pure-CSS implementation.

---

## 1. Anti-slop rules (hard constraints)

Do not use any of the following, under any circumstance:

- Flat SVG illustration of any kind
- Generic "tech blue" gradients, glows, or neon accents
- Drop shadows, box shadows, `drop-shadow` filters, or elevated cards
- Rounded corners of any radius (including pills, circles, and softly rounded buttons)
- Looping decorative animations (infinite spins, pulses, floats, marquees, animated grain)
- AI-tell copy: "it's not X, it's Y", "no X, no Y, no Z" lists, trailing comma clauses, "revolutionary", "seamless", "unlock", "elevate", "empower"

If it looks like a template from a landing-page builder, it is wrong.

---

## 2. Art direction statement

**Industrial brutalism.**

- Sharp 90° corners everywhere. `border-radius: 0`.
- 1px solid borders only. `#333333` default, `#e8861d` amber for active/focus states.
- High contrast: near-black background `#090909`, near-white text `#e5e5e5`.
- Technical diagrammatic look: orthographic plates, section lines, centerlines, hatch patterns, dimension lines, title blocks.
- Warm industrial accent: amber/orange `#e8861d`, used sparingly for active states, focus rings, connection paths, and reticles.
- Macaulay-style cutaway aesthetic but computed: exploded views, sectioned parts, and cutaway renders generated from CAD/technical data, never hand-drawn.
- Imagery: duotone, static grain, technical plates. No photography treated with warm filters.

---

## 3. Color palette

All values in hex. Neutral base is near-black + warm gray. Single accent hue: industrial amber.

| Role | Hex | Usage |
|------|-----|-------|
| `ink` (background) | `#090909` | Page body, room canvas, dark surfaces |
| `surface` | `#131313` | Panels, cards, modals, echelon rail |
| `surfaceHover` | `#1c1c1c` | Hovered/pressed surface |
| `border` | `#333333` | 1px default borders, divider lines, graph edges |
| `borderFocus` | `#e8861d` | Active/focus borders, hotspot rings, active node paths |
| `text` | `#e5e5e5` | Primary body copy, labels, titles |
| `textMuted` | `#8a8a8a` | Secondary metadata, captions, inactive states |
| `textDim` | `#525252` | Disabled text, placeholder, future-state nodes |
| `amber-950` | `#451a03` | Deep amber, dark UI on accent |
| `amber-900` | `#7c2d12` | — |
| `amber-800` | `#9a3412` | — |
| `amber-700` | `#c2410c` | — |
| `amber-600` | `#e8861d` | Primary accent: focus rings, active hotspots, traversed graph edges |
| `amber-500` | `#fb923c` | — |
| `amber-400` | `#fdba74` | — |
| `amber-100` | `#ffedd5` | Amber text on dark amber backgrounds only |

**No gradients.** Flat fills only. Amber is never used as a background wash; it is an accent line, dot, border, or text highlight.

---

## 4. Typography

### Font stacks

**`sans`** — headings, UI labels, data  
`"Sharp Grotesk"`, `"Söhne"`, `"Akzidenz-Grotesk"`, `"Helvetica Now Text"`, `Helvetica`, `Arial`, `sans-serif`

**`mono`** — technical specs, material callouts, part numbers, temperatures, code-like data  
`"IBM Plex Mono"`, `Menlo`, `Monaco`, `"Courier New"`, `monospace`

### Sizes (px, 16px base)

| Token | px | rem | Usage |
|-------|-----|-----|-------|
| `xs` | 12 | 0.75 | Captions, port labels, metadata |
| `sm` | 14 | 0.875 | Body secondary, node subtitles |
| `base` | 16 | 1 | Body copy, panel text |
| `lg` | 18 | 1.125 | Section intros |
| `xl` | 20 | 1.25 | Hotspot labels, echelon headers |
| `2xl` | 24 | 1.5 | Room view object titles |
| `3xl` | 30 | 1.875 | Major section headings |
| `4xl` | 36 | 2.25 | Page-level headings |
| `5xl` | 48 | 3 | Landing hero |
| `6xl` | 60 | 3.75 | Title-block scale |

### Line heights

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | 1.25 | Headings, numbers |
| `snug` | 1.375 | Body copy |
| `normal` | 1.5 | Long-form spec text |
| `relaxed` | 1.625 | Documentation panels |

### Weights

- `400` — regular body
- `600` — semi-bold headings, labels
- `800` — data, years, temperatures, part numbers (mono)

### Letter spacing

- Headings: `-0.02em` (`tracking-tight`)
- Body: `0` (`tracking-normal`)
- Uppercase labels, breadcrumbs, port IDs: `0.05em` (`tracking-wider`)

### Numbers

All technical figures (temperatures, dates, dimensions, tolerances) set in **mono**, tabular numerals, weight `800`. Example: `220°C`, `1869`, `P20`, `±0.025 mm`.

---

## 5. Spacing system

Base grid: **4px**. All padding, margin, gap, and inset values snap to this grid.

| Token | px | rem |
|-------|-----|-----|
| `0.5` | 2 | 0.125 |
| `1` | 4 | 0.25 |
| `1.5` | 6 | 0.375 |
| `2` | 8 | 0.5 |
| `2.5` | 10 | 0.625 |
| `3` | 12 | 0.75 |
| `3.5` | 14 | 0.875 |
| `4` | 16 | 1 |
| `5` | 20 | 1.25 |
| `6` | 24 | 1.5 |
| `7` | 28 | 1.75 |
| `8` | 32 | 2 |
| `9` | 36 | 2.25 |
| `10` | 40 | 2.5 |
| `12` | 48 | 3 |
| `14` | 56 | 3.5 |
| `16` | 64 | 4 |
| `20` | 80 | 5 |
| `24` | 96 | 6 |
| `28` | 112 | 7 |
| `32` | 128 | 8 |
| `40` | 160 | 10 |
| `48` | 192 | 12 |
| `56` | 224 | 14 |
| `64` | 256 | 16 |

Gutter between room canvas and echelon panel: `space-16` (64px) minimum. Inner panel padding: `space-4` (16px) all sides. Component gap: `space-2` (8px) or `space-3` (12px).

---

## 6. Borders, radius, shadows

- **Border radius:** `0` everywhere. `rounded-none` is the only radius utility used. No exceptions for buttons, inputs, avatars, badges, or panels.
- **Border width:** `1px` solid. Default color `#333333`. Active/focus color `#e8861d`.
- **Shadow:** `none`. `box-shadow` and `drop-shadow` are banned globally. Depth is expressed through border contrast and surface layering (`#090909` → `#131313` → `#1c1c1c`), never through blur.
- **Outline:** `focus-visible` shows a `2px solid #e8861d` ring with `-2px` offset. Not a shadow; a crisp industrial focus mark.
- **Dividers:** `border-b border-border` between list rows. No horizontal rules with gradients.

---

## 7. Motion principles

- **Easing:** `linear` only, or `steps(n, jump-end)` for discrete state changes. No `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier` with overshoot, `bounce`, or `elastic`.
- **Durations:** `75ms` (micro), `150ms` (fast), `300ms` (normal), `500ms` (slow), `750ms` (slowest).
- **Transitions:** Allowed only on user-triggered state changes — hover, focus, active, open/close, zoom in/out.
- **No looping decorative animation:** No infinite spins, pulses, floats, shimmers, or animated film grain. Grain is a static noise overlay.
- **Zoom:** The core room → object zoom moves linearly, no spring, no overshoot, no bounce-back. Camera arrives at a hard stop.
- **Graph traversal:** Node activation advances in discrete steps (`steps(4, jump-end)`), one echelon per frame, no interpolation drift.

---

## 8. Imagery treatment

- **Duotone:** All photographic material rendered in near-black `#090909` + amber `#e8861d` duotone. No full-color photography, no warm filters, no vignettes.
- **Grain:** Static monochrome noise overlay at 4–6% opacity over images and large surfaces. Non-animated. Applied as a fixed SVG noise filter or static PNG, never a CSS-animated grain loop.
- **Technical plates:** Object interiors shown as orthographic cutaway plates — section lines at 45°, centerlines, dimension chains, hatch patterns, title-block metadata blocks (part, material, process, date, scale). Generated from CAD/technical data, computed geometry, not hand-drawn illustration.
- **Exploded views:** Parts separated along their axis of assembly with 1px solid connector lines between original and displaced position.
- **No flat SVG icons.** UI marks are CSS-drawn: squares, crosses, lines, dots. 1px strokes, 0 radius.

---

## 9. UI component specs

### (1) Object hotspot

The clickable marker placed on an object in the room view (e.g., on a pencil, a telephone, a chair).

**Geometry**
- Square, `24×24px`, `border-radius: 0`.
- `1px solid #333333` border, background `#090909`.
- Center mark: `2px` solid crosshair, `#e8861d`, inset `2px` from edges.

**States**

| State | Border | Fill | Center mark |
|-------|--------|------|-------------|
| Default | `1px #333333` | `#090909` | `#e8861d` |
| Hover / focus | `1px #e8861d` | `#131313` | `#e8861d` |
| Active / selected | `2px #e8861d` | `#e8861d` | `#090909` |
| Disabled | `1px #525252` | `#090909` | `#525252`, opacity `0.5` |

**Label (on hover/focus)**
- Mono `12px`, uppercase, `tracking-wider`, text `#e5e5e5`.
- Container: `1px solid #333333`, background `#131313`, padding `4px 8px`, `0` radius, no shadow.
- Positioned above the hotspot with `4px` gap, linear `150ms` fade.

**Forbidden:** drop shadow, glow, pulse, bounce, circular shape, rounded pill label.

### (2) Echelon panel

Right-side rail showing the manufacturing chain echelons for the selected object (raw material → tooling → process → assembly → logistics → retail).

**Layout**
- Fixed right rail, width `360px`, full viewport height.
- `border-left: 1px solid #333333`, background `#090909`.
- Inner padding `space-4` (16px).

**Header**
- Mono `10px`, uppercase, `tracking-wider`, text `#e8861d`.
- Breadcrumb chain: `RAW MATERIAL → TOOLING → PROCESS → ASSEMBLY`, separators `→` in `#8a8a8a`.
- Active echelon pill: `1px solid #e8861d`, text `#e8861d`, padding `2px 6px`, `0` radius.

**Echelon rows**
- Each row: full width, padding `space-3` (12px) vertical × `space-4` (16px) horizontal, `border-bottom: 1px solid #1c1c1c` (last row no border).
- Primary label: mono `13px`, `#e5e5e5`, weight `600`.
- Meta line: mono `11px`, `#8a8a8a` — material, process, temperature, tolerance.
- Active row: background `#131313`, `border-left: 2px solid #e8861d`, text `#e5e5e5`.
- Future row (not yet reached): text `#525252`, opacity `0.6`, border-bottom `#131313`.

**Interaction**
- Row activation: linear `150ms` background/color transition. No slide, no bounce.
- Chevron: mono `>` character, `11px`, rotates `90deg` linearly `150ms` on expand (discrete, not continuous spin).
- Scrollbar: thin, track `#131313`, thumb `#333333`, `0` radius.

**Forbidden:** card shadows, rounded corners, sticky hover lifts, animated reveals.

### (3) Manufacturing graph node

A node in the manufacturing graph, representing one process step (e.g., injection molding, wire coiling, celluloid casting).

**Geometry**
- Rectangular, `0` radius, `1px solid #333333`, background `#0f0f0f`.
- Padding `space-3` (12px) × `space-4` (16px).
- Min width `200px`, height auto; title height `48px` for single-line, `64px` wrapped.

**Contents**
- Title: mono `12px`, weight `800`, `#e5e5e5` — e.g., `INJECTION MOLDING`.
- Subtitle: mono `11px`, `#8a8a8a` — e.g., `P20 tool steel cavity · 220°C ABS · 60-ton clamp · 14s cycle`.
- Connection ports: `2×2px` solid squares, `#e8861d`, at mid-left and mid-right edges. Inactive ports: `#333333`.

**States**

| State | Border | Fill | Title |
|-------|--------|------|-------|
| Default | `1px #333333` | `#0f0f0f` | `#e5e5e5` |
| Visited | `1px #e8861d` | `#0f0f0f` | `#e8861d` |
| Current | `2px #e8861d` | `#e8861d` | `#090909` weight `800` |
| Future | `1px #1c1c1c` | `#090909` | `#525252` |

**Edges (connections between nodes)**
- Orthogonal 90° routing only. `1px solid #333333`.
- Traversed path: `1px solid #e8861d`, stepped `steps(4, jump-end)` activation.
- Arrowheads: `4×4px` filled squares at line terminations, matching line color.

**Forbidden:** hover lift, shadow, glow, rounded node corners, curved bezier edges, pulse animations.

---

## 10. Tailwind config

Exact `tailwind.config.js`. Extends theme only; no base component bloat.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    // Drop shadow and ring utilities are banned by art direction.
    // Kept disabled so they cannot be accidentally used.
    dropShadow: false,
    ring: false,
    ringOffset: false,
    divideOpacity: false,
    ringColor: false,
    ringWidth: false,
  },
  theme: {
    extend: {
      colors: {
        ink: '#090909',
        surface: '#131313',
        surfaceHover: '#1c1c1c',
        border: '#333333',
        borderFocus: '#e8861d',
        text: '#e5e5e5',
        textMuted: '#8a8a8a',
        textDim: '#525252',
        amber: {
          950: '#451a03',
          900: '#7c2d12',
          800: '#9a3412',
          700: '#c2410c',
          600: '#e8861d',
          500: '#fb923c',
          400: '#fdba74',
          100: '#ffedd5',
        },
      },
      fontFamily: {
        sans: [
          '"Sharp Grotesk"',
          '"Söhne"',
          '"Akzidenz-Grotesk"',
          '"Helvetica Now Text"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          'Menlo',
          'Monaco',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.25', letterSpacing: '0.05em' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['20px', { lineHeight: '1.375', letterSpacing: '-0.02em' }],
        '2xl': ['24px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '5xl': ['48px', { lineHeight: '1.125', letterSpacing: '-0.02em' }],
        '6xl': ['60px', { lineHeight: '1.125', letterSpacing: '-0.02em' }],
      },
      fontWeight: {
        regular: '400',
        semi: '600',
        data: '800',
      },
      letterSpacing: {
        tighter: '-0.02em',
        normal: '0',
        wide: '0.05em',
      },
      spacing: {
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
        40: '160px',
        48: '192px',
        56: '224px',
        64: '256px',
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0',
        full: '0',
      },
      boxShadow: {
        none: 'none',
        DEFAULT: 'none',
      },
      transitionTimingFunction: {
        linear: 'linear',
        step: 'steps(4, jump-end)',
        stepEnd: 'steps(6, jump-end)',
      },
      transitionDuration: {
        75: '75ms',
        150: '150ms',
        300: '300ms',
        500: '500ms',
        750: '750ms',
      },
      animation: {
        none: 'none',
      },
      keyframes: {
        // Intentionally empty. No looping decorative animations.
      },
      zIndex: {
        hide: '-1',
        auto: 'auto',
        base: '0',
        docked: '10',
        hotspot: '20',
        panel: '30',
        zoom: '40',
      },
    },
  },
  plugins: [],
}
```

### Utility class map for components

| Component | Classes |
|-----------|---------|
| Object hotspot | `absolute w-6 h-6 border border-border bg-ink border-amber-600 focus-visible:outline-none focus-visible:border-amber-600 focus-visible:ring-0` |
| Hotspot mark | `absolute inset-2 border-t border-amber-600 border-l border-amber-600` |
| Hotspot label | `absolute mx-auto -space-y-2 px-3 py-1 text-[10px] font-mono font-semi tracking-wide uppercase text-text border border-border bg-surface` |
| Echelon panel | `fixed right-0 top-0 h-full w-[360px] border-l border-border bg-ink p-4` |
| Echelon row | `flex items-center gap-3 px-4 py-3 border-b border-surfaceHover last:border-0` |
| Echelon row active | `bg-surface border-l-2 border-amber-600` |
| Graph node | `flex flex-col gap-1 px-4 py-3 border border-border bg-[#0f0f0f] min-w-[200px]` |
| Graph node current | `border-2 border-amber-600 bg-amber-600 text-ink` |
| Graph edge | `h-[1px] w-full bg-border` |
| Graph edge active | `bg-amber-600` |
| Mono data | `font-mono font-data text-[11px]` |

---

## 11. Tone & voice

Precise, specific, technical. Real materials, real specs, real history. No marketing abstractions.

**Copy rules**
- State the material, the process, the temperature, the date, the tolerance. If you cannot name it, do not write it.
- Use active voice. Imperative where appropriate.
- No "it's not X, it's Y". No "revolutionary", "seamless", "unlock", "empower", "elevate", "game-changing", "disruptive".
- No trailing comma clauses. No "no X, no Y, no Z" lists.
- Numbers set in mono, tabular, weight `800`: `220°C`, `1869`, `P20`, `±0.025 mm`, `60-ton`.

**Approved reference material (use these, do not paraphrase into fluff)**

- **P20 tool steel** — pre-hardened mold steel, ~280–350 HB, used for injection mold cavities. Common in consumer-plastic tooling.
- **ABS** — acrylonitrile butadiene styrene, processed around `220°C`, injection-molded, cycle time `14s` on a `60-ton` clamp for small parts.
- **Hyatt celluloid** — `1869`, John Wesley Hyatt, camphor + nitrocellulose, first commercially successful synthetic plastic, ivory substitute for billiard balls.
- **Wafios coilers** — Wafios AG (Reutlingen, Germany), wire-forming and coiling machinery, used for drawn steel wire springs and forms.
- **Graphite** — mined, milled, mixed with clay, fired; pencil "lead" contains no lead.
- **Incense-cedar** — `Libocedrus decurrens`, California, slatted for pencil casings.
- **Brass ferrule** — crimped to hold eraser to pencil.

**Example microcopy**

- `P20 tool steel cavity · 220°C ABS · 60-ton clamp · 14s cycle · ±0.025 mm`
- `Hyatt celluloid · 1869 · camphor + nitrocellulose · first synthetic plastic`
- `Wafios coiler · drawn steel wire · 0.8mm · coil diameter 12mm`
- `ECHELON 0 → TOOLING → PROCESS → ASSEMBLY → LOGISTICS`
- `PART NO. 114-A · MATERIAL: P20 · PROCESS: INJECTION MOLDING · SCALE 2:1`

**Do / Don't**

| Do | Don't |
|----|-------|
| `Injection molding · 220°C ABS · P20 tool steel` | `It's not just plastic, it's a story` |
| `±0.025 mm tolerance` | `Precision you can feel` |
| `ECHELON 3 · ASSEMBLY · 1958` | `Seamlessly explore the journey` |
| `Wafios coiler, wire diameter 0.8mm` | `Unlock the making` |

---

## 12. Page behavior notes

- **Room view:** Starting point. Modern room, objects placed on surfaces. Near-black canvas, 1px grid floor, no shadows on objects (shadows implied by edge contrast and value steps only).
- **Zoom:** Clicking an object hotspot zooms linearly `300–500ms` into the object. Room dissolves into the first echelon panel; graph node for echelon 0 opens.
- **Drill-down:** Clicking a graph node advances to the next echelon, stepped `steps(4, jump-end)`, one echelon per frame. Path edge fills amber as traversed.
- **No parallax, no floating elements, no decorative motion.** Camera moves are computed linear translations.

---

## 13. banagale — HISTORICAL direction (2026-10-21 redesign, superseded 2026-10-23)

> **⚠ SUPERSEDED by § 14.** Kept for archaeology; the hexes below describe the old
> parchment theme and no longer match the shipped tokens. The structural rules
> (anti-slop spine, node color SEMANTICS, photography unfiltered) all carried into § 14 —
> only the values changed.

**Banagale parchment.** The site reads like a page from a printed technical manual or a
field notebook: warm paper ground, warm-brown ink linework, brick-red accent, hand-written
caveats. Photography stays full-color and unfiltered; the ink system is data (CSS tokens +
canvas constants), applied like presswork.

Non-negotiables (same anti-slop spine as the historical sections above):

- No flat SVG illustration; photography is the image layer.
- No decorative gradients. The one allowed exception is the content text sheet's vertical
  cream-to-paper tint — a material reference for sheet paper, not a color wash.
- No drop shadows, no floating cards, no rounded corners (radius 0 everywhere),
  no looping decorative animation, no AI-tell copy.
- Depth comes from hairline 1px ink borders and value steps between paper tones, never blur.

### Tokens (css/style.css `:root`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper` | `#e9dec4` | Page ground, canvas bg, palette fallback, theme-color, favicon |
| `--paper-plate` | `#f3ead4` | Panels, chips, graph node fill, press/schematic plate |
| `--cream` | `#f6efdd` | Lightest sheet tone (text sheet top edge) |
| `--ink` | `#44321f` | Primary text, metals/electronics/oil node borders |
| `--ink-faded` | `#6e5a40` | Muted text, wood/timber/stoneware borders |
| `--pale` | `#93805f` | Hairlines, dimension lines, minerals/paper/glass borders |
| `--brick` | `#b65c38` | Accent: active, focus, current node, machine echelon, picks |
| `--brick-deep` | `#94472a` | Accent hover/pressed, bauxite border |
| `--mustard` | `#c9a04e` | Wax/candle/copper/adhesive borders, warm marks |
| `--sage` | `#8a9471` | Plant/fiber borders, quiet tags |
| `--steel` | `#6e8896` | Machine borders, steel lines in schematics |

Typography: **Alegreya SC** (small-caps display), **Alegreya** (body serif),
**Caveat** (hand annotations), **IBM Plex Mono** (technical labels). Text is warm brown
ink on paper — never neutral gray.

### Finale-graph node border colors (`js/content.js`, painted by `js/graph.js`)

Semantic, every hex must sit on parchment: machines `#6e8896` · metals/electronics/oil
`#44321f` · plastics/glaze `#b65c38` · bauxite `#94472a` · sand/kaolin/feldspar/glass/paper
`#93805f` · plants/rattan/cotton `#8a9471` · wood/timber/stoneware `#6e5a40` ·
wax/candle/copper/adhesive `#c9a04e`. Current node = brick 2px border + hot fill; visited
= brick text; future = dimmed. Same list is in AUTHORING.md §2 — pick by material family
when adding nodes.

---

## 14. riso/zine — CURRENT direction (2026-10-23 re-theme)

**Print-shop riso.** The site reads like a page fresh off a risograph: near-white paper,
true near-black ink, one loud vermilion accent, saturated flat tag colors. Same editorial
spine as before — hairline 1px rules, small-caps and mono labels, radius 0, no shadows,
hand-written Caveat annotations, full-color unfiltered photography — but the ground switched
from sepia parchment to crisp gallery-white for legibility and punch (millennials/Gen Z read
it as zine/riso-print culture, not AI gradient mush).

Non-negotiables (unchanged): no flat SVG illustration, no decorative gradient WASHES on
components (the one exemption is the page-ground atmosphere in `--atmo` — a light/falloff
treatment like a photo on lit paper, plus the content-sheet cream-to-paper tint as a
material reference), no drop shadows, no rounded corners, no looping decorative animation,
no AI-tell copy. Depth from hairlines and value steps between paper tones, never blur.

### Tokens (css/style.css `:root`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper` | `#f6f7f2` | Page ground, canvas bg, palette fallback, theme-color, favicon |
| `--paper-plate` | `#eef1ec` | Panels, chips, graph node fill, press/schematic plate |
| `--atmo` | (CSS var, gradient stack) | Page/stage atmosphere: white top light, sage floor falloff (`#f7f8f4 → #dde3d8`), faint vermilion dawn at top-left (8%), soft ink floor shadow — shared by `body` and `#stage` so every view sits in the same "lit paper" |
| `--tooth` | (CSS var, SVG feTurbulence) | Static paper-grain overlay (5% alpha ink noise) applied over body + stage |
| `--cream` | `#ffffff` | Lightest sheet tone (text sheet top edge), button fills |
| `--ink` | `#181410` | Primary text, dark linework, metals/electronics/oil node borders |
| `--ink-faded` | `#5c564c` | Muted text (incl. labels formerly at ink-faint), wood/timber/stoneware borders |
| `--ink-faint` | `#a49e92` | Hairlines, dimension lines, borders only — never text |
| `--brick` | `#e0472b` | THE accent: vermilion — active, focus, current node, machine echelon, picks, scroll hint |
| `--brick-deep` | `#b93a1d` | Accent hover/pressed, bauxite border |
| `--mustard` | `#e0a52f` | Wax/candle/copper/adhesive borders, warm marks |
| `--sage` | `#7d9a5e` | Plant/fiber borders, quiet tags |
| `--steel` | `#5b7f96` | Machine borders, steel lines in schematics, magnet south |
| `--iron` | `#77848c` | Iron-toned accents |
| `--magnet-n` | `#e0562f` | Magnet north pole |

Canvas constants (js): press.js `BG #f0ede4, AMBER #e0472b, WARM #e0a52f, STEEL #5b7f96,
EDGE #8e8778` (EDGE lifted from the hairline tone for canvas stroke legibility);
graph.js `FILL #f0ede4, FILL_HOT #faf9f5, TEXT #181410, MUTED #5c564c, DIM #7a7365,
EDGE #a49e92`.

### Finale-graph node border colors (`js/content.js`, painted by `js/graph.js`)

Semantic, every hex must sit on near-white paper: machines `#5b7f96` ·
metals/electronics/oil `#181410` · plastics/glaze `#e0472b` · bauxite `#b93a1d` ·
sand/kaolin/feldspar/glass/paper `#a49e92` · plants/rattan/cotton `#7d9a5e` ·
wood/timber/stoneware `#5c564c` · wax/candle/copper/adhesive `#e0a52f`. Current node =
vermilion 2px border + hot fill; visited = vermilion text; future = dimmed. Same list is in
AUTHORING.md §2 — pick by material family when adding nodes.

### Contrast policy (moving forward)

Text-only minimums on `--paper`: labels ≥ `--ink-faded` (`#5c564c`) or 62%+ ink alpha;
`--ink-faint` is reserved for hairlines and non-text borders. Small text in the accent uses
`--brick-deep` when below 14px. `--mustard`/`--sage`/`--iron` are fill/border tones — not
small-text colors.