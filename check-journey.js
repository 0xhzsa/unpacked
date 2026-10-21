const fs = require('fs');
const w = {};
new Function('window', fs.readFileSync('js/journey.js', 'utf8'))(w);
const o = w.JOURNEY.objects;
let bad = 0;
o.forEach(x => {
  const seq = x.stops.map(s => s.stop);
  const order = seq.every((v, i) => i === 0 || v > seq[i - 1]);
  const mono = x.stops.every((s, i) => i === 0 || s.echelon >= x.stops[i - 1].echelon);
  const hasRoom = x.stops[0].kind === 'room';
  const last = x.stops[x.stops.length - 1].kind === 'source';
  const ok = order && mono && hasRoom && last;
  if (!ok) bad++;
  console.log(x.id.padEnd(12), 'stops=' + x.stops.length, 'seq=' + seq.join(','), 'e=' + x.stops.map(s => s.echelon).join(''), ok ? 'OK' : 'PROBLEM');
});
console.log(bad === 0 ? 'ALL OK' : bad + ' PROBLEMS');
