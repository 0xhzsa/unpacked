(async () => {
  await new Promise(r => setTimeout(r, 2600));
  const pin = document.querySelector(".pin");
  if (!pin) return { noPin: true };
  pin.click();
  await new Promise(r => setTimeout(r, 900));
  return { done: "zoomed", hash: location.hash };
})()
