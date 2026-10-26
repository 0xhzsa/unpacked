(async () => {
  await new Promise(r => setTimeout(r, 1800));
  const out = { start: location.hash };
  const seen = [];
  for (let i = 0; i < 10; i++) {
    const btn = [...document.querySelectorAll("button,a")].find(e => /NEXT STOP|FINISH|GROUND|DONE/i.test(e.textContent));
    if (!btn) { seen.push("noBtn"); break; }
    const label = btn.textContent.trim().slice(0, 18);
    btn.click();
    await new Promise(r => setTimeout(r, 1100));
    const stopTxt = (document.body.textContent.match(/STOP\s*\d+\s*\/\s*\d+/i) || ["none"])[0].replace(/\s+/g, " ");
    seen.push(label + "->" + stopTxt + "|" + location.hash.slice(-16));
    if (/FINISH|GROUND|DONE|^…/i.test(btn.textContent)) break;
  }
  out.walk = seen;
  return out;
})()
