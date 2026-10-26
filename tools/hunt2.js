/* hunt2.js — object-stop photo sweep via Openverse (CC-licensed, attribution metadata included).
   Outputs: tools/uns/<file>.{A,B,C}.jpg + manifest.json */
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
  "desk-lamp": "table lamp night",
  "desk-lamp-alt": "desk lamp glow",
  "office-chair": "office chair black modern dark",
  "ceramic-mug": "ceramic mug coffee dark",
  "steel-desk": "steel table workshop",
  "steel-desk-alt": "metal desk industrial",  "glass-window": "window pane night light bokeh",
  "hardcover-book": "hardcover book dark still life",
  "hardcover-book-alt": "book pages vintage macro",
  "ceiling-fan": "ceiling fan blades closeup",
  "ceiling-fan-alt": "fan blades ceiling",
  "armchair": "rattan armchair",
  "armchair-alt": "wicker chair indoor",
  "insulated-bottle": "steel bottle water flask dark",
  "insulated-bottle-alt": "thermos flask black",
  "wireless-earbuds": "earbuds case macro dark",
  "wireless-earbuds-alt": "earphones black macro",
  "magnet-power-bank": "power bank battery dark",
  "magnet-power-bank-alt": "power bank charger black",
  "slow-rebound-ball": "ball sphere macro dark blue",
  "slow-rebound-ball-alt": "rubber ball macro",
  "mini-blender": "blender kitchen counter moody",
  "mini-blender-alt": "blender smoothie dark",
  "portable-ssd": "ssd drive electronics macro dark",
  "portable-ssd-alt": "hard drive black macro",
  "keyboard": "mechanical keyboard keycaps macro",
  "keyboard-alt": "mechanical keyboard backlit closeup",
  "desk-lamp": "led desk lamp glowing dark",
  "desk-lamp-alt": "desk lamp black studio",
  "office-chair": "gaming office chair dark studio",
  "office-chair-alt": "ergonomic chair black product",
  "steel-desk": "steel table industrial workbench",
  "steel-desk-alt": "metal table black studio",
  "glass-window": "rain window night bokeh",
  "glass-window-alt": "condensation window dark moody",
  "hardcover-book": "hardcover book dark moody",
  "hardcover-book-alt": "stack of books dark still life",
  "ceiling-fan": "ceiling fan blades closeup",
  "ceiling-fan-alt": "fan blades ceiling minimal",
  "candle": "candle flame dark macro",
  "candle-alt": "lit candle black background",
  "armchair": "rattan armchair studio",
  "armchair-alt": "wicker chair rattan product",
  "insulated-bottle": "insulated steel bottle black",
  "insulated-bottle-alt": "steel tumbler water bottle product",
  "matcha-whisk": "matcha whisk chasen bamboo",
  "matcha-whisk-alt": "matcha whisk dark",
  "led-strip": "led strip light glow closeup",
  "led-strip-alt": "rgb led strip macro dark",
  "magnet-power-bank": "magnetic power bank black",
  "magnet-power-bank-alt": "power bank minimal black product",
  "slow-rebound-ball": "stress ball squeeze macro",
  "slow-rebound-ball-alt": "foam ball macro dark",
  "mini-blender": "portable blender dark moody",
  "mini-blender-alt": "blender glass closeup dark kitchen",
  "fridge-player": "vinyl record turntable dark",
  "fridge-player-alt": "turntable stylus closeup"
};
const FILTER = process.argv.slice(2);
const UA = "unpackedsite/1.0 (educational demo; contact via github 0xhzsa/unpacked)";
const TMO = 22000;

function stopInfo(chainId) {
  const ch = (J.objects || J.chains || []).find(c => c.id === chainId);
  if (!ch) return null;
  const st = (ch.stops || [])[1] || (ch.stops || []).find(s => s.kind === "object");
  if (!st || !IMG[st.id]) return null;
  return { ch, st, file: IMG[st.id].replace(/\.jpg$/, "") };
}

async function openverse(q) {
  const url = "https://api.openverse.org/v1/images/?q=" + encodeURIComponent(q) + "&page_size=16&filter_dead=false&license_type=commercial,modification";
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(TMO) });
  if (!res.ok) throw new Error("openverse " + res.status);
  const j = await res.json();
  return (j.results || []).filter(r => r.url);
}

async function dl(srcUrl, dest) {
  const res = await fetch(srcUrl, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TMO) });
  if (!res.ok) throw new Error("img " + res.status);
  const ab = Buffer.from(await res.arrayBuffer());
  if (ab.length < 22000) throw new Error("small " + ab.length);
  fs.writeFileSync(dest, ab);
  return ab.length;
}

(async () => {
  const mfPath = path.join(outDir, "manifest.json");
  const existing = fs.existsSync(mfPath) ? JSON.parse(fs.readFileSync(mfPath, "utf8")) : {};
  const manifest = Object.assign({}, existing);
  const chains = (J.objects || J.chains || []).map(c => c.id).filter(id => !FILTER.length || FILTER.some(f => id.includes(f)));
  for (const chainId of chains) {
    const q = QUERIES[chainId] || QUERIES[chainId.replace(/-0?\d$/, "")] || chainId.replace(/-/g, " ");
    const info = stopInfo(chainId);
    if (!info) { console.log("SKIP (no object img)", chainId); continue; }
    const base = info.file;
    try {
      let results = [];
      for (let attempt = 0; attempt < 2 && !results.length; attempt++) {
        try {
          await new Promise(r2 => setTimeout(r2, attempt ? 12000 : 0));
          results = await openverse(q);
          if (!results.length && QUERIES[chainId + "-alt"]) results = await openverse(QUERIES[chainId + "-alt"]);
        } catch (e) { console.log("  search retry", chainId, e.message); }
      }
      await new Promise(r2 => setTimeout(r2, 7000));
      /* landscape, bigger-area, non-empty-title first */
      results = results.map(r => {
        const land = r.width && r.height ? (r.width >= r.height ? 1 : 0) : 0.5;
        const area = (r.width || 1000) * (r.height || 700);
        return { r, score: land * 2 + area / 1e7 };
      }).sort((a, b) => b.score - a.score).map(x => x.r);
      manifest[chainId] = { stopId: info.st.id, file: base, query: q, candidates: [] };
      const grades = ["A", "B", "C"];
      for (let k = 0, gi = 0; k < results.length && gi < 3; k++) {
        const r = results[k];
        const grade = grades[gi];
        const dest = path.join(outDir, base + "-" + grade + ".jpg");
        try {
          const size = await dl(r.url, dest);
          manifest[chainId].candidates.push({
            rank: gi, saved: "tools/uns/" + path.basename(dest),
            src: r.source || "", provider: r.provider || "",
            page: r.foreign_landing_url, lic: r.license, licver: r.license_version,
            by: r.creator || "unknown", ids: r.id,
            w: r.width, h: r.height, size, desc: (r.title || "").slice(0, 70)
          });
          gi++;
        } catch (e) { /* try next candidate */ }
      }
      console.log("OK", chainId, "->", manifest[chainId].candidates.length, "candidates (", manifest[chainId].candidates.map(c => (c.by || "?") + "/" + c.src).join(" | "), ")");
    } catch (e) { console.log("FAIL", chainId, e.message); }
  }
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 1));
  console.log("WROTE manifest");
})();
