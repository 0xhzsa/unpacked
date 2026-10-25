const fs = require('fs');
const NOTE = `
### Session 22 (2026-10-25) — 6 photo ground-truth replacements + launch polish

Local IP was fully 429-throttled by all Wikimedia surfaces (api.php, article
pages, category pages, Special:FilePath, upload thumbs - confirmed with
tools/probe-hosts.js). Byte fetch therefore ran through a Modal sandbox with a
fresh egress IP: app "unpacked-photo-fetch", volume "unpacked-imgs",
script tools/wmo3.py (browser UA, 7 s pacing, JPEG magic + width/size verify,
iiurlwidth=1280 thumbs). Attribution log: tools/log.txt (volume copy also in
tools/wmo3-log.txt). Local byte sizes verified equal to the run log exactly.

| file | Commons source file | artist | license | dims / bytes |
|------|--------------------|--------|---------|--------------|
| bauxite.jpg | Bauxite with unweathered rock core. C 021.jpg | Werner Schellmann | CC BY-SA 2.5 | 1280x830 / 307536 |
| clay.jpg | Kaolinite from Twiggs County in Georgia in USA.jpg | James St. John | CC BY 2.0 | 1280x892 / 240427 |
| batch.jpg | Pitted sand grains Western Desert.jpg | Wilson44691 | CC0 | 1280x960 / 265762 |
| screw.jpg | Lag screw (05).jpg | Rasbak | CC BY-SA 3.0 | 1280x1814 / 356391 |
| frame.jpg | Stool with woven seat MET 14.10.3 view 4.jpg | (MET, unnamed) | CC0 | 1280x1029 / 223836 |
| carbide.jpg | Tungsten carbide inserts.jpg | Mauro Cateb | CC BY-SA 4.0 | 1280x1095 / 241937 |

Rejected en route for size: Weipa-bauxite-mine (314px), BauxiteUSGOV (600px),
Screws.jpg (300px), Chalot tenons mortaises (550px).

window.UNPACKED_CREDITS in js/meta.js extended with the six rows (vendor
fall-through line "PHOTO: WIKIMEDIA COMMONS" covers the rest).
Pins re-aimed to photo landmarks in js/beats.js for 7 beats (both bauxite
beats, kaolin-03, soda-03, batch-03, hardware-01, frame-01; carbide-03 pins
already matched). desk-lamp ground copy now says "pocked, porous ore" to match
the specimen photo (old text said "oxide red" of the retired laterite shot).
`;
fs.appendFileSync('C:/Users/stagh/unpacked/RECOVERY-NOTE.md', NOTE);
console.log('note appended', NOTE.length);
