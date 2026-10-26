const m = JSON.parse(require("fs").readFileSync(__dirname + "/manifest.json", "utf8"));
for (const k of process.argv.slice(2)) {
  const v = m[k];
  if (!v) { console.log("no entry", k); continue; }
  console.log("==" + k + " -> " + v.file + " | query: " + v.query);
  (v.candidates || []).forEach(c => console.log("  [" + c.rank + "] " + c.saved.split("/").pop() + " | " + c.by + " | " + c.lic + " " + (c.licver || "") + " | " + c.w + "x" + c.h + " | " + String(c.desc || "").slice(0, 56)));
  (v.c3 || []).forEach(c => console.log("  [" + c.rank + "] " + c.saved.split("/").pop() + " | " + c.by + " | " + c.lic + " | " + c.w + "x" + c.h + " | " + String(c.desc || "").slice(0, 56) + " | " + c.page));
}
