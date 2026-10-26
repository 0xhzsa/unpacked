/* hunt.js — license-clean photo sweep: Unsplash (free license, same aesthetic as "dark moody pinterest").
   For each of the 20 object stops: napi search -> 3 candidates -> tools/uns/<basename>.{A,B,C}.jpg + manifest.
   Run: node tools/hunt.js            (builds all)
        node tools/hunt.js kb ls      (filter by chain id substring) */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {} };
for (const f of ["js/journey.js", "js/imgmap.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox);
}
const J = sandbox.window.JOURNEY, IMG = sandbox.window.UnpackedIMG;

const QUERIES = {
  "desk-lamp": "desk lamp dark background",
  "office-chair": "office chair dark studio",
  "ceramic-mug": "ceramic coffee mug dark moody",
  "steel-desk": "steel table industrial dark",
  "glass-window": "window glass rain moody dark",
  "hardcover-book": "hardcover book dark moody",
  "ceiling-fan": "ceiling fan ceiling dark",
  "armchair": "rattan armchair dark interior",
  "insulated-bottle": "steel water bottle dark",
  "wireless-earbuds": "wireless earbuds dark macro",
  "magnet-power-bank": "power bank dark",
  "slow-rebound-ball": "ball sphere dark studio",
  "mini-blender": "blender kitchen dark moody",
  "portable-ssd": "ssd drive macro dark",
  "fridge-player": "record player vinyl dark",
  "keyboard": "mechanical keyboard macro dark"
};
const FILTER = process.argv.slice(2);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const outDir = path.join(__dirname, "uns");
fs.mkdirSync(outDir, { recursive: true });

function stopInfo(chainId) {
  const ch = (J.objects || J.chains || []).find(c => c.id === chainId);
  if (!ch) return null;
  const st = (ch.stops || [])[1] || (ch.stops || []).find(s => s.kind === "object");
  if (!st || !IMG[st.id]) return null;
  return { ch, st, file: IMG[st.id].replace(/\.jpg$/, "") };
}

async function search(q) {
  const url = "https://unsplash.com/napi/search/photos?query=" + encodeURIComponent(q) + "&per_page=8&color=black&orientation=landscape";
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" } });
  if (!res.ok) throw new Error("napi " + res.status);
  const j = await res.json();
  return (j.results || []).filter(r => !r.premium && r.width >= 1200 && (r.urls || {}).raw);
}

async function dl(rawUrl, dest) {
  const res = await fetch(rawUrl + (rawUrl.includes("?") ? "&" : "?") + "w=1600&q=82&fm=jpg&fit=max", { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error("img " + res.status);
  const ab = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, ab);
  return ab.length;
}

(async () => {
  const manifest = {};
  const chains = (J.objects || J.chains || []).map(c => c.id).filter(id => !FILTER.length || FILTER.some(f => id.includes(f)));
  for (const chainId of chains) {
    const q = QUERIES[chainId] || chainId.replace(/-/g, " ");
    const info = stopInfo(chainId);
    if (!info) { console.log("SKIP (no object img)", chainId); continue; }
    const base = info.file;
    try {
      const results = await search(q);
      manifest[chainId] = { stopId: info.st.id, file: base, query: q, candidates: [] };
      const grades = ["A", "B", "C"];
      for (let k = 0; k < Math.min(3, results.length); k++) {
        const r = results[k];
        const dest = path.join(outDir, base + "-" + grades[k] + ".jpg");
        try {
          const size = await dl(r.urls.raw, dest);
          manifest[chainId].candidates.push({
            rank: k, saved: "tools/uns/" + path.basename(dest),
            unsplashId: r.id, page: r.links.html,
            by: (r.user || {}).name, byUrl: (r.user || {}).links && r.user.links.html,
            w: r.width, h: r.height, size, desc: (r.alt_description || r.description || "").slice(0, 90)
          });
        } catch (e) { console.log("  dl fail", base, grades[k], e.message); }
      }
      console.log("OK", chainId, "->", manifest[chainId].candidates.length, "candidates (", manifest[chainId].candidates.map(c => c.by).join(" / "), ")");
    } catch (e) { console.log("FAIL", chainId, e.message); }
  }
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 1));
  console.log("WROTE", path.join("tools/uns/manifest.json"));
})();
