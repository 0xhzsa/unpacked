const m = JSON.parse(require("fs").readFileSync(__dirname + "/manifest.json", "utf8"));
for (const [k, v] of Object.entries(m)) {
  console.log("==" + k + " -> " + v.file);
  (v.candidates || []).forEach(c => console.log(
    "  " + c.saved.split("/").pop() +
    " | " + c.by +
    " | " + c.lic + " " + c.licver +
    " | " + c.w + "x" + c.h +
    " | " + String(c.desc || "").slice(0, 46) +
    " | " + (c.page || "")
  ));
}
