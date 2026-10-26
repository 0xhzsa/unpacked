/* sheet.js — build a contact sheet (current photo vs hunt candidates per object stop) */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..", "..");
const unsDir = __dirname;
const sandbox = { window: {} };
for (const f of ["js/journey.js", "js/imgmap.js", "js/meta.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox);
}
const J = sandbox.window.JOURNEY, IMG = sandbox.window.UnpackedIMG, META = sandbox.window.UNPACKED_META || {};
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8"));

const order = (META.lines && META.lines.order) || (J.objects || J.chains).map(c => c.id);
let rows = "";
for (const chainId of order) {
  const m = manifest[chainId];
  if (!m) continue;
  const cur = IMG[m.stopId];
  let tiles = "";
  if (cur) tiles += `<figure><img src="../../assets/img/${cur}.jpg?v=8"><figcaption>CURRENT ${cur}</figcaption></figure>`;
  m.candidates.forEach(c => {
    tiles += `<figure><img src="${c.saved.replace("tools/uns", ".")}"><figcaption>${path.basename(c.saved)} · ${c.by} · ${c.src} · ${c.lic || ""} ${c.licver || ""} · ${c.w}x${c.h}</figcaption></figure>`;
  });
  rows += `<section><h3>${chainId} <small>${m.file}</small></h3><div class="grid">${tiles}</div></section>`;
}
fs.writeFileSync(path.join(__dirname, "contact.html"), `<style>
body{background:#101014;color:#eee;font:13px/1.4 monospace;margin:16px}
section{margin:0 0 22px;border-bottom:1px solid #333;padding-bottom:14px}
h3{color:#FF9DB8;margin:0 0 8px}h3 small{color:#888}
.grid{display:flex;gap:10px;flex-wrap:wrap}
figure{margin:0;width:250px}
img{width:250px;height:170px;object-fit:cover;border-radius:6px;border:1px solid #444;display:block}
figcaption{font-size:10px;color:#9a9a9a;margin-top:4px}
</style>` + rows);
console.log("wrote tools/uns/contact.html");
