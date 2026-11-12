import { readFileSync } from 'node:fs';

const { rapport: tekst } = JSON.parse(readFileSync(
  new URL('../seo-data/sprak/nb.json', import.meta.url),
  'utf8',
));

const usd = (belop) => `$${Number(belop ?? 0).toFixed(3)}`;

export function nattrapport(logg) {
  const linjer = [
    `## ${tekst.nattTittel}`,
    '',
    `- **${tekst.dato}:** ${logg.dato}`,
    `- **${tekst.modus}:** ${logg.modus}`,
    `- **${tekst.resultat}:** ${logg.resultat}`,
  ];
  if (logg.emne) linjer.push(`- **${tekst.emne}:** ${logg.emne}`);
  if (logg.sprak) linjer.push(`- **${tekst.sprak}:** ${logg.sprak}`);
  if (logg.sti && logg.resultat === 'publisert') {
    linjer.push(`- **${tekst.artikkel}:** [${logg.sti}](https://matlyst-app.no${logg.sti})`);
  }
  if (logg.prUrl) {
    const nummer = logg.prUrl.match(/\/pull\/(\d+)\/?$/u)?.[1];
    linjer.push(`- **${tekst.pr}:** [${tekst.pr}${nummer ? ` #${nummer}` : ''}](${logg.prUrl})`);
  }
  linjer.push(`- **${tekst.kostnad}:** ${usd(logg.kostnadUsd)}`);
  if (logg.resultat === 'sperret') {
    linjer.push('', `> **${tekst.sperre}:** ${(logg.grunner ?? []).join('; ') || tekst.ingen}`);
  } else if (logg.grunner?.length) {
    linjer.push('', `### ${tekst.grunner}`, '', ...logg.grunner.map((grunn) => `- ${grunn}`));
  }
  return `${linjer.join('\n')}\n`;
}

export function ukerapport({ ytelse, ko, kostnadUke }) {
  const ytelseslinjer = ytelse.length
    ? ytelse.map((rad) => `- ${rad.sti}: ${rad.visninger} ${tekst.visninger}, ${rad.klikk} ${tekst.klikk}, ${tekst.plassering} ${rad.plassering}`)
    : [`- ${tekst.ingen}`];
  const kolinjer = [...ko]
    .sort((a, b) => (b.poeng ?? 0) - (a.poeng ?? 0))
    .slice(0, 10)
    .map((emne, indeks) => `${indeks + 1}. ${emne.sokeord} (${emne.sprak}, ${emne.poeng} ${tekst.poeng})`);
  return [
    `## ${tekst.ukeTittel}`,
    '',
    `### ${tekst.ytelse}`,
    '',
    ...ytelseslinjer,
    '',
    `### ${tekst.ko}`,
    '',
    ...(kolinjer.length ? kolinjer : [`1. ${tekst.ingen}`]),
    '',
    `- **${tekst.kostnad}:** ${usd(kostnadUke)}`,
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
