(async () => {
  await new Promise(r => setTimeout(r, 2200));
  const out = {};
  const rows = [...document.querySelectorAll("a,button,[data-go],li,div")]
    .filter(e => /Keycap Set/i.test(e.textContent) && e.textContent.trim().length < 200)
    .sort((a, b) => (a.getBoundingClientRect().width * a.getBoundingClientRect().height) - (b.getBoundingClientRect().width * b.getBoundingClientRect().height));
  if (rows[0]) {
    out.row = rows[0].tagName + "." + String(rows[0].className).slice(0, 26);
    rows[0].click();
    await new Promise(r => setTimeout(r, 1400));
    out.afterRowTap = location.hash;
    const els = [...document.querySelectorAll("*")].slice(0, 0);
    out.title = document.title;
  } else out.row = "notfound";
  const svg = [...document.querySelectorAll("svg")].map(s => { const b = s.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height), String(s.getAttribute("class") || "").slice(0, 16)]; }).slice(0, 5);
  out.svg = svg;
  out.scrollW = document.documentElement.scrollWidth;
  out.bodyOverflowX = [...document.body.children].map(e => Math.round(e.scrollWidth)).sort((a, b) => b - a).slice(0, 2);
  return out;
})()
