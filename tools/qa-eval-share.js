localStorage.clear();
window.location.hash = '#/ground/fridge-player';
setTimeout(function () { document.querySelectorAll('button').forEach(function (b) { if (/SHARE THE CARD/.test(b.textContent)) b.click(); }); }, 900);
'clicked'
