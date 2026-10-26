(async () => {
  await new Promise(r => setTimeout(r, 1800));
  const snap = () => {
    const t = (document.body.textContent.match(/STOP\s*\d+\s*\/\s*\d+/i) || ["?"])[0].replace(/\s+/g, "");
    const head = document.querySelector(".bottom-0 h1");
    return { h: location.hash.slice(-18), t: t, l: head ? head.textContent.slice(0, 16) : "-" };
  };
  const out = { s0: snap() };
  const btn = [...document.querySelectorAll("button")].find(e => /NEXT STOP/i.test(e.textContent));
  btn.click();
  await new Promise(r => setTimeout(r, 120)); out.s1_120 = snap();
  await new Promise(r => setTimeout(r, 300)); out.s2_420 = snap();
  await new Promise(r => setTimeout(r, 600)); out.s3_1020 = snap();
  await new Promise(r => setTimeout(r, 1000)); out.s4_2020 = snap();
  const btn2 = [...document.querySelectorAll("button")].find(e => /NEXT STOP/i.test(e.textContent));
  if (btn2 && /NEXT STOP/i.test(btn2.textContent)) {
    btn2.click();
    await new Promise(r => setTimeout(r, 120)); out.s5_120 = snap();
    await new Promise(r => setTimeout(r, 500)); out.s6_620 = snap();
    await new Promise(r => setTimeout(r, 1400)); out.s7_2020 = snap();
  } else { out.noBtn2 = true; out.btnText = btn2 ? btn2.textContent.slice(0, 20) : "none"; }
  return out;
})()
