import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

// Legg til domener eller merkenavn her. Treff avgrenses til domenedeler.
export const STORE_AKTORER = [
  'wikipedia', 'amazon', 'youtube', 'reddit', 'pinterest', 'facebook',
  'nytimes', 'forbes', 'wirecutter', 'cnet', 'pcmag', 'techradar',
  'goodhousekeeping', 'bhg', 'allrecipes', 'foodnetwork', 'thespruce',
  'healthline', 'webmd', 'clevelandclinic', 'mayoclinic', 'apple.com',
  'play.google.com', 'walmart', 'target', 'homedepot', 'lowes', 'bestbuy',
  'ebay', 'etsy', 'matprat.no', 'nrk.no', 'vg.no', 'aftenposten',
  'valdemarsro', 'koket.se', 'dr.dk', 'arla', 'coop', 'ica.se',
  'simplyrecipes', 'seriouseats', 'tasteofhome', 'marthastewart', 'thekitchn',
  'delish', 'epicurious', 'bonappetit', 'bbcgoodfood', 'wikihow', 'realsimple',
  'health.com', 'verywellfit', 'verywellhealth', 'nerdwallet', 'makeuseof',
  'tomshardware', 'tomsguide', 'consumerreports', 'businessinsider', 'popularmechanics',
];

const VOLUM = new Map([[50, 1], [500, 2], [5000, 3], [50000, 4], [500000, 5]]);
const VOLUMTEKST = ['Under 10', '10 - 100', '100 - 1K', '1K - 10K', '10K - 100K', '100K - 1M'];
const normaliser = tekst => tekst.trim().toLowerCase();

export async function readKeywordPlannerFile(path) {
  const bytes = await readFile(path);
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return bytes.subarray(2).toString('utf16le');
  // ASCII-tegn i UTF-16 LE har null i annethvert byte, også uten BOM.
  const prøve = bytes.subarray(0, 512);
  let nullOddetall = 0;
  let nullPartall = 0;
  for (let i = 0; i < prøve.length; i++) {
    if (prøve[i] === 0) {
      if (i % 2) nullOddetall++;
      else nullPartall++;
    }
  }
  const utf16 = nullOddetall > prøve.length / 5 && nullOddetall > nullPartall * 2;
  return bytes.toString(utf16 ? 'utf16le' : 'utf8').replace(/^\uFEFF/, '');
}

function lesTsv(tekst) {
  const rader = [];
  let rad = [];
  let felt = '';
  let sitert = false;
  for (let i = 0; i < tekst.length; i++) {
    const tegn = tekst[i];
    if (tegn === '"') {
      if (sitert && tekst[i + 1] === '"') { felt += '"'; i++; }
      else if (sitert || felt === '') sitert = !sitert;
      else felt += tegn;
    } else if (!sitert && (tegn === '\t' || tegn === '\n' || tegn === '\r')) {
      rad.push(felt);
      felt = '';
      if (tegn !== '\t') {
        rader.push(rad);
        rad = [];
        if (tegn === '\r' && tekst[i + 1] === '\n') i++;
      }
    } else felt += tegn;
  }
  if (sitert) throw new Error('CSV har et uavsluttet sitert felt.');
  if (felt || rad.length) rader.push([...rad, felt]);
  return rader;
}

export function parseKeywordPlannerCsv(text) {
  const linjer = lesTsv(text.replace(/^\uFEFF/, ''));
  const overskrift = (linjer[2] ?? []).map(felt => felt.trim());
  const kolonner = ['Keyword', 'Avg. monthly searches', 'Competition', 'Top of page bid (low range)', 'Top of page bid (high range)'];
  const indeks = kolonner.map(navn => {
    const posisjon = overskrift.indexOf(navn);
    if (posisjon < 0) throw new Error(`CSV mangler kolonnen ${navn}.`);
    return posisjon;
  });
  const tall = felt => felt.trim() !== '' && Number.isFinite(Number(felt)) ? Number(felt) : null;
  return linjer.slice(3).flatMap(rad => {
    const [ord, volum, konkurranse, lavt, høyt] = indeks.map(i => (rad[i] ?? '').trim());
    if (!ord) return [];
    const bucket = volum === '' ? 0 : VOLUM.get(Number(volum));
    if (bucket === undefined) throw new RangeError(`Ukjent volum for søkeordet ${ord}: ${volum}.`);
    return [{
      keyword: normaliser(ord), bucket, bucketLabel: VOLUMTEKST[bucket],
      competition: ['Low', 'Medium', 'High'].includes(konkurranse) ? konkurranse : null,
      bidLow: tall(lavt), bidHigh: tall(høyt),
    }];
  });
}

export function tellStore(domener) {
  return domener.slice(0, 10).filter(domene => {
    const vert = normaliser(domene).replace(/^www\./, '');
    return STORE_AKTORER.some(aktør => {
      const mønster = aktør.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?:^|\\.)${mønster}(?:\\.|$)`, 'i').test(vert);
    });
  }).length;
}

export function skaar({ bucket, fit, intent, store, harKonverteringsvei }) {
  for (const [navn, verdi] of Object.entries({ fit, intent })) {
    if (!Number.isInteger(verdi) || verdi < 0 || verdi > 3) {
      throw new RangeError(`${navn} må være et heltall fra 0 til 3.`);
    }
  }
  if (!Number.isInteger(bucket) || bucket < 0) throw new RangeError('bucket må være et ikke-negativt heltall.');
  if (store !== null && (!Number.isInteger(store) || store < 0)) throw new RangeError('store må være null eller et ikke-negativt heltall.');
  const demand = Math.min(bucket, 3);
  const difficulty = store === null ? null : store <= 2 ? 3 : store <= 4 ? 2 : store <= 6 ? 1 : 0;
  const total = difficulty === null ? null : demand + fit + intent + difficulty;
  return { demand, fit, intent, difficulty, total, inkluder: total !== null && total >= 8 && harKonverteringsvei === true };
}

function sorter(a, b) {
  return (b.total ?? -1) - (a.total ?? -1) || a.keyword.localeCompare(b.keyword, 'nb');
}

export function byggTabell({ rader, serp, etiketter }) {
  const serpMap = new Map(Object.entries(serp).map(([ord, data]) => [normaliser(ord), data]));
  const etikettMap = new Map(Object.entries(etiketter).map(([ord, data]) => [normaliser(ord), data]));
  return rader.map(rad => {
    const keyword = normaliser(rad.keyword);
    const etikett = etikettMap.get(keyword);
    const domener = serpMap.get(keyword)?.domener;
    const harSerp = Array.isArray(domener) && domener.length > 0 && domener.every(domene => typeof domene === 'string' && domene.trim());
    const mangler = [];
    if (!etikett) mangler.push('etikett');
    if (!harSerp) mangler.push('serp');
    const store = harSerp ? tellStore(domener) : null;
    const side = typeof etikett?.side === 'string' ? etikett.side.trim() : '';
    const poeng = skaar({ bucket: rad.bucket, fit: etikett ? etikett.fit : 0, intent: etikett ? etikett.intent : 0, store, harKonverteringsvei: Boolean(side) });
    if (!etikett) Object.assign(poeng, { fit: null, intent: null, total: null, inkluder: false });
    return { ...rad, keyword, store, side, ...poeng, mangler };
  }).sort(sorter);
}

function celle(verdi) {
  return String(verdi ?? 'Ukjent').replace(/[\u2013\u2014]/g, '-')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;').replace(/[\r\n]+/g, ' ').replace(/([\\`*_\[\]])/g, '\\$1');
}

export function tilMarkdown(tabell, { sprak, dato }) {
  const sortert = [...tabell].sort(sorter);
  const linjer = [
    '# Søkeordvalidering: sweet spot', '', `Språk: ${celle(sprak)}. Dato: ${celle(dato)}.`, '',
    '| Søkeord | Volum | Bud (høy) | Store av 10 | Fit | Intent | Total | Vei | Inkluder |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...sortert.map(rad => `| ${[
      rad.keyword, rad.bucketLabel, rad.bidHigh, rad.store, rad.fit, rad.intent,
      rad.total, rad.side || 'Ingen', rad.inkluder ? 'Ja' : 'Nei',
    ].map(celle).join(' | ')} |`),
    '', '## Mangler', '',
  ];
  const mangler = sortert.filter(rad => rad.mangler.length);
  linjer.push(...(mangler.length ? mangler.map(rad => `- ${celle(rad.keyword)}: ${rad.mangler.map(celle).join(', ')}`) : ['Ingen mangler.']));
  return `${linjer.join('\n')}\n`;
}

async function cli() {
  const { values } = parseArgs({ options: {
    csv: { type: 'string', multiple: true }, serp: { type: 'string' },
    etiketter: { type: 'string' }, sprak: { type: 'string' }, ut: { type: 'string' },
  } });
  for (const navn of ['csv', 'serp', 'etiketter', 'sprak', 'ut']) {
    if (!values[navn]) throw new Error(`Mangler --${navn}.`);
  }
  const unike = new Map();
  for (const fil of values.csv) {
    for (const rad of parseKeywordPlannerCsv(await readKeywordPlannerFile(fil))) unike.set(rad.keyword, rad);
  }
  const serp = JSON.parse(await readFile(values.serp, 'utf8'));
  const etiketter = JSON.parse(await readFile(values.etiketter, 'utf8'));
  const tabell = byggTabell({ rader: [...unike.values()], serp, etiketter });
  await writeFile(values.ut, tilMarkdown(tabell, { sprak: values.sprak, dato: new Date().toISOString().slice(0, 10) }), 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  cli().catch(feil => { console.error(`Kunne ikke lage søkeordtabellen: ${feil.message}`); process.exitCode = 1; });
}
