import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const tekst = readFileSync(new URL('../robots.txt', import.meta.url), 'utf8');

// Grupper: sammenhengende User-agent-linjer, så regler.
export function grupper(t) {
  const ut = [];
  let denne = null, lesAgenter = false;
  for (const rad of t.split('\n').map((r) => r.replace(/#.*$/u, '').trim()).filter(Boolean)) {
    const [navn, ...resten] = rad.split(':');
    const verdi = resten.join(':').trim();
    const felt = navn.toLowerCase();
    if (felt === 'user-agent') {
      if (!lesAgenter) { denne = { agenter: [], regler: [] }; ut.push(denne); }
      denne.agenter.push(verdi);
      lesAgenter = true;
    } else {
      lesAgenter = false;
      if (denne && (felt === 'allow' || felt === 'disallow')) denne.regler.push([felt, verdi]);
    }
  }
  return ut;
}

const KI = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'meta-externalagent', 'bingbot'];

test('hver KI-crawler har en navngitt gruppe med Allow: /', () => {
  const g = grupper(tekst);
  for (const navn of KI) {
    const treff = g.filter((x) => x.agenter.some((a) => a.toLowerCase() === navn.toLowerCase()));
    assert.ok(treff.length >= 1, `mangler gruppe for ${navn}`);
    for (const x of treff) assert.ok(x.regler.some(([f, v]) => f === 'allow' && v === '/'), `${navn} mangler Allow: /`);
  }
});

test('ingen gruppe nekter noe for noen robot', () => {
  for (const x of grupper(tekst)) {
    const nekter = x.regler.filter(([f, v]) => f === 'disallow' && v !== '');
    assert.deepEqual(nekter, [], `${x.agenter.join(',')} har Disallow`);
  }
  assert.ok(grupper(tekst).some((x) => x.agenter.includes('*') && x.regler.some(([f, v]) => f === 'allow' && v === '/')));
});

test('alle fire sitemap-linjer står', () => {
  for (const f of ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml']) {
    assert.ok(tekst.includes(`Sitemap: https://matlyst-app.no/${f}\n`), f);
  }
});
