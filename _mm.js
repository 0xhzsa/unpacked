const https = require('https');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 UNPACKED-v3-images';

function api(params) {
  const qs = Object.entries(params).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
  return new Promise((res, rej) => {
    https.get({ hostname: 'commons.wikimedia.org', path: '/w/api.php?' + qs, headers: { 'User-Agent': UA, 'Accept': 'application/json' } }, r => {
      if (r.statusCode !== 200) { rej(new Error('HTTP ' + r.statusCode)); return; }
      let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(new Error('parse fail')); } });
    }).on('error', rej);
  });
}

(async () => {
  const titles = [
    'File:White Ceramic Mug Filled With Coffee Beside Coffee Beans (43087322071).jpg',
    'File:Coffee and cookies (Unsplash).jpg',
    'File:Coffee steaming in a mug.jpg',
    'File:Polka-dot mug (Unsplash).jpg',
    'File:Coffee with cream and sugar (Unsplash).jpg',
    'File:Mug of Cappucino, Epoch Cafe, 2026 (01).jpg',
    'File:Person Holding Mug on Table (29214761648).jpg'
  ];
  const j = await api({ action: 'query', titles: titles.join('|'), prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: 1600, format: 'json' });
  const pages = j.query && j.query.pages || {};
  Object.values(pages).forEach(p => {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii) { console.log(p.title + ' -> no info'); return; }
    const em = ii.extmetadata || {};
    console.log('TITLE: ' + p.title.replace('File:', ''));
    console.log('  size: ' + ii.width + 'x' + ii.height + ' bytes:' + ii.size);
    console.log('  artist: ' + String((em.Artist || {}).value || '').replace(/<[^>]+>/g, '').trim());
    console.log('  license: ' + (em.LicenseShortName || {}).value);
  });
})();
