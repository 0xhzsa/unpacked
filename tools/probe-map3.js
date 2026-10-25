new Promise(function (res) {
  setTimeout(function () {
    var ts = Array.prototype.slice.call(document.querySelectorAll('svg text'));
    var items = ts.map(function (t) { return { s: t.textContent, b: t.getBBox() }; });
    var out = [];
    for (var i = 0; i < items.length; i++) {
      for (var j = i + 1; j < items.length; j++) {
        var a = items[i]; var b = items[j];
        var ox = Math.min(a.b.x + a.b.width, b.b.x + b.b.width) - Math.max(a.b.x, b.b.x);
        var oy = Math.min(a.b.y + a.b.height, b.b.y + b.b.height) - Math.max(a.b.y, b.b.y);
        if (ox > 2 && oy > 2) out.push([a.s, b.s, Math.round(ox), Math.round(oy)]);
      }
    }
    res({ n: ts.length, overlaps: out.slice(0, 30) });
  }, 2600);
})
