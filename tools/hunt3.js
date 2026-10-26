/* hunt3.js — object-stop photo sweep via the Wikimedia Commons API (keyless, generous limits).
   License from extmetadata.LicenseShortName, whitelisted to CC BY / CC BY-SA / CC0 / PD.
   Candidate files are suffixed D/E/F so hunt2 output (A/B/C) is never clobbered.
   usage: node tools/hunt3.js [chainfilter ...] */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const outDir = path.join(__dirname, "uns");
fs.mkdirSync(outDir, { recursive: true });

const sandbox = { window: {} };
for (const f of ["js/journey.js", "js/imgmap.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox);
}
const J = sandbox.window.JOURNEY, IMG = sandbox.window.UnpackedIMG;

const QUERIES = {
  "keyboard": "keyboard keys closeup",
  "keyboard-alt": "computer keyboard black",
  "fridge-player": "Technics SL-1200 turntable",
  "fridge-player-alt": "record player vinyl closeup",
  "glass-window": "rain window night bokeh",
  "glass-window-alt": "condensation window dark moody",
  "candle": "candle flame dark macro",
  "candle-alt": "lit candle black background",
  "slow-rebound-ball": "stress ball",
  "slow-rebound-ball-alt": "squishy ball",
  "ceiling-fan": "ceiling fan dark",
  "ceiling-fan-alt": "ceiling fan wood blades dusk",
  "hardcover-book": "old book still life dark",
  "hardcover-book-alt": "antique leather book moody",
  "led-strip": "led strip light glowing dark",
  "led-strip-alt": "led lights night macro",
  "armchair": "armchair dark interior",
  "armchair-alt": "lounge chair leather studio",
  "matcha-whisk": "chasen bamboo whisk dark",
  "matcha-whisk-alt": "bamboo whisk matcha still life",
  "desk-lamp": "desk lamp glowing dark",
  "desk-lamp-alt": "anglepoise lamp",
  "office-chair": "office chair black studio",
  "office-chair-alt": "swivel chair product photography",
  "steel-desk": "steel desk dark",
  "steel-desk-alt": "metal desk industrial vintage",
  "magnet-power-bank": "power bank black",
  "magnet-power-bank-alt": "portable charger closeup black",
  "insulated-bottle": "steel bottle black background",
  "insulated-bottle-alt": "vacuum flask dark still life",
  "mini-blender": "blender dark still life",
  "mini-blender-alt": "kitchen blender dark moody",
  "ceramic-mug": "ceramic mug dark still life",
  "ceramic-mug-alt": "coffee cup dark moody",
  "wireless-earbuds": "earbuds case black",
  "wireless-earbuds-alt": "wireless earphones macro",
  "portable-ssd": "portable ssd drive aluminum",
  "portable-ssd-alt": "external hard drive black",
  "ballpoint-pen": "ballpoint pen macro dark",
  "ballpoint-pen-alt": "pen still life dark"
};

const UA = "unpackedsite/1.0 (https://github.com/0xhzsa/unpacked; product-photo research; contact via repo)";
const FILTER = process.argv.slice(2);
const GRADES = ["D", "E", "F"];
const OKLIC = ["cc0", "cc by", "cc by-sa", "public domain"];

function stopInfo(chainId) {
  const ch = (J.objects || J.chains || []).find(c => c.id === chainId);
  if (!ch) return null;
  const st = (ch.stops || [])[1] || (ch.stops || []).find(s => s.kind === "object");
  if (!st || !IMG[st.id]) return null;
  return { ch, st, file: IMG[st.id].replace(/\.jpg$/, "") };
}

function stripTags(h) { return String(h || "").replace(/<[^>]*>/g, "").trim(); }

function licOk(raw) {
  const s = String(raw || "").toLowerCase().trim();
  for (const k of OKLIC) if (s.startsWith(k)) return raw;
  return null;
}

async function apiSearch(q) {
  const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
    "&generator=search&gsrnamespace=6&gsrlimit=40&gsrsearch=" + encodeURIComponent(q + " filetype:bitmap") +
    "&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1400";
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error("api " + res.status);
  const j = await res.json();
  return (j.query && j.query.pages || []).filter(p => p.imageinfo && p.imageinfo[0]);
}

const CATS = {
  "insulated-bottle": ["Water bottles", "Vacuum flasks"],
  "magnet-power-bank": ["Power banks"],
  "portable-ssd": ["Solid-state drives", "External hard disk drives"],
  "desk-lamp": ["Desk lamps"],
  "office-chair": ["Office chairs"],
  "armchair": ["Armchairs"],
  "steel-desk": ["Desks"]
};

async function apiCategory(cat) {
  const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
    "&generator=categorymembers&gcmtitle=" + encodeURIComponent("Category:" + cat) +
    "&gcmtype=file&gcmlimit=80&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1400";
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error("catapi " + res.status);
  const j = await res.json();
  return (j.query && j.query.pages || []).filter(p => p.imageinfo && p.imageinfo[0]);
}

async function dl(srcUrl, dest) {
  const res = await fetch(srcUrl, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error("img " + res.status);
  const ab = Buffer.from(await res.arrayBuffer());
  if (ab.length < 22000) throw new Error("small " + ab.length);
  fs.writeFileSync(dest, ab);
  return ab.length;
}

(async () => {
  const mfPath = path.join(outDir, "manifest.json");
  const manifest = fs.existsSync(mfPath) ? JSON.parse(fs.readFileSync(mfPath, "utf8")) : {};
  const chains = (J.objects || J.chains || []).map(c => c.id).filter(id => !FILTER.length || FILTER.some(f => id.includes(f)));
  for (const chainId of chains) {
    const q = QUERIES[chainId] || QUERIES[chainId + "-alt"] || chainId.replace(/-/g, " ");
    const info = stopInfo(chainId);
    if (!info) { console.log("SKIP (no object img)", chainId); continue; }
    const base = info.file;
    try {
      let pages = [];
      for (const cat of (CATS[chainId] || [])) {
        try { const cp = await apiCategory(cat); if (cp.length) pages = pages.concat(cp); } catch (e) { console.log("  cat skip", chainId, e.message); }
      }
      if (pages.length < 6) {
        for (let attempt = 0; attempt < 2 && pages.length < 6; attempt++) {
          try {
            if (attempt) await new Promise(r => setTimeout(r, 3000));
            pages = pages.concat(await apiSearch(q));
            if (QUERIES[chainId + "-alt"]) pages = pages.concat(await apiSearch(QUERIES[chainId + "-alt"]));
          } catch (e) { console.log("  search retry", chainId, e.message); }
        }
      }
      const seenT = {};
      pages = pages.filter(p => (seenT[p.title] ? false : (seenT[p.title] = 1)));
      await new Promise(r => setTimeout(r, 1200));
      let em = manifest[chainId] || (manifest[chainId] = { stopId: info.st.id, file: base, query: q, candidates: [] });
      em.c3 = [];
      // license-clean, .jpg only, >=1000px wide; prefer landscape
      const MINW = parseInt(process.env.HUNT_MINW || "1000", 10);
      const ranked = pages.map(p => {
        const ii = p.imageinfo[0];
        const lic = licOk(ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value);
        if (!lic) return null;
        if (!/\.(jpe?g)$/i.test(p.title || "")) return null;
        if ((ii.width || 0) < MINW) return null;
        const land = ii.width >= ii.height ? 1 : 0;
        return { p, ii, lic, score: land * 2 + (ii.width * ii.height) / 2e7 };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
      for (let k = 0, gi = 0; k < ranked.length && gi < 3; k++) {
        const r = ranked[k];
        const dest = path.join(outDir, base + "-" + GRADES[gi] + ".jpg");
        try {
          const size = await dl(r.ii.thumburl || r.ii.url, dest);
          em.c3.push({
            rank: gi, saved: "tools/uns/" + path.basename(dest),
            src: "wikimedia", page: "https://commons.wikimedia.org/wiki/" + encodeURIComponent((r.p.title || "").replace(/ /g, "_")),
            lic: r.lic, by: stripTags(r.ii.extmetadata.Artist && r.ii.extmetadata.Artist.value) || "unknown",
            w: r.ii.width, h: r.ii.height, size, desc: (r.p.title || "").replace(/^File:/, "").slice(0, 70)
          });
          gi++;
        } catch (e) { /* next */ }
      }
      console.log("OK", chainId, "->", em.c3.length, "candidates (", em.c3.map(c => (c.by || "?") + " | " + c.lic).join(" | "), ")");
    } catch (e) { console.log("FAIL", chainId, e.message); }
  }
  fs.writeFileSync(mfPath, JSON.stringify(manifest, null, 2));
  console.log("WROTE manifest");
})().catch(e => { console.error("FATAL", e); process.exit(1); });
