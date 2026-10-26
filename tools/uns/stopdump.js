const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..", "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "js", "journey.js"), "utf8"), sandbox);
const J = sandbox.window.JOURNEY;
const want = new Set(["desk-lamp-01","ceramic-mug-01","steel-desk-01","ceiling-fan-01","armchair-01","wireless-earbuds-01","mini-blender-01","ballpoint-pen-01","fridge-player-01"]);
for (const ch of J.objects) {
  for (const st of ch.stops) {
    if (want.has(st.id)) console.log(JSON.stringify({ chain: ch.id, zoom: st.zoom, image: st.image, name: st.name }));
  }
}
