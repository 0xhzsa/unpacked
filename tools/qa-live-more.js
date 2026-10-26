(async () => {
  await new Promise(r => setTimeout(r, 3000));
  const b = [...document.querySelectorAll("button")].find(e => /READ MORE/i.test(e.textContent));
  if (!b) return { fail: "no-morebtn" };
  const r = b.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const hit = document.elementFromPoint(cx, cy);
  const body = document.querySelector(".bodyclamp") || document.querySelector(".rcard p");
  const card = document.querySelector(".rcard");
  const fade = document.querySelector(".bodyfade");
  const before = {
    bodyScroll: body ? body.scrollHeight : -1,
    bodyClient: body ? body.clientHeight : -1,
    cardMaxH: card ? getComputedStyle(card).maxHeight : "n/a",
    fadeOp: fade ? getComputedStyle(fade).opacity : "n/a",
    label: b.textContent.trim()
  };
  const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, pointerId: 1, pointerType: "touch", isPrimary: true };
  try { b.dispatchEvent(new PointerEvent("pointerdown", opts)); b.dispatchEvent(new PointerEvent("pointerup", opts)); } catch (e) {}
  try { b.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true })); b.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true })); } catch (e) {}
  b.click();
  await new Promise(r2 => setTimeout(r2, 700));
  const after = {
    bodyScroll: body ? body.scrollHeight : -1,
    bodyClient: body ? body.clientHeight : -1,
    cardMaxH: card ? getComputedStyle(card).maxHeight : "n/a",
    fadeOp: fade ? getComputedStyle(fade).opacity : "n/a",
    label: b.textContent.trim(),
    cardClasses: card ? card.className : "n/a",
    hitTag: hit ? (hit.className || hit.tagName) : "none",
    hitIsBtn: hit === b
  };
  return { before, after };
})()
