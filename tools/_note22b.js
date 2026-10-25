const fs = require('fs');
const NOTE = `
### Session 22b (2026-10-25) — round-2 photo upgrades (6 weak files)

Same fresh-IP Modal pipeline, script tools/wmo4.py, app "unpacked-photo-fetch-2",
volume "unpacked-imgs", attribution log tools/vol/log2.txt (byte sizes verified
equal to local pulls).

| file | Commons source file | artist | license | dims / bytes |
|------|--------------------|--------|---------|--------------|
| press-a.jpg | PlasticsInjectionMoulderJones.jpg | (unmarked) | CC BY-SA 2.5 | 1280x910 / 292190 |
| press-b.jpg | LegoSpritzguss.JPG | Arne Hückelheim | CC BY 3.0 | 1280x853 / 217688 |
| stamping.jpg | Deep Draw Line example by Pressteck Italy.jpg | Presteck S.p.A Italy | CC BY-SA 2.0 | 1173x407 / 58361 |
| pen.jpg | 03-BICcristal2008-03-26.jpg | Trounce | CC BY 3.0 | 1280x857 / 62466 |
| portable-ssd-smt-02.jpg | Smt_closeup.jpg | John Fader | CC BY-SA 3.0 | 1024x800 / 209519 |
| carbide.jpg | Tungsten carbide.jpg | Splarka | Public domain | 1200x500 / 97918 |

Rejected en route (width < 950): SMT-Bestueckung 600px, PlaceC5 350px,
Inserti_widia 656px, Schneidplättchen aus Widia 903px.

Pins: StationView renders no pins; the pin surface is RideView (full-screen
cover). Ride window exposes only the center ~31% of photo width (stamping:
center 16%, 2.07x upscale), so all nine affected beats' pins were aimed into
that window and verified by ride screenshots (tools/qa-r2r-*.png): keyboard
inj-02, chair injection-02 (heading now "The Mold" - photo is a mold + ejected
part, not a machine), steel-desk-press-02, ceiling-fan-stamping-02,
insulated-bottle-press-02, mini-blender-blades-01, portable-ssd-smt-02,
ballpoint-pen-01, ballpoint-pen-carbide-03.
Image URLs bumped ?v=4 -> ?v=5 so browsers drop the cached round-1 bytes.
UNPACKED_CREDITS: carbide row replaced, 5 rows added (6 files).
`;
fs.appendFileSync('C:/Users/stagh/unpacked/RECOVERY-NOTE.md', NOTE);
console.log('note appended', NOTE.length);
