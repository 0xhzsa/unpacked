const https = require('https');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 UNPACKED-v3-images';
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
  const queries = [
    'filetype:bitmap ceramic mug coffee',
    'filetype:bitmap mug coffee cup table',
    'filetype:bitmap white mug minimal',
    'filetype:bitmap espresso cup saucer'
  ];
  for (const q of queries) {
    try {
      const j = await api({ action: 'query', list: 'search', srsearch: q, srnamespace: 6, srlimit: 12, format: 'json' });
      const hits = (j.query && j.query.search) || [];
      console.log('== ' + q);
      hits.forEach(h => console.log('   ' + h.title.replace('File:', '')));
    } catch (e) { console.log('== ' + q + ' ERR ' + e.message); }
    await sleep(7000);
  }
})();
