/* shot.js — real-viewport screenshot + layout-overflow check via Chrome DevTools Protocol.
   Fixes the --window-size floor (~492px) in headless Edge by using Emulation.setDeviceMetricsOverride.

   usage: node shot.js <url> <width> <height> <outPng> [waitMs] [--evalfile <file>] [--clip x,y,w,h]
   prints: { iw, sw, sh, bad[] } — bad = elements whose right edge exceeds the viewport.
   --clip captures an arbitrary page rectangle via captureBeyondViewport (ignores scroll). */
const { spawn, spawnSync } = require("child_process");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const EDGE = process.env.EDGE || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const args = process.argv.slice(2);
const evalIdx = args.indexOf("--evalfile");
const evalFile = evalIdx > -1 ? args[evalIdx + 1] : null;
const clipIdx = args.indexOf("--clip");
const clipRaw = clipIdx > -1 ? args[clipIdx + 1] : null;
const usedIds = [];
if (evalIdx > -1) usedIds.push(evalIdx, evalIdx + 1);
if (clipIdx > -1) usedIds.push(clipIdx, clipIdx + 1);
const positional = args.filter((a, i) => !a.startsWith("--") && !usedIds.includes(i));
const [url, W, H, out, waitMs] = positional;
if (!url || !W || !H || !out) {
  console.error("usage: node shot.js <url> <width> <height> <outPng> [waitMs] [--evalfile <file>]");
  process.exit(2);
}
const PORT = 9300 + (process.pid % 600);

function get(p) {
  return new Promise((res, rej) => {
    http.get({ host: "127.0.0.1", port: PORT, path: p }, (r) => {
      let d = ""; r.on("data", (c) => (d += c)); r.on("end", () => res(d));
    }).on("error", rej);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async function main() {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), "edge-shot-"));
  const child = spawn(EDGE, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
    "--remote-allow-origins=*", `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${prof}`, `--window-size=${W},${H}`, url,
  ], { stdio: "ignore" });

  try {
    let up = false;
    for (let i = 0; i < 60 && !up; i++) { try { await get("/json/version"); up = true; } catch (e) { await sleep(250); } }
    if (!up) throw new Error("devtools port never came up");

    const list = JSON.parse(await get("/json/list"));
    const target = list.find((t) => t.type === "page" && /localhost|127\.0\.0\.1|test-open/.test(t.url))
      || list.find((t) => t.type === "page");
    if (!target) throw new Error("no page target");

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let id = 0; const pending = new Map();
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    };
    const send = (method, params = {}) => new Promise((res) => {
      const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params }));
    });

    await send("Emulation.setDeviceMetricsOverride", {
      width: +W, height: +H, deviceScaleFactor: 1, mobile: false,
    });

    if (evalFile) {
      // Wait for the target to actually be on the requested URL, then for the
      // document to finish loading. Without this, an evaluate() issued right
      // after the target appears can land in the pre-navigation execution
      // context and be silently discarded when the page commits.
      let host = "";
      try { host = new URL(url).host; } catch (e) { host = url; }
      for (let i = 0; i < 200; i++) {
        const nav = await send("Runtime.evaluate", {
          expression: "location.href + '|' + document.readyState", returnByValue: true,
        });
        const v = nav.result && nav.result.result && nav.result.result.value;
        if (typeof v === "string") {
          const [href, state] = v.split("|");
          if (href.indexOf(host) > -1 && (state === "complete" || state === "interactive")) break;
        }
        await sleep(100);
      }
      const r = await send("Runtime.evaluate", {
        expression: fs.readFileSync(evalFile, "utf8"), returnByValue: true, awaitPromise: true,
      });
      console.log("EVAL:", JSON.stringify(r.result && r.result.result && r.result.result.value));
    }

    await sleep(parseInt(waitMs || "5000", 10));

    const geoExpr = "(function(){var iw=innerWidth,sw=document.documentElement.scrollWidth,sh=document.documentElement.scrollHeight;var bad=[];" +
      "document.querySelectorAll('body *').forEach(function(el){var r=el.getBoundingClientRect();" +
      "if(r.width>0&&r.right>iw+1&&bad.length<6)bad.push((el.id||el.className||el.tagName)+':'+Math.round(r.right));});" +
      "return {iw:iw,sw:sw,sh:sh,bad:bad};})()";
    const geo = await send("Runtime.evaluate", { expression: geoExpr, returnByValue: true });
    console.log("GEO:", JSON.stringify(geo.result && geo.result.result && geo.result.result.value));

    const clipParts = clipRaw ? clipRaw.split(",").map(Number) : null;
    const shotOpts = { format: "png" };
    if (clipParts && clipParts.length === 4) {
      shotOpts.clip = { x: clipParts[0], y: clipParts[1], width: clipParts[2], height: clipParts[3], scale: 1 };
      shotOpts.captureBeyondViewport = true;
    }
    const shot = await send("Page.captureScreenshot", shotOpts);
    fs.writeFileSync(out, Buffer.from(shot.result.data, "base64"));
    console.log("WROTE:", out);
    ws.close();
  } finally {
    try { spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"]); } catch (e) {}
    try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
  }
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
