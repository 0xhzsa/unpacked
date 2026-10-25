const fs = require('fs');
const src = fs.readFileSync('C:/Users/stagh/unpacked/js/journey.js', 'utf8');
let body = src.replace(/^\s*\/\*[\s\S]*?\*\//, '').trim();
body = body.replace(/^window\.[A-Za-z0-9_]+\s*=\s*/, '').replace(/;\s*$/, '');
const j = eval('(' + body + ')');
const objs = j.objects || j.chains || [];
const imgmap = fs.readFileSync('C:/Users/stagh/unpacked/js/imgmap.js', 'utf8');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function imgFor(stopId) {
  const re = new RegExp('"' + esc(stopId) + '"\\s*:\\s*"([^"]+)"');
  const m = imgmap.match(re);
  return m ? m[1] : '(none)';
}
console.log('--- chain heroes (first object stop) ---');
objs.forEach(o => {
  const obj = o.stops.find(s => s.kind === 'object') || o.stops[1];
  console.log(o.id.padEnd(20) + ' | ' + o.name.padEnd(20) + ' | ' + String(obj.id).padEnd(26) + ' | img=' + imgFor(obj.id));
});
console.log('--- all distinct images used ---');
const set = new Set();
objs.forEach(o => o.stops.forEach(s => { const im = imgFor(s.id); if (im !== '(none)') set.add(im); }));
console.log([...set].sort().join(', '));
console.log('count:', set.size);
