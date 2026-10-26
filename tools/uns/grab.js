/* grab.js — targeted Commons fetcher.
   usage:
     node tools/uns/grab.js search "<query>"            -> list top 30 titles (no download)
     node tools/uns/grab.js title <outBase> <Title.jpg> [more...] -> download whitelisted-license thumbs as <outBase>-G/H/I.jpg */
const fs = require("fs");
const path = require("path");
const UA = "unpackedsite/1.0 (https://github.com/0xhzsa/unpacked; product-photo research; contact via repo)";

(async () => {
  const mode = process.argv[2];
  if (mode === "search") {
    const q = process.argv[3];
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
      "&generator=search&gsrnamespace=6&gsrlimit=30&gsrsearch=" + encodeURIComponent(q + " filetype:bitmap") +
      "&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata";
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(25000) });
    const j = await res.json();
    (j.query && j.query.pages || []).forEach(p => {
      if (!p.imageinfo) return;
      const ii = p.imageinfo[0];
      const lic = ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value || "?";
      console.log(ii.width + "x" + ii.height + " [" + lic + "] " + (p.title || "").replace(/^File:/, ""));
    });
  } else if (mode === "cat") {
    const outBase = process.argv[3];
    const cat = process.argv[4];
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
      "&generator=categorymembers&gcmtitle=" + encodeURIComponent("Category:" + cat) +
      "&gcmtype=file&gcmlimit=80&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1400";
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(25000) });
    if (!res.ok) throw new Error("catapi " + res.status);
    const j = await res.json();
    const pages = (j.query && j.query.pages || []).filter(p => p.imageinfo && p.imageinfo[0] && /\.(jpe?g)$/i.test(p.title || ""));
    const ranked = pages.map(p => {
      const ii = p.imageinfo[0];
      const licRaw = ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value || "?";
      const lic = String(licRaw).toLowerCase().trim();
      if (!/^(cc0|cc by|cc by-sa|public domain)/.test(lic)) return null;
      if ((ii.width || 0) < 1500) return null;
      const land = ii.width >= ii.height ? 1 : 0;
      return { p, ii, licRaw, score: land * 2 + (ii.width * ii.height) / 2e7 };
    }).filter(Boolean).sort((a, b) => b.score - a.score);
    let gi = 0;
    for (const r of ranked) {
      if (gi >= 4) break;
      const dest = path.join(__dirname, outBase + "-" + "GHIJ"[gi] + ".jpg");
      try {
        const dres = await fetch(r.ii.thumburl || r.ii.url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
        if (!dres.ok) { console.log("skip http " + dres.status + " " + r.p.title); continue; }
        const ab = Buffer.from(await dres.arrayBuffer());
        if (ab.length < 22000) { console.log("skip small " + r.p.title); continue; }
        fs.writeFileSync(dest, ab);
        const by = String((r.ii.extmetadata.Artist && r.ii.extmetadata.Artist.value) || "unknown").replace(/<[^>]*>/g, "").trim();
        console.log("OK " + path.basename(dest) + " [" + r.licRaw + "] by " + by + " | " + r.ii.width + "x" + r.ii.height + " | " + r.p.title);
        gi++;
      } catch (e) { console.log("dl fail " + r.p.title + " " + e.message); }
    }
  } else if (mode === "titlefile") {
    const outBase = process.argv[3];
    const titles = fs.readFileSync(process.argv[4], "utf8").split(/\r?\n/).map(s => s.trim()).filter(Boolean)
      .map(t => t.startsWith("File:") ? t : "File:" + t);
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
      "&titles=" + encodeURIComponent(titles.join("|")) +
      "&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1400";
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(25000) });
    if (!res.ok) throw new Error("api " + res.status);
    const j = await res.json();
    const pages = (j.query && j.query.pages || []);
    let gi = 0;
    for (const p of pages) {
      if (!p.imageinfo || !p.imageinfo[0]) { console.log("skip noinfo " + (p.title || "?")); continue; }
      const ii = p.imageinfo[0];
      const licRaw = ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value || "?";
      const lic = String(licRaw).toLowerCase().trim();
      if (!/^(cc0|cc by|cc by-sa|public domain)/.test(lic)) { console.log("skip lic [" + licRaw + "] " + p.title); continue; }
      if (gi >= 5) break;
      const dest = path.join(__dirname, outBase + "-" + "GHIJK"[gi] + ".jpg");
      try {
        const dres = await fetch(ii.thumburl || ii.url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
        if (!dres.ok) { console.log("skip http " + dres.status + " " + p.title); continue; }
        const ab = Buffer.from(await dres.arrayBuffer());
        if (ab.length < 22000) { console.log("skip small " + p.title); continue; }
        fs.writeFileSync(dest, ab);
        const by = String((ii.extmetadata.Artist && ii.extmetadata.Artist.value) || "unknown").replace(/<[^>]*>/g, "").trim();
        console.log("OK " + path.basename(dest) + " [" + licRaw + "] by " + by + " | " + ii.width + "x" + ii.height + " | " + p.title);
        gi++;
      } catch (e) { console.log("dl fail " + p.title + " " + e.message); }
    }
  } else if (mode === "title") {
    const outBase = process.argv[3];
    const titles = process.argv.slice(4).map(t => t.startsWith("File:") ? t : "File:" + t);
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
      "&titles=" + encodeURIComponent(titles.join("|")) +
      "&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1400";
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: AbortSignal.timeout(25000) });
    const j = await res.json();
    const pages = (j.query && j.query.pages || []);
    let gi = 0;
    for (const p of pages) {
      if (!p.imageinfo || !p.imageinfo[0]) { console.log("skip noinfo " + (p.title || "?")); continue; }
      const ii = p.imageinfo[0];
      const licRaw = ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value || "?";
      const lic = String(licRaw).toLowerCase();
      if (!/^(cc0|cc by|cc by-sa|public domain)/.test(lic.trim())) { console.log("skip lic [" + licRaw + "] " + p.title); continue; }
      if (gi > 4) break;
      const dest = path.join(__dirname, outBase + "-" + "GHIJK"[gi] + ".jpg");
      try {
        const dres = await fetch(ii.thumburl || ii.url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
        if (!dres.ok) { console.log("skip http " + dres.status + " " + p.title); continue; }
        const ab = Buffer.from(await dres.arrayBuffer());
        if (ab.length < 22000) { console.log("skip small " + p.title); continue; }
        fs.writeFileSync(dest, ab);
        const by = String((ii.extmetadata.Artist && ii.extmetadata.Artist.value) || "unknown").replace(/<[^>]*>/g, "").trim();
        const licUrl = ii.extmetadata.LicenseUrl && ii.extmetadata.LicenseUrl.value || "";
        console.log("OK " + path.basename(dest) + " [" + licRaw + "] by " + by + " | " + ii.width + "x" + ii.height + " | " + p.title + " | " + licUrl);
        gi++;
      } catch (e) { console.log("dl fail " + p.title + " " + e.message); }
    }
  }
})().catch(e => { console.error("FATAL", e); process.exit(1); });
