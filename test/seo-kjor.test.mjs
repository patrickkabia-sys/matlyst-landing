import assert from 'node:assert/strict';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';

import { kjor } from '../seo-motor/kjor.mjs';
import { lagRapporttekst } from '../seo-motor/etterbehandle.mjs';
import { nattrapport } from '../seo-motor/rapport.mjs';

const REPO = new URL('../', import.meta.url);
const FIXTURE = JSON.parse(readFileSync(
  new URL('../seo-motor/test/fixtures/tørt/api.json', import.meta.url),
  'utf8',
));

function skrivJson(fil, data) {
  mkdirSync(join(fil, '..'), { recursive: true });
  writeFileSync(fil, `${JSON.stringify(data, null, 2)}\n`);
}

function lagRot(t, { ko = true, grenser = {}, logg = [] } = {}) {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-kjor-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  mkdirSync(join(mappe, 'seo-data'), { recursive: true });
  mkdirSync(join(mappe, 'blogg-kilde', 'auto'), { recursive: true });
  cpSync(new URL('../seo-data/sprak/', import.meta.url), join(mappe, 'seo-data', 'sprak'), { recursive: true });
  cpSync(new URL('../seo-data/instrukser/', import.meta.url), join(mappe, 'seo-data', 'instrukser'), { recursive: true });
  skrivJson(join(mappe, 'seo-data', 'emnekø.json'), ko ? [{
    id: 'oppbevaring-av-ukens-rester-hjemme-nb',
    sprak: 'nb',
    sokeord: 'oppbevaring av ukens rester hjemme',
    poeng: 100,
    tagger: ['oppbevaring', 'rester'],
  }] : []);
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), []);
  skrivJson(join(mappe, 'seo-data', 'grenser.json'), {
    brodtekstMinOrd: 20,
    brodtekstMaksOrd: 1200,
    overlappMaks: 0.5,
    vanskelighetMaks: 35,
    dataforseoMaksForesporslerPerUke: 40,
    ...grenser,
  });
  skrivJson(join(mappe, 'seo-data', 'frø.json'), {
    nb: ['airfryer', 'kjøkkentips', 'ukemeny', 'rester'],
    sv: [], da: [], en: [],
  });
  skrivJson(join(mappe, 'seo-data', 'kilder.json'), {
    nb: [{ id: 'mattilsynet', url: 'https://kilde.test/rester', tagger: ['oppbevaring', 'rester'] }],
  });
  skrivJson(join(mappe, 'seo-data', 'forbudt.json'), { domener: [], navn: [], helseord: {}, slugs: [] });
  for (const rad of logg) skrivJson(join(mappe, 'seo-data', 'logg', `${rad.dato}.json`), rad);
  writeFileSync(join(mappe, 'index.html'), '<title>Matlyst</title><meta name="description" content="Forsiden"><body>Matlyst</body>');
  writeFileSync(join(mappe, 'sitemap.xml'), '<?xml version="1.0"?><urlset><url><loc>https://matlyst-app.no/</loc></url></urlset>');
  return { mappe, rot: pathToFileURL(`${mappe}/`) };
}

function lagAvh(rot, { artikkel = FIXTURE.artikkel, hent, dataforseo, gsc } = {}) {
  let klientKall = 0;
  const klient = {
    messages: {
      parse: async () => {
        klientKall += 1;
        const data = klientKall === 1 ? artikkel : FIXTURE.gransk;
        return {
          parsed_output: data,
          stop_reason: 'end_turn',
          usage: { input_tokens: 100, output_tokens: 100 },
        };
      },
    },
  };
  return {
    avh: {
      gsc: gsc ?? (async () => { throw new Error('gsc skal ikke kalles'); }),
      dataforseo: dataforseo ?? (async () => { throw new Error('dataforseo skal ikke kalles'); }),
      hent: hent ?? (async () => FIXTURE.kilde),
      klient,
      gh: async () => '[]',
      rot,
    },
    klientKall: () => klientKall,
  };
}

function filer(rot) {
  return readdirSync(rot, { recursive: true }).map(String).sort();
}

function statusShell(workflow) {
  const stegstart = workflow.indexOf('      - name: Lagre driftsstatus');
  const blokkstart = workflow.indexOf('        run: |\n', stegstart) + '        run: |\n'.length;
  const blokkslutt = workflow.indexOf('\n      - name:', blokkstart);
  return workflow.slice(blokkstart, blokkslutt)
    .split('\n')
    .map((linje) => linje.slice(10))
    .join('\n');
}

test('av gjør ingenting', async (t) => {
  const { mappe, rot } = lagRot(t);
  const { avh } = lagAvh(rot);
  const før = filer(mappe);

  const resultat = await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'av', tørt: true, avh });

  assert.equal(resultat.resultat, 'av');
  assert.deepEqual(filer(mappe), før);
});

test('tørt i utkast skriver artikkel og logg uten nettverk', async (t) => {
  const { mappe, rot } = lagRot(t);
  const { avh } = lagAvh(rot);

  const resultat = await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(resultat.resultat, 'publisert');
  const artikkel = JSON.parse(readFileSync(join(mappe, 'blogg-kilde', 'auto', 'nb', `${FIXTURE.artikkel.slug}.json`)));
  assert.deepEqual(artikkel.kilder, [{ id: 'K1', url: 'https://kilde.test/rester' }]);
  assert.ok(existsSync(join(mappe, 'seo-data', 'logg', '2026-11-12.json')));
});

test('avvist fra vern skriver avvist-fil', async (t) => {
  const { mappe, rot } = lagRot(t);
  const forLangTittel = { ...FIXTURE.artikkel, tittel: 'x'.repeat(61) };
  const { avh } = lagAvh(rot, { artikkel: forLangTittel });

  const resultat = await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(resultat.resultat, 'avvist');
  assert.ok(existsSync(join(mappe, 'seo-data', 'avvist', `2026-11-12-${FIXTURE.artikkel.slug}.json`)));
});

test('tredje avvisning skriver sperre', async (t) => {
  const { mappe, rot } = lagRot(t, { logg: [
    { dato: '2026-11-10', resultat: 'avvist' },
    { dato: '2026-11-11', resultat: 'avvist' },
  ] });
  const { avh } = lagAvh(rot, { artikkel: { ...FIXTURE.artikkel, tittel: 'x'.repeat(61) } });

  const resultat = await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.ok(existsSync(join(mappe, 'seo-data', 'sperre.json')));
  assert.equal(resultat.resultat, 'sperret');
  assert.match(nattrapport(resultat), /sperret/u);
  assert.doesNotMatch(nattrapport(resultat), /tre avvisninger på rad/u);
});

test('aktiv sperre gjør på-modus til utkast i hele kjøringen', async (t) => {
  const { mappe, rot } = lagRot(t);
  skrivJson(join(mappe, 'seo-data', 'sperre.json'), { grunn: 'tre avvisninger på rad' });
  const { avh } = lagAvh(rot);

  const resultat = await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'på', tørt: true, avh });

  assert.equal(resultat.modus, 'utkast');
  assert.equal(resultat.resultat, 'publisert');
});

test('korrupt sperrefil blir feilresultat og kastes ikke ut av kjor', async (t) => {
  const { mappe, rot } = lagRot(t);
  writeFileSync(join(mappe, 'seo-data', 'sperre.json'), '{ikke json');
  const { avh } = lagAvh(rot);

  const resultat = await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(resultat.resultat, 'feil');
  assert.match(resultat.grunner[0], /JSON/u);
  assert.ok(existsSync(join(mappe, 'seo-data', 'logg', '2026-11-12.json')));
});

test('feil i kilde gir resultat feil og ingen artikkel', async (t) => {
  const { mappe, rot } = lagRot(t);
  const { avh } = lagAvh(rot, { hent: async () => { throw new Error('kilden svarte ikke'); } });

  const resultat = await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(resultat.resultat, 'feil');
  assert.match(resultat.grunner[0], /kilden svarte ikke/u);
  assert.equal(existsSync(join(mappe, 'blogg-kilde', 'auto', 'nb', `${FIXTURE.artikkel.slug}.json`)), false);
});

test('ingen nye forsøk etter avvisning', async (t) => {
  const { rot } = lagRot(t);
  const { avh, klientKall } = lagAvh(rot, { artikkel: { ...FIXTURE.artikkel, tittel: 'x'.repeat(61) } });

  await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(klientKall(), 1);
});

test('DataForSEO-taket lagres per uke på tvers av kjøringer', async (t) => {
  const { mappe, rot } = lagRot(t, {
    ko: false,
    grenser: { dataforseoMaksForesporslerPerUke: 3 },
  });
  let dataforseoKall = 0;
  const { avh } = lagAvh(rot, {
    gsc: async () => [],
    dataforseo: async ({ frø }) => {
      dataforseoKall += 1;
      assert.equal(frø.length, 3);
      return [];
    },
  });

  await kjor({ tid: new Date('2026-11-09T04:00:00Z'), modus: 'utkast', tørt: true, avh });
  await kjor({ tid: new Date('2026-11-09T05:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(dataforseoKall, 1);
  const teller = JSON.parse(readFileSync(join(mappe, 'seo-data', 'logg', 'dataforseo-2026-11-09.json')));
  assert.equal(teller.foresporsler, 3);
});

test('GSC-perioden bruker Oslo-dato rundt midnatt', async (t) => {
  const { rot } = lagRot(t, { ko: false });
  let periode;
  const { avh } = lagAvh(rot, {
    gsc: async ({ fra, til }) => {
      periode = { fra, til };
      return [];
    },
    dataforseo: async () => [],
  });

  await kjor({ tid: new Date('2026-11-08T23:30:00Z'), modus: 'utkast', tørt: true, avh });

  assert.deepEqual(periode, { fra: '2026-10-12', til: '2026-11-08' });
});

test('workflow har tidsplan, manuell start og av-vakt', () => {
  const workflow = readFileSync(new URL('../.github/workflows/seo-autopilot.yml', import.meta.url), 'utf8');
  assert.match(workflow, /cron:\s*'0 3 \* \* \*'/u);
  assert.match(workflow, /workflow_dispatch:/u);
  assert.match(workflow, /SEO_AUTOPILOT:\s*\$\{\{ vars\.SEO_AUTOPILOT \}\}/u);
  assert.match(workflow, /steps\.modus\.outputs\.modus != 'av'/u);
  assert.match(workflow, /echo "modus=\$\(node -p .*seo-resultat\.json.*\.modus/u);
  assert.match(workflow, /if: steps\.motor\.outputs\.modus == 'på'/u);
  assert.match(workflow, /if: steps\.motor\.outputs\.modus == 'utkast'/u);
  assert.doesNotMatch(workflow, /echo "dato=\$\(date \+%F\)"/u);
  assert.match(workflow, /- name: Bygg nettstedet\n\s+if:[^\n]+\n\s+id: bygg\n\s+continue-on-error: true/u);
  assert.doesNotMatch(workflow, /node --input-type=module/u);
  assert.doesNotMatch(workflow, /<<'NODE'/u);
  assert.equal(workflow.match(/node seo-motor\/etterbehandle\.mjs avvis/gu)?.length, 1);
  assert.equal(workflow.match(/node seo-motor\/etterbehandle\.mjs levering/gu)?.length, 1);
  assert.equal(workflow.match(/node seo-motor\/etterbehandle\.mjs pushfeil/gu)?.length, 1);
  assert.equal(workflow.match(/node seo-motor\/etterbehandle\.mjs rapport/gu)?.length, 1);
  assert.match(workflow, /uses: actions\/checkout@v4\n\s+with:\n\s+ref: main/u);
  assert.match(workflow, /echo "basis=\$\(git rev-parse HEAD\)"/u);
  assert.equal(workflow.match(/git reset -- seo-resultat\.json seo-data/gu)?.length, 2);
  assert.equal(workflow.match(/git push origin HEAD:main/gu)?.length, 1);
  assert.equal(workflow.match(/git pull --rebase origin main/gu)?.length, 1);
  assert.match(workflow, /if ! git pull --rebase origin main \|\| ! git push origin HEAD:main; then/u);
  assert.ok(workflow.indexOf('git push origin HEAD:main') > workflow.indexOf('- name: Lagre driftsstatus'));
  assert.match(workflow, /git switch -C seo-autopilot-status "\$BASIS"/u);
  assert.doesNotMatch(workflow, /git switch main/u);
  assert.doesNotMatch(workflow, /push av artikkel og driftsstatus feilet/u);
  assert.doesNotMatch(workflow, /logg\.resultat = 'utkast'/u);
  assert.doesNotMatch(workflow, /skalSperre\(tellAvvisningerPåRad\(historikk\)\)/u);
  assert.doesNotMatch(workflow, /rad\.dato >= startdato && rad\.dato <= sluttdato/u);
});

test('workflowens statussteg er gyldig shell', () => {
  const workflow = readFileSync(new URL('../.github/workflows/seo-autopilot.yml', import.meta.url), 'utf8');
  const shell = statusShell(workflow);

  execFileSync('bash', ['-n'], { input: shell, stdio: ['pipe', 'pipe', 'pipe'] });
});

test('rebasekonflikt avbrytes før pushfeilen logges og rapporteres', (t) => {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-rebase-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  const remote = join(mappe, 'remote.git');
  const kilde = join(mappe, 'kilde');
  const kjører = join(mappe, 'kjører');
  const git = (cwd, args) => execFileSync('git', args, { cwd, stdio: 'pipe' }).toString().trim();

  execFileSync('git', ['init', '--bare', remote], { stdio: 'pipe' });
  mkdirSync(kilde);
  git(kilde, ['init', '-b', 'main']);
  git(kilde, ['config', 'user.name', 'Test']);
  git(kilde, ['config', 'user.email', 'test@example.com']);
  cpSync(new URL('../seo-motor/filer.mjs', import.meta.url), join(kilde, 'seo-motor', 'filer.mjs'));
  cpSync(new URL('../seo-motor/modus.mjs', import.meta.url), join(kilde, 'seo-motor', 'modus.mjs'));
  cpSync(new URL('../seo-motor/rapport.mjs', import.meta.url), join(kilde, 'seo-motor', 'rapport.mjs'));
  cpSync(new URL('../seo-motor/etterbehandle.mjs', import.meta.url), join(kilde, 'seo-motor', 'etterbehandle.mjs'));
  cpSync(new URL('../seo-data/sprak/nb.json', import.meta.url), join(kilde, 'seo-data', 'sprak', 'nb.json'));
  skrivJson(join(kilde, 'seo-data', 'logg', '2026-11-12.json'), {
    dato: '2026-11-12',
    modus: 'på',
    resultat: 'publisert',
    kostnadUsd: 0.01,
  });
  git(kilde, ['add', '.']);
  git(kilde, ['commit', '-m', 'basis']);
  git(kilde, ['remote', 'add', 'origin', remote]);
  git(kilde, ['push', '-u', 'origin', 'main']);
  execFileSync('git', ['clone', remote, kjører], { stdio: 'pipe' });

  skrivJson(join(kjører, 'seo-data', 'logg', '2026-11-12.json'), {
    dato: '2026-11-12',
    modus: 'på',
    resultat: 'publisert',
    kostnadUsd: 0.02,
  });
  skrivJson(join(kilde, 'seo-data', 'logg', '2026-11-12.json'), {
    dato: '2026-11-12',
    modus: 'på',
    resultat: 'publisert',
    kostnadUsd: 0.03,
  });
  git(kilde, ['add', 'seo-data']);
  git(kilde, ['commit', '-m', 'ekstern status']);
  git(kilde, ['push', 'origin', 'main']);
  const fjernHode = git(kilde, ['rev-parse', 'HEAD']);

  const workflow = readFileSync(new URL('../.github/workflows/seo-autopilot.yml', import.meta.url), 'utf8');
  const resultat = spawnSync('bash', ['-e'], {
    cwd: kjører,
    env: {
      ...process.env,
      BASIS: git(kjører, ['rev-parse', 'HEAD']),
      DATO: '2026-11-12',
      MODUS: 'på',
      MOTORRESULTAT: 'publisert',
      PUBLISERINGSUTFALL: 'success',
    },
    input: statusShell(workflow),
    encoding: 'utf8',
  });

  assert.equal(resultat.status, 1);
  assert.equal(existsSync(join(kjører, '.git', 'rebase-merge')), false);
  assert.equal(existsSync(join(kjører, '.git', 'rebase-apply')), false);
  assert.equal(git(remote, ['rev-parse', 'refs/heads/main']), fjernHode);
  const logg = JSON.parse(readFileSync(join(kjører, 'seo-data', 'logg', '2026-11-12.json')));
  assert.equal(logg.resultat, 'feil');
  assert.deepEqual(logg.grunner, ['push av artikkel og driftsstatus feilet']);
  assert.match(lagRapporttekst(pathToFileURL(`${kjører}/`), '2026-11-12'), /Resultat:\*\* feil/u);
  assert.doesNotMatch(lagRapporttekst(pathToFileURL(`${kjører}/`), '2026-11-12'), /push av artikkel/u);
});

test('CLI-tørrkjøring uten miljø går gjennom hele løpet', (t) => {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-cli-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  cpSync(REPO, mappe, {
    recursive: true,
    filter: (kilde) => !['.git', '.superpowers', 'node_modules'].includes(kilde.split('/').at(-1)),
  });
  symlinkSync(fileURLToPath(new URL('../node_modules', import.meta.url)), join(mappe, 'node_modules'), 'dir');
  const miljø = { ...process.env };
  for (const navn of [
    'SEO_AUTOPILOT',
    'GSC_SERVICE_ACCOUNT_JSON',
    'DATAFORSEO_LOGIN',
    'DATAFORSEO_PASSWORD',
    'ANTHROPIC_API_KEY_LANDING',
  ]) delete miljø[navn];
  execFileSync(process.execPath, ['seo-motor/kjor.mjs', '--tørt'], { cwd: mappe, env: miljø, stdio: 'pipe' });

  const resultat = JSON.parse(readFileSync(join(mappe, 'seo-resultat.json')));
  assert.equal(resultat.resultat, 'publisert');
  assert.equal(resultat.modus, 'utkast');
  assert.ok(existsSync(join(mappe, 'blogg-kilde', 'auto', 'nb', `${resultat.slug}.json`)));
});
