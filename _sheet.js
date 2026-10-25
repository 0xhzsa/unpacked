const fs = require('fs');
const src = fs.readFileSync('C:/Users/stagh/unpacked/js/imgmap.js', 'utf8');
const re = /"([a-z0-9-]+)":\s*"([a-z0-9-_]+)"/g;
const seen = new Set(), files = [];
let m;
while ((m = re.exec(src))) { if (!seen.has(m[2])) { seen.add(m[2]); files.push(m[2]); } }
console.log('files:', files.length);
const per = 14, cols = 7;
let n = 0;
for (let s = 0; s < files.length; s += per) {
  const slice = files.slice(s, s + per);
  let html = '<!DOCTYPE html><html><head><style>body{margin:0;background:#0F0D10;font:10px monospace;color:#999}body{display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:4px;padding:4px}figure{margin:0}figcaption{white-space:nowrap;overflow:hidden}img{width:100%;height:118px;object-fit:cover;display:block}</style></head><body>';
  slice.forEach((f, i) => {
    const num = s + i + 1;
    html += '<figure><img src="/assets/img/' + f + '.jpg"><figcaption>' + num + ' \u00B7 ' + f + '.jpg</figcaption></figure>';
  });
  html += '</body></html>';
  fs.writeFileSync('C:/Users/stagh/unpacked/tools/sheet' + (n + 1) + '.html', html);
  n++;
}
console.log('sheets:', n);
