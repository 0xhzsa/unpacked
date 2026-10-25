/* tests each wikimedia surface in sequence with 10 s gaps */
const https = require('https');
const crypto = require('crypto');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function probe(label, url) {
  return new Promise(function (res) {
    const u = new URL(url);
    const req = https.get({ host: u.host, path: u.pathname + u.search, headers: { 'User-Agent': UA } }, function (r) {
      const chunks = [];
      r.on('data', function (c) { if (chunks.length < 4) chunks.push(c); });
      r.on('end', function () {
        console.log(label, '->', r.statusCode, (r.headers['content-type'] || '').split(';')[0], r.headers.location ? '(redirect ' + r.headers.location.slice(0, 60) + ')' : '');
        res();
      });
      r.resume();
    }).on('error', function (e) { console.log(label, '-> ERR', e.message); res(); });
    req.setTimeout(30000, function () { req.destroy(); res(); });
  });
}

// md5 path of a known-good commons file: LED_strip_closeup.jpg
const name = 'LED_strip_closeup.jpg';
const md5 = crypto.createHash('md5').update(name.replace(/ /g, '_')).digest('hex');

(async function main() {
  const p = 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + md5[0] + '/' + md5.slice(0, 2) + '/' + name.replace(/ /g, '_') + '/1280px-' + name.replace(/ /g, '_');
  await probe('upload.thumb', p);
  await new Promise((r) => setTimeout(r, 10000));
  await probe('commons.cat', 'https://commons.wikimedia.org/wiki/Category:Bauxite');
  await new Promise((r) => setTimeout(r, 10000));
  await probe('filepath', 'https://commons.wikimedia.org/wiki/Special:FilePath/LED_strip_closeup.jpg?width=1280');
  await new Promise((r) => setTimeout(r, 10000));
  await probe('en.wiki', 'https://en.wikipedia.org/wiki/Bauxite_mining');
})();
