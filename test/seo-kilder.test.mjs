import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { hentUtdrag } from '../seo-motor/kilder.mjs';

const fixtureRot = new URL('../seo-motor/test/fixtures/kilder/', import.meta.url);
const restematHtml = readFileSync(new URL('restemat.html', fixtureRot), 'utf8');

const emne = {
  sprak: 'nb',
  tagger: ['rester'],
  sokeord: 'middag av rester i kjøleskapet',
};

test('velger kilder med felles tagg', async () => {
  const kall = [];
  const kilder = {
    nb: [
      { url: 'https://offentlig.example/rester', tagger: ['rester', 'oppbevaring'] },
      { url: 'https://offentlig.example/omregning', tagger: ['omregning'] },
    ],
  };

  const utdrag = await hentUtdrag(emne, kilder, async (url) => {
    kall.push(url);
    return { status: 200, tekst: restematHtml };
  });

  assert.deepEqual(kall, ['https://offentlig.example/rester']);
  assert.ok(utdrag.length > 0);
});

test('tom kilde gir ingen utdrag', async () => {
  const kilder = {
    nb: [
      { url: 'https://offentlig.example/forbudt', tagger: ['rester'] },
      { url: 'https://offentlig.example/tom', tagger: ['rester'] },
    ],
  };

  const utdrag = await hentUtdrag(emne, kilder, async (url) => (
    url.endsWith('/forbudt')
      ? { status: 403, tekst: restematHtml }
      : { status: 200, tekst: '' }
  ));

  assert.deepEqual(utdrag, []);
});

test('utdrag nummereres K1..', async () => {
  const kilder = {
    nb: [{ url: 'https://offentlig.example/rester', tagger: ['rester'] }],
  };

  const utdrag = await hentUtdrag(
    emne,
    kilder,
    async () => ({ status: 200, tekst: restematHtml }),
  );

  assert.deepEqual(utdrag.map(({ id }) => id), ['K1', 'K2']);
  assert.deepEqual(utdrag.map(({ tekst }) => tekst), [
    'Rester kan bli en ny middag når de oppbevares riktig.',
    'Sett restene synlig i kjøleskapet, så er de lettere å bruke.',
  ]);
  assert.ok(utdrag.every(({ tekst }) => tekst.length <= 600));
});

test('henter aldri utenfor kilder.json', async () => {
  const kall = [];
  const kilder = {
    nb: [{ url: 'https://offentlig.example/rester', tagger: ['rester'] }],
  };

  await hentUtdrag(emne, kilder, async (url) => {
    kall.push(url);
    return { status: 200, tekst: restematHtml };
  });

  assert.deepEqual(kall, ['https://offentlig.example/rester']);
  assert.equal(kall.includes('https://uautorisert.example/råd'), false);
});
