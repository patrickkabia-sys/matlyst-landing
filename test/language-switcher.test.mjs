import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../language-switcher.js', import.meta.url), 'utf8');

function kjor({ search = '', hash = '', href = '/sv/avregistrera/?sprak=sv' } = {}) {
  const lager = new Map();
  let cookie = '';
  let klikk = null;
  const lenke = {
    href,
    getAttribute: (navn) => (navn === 'href' ? lenke.href : null),
    setAttribute: (navn, verdi) => { if (navn === 'href') lenke.href = verdi; },
    addEventListener: (navn, handler) => { if (navn === 'click') klikk = handler; },
  };
  const document = {
    querySelectorAll: () => [lenke],
    get cookie() { return cookie; },
    set cookie(verdi) { cookie = verdi; },
  };
  const window = {
    document,
    location: { origin: 'https://matlyst-app.no', search, hash },
    localStorage: { getItem: (k) => lager.get(k) ?? null, setItem: (k, v) => lager.set(k, v) },
  };
  vm.runInNewContext(source, { window, URL, URLSearchParams });
  return { lenke, lager, klikk: () => klikk?.(), cookie: () => cookie };
}

test('språkbytte bevarer signerte parametere og anker', () => {
  const side = kjor({ search: '?u=bruker&s=signatur', hash: '#status' });
  assert.equal(side.lenke.href, '/sv/avregistrera/?u=bruker&s=signatur&sprak=sv#status');
});

test('valg lagres før nettleseren følger lenken', () => {
  const side = kjor({ href: '/?sprak=nb' });
  side.klikk();
  assert.equal(side.lager.get('matlyst-sprak'), 'nb');
  assert.equal(side.lager.get('matlyst-sprak-vurdert'), '1');
  assert.match(side.cookie(), /matlyst-sprak-vurdert=1/u);
});

test('direkte språkparameter lagres også på tekniske sider', () => {
  const side = kjor({ search: '?code=abc&sprak=da', href: '/da/tiktok-auth/?sprak=da' });
  assert.equal(side.lager.get('matlyst-sprak'), 'da');
  assert.equal(side.lager.get('matlyst-sprak-vurdert'), '1');
  assert.equal(side.lenke.href, '/da/tiktok-auth/?code=abc&sprak=da');
});

test('footerens lenkerekke brytes på mobil, så bunnvelgeren ikke gjør siden bredere enn skjermen', () => {
  const css = readFileSync(new URL('../language-switcher.css', import.meta.url), 'utf8');
  const mobil = css.match(/@media \(max-width: 700px\) \{([\s\S]*?)\n\}/u);
  assert.ok(mobil, 'mangler mobilblokk');
  assert.match(mobil[1], /footer \.f-l, footer \.footer-links \{[^}]*flex-wrap: wrap/u);
  assert.match(mobil[1], /footer \.language-switcher-bottom \{[^}]*flex-basis: 100%/u);
});
