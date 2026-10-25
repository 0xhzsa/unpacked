// check-beats.js - gate for the v3 story layer.
// Asserts window.UNPACKED_BEATS covers every stop in window.JOURNEY exactly once, in order,
// with the beat contract intact, and warns when a stat numeral is not traceable to the
// audited journey specs/history (manual-OK list below covers reviewed exceptions).
// Run from repo root: node check-beats.js  (exit 1 on problems, warnings are reported)
const fs = require('fs');

const problems = [], warns = [], manual = [];

const window = { CONTENT: { chains: [] } };
eval(fs.readFileSync('js/journey.js', 'utf8'));
const chArr = window.JOURNEY.objects || window.JOURNEY.chains || window.JOURNEY;
if (!Array.isArray(chArr)) { console.log('check-beats: journey shape unknown'); process.exit(1); }

eval(fs.readFileSync('js/beats.js', 'utf8'));
const beats = window.UNPACKED_BEATS;
if (!beats || typeof beats !== 'object') { console.log('check-beats: UNPACKED_BEATS missing'); process.exit(1); }

const WORDNUM = {
  one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7',
  eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', twenty: '20',
  thirty: '30', fifty: '50', sixty: '60', hundred: '100', thousand: '1000',
  thousands: '1000', million: '1000000', millions: '1000000',
  billion: '1000000000', billions: '1000000000', dozens: '12', tens: '10',
  doubled: '2', tripled: '3', single: '1'
};

const specText = (st) => (st.specs || []).map(sp => sp.label + ' = ' + sp.value + (sp.unit || '')).join(' ; ') +
  ' || ' + (st.history || '') + ' || ' + (st.narration || '') + ' || ' + (st.image || '');

function numTok(t) {
  const set = new Set();
  for (const m of String(t).matchAll(/\d[\d,.]*/g)) {
    set.add(m[0].replace(/,$/, ''));
    set.add(m[0].replace(/[,\s]/g, ''));
  }
  const words = String(t).toLowerCase().match(/[a-z]+/g) || [];
  for (const w of words) if (WORDNUM[w]) set.add(WORDNUM[w]);
  return set;
}

const MANUAL_OK = {
  'magnet-power-bank/magnet-power-bank-board-01|stat': 'SoC is singular in spec (Core=ARM-class SoC); stop carries no numeral spec',
  'ballpoint-pen/ballpoint-pen-grinder-02|stat': 'sub-micron means under 0.001 mm (journey Tolerance=Sub-micron; ball spec Roundness=approx 1 micrometer)'
};
const isManual = (tag, kind) => MANUAL_OK[tag + '|' + kind] || null;

const ordered = [], seen = new Set();
for (const ch of chArr) for (const st of ch.stops) {
  ordered.push({ ch: ch.id, tag: ch.id + '/' + st.id, st });
  seen.add(st.id);
}
const beatKeys = Object.keys(beats);
const missing = ordered.filter(o => !beats[o.st.id]).map(o => o.tag);
const extra = beatKeys.filter(k => !seen.has(k));
if (missing.length) problems.push('MISSING (' + missing.length + '): ' + missing.join(' '));
if (extra.length) problems.push('EXTRA (' + extra.length + '): ' + extra.join(' '));

const badDash = /[\u2013\u2014]/;

for (const o of ordered) {
  const b = beats[o.st.id]; if (!b) continue;
  const tag = o.tag, s = o.st;
  if (typeof b.b !== 'string' || !b.b.trim()) problems.push(tag + ': EMPTY body');
  else if (b.b.length > 300) problems.push(tag + ': body TOO LONG ' + b.b.length);
  else if (b.b.length > 260) {
    const okm = isManual(tag, 'body');
    if (okm) manual.push(tag + ': body ' + b.b.length + ' chars (allowed: ' + okm + ')');
    else warns.push(tag + ': body soft-cap ' + b.b.length + ' | ' + b.b);
  }
  const fields = [b.h, b.b, b.stat && b.stat.l, b.stat && b.stat.v, b.stat && b.stat.u].filter(x => typeof x === 'string');
  for (const t of fields) {
    if (badDash.test(t)) problems.push(tag + ': EM DASH in: ' + t);
    if (/it's not|it is not/i.test(t) || /\bnot just\b/i.test(t)) problems.push(tag + ': slop reveal: ' + t);
  }
  if (typeof b.h !== 'string' || !b.h.trim()) problems.push(tag + ': EMPTY h');
  if (!b.stat || typeof b.stat !== 'object') { problems.push(tag + ': no stat'); continue; }
  const { v, u, l } = b.stat;
  if ((typeof v !== 'string' && typeof v !== 'number')) problems.push(tag + ': stat.v bad type');
  if (typeof u !== 'string') problems.push(tag + ': stat.u bad type');
  if (typeof l !== 'string' || !l.trim()) problems.push(tag + ': stat.l empty');
  else if (l.length > 64) warns.push(tag + ': long stat.l ' + l.length + ' | ' + l);
  if (!Array.isArray(b.call) || b.call.length !== 2) { problems.push(tag + ': call len ' + (b.call ? b.call.length : 'null')); continue; }
  for (const c of b.call) {
    if (typeof c.x !== 'number' || c.x < 0 || c.x > 100 || typeof c.y !== 'number' || c.y < 0 || c.y > 100)
      problems.push(tag + ': call coords ' + JSON.stringify(c));
    if (typeof c.label !== 'string' || !c.label.trim() || typeof c.sub !== 'string' || !c.sub.trim())
      problems.push(tag + ': call label/sub empty');
    if (badDash.test(c.label) || badDash.test(c.sub)) problems.push(tag + ': EM DASH in call');
  }
  if (s.kind === 'room') {
    const wdg = (s.specs || []).find(sp => /how deep/i.test(sp.label));
    const wend = (s.specs || []).find(sp => /we end/i.test(sp.label));
    if (wdg && (String(v) !== String(wdg.value) || u !== 'stops'))
      warns.push(tag + ': room stat != How deep we go (' + String(v) + ' vs ' + String(wdg.value) + ', u=' + u + ')');
    if (wend && l) {
      const core = String(wend.value).toLowerCase().replace(/^the |^an |^a /, '');
      if (!(core.length > 2 && String(l).toLowerCase().includes(core)))
        warns.push(tag + ': room l misses ground "' + String(wend.value) + '" | l=' + l);
    }
  }
  const localTxt = specText(s);
  const chObj = chArr.find(c => c.id === o.ch);
  const chainTxt = chObj ? chObj.stops.map(specText).join(' || ') + ' || ' + (chObj.tagline || '') + ' || ' + (chObj.name || '') : '';
  const localTok = numTok(localTxt), chainTok = numTok(chainTxt);
  const vn = String(v).match(/\d[\d,.]*/g) || [];
  const missLocal = [], missChain = [];
  for (const n of vn) {
    if (!localTok.has(n) && !localTok.has(n.replace(/,/g, ''))) missLocal.push(n);
    if (!chainTok.has(n) && !chainTok.has(n.replace(/,/g, ''))) missChain.push(n);
  }
  if (String(v) !== '' && missLocal.length > 0) {
    const okm = isManual(tag, 'stat');
    if (okm) manual.push(tag + ': stat "' + String(v) + '" (allowed: ' + okm + ')');
    else warns.push(tag + ': stat "' + String(v) + '" not in stop specs (' + missLocal.join('+') + ')');
  }
  if (String(v) !== '' && missChain.length > 0) {
    if (!isManual(tag, 'stat'))
      warns.push(tag + ': stat "' + String(v) + '" not in chain AT ALL (' + missChain.join('+') + ')');
    else if (missLocal.length === 0)
      manual.push(tag + ': stat "' + String(v) + '" (chain via spelled-out words; allowed)');
  }
}

console.log('check-beats: chains ' + chArr.length + ' | stops ' + ordered.length + ' | beats ' + beatKeys.length);
console.log('manual-ok: ' + manual.length);
for (const m of manual) console.log('  * ' + m);
if (warns.length) { console.log('warnings: ' + warns.length); for (const w of warns) console.log('  ~ ' + w); }
for (const p of problems) console.log('PROBLEM: ' + p);
if (problems.length) process.exit(1);
console.log('check-beats: OK');
