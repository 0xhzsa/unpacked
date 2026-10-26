(async () => {
  await new Promise(r => setTimeout(r, 2400));
  const out = { url: location.hash };
  const pins = [...document.querySelectorAll(".pin")];
  out.pinCount = pins.length;
  out.pins = pins.map(p => { const b = p.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), getComputedStyle(p).pointerEvents]; });
  const cardEl = [...document.querySelectorAll("div")].find(e => String(e.className).includes("bottom-0") && e.textContent.length > 30);
  if (cardEl) { const b = cardEl.getBoundingClientRect(); out.card = [Math.round(b.top), Math.round(b.height), "gc:" + String(cardEl.className).includes("gc")]; }
  out.hasCard = !!cardEl;
  return out;
})()
