import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

import { datafil, lesJson, lesLogg } from './filer.mjs';
import { lesPrivat, lesSeoDataNokkel } from './privat.mjs';

const { rapport: tekst } = JSON.parse(readFileSync(
  new URL('../seo-data/sprak/nb.json', import.meta.url),
  'utf8',
));

function antallslinjer(antall = {}) {
  return Object.entries(tekst.antallEtiketter)
    .filter(([nokkel]) => Number.isFinite(antall[nokkel]))
    .map(([nokkel, etikett]) => `- **${etikett}:** ${antall[nokkel]}`);
}

export function nattrapport(logg) {
  const linjer = [
    `## ${tekst.nattTittel}`,
    '',
    `- **${tekst.dato}:** ${logg.dato}`,
    `- **${tekst.modus}:** ${logg.modus}`,
    `- **${tekst.resultat}:** ${logg.resultat}`,
  ];
  if (logg.statuskode) linjer.push(`- **${tekst.statuskode}:** ${logg.statuskode}`);
  if (logg.bestilling_id) linjer.push(`- **${tekst.bestillingId}:** ${logg.bestilling_id}`);
  if (logg.slug) linjer.push(`- **${tekst.slug}:** ${logg.slug}`);
  if (logg.pr_url) {
    const nummer = logg.pr_url.match(/\/pull\/(\d+)\/?$/u)?.[1];
    linjer.push(`- **${tekst.pr}:** [${tekst.pr}${nummer ? ` #${nummer}` : ''}](${logg.pr_url})`);
  }
  const antall = antallslinjer(logg.antall);
  if (antall.length) linjer.push('', `### ${tekst.antall}`, '', ...antall);
  if (logg.grunnkoder?.length) {
    linjer.push('', `### ${tekst.grunnkoder}`, '', ...logg.grunnkoder.map((kode) => `- ${kode}`));
  }
  return `${linjer.join('\n')}\n`;
}

export function ukerapport({ statuskoder = [], antall = {} }) {
  const kodelinjer = statuskoder.length
    ? statuskoder.map((kode) => `- ${kode}`)
    : [`- ${tekst.ingen}`];
  const antallLinjer = antallslinjer(antall);
  return [
    `## ${tekst.ukeTittel}`,
    '',
    `### ${tekst.statuskoder}`,
    '',
    ...kodelinjer,
    '',
    `### ${tekst.antall}`,
    '',
    ...(antallLinjer.length ? antallLinjer : [`- ${tekst.ingen}`]),
    '',
  ].join('\n');
}

export async function postRapport(rapporttekst, { issueTittel, gh }) {
  const liste = await gh(['issue', 'list', '--search', `${issueTittel} in:title`, '--json', 'number']);
  const saker = JSON.parse(liste || '[]');
  let nummer = saker[0]?.number;
  if (!nummer) {
    const opprettet = await gh(['issue', 'create', '--title', issueTittel, '--body', tekst.issueBody]);
    nummer = opprettet.match(/\/issues\/(\d+)\/?$/u)?.[1];
  }
  await gh(['issue', 'comment', String(nummer), '--body', rapporttekst]);
}

function sisteSyvDager(logg, sluttdato) {
  const slutt = new Date(`${sluttdato}T12:00:00Z`);
  const start = new Date(slutt);
  start.setUTCDate(start.getUTCDate() - 6);
  const startdato = start.toISOString().slice(0, 10);
  return logg.filter((rad) => rad.dato >= startdato && rad.dato <= sluttdato);
}

export function lagRapporttekst(rot, dato, privat = null) {
  const logg = lesJson(datafil(rot, `logg/${dato}.json`), {
    dato,
    modus: 'ukjent',
    resultat: 'feil',
    statuskode: 'logg-mangler',
  });
  let rapport = nattrapport(logg);
  const dag = new Date(`${dato}T12:00:00Z`);
  if (new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Oslo', weekday: 'short' }).format(dag) === 'Mon') {
    const uke = sisteSyvDager(lesLogg(rot), dato);
    const statuskoder = [...new Set(uke.map((rad) => rad.statuskode).filter(Boolean))];
    const antall = {
      levert: uke.filter((rad) => rad.resultat === 'levert').length,
      avvist: uke.filter((rad) => rad.resultat === 'avvist' || rad.resultat === 'sperret').length,
      bestillinger: uke.filter((rad) => rad.resultat === 'bestilling').length,
      ytelsesrader: privat?.ytelse?.at(-1)?.antall,
    };
    rapport += `\n${ukerapport({ statuskoder, antall })}`;
  }
  return rapport;
}

export async function rapporter(rot, { dato, gh, nokkel }) {
  const språk = lesJson(datafil(rot, 'sprak/nb.json'), {});
  const privat = nokkel ? lesPrivat(datafil(rot, 'privat.enc'), nokkel) : null;
  await postRapport(lagRapporttekst(rot, dato, privat), {
    issueTittel: språk.rapport.issueTittel,
    gh,
  });
}

async function cli() {
  const dato = process.env.DATO;
  if (!dato) {
    process.exitCode = 1;
    return;
  }
  const kjør = promisify(execFile);
  const gh = async (args) => (await kjør('gh', args)).stdout.trim();
  const nokkel = lesSeoDataNokkel({ tillatNokkelring: false });
  await rapporter(new URL('../', import.meta.url), { dato, gh, nokkel });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await cli();
  } catch {
    process.stdout.write(`${JSON.stringify({ statuskode: 'rapport-feil' })}\n`);
    process.exitCode = 1;
  }
}
