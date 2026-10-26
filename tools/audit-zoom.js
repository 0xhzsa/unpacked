(async () => {
  await new Promise(r => setTimeout(r, 2600));
  const out = { url: location.hash };
  out.counter0 = ((document.body.textContent.match(/STOP\s*\d+\s*\/\s*\d+/i) || ["?"])[0]).replace(/\s+/g, " ");
  const layer = document.querySelector(".stage > .s.on") || document.querySelector(".stage > .s");
  out.t0 = layer && layer.style.transform || "(none)";
  const pin = document.querySelector(".pin");
  if (!pin) { out.noPin = true; return out; }
  out.pinPE = getComputedStyle(pin).pointerEvents;
  out.pinCursor = getComputedStyle(pin).cursor;
  out.label = pin.textContent.slice(0, 30);
  pin.click();
  await new Promise(r => setTimeout(r, 800));
  const layer2 = document.querySelector(".stage > .s.on") || layer;
  out.t1 = layer2.style.transform || "(none)";
  out.zoomtipOn = !!document.querySelector(".zoomtip.on");
  out.zooming = !!document.querySelector(".zooming");
  out.pzDot = !!document.querySelector(".pin.pz");
  const wrap = document.querySelector(".fixed.inset-0") || document.body;
  wrap.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await new Promise(r => setTimeout(r, 800));
  out.t2 = layer2.style.transform || "(none)";
  out.zoomtipAfterRelease = !!document.querySelector(".zoomtip.on");
  const btn = [...document.querySelectorAll("button")].find(e => /NEXT STOP/i.test(e.textContent));
  btn.click();
  await new Promise(r => setTimeout(r, 1100));
  out.afterNext = {
    hash: location.hash.slice(-24),
    counter: ((document.body.textContent.match(/STOP\s*\d+\s*\/\s*\d+/i) || ["?"])[0]).replace(/\s+/g, " "),
    head: (document.querySelector(".bottom-0 h1") || { textContent: "-" }).textContent.slice(0, 18),
    transform: (document.querySelector(".stage > .s.on") || layer2).style.transform || "(none)"
  };
  return out;
})()
