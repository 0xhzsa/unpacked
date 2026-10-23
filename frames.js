/* frames.js — keeps one headless page alive and captures a demosequence.
   usage: node frames.js <url> <width> <height> <outDir> [settleMs] */
const { spawn, spawnSync } = require("child_process");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const EDGE = process.env.EDGE || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const args = process.argv.slice(2);
const [url, W, H, outDir, settleMs] = args;
if (!url || !W || !H || !outDir) {
  console.error("usage: node frames.js <url> <width> <height> <outDir> [settleMs]");
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

const STEPS = [
  ["shot", null, 1200],
  ["eval", "window.openStory && window.openStory(0)", 2500],
  ["shot", null, 400],
  ["eval",
    "(function(){var s=document.querySelector('section[id*=\"inj\"],section[id*=\"mold\"]');if(s)s.scrollIntoView({block:'start'});return !!s;})()", 1600],
  ["shot", null, 300],
  ["eval",
    "(function(){var b=document.querySelector('section[id*=\"inj\"] .ch-extras button, section[id*=\"mold\"] .ch-extras button');if(b)b.click();return !!b;})()", 1100],
  ["shot", null, 750],
  ["shot", null, 750],
  ["shot", null, 750],
  ["eval", "document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))", 900],
  ["shot", null, 300],
  ["eval",
    "(function(){var l=document.getElementById('the-ledger');if(l)l.scrollIntoView();return !!l;})()", 1600],
  ["shot", null, 300],
  ["eval",
    "(function(){var c=document.querySelector('.closing');if(c)c.scrollIntoView();return !!c;})()", 1500],
  ["shot", null, 300],
  ["eval",
    "(function(){if(window.DescentAPI&&window.DescentAPI.openFinaleFull){window.DescentAPI.openFinaleFull();return true;}return false;})()", 3200],
  ["shot", null, 700],
  ["shot", null, 700],
];

(async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), "edge-frames-"));
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
    const target = list.find((t) => t.type === "page" && /localhost|127\.0\.0\.1/.test(t.url))
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

    let host = "";
    try { host = new URL(url).host; } catch (e) { host = url; }
    for (let i = 0; i < 200; i++) {
      const nav = await send("Runtime.evaluate", {
        expression: "location.href + '|' + document.readyState", returnByValue: true,
      });
      const v = nav.result && nav.result.result && nav.result.result.value;
      if (typeof v === "string" && v.indexOf(host) > -1) {
        const state = v.split("|")[1];
        if (state === "complete" || state === "interactive") break;
      }
      await sleep(100);
    }

    await sleep(parseInt(settleMs || "5000", 10));

    let fi = 0;
    for (let s = 0; s < STEPS.length; s++) {
      const [kind, expr, waitMs] = STEPS[s];
      if (kind === "eval") {
        const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
        const v = r.result && r.result.result && r.result.result.value;
        console.log("EVAL[" + s + "]:", JSON.stringify(v));
      }
      await sleep(waitMs);
      if (kind === "shot") {
        const shot = await send("Page.captureScreenshot", { format: "png" });
        const out = path.join(outDir, "f" + String(fi).padStart(2, "0") + ".png");
        fs.writeFileSync(out, Buffer.from(shot.result.data, "base64"));
        console.log("WROTE:", out);
        fi++;
      }
    }
    ws.close();
  } finally {
    try { spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"]); } catch (e) {}
    try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
  }
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
