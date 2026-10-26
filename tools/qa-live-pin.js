(async () => {
  await new Promise(r => setTimeout(r, 3000));
  const pin = document.querySelector(".pin");
  if (!pin) return { fail: "no-pin" };
  const dot = pin.querySelector(".pdot") || pin;
  const r = dot.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const hit = document.elementFromPoint(cx, cy);
  const card = document.querySelector(".rcard");
  const layer = () => {
    const els = [...document.querySelectorAll(".stage > .s")];
    const cur = els[els.length - 1];
    return cur ? getComputedStyle(cur).transform : "no-layer";
  };
  const before = { transform: layer(), zoomtip: !!document.querySelector(".zoomtip.on") };
  const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, pointerId: 1, pointerType: "touch", isPrimary: true };
  try { dot.dispatchEvent(new PointerEvent("pointerdown", opts)); dot.dispatchEvent(new PointerEvent("pointerup", opts)); } catch (e) {}
  try { dot.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true })); dot.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true })); } catch (e) {}
  (hit || dot).click();
  await new Promise(r2 => setTimeout(r2, 800));
  const after = {
    transform: layer(),
    zoomtip: !!document.querySelector(".zoomtip.on"),
    zooming: !!document.querySelector(".zooming"),
    hitTag: hit ? (hit.className || hit.tagName).toString().slice(0, 60) : "none",
    hitInPin: hit ? !!hit.closest(".pin") : false
  };
  return { before, after };
})()
