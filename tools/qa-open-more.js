(async () => {
  await new Promise(r => setTimeout(r, 2600));
  const b = [...document.querySelectorAll("button")].find(e => /READ MORE/i.test(e.textContent));
  if (b) b.click();
  await new Promise(r => setTimeout(r, 900));
  const f = document.querySelector(".bodyfade");
  return { clicked: !!b, fadeOpacity: f ? getComputedStyle(f).opacity : "n/a", fadeDisplay: f ? getComputedStyle(f).display : "n/a", cardOpen: !!document.querySelector(".rcard.open") };
})()