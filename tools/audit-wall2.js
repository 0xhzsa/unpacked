(async () => {
  await new Promise(r => setTimeout(r, 2000));
  const out = {};
  out.broken = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => (i.src || "").split("/").slice(-2).join("/"));
  out.imgTotal = document.images.length;
  const cand = [...document.querySelectorAll("a,button,[data-go],div,li,section")]
    .filter(e => /Mechanical Keyboard/i.test(e.textContent) && e.textContent.trim().length < 220)
    .sort((a, b) => (a.getBoundingClientRect().width * a.getBoundingClientRect().height) - (b.getBoundingClientRect().width * b.getBoundingClientRect().height));
  if (cand[0]) {
    const el = cand[0];
    const b = el.getBoundingClientRect();
    out.minCard = { tag: el.tagName + "." + String(el.className).slice(0, 30), size: [Math.round(b.width), Math.round(b.height)], list: cand.slice(0, 3).map(e => e.tagName + "." + String(e.className).slice(0, 22)) };
    el.click();
    await new Promise(r => setTimeout(r, 1700));
    out.hashAfterCardTap = location.hash;
    const pins = [...document.querySelectorAll(".pin")];
    out.pins = pins.map(p => { const pb = p.getBoundingClientRect(); return [Math.round(pb.x), Math.round(pb.y), getComputedStyle(p).pointerEvents]; });
    const chip = document.querySelector(".pin .plb");
    if (chip) { const cb = chip.getBoundingClientRect(); out.chip = [Math.round(cb.x), Math.round(cb.y), Math.round(cb.width), Math.round(cb.height)]; }
    const cardEl = [...document.querySelectorAll("div")].find(e => String(e.className).includes("bottom-0") && /NEXT STOP|READ MORE/i.test(e.textContent));
    if (cardEl) { const cb = cardEl.getBoundingClientRect(); out.card = [Math.round(cb.top), Math.round(cb.height)]; }
    const body = [...document.querySelectorAll("p,div")].find(e => e.textContent.length > 80 && /Eighty-seven|machines/i.test(e.textContent));
    if (body) { out.bodyTail = body.textContent.trim().slice(-42); }
    const stopTxt = (document.body.textContent.match(/STOP\s*\d+\s*\/\s*\d+/i) || ["none"])[0];
    out.stopCounter = stopTxt.replace(/\s+/g, " ");
  }
  return out;
})()
