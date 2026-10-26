(async () => {
  await new Promise(r => setTimeout(r, 2200));
  const out = { phase: "map" };
  out.hash = location.hash;
  const rows = [...document.querySelectorAll("button,a,[class*=row]")].filter(e => e.textContent.trim().length > 2 && e.getBoundingClientRect().width > 100);
  out.rowCount = rows.length;
  out.rows = rows.slice(0, 6).map(e => { const b = e.getBoundingClientRect(); return e.textContent.trim().slice(0, 22).replace(/\n/g, " ") + "|" + Math.round(b.width) + "x" + Math.round(b.height); });
  const chip = [...document.querySelectorAll("div,button,a,span")].find(e => /SINGLE|STOPS/i.test(e.textContent) && e.textContent.trim().length < 30);
  if (chip) { const b = chip.getBoundingClientRect(); out.modeChip = chip.textContent.trim().slice(0, 24) + "|" + Math.round(b.width) + "x" + Math.round(b.height); }
  const back = [...document.querySelectorAll("button,a")].find(e => e.textContent.trim() === "" && e.getBoundingClientRect().width > 0);
  out.someBtn = back ? String(back.className).slice(0, 30) : "none";
  const hdr = [...document.querySelectorAll("div")].filter(e => String(e.className).includes("fixed") || String(e.className).includes("top-0")).slice(0, 3).map(e => ({ cls: String(e.className).slice(0, 30), h: Math.round(e.getBoundingClientRect().height) }));
  out.headers = hdr;
  out.smallText = [...document.querySelectorAll("*")].filter(e => !e.children.length && e.textContent.trim().length > 2 && parseFloat(getComputedStyle(e).fontSize) < 10.5).slice(0, 6).map(e => getComputedStyle(e).fontSize + "px " + e.textContent.trim().slice(0, 20));
  return out;
})()
