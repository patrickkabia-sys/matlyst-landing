import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(`${root}/404.html`, 'utf8');

test('404-siden er noindex, tilgjengelig og bruker nettstedets design', () => {
  assert.match(html, /<meta name="robots" content="noindex, follow">/u);
  assert.match(html, /<main id="hovedinnhold"/u);
  assert.match(html, /aria-labelledby="not-found-title"/u);
  assert.match(html, /href="\/styles\.css"/u);
  assert.match(html, /href="\/404\.css"/u);
  assert.doesNotMatch(html, /site\.js|posthog|googletagmanager/iu);
});

test('404-siden har tekst og fungerende mål på alle fire språk', () => {
  const script = html.match(/<script>([\s\S]*?)<\/script>/u)[1];
  for (const [prefix, expected] of [['nb','Denne siden finnes ikke.'], ['sv','Den här sidan finns inte.'], ['da','Denne side findes ikke.'], ['en','This page does not exist.']]) {
    const elements = new Map();
    const make = (key = '') => ({ textContent: '', href: '', getAttribute: () => key, setAttribute() {} });
    const copyElements = ['title','lead','home','import','help','plan','shopping','contact','terms','privacy','skip'].map((key) => [key, make(key)]);
    for (const [key, element] of copyElements) elements.set(key, element);
    const documentElement = { lang: '' };
    const document = {
      documentElement,
      title: '',
      querySelectorAll(selector) {
        if (selector === '[data-copy]') return copyElements.map(([, element]) => element);
        const key = selector.match(/^\[data-([^\]]+)\]$/u)?.[1];
        return key && elements.has(key) ? [elements.get(key)] : [];
      },
      querySelector() { return make(); },
    };
    vm.runInNewContext(script, { document, location: { pathname: prefix === 'nb' ? '/mangler/' : `/${prefix}/mangler/` } });
    assert.equal(documentElement.lang, prefix);
    assert.equal(elements.get('title').textContent, expected);
    assert.ok(elements.get('home').href.startsWith(prefix === 'nb' ? '/' : `/${prefix}/`));
    assert.ok(elements.get('import').href.includes(prefix === 'nb' ? 'importer-' : `/${prefix}/`));
  }
});
