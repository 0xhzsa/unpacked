/* probe-pins.js - dump pin/label elements on the current station view */
(() => {
  const out = { pins: [], shot: null, dims: null };
  document.querySelectorAll('*').forEach(() => {});
  const cands = [...document.querySelectorAll('div,span,button')].filter(e => {
    const c = (e.className && e.className.baseVal !== undefined) ? e.className.baseVal : (e.className || '');
    return /pin/i.test(String(c));
  });
  cands.slice(0, 12).forEach(e => {
    const r = e.getBoundingClientRect();
    out.pins.push({
      cls: String(e.className).slice(0, 40),
      text: (e.textContent || '').slice(0, 30),
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)
    });
  });
  const shot = document.querySelector('.shot');
  if (shot) { const r = shot.getBoundingClientRect(); out.shot = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; }
  const im = document.querySelector('.shot img');
  if (im) out.img = { nw: im.naturalWidth, nh: im.naturalHeight, src: im.src.split('/').pop() };
  return JSON.stringify(out);
})()
