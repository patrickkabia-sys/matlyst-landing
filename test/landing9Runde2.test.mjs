import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const HTML = readdirSync(join(ROOT, 'images')).filter((name) => /badge/iu.test(name));

test('butikkmerkene er engelske i innholdet, ikke bare i filnavnet', () => {
  assert.deepEqual(HTML.sort(), ['appstore-badge.svg', 'googleplay-badge-en.png']);
  const apple = readFileSync(join(ROOT, 'images/appstore-badge.svg'), 'utf8');
  assert.doesNotMatch(apple, /(?:_NO_|Last ned|Hent|Lataa|Télécharger|Descargar|Download_on_the_App_Store_Badge_NO)/iu);
  assert.match(apple, /Download_on_the_App_Store_Badge_US-UK/iu);
  assert.doesNotMatch(readFileSync(join(ROOT, 'images/googleplay-badge-en.png'), 'latin1'), /(?:Last ned|Hent|Ladda ner|Télécharger)/iu);
});

test('juridiske kilder har URL og lesedato for klageveiene', () => {
  const sources = readFileSync(join(ROOT, 'qa/sv-da/juridiske-kilder.md'), 'utf8');
  assert.match(sources, /https:\/\/forbrugereuropa\.dk\/klag\//u);
  assert.match(sources, /https:\/\/www\.forbrukerradet\.no\/her-klager-du\//u);
  assert.match(sources, /https:\/\/www\.forbrukertilsynet\.no\/forbrukerklageutvalget\//u);
  assert.equal((sources.match(/2026-10-05/gu) ?? []).length >= 4, true);
});
