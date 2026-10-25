// fetch Commons file at 1600px via Special:FilePath, save to out path; print bytes+width
const https = require('https');
const fs = require('fs');
const title = process.argv[2];
const out = process.argv[3];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function get(url, redirects) {
  return new Promise((res, rej) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname, path: u.pathname + u.search, protocol: u.protocol,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 UNPACKED-v3-images',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      }
    }, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        if (redirects > 5) return rej(new Error('too many redirects'));
        return get(new URL(r.headers.location, url).toString(), redirects + 1).then(res).catch(rej);
      }
      if (r.statusCode !== 200) { rej(new Error('HTTP ' + r.statusCode)); return; }
      const c = []; r.on('data', x => c.push(x)); r.on('end', () => res(Buffer.concat(c)));
    });
    req.on('error', rej);
    req.setTimeout(60000, () => { req.destroy(); rej(new Error('timeout')); });
  });
}

function widthOf(buf) {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const m = buf[i + 1];
    if (m === 0xD9) break;
    if (m === 0xC0 || m === 0xC1 || m === 0xC2) return (buf[i + 5] << 8) | buf[i + 6];
    const l = (buf[i + 2] << 8) | buf[i + 3];
    i += 2 + l;
  }
  return 0;
}

(async () => {
  await sleep(3000);
  const buf = await get('https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(title.replace(/^File:/, '')) + '?width=1600');
  const w = widthOf(buf);
  console.log('bytes:', buf.length, 'width:', w, 'magic:', buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF);
  if (w < 1000) { console.log('REJECT: width'); process.exit(1); }
  fs.writeFileSync(out, buf);
  console.log('WROTE', out);
})();
