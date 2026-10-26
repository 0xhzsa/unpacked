/* probe-cats.js — check which Commons categories actually hold direct files, print titles.
   usage: node tools/uns/probe-cats.js "Name1" "Name2" ... */
const UA = "unpackedsite/1.0 (https://github.com/0xhzsa/unpacked; product-photo research; contact via repo)";
(async () => {
  for (const cat of process.argv.slice(2)) {
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
      "&generator=categorymembers&gcmtitle=" + encodeURIComponent("Category:" + cat) +
      "&gcmtype=file&gcmlimit=25&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1400";
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(20000) });
      const j = await res.json();
      const pages = (j.query && j.query.pages || []).filter(p => p.imageinfo && p.imageinfo[0] && /\.(jpe?g)$/i.test(p.title || ""));
      console.log("=== " + cat + " -> " + pages.length + " files");
      pages.slice(0, 14).forEach(p => {
        const ii = p.imageinfo[0];
        const lic = ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value || "?";
        console.log("   " + ii.width + "x" + ii.height + " [" + lic + "] " + (p.title || "").replace(/^File:/, ""));
      });
    } catch (e) { console.log("=== " + cat + " FAIL " + e.message); }
    await new Promise(r => setTimeout(r, 900));
  }
})().catch(e => { console.error("FATAL", e); process.exit(1); });
