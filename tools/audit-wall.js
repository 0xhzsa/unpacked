(async () => {
  await new Promise(r => setTimeout(r, 2200));
  const out = { phase: "wall" };
  out.hash0 = location.hash;
  out.smallText = [...document.querySelectorAll("*")].filter(e => !e.children.length && e.textContent.trim().length > 2 && parseFloat(getComputedStyle(e).fontSize) < 10.5).slice(0, 8).map(e => getComputedStyle(e).fontSize + "px " + e.textContent.trim().slice(0, 24));
  out.overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const card = [...document.querySelectorAll("a,button,[data-go],div")].find(e => /Mechanical Keyboard/i.test(e.textContent));
  if (card) {
    const b = card.getBoundingClientRect();
    out.cardTag = card.tagName + "." + String(card.className).slice(0, 40);
    out.cardRect = [Math.round(b.width), Math.round(b.height)];
  }
  if (card) card.click();
  await new Promise(r => setTimeout(r, 1800));
  out.hashAfterCardTap = location.hash;
  const pins = [...document.querySelectorAll(".pin")];
  out.pins = pins.map(p => { const b = p.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), getComputedStyle(p).pointerEvents]; });
  const chip = document.querySelector(".pin .plb");
  if (chip) { const b = chip.getBoundingClientRect(); out.chip = [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }
  const cardEl = [...document.querySelectorAll("div")].find(e => String(e.className).includes("bottom-0") && /NEXT STOP/i.test(e.textContent));
  if (cardEl) { const b = cardEl.getBoundingClientRect(); out.card = [Math.round(b.top), Math.round(b.height)]; }
  const btn = [...document.querySelectorAll("button,a")].find(e => /NEXT STOP/i.test(e.textContent));
  if (btn) { const b = btn.getBoundingClientRect(); out.nextBtn = [Math.round(b.width), Math.round(b.height), Math.round(b.top)]; }
  const body = [...document.querySelectorAll("p,div")].find(e => e.textContent.length > 80 && /laptop|fan|chair|blades|machine/i.test(e.textContent));
  if (body) { out.bodyTail = body.textContent.trim().slice(-50); const s = getComputedStyle(body); out.clamp = s.display + " " + (s.webkitLineClamp || s.lineClamp) + " " + (s.webkitBoxOrient || s.boxOrient || ""); }
  const rm = [...document.querySelectorAll("button,a")].find(e => /READ MORE/i.test(e.textContent));
  if (rm) { const b = rm.getBoundingClientRect(); out.readMore = [Math.round(b.width), Math.round(b.height)]; }
  if (rm) rm.click();
  await new Promise(r => setTimeout(r, 1300));
  const card2 = [...document.querySelectorAll("div")].find(e => String(e.className).includes("bottom-0") && e.textContent.length > 30);
  if (card2) { const b = card2.getBoundingClientRect(); out.expanded = [Math.round(b.top), Math.round(b.height)]; }
  const shotImg = document.querySelector(".shot img");
  out.shotH = shotImg ? Math.round(shotImg.getBoundingClientRect().height) : -1;
  const up = [...document.querySelectorAll("button,a")].find(e => /READ LESS|COLLAPSE/i.test(e.textContent));
  if (up) up.click();
  await new Promise(r => setTimeout(r, 900));
  const card3 = [...document.querySelectorAll("div")].find(e => String(e.className).includes("bottom-0") && e.textContent.length > 30);
  if (card3) { const b = card3.getBoundingClientRect(); out.collapsed = [Math.round(b.top), Math.round(b.height)]; }
  if (btn) btn.click();
  await new Promise(r => setTimeout(r, 1400));
  out.afterNext1 = location.hash;
  const btn2 = [...document.querySelectorAll("button,a")].find(e => /NEXT STOP/i.test(e.textContent));
  if (btn2) btn2.click();
  await new Promise(r => setTimeout(r, 1400));
  out.afterNext2 = location.hash;
  const pins2 = [...document.querySelectorAll(".pin")];
  out.pinsAfterNext = pins2.length;
  history.back(); await new Promise(r => setTimeout(r, 900));
  out.back1 = location.hash;
  history.back(); await new Promise(r => setTimeout(r, 900));
  out.back2 = location.hash;
  history.back(); await new Promise(r => setTimeout(r, 900));
  out.back3 = location.hash;
  out.brokenImg = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length;
  return out;
})()
