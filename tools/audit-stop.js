(async () => {
  await new Promise(r => setTimeout(r, 2200));
  const out = { phase: "deep-stop", url: location.hash };
  const pins = [...document.querySelectorAll(".pin")];
  out.pins = pins.map(p => { const b = p.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), getComputedStyle(p).pointerEvents]; });
  const dots = document.querySelectorAll(".pin span:not(.plb)");
  out.dotCount = dots.length;
  const labels = [...document.querySelectorAll(".pin .plb")];
  out.labels = labels.map(l => { const b = l.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y)]; });
  const cardEl = [...document.querySelectorAll("div")].find(e => String(e.className).includes("bottom-0") && e.textContent.length > 30);
  if (cardEl) { const b = cardEl.getBoundingClientRect(); out.card = [Math.round(b.top), Math.round(b.height)]; }
  out.stopChip = /STOP\s+\d/i.test(document.body.textContent) ? RegExp(document.body.textContent.match(/STOP\s+\d+\s*\/\s*\d+/i) || ["?"])[0].replace(/\s+/g, " ") : "none";
  const back = [...document.querySelectorAll("button,a")].find(e => e.textContent.trim() === "" && /back|prev/i.test(e.className + e.getAttribute("aria-label") || ""));
  out.backBtn = back ? back.tagName : "notfound";
  const allBtns = [...document.querySelectorAll("button,a")].slice(0, 20).map(e => { const b = e.getBoundingClientRect(); return String(e.className).slice(0, 26) + "|" + Math.round(b.width) + "x" + Math.round(b.height) + "|y" + Math.round(b.top); });
  out.btns = allBtns;
  out.smallText = [...document.querySelectorAll("*")].filter(e => !e.children.length && e.textContent.trim().length > 2 && parseFloat(getComputedStyle(e).fontSize) < 10.5).slice(0, 6).map(e => getComputedStyle(e).fontSize + "px " + e.textContent.trim().slice(0, 20));
  out.brokenImg = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length;
  return out;
})()
