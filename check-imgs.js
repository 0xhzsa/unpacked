const fs = require('fs');
const d = fs.readFileSync('js/descent.js', 'utf8');
const start = d.indexOf('var IMG');
const b = d.slice(start, d.indexOf('};', start));
const n = [...new Set([...b.matchAll(/:\s*"([a-z]+)"/g)].map(m => m[1]))];
const h = new Set(fs.readdirSync('assets/img').filter(f => f.endsWith('.jpg')).map(f => f.slice(0, -4)));
console.log('missing:', n.filter(x => !h.has(x)));
console.log('unused:', [...h].filter(x => !n.includes(x)));
console.log('mapped:', n.length, 'files:', h.size);
