import { readFileSync } from 'node:fs';

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
