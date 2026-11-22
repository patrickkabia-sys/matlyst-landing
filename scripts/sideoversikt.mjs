// Skriver docs/SIDEOVERSIKT.md: et oppslagsdokument over alle sidene i sitemapene, gruppert, med hull i språkdekningen.
// Alt leses fra det generatorene allerede vet: sitemapene (adresser og lastmod), sidegruppene (locale-sider.mjs), familieregisteret
// (familier/register.mjs), sidetypene (sidetyper.mjs) og hreflang i sidene. Ingenting føres for hånd, bortsett fra korte etiketter.
// Fila har ingen «generert»-dato: lastmod kommer fra sitemapene, så fila er uendret når sidene er uendret.
// docs/ står i exclude i _config.yml, så fila publiseres ikke. Står sist i byggekjeden (etter lastmod og llms).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SIDEGRUPPER, SPRAKKODER, SPRAKREKKEFOLGE, filForSti, gruppeForSti } from './locale-sider.mjs';
import { FAMILIER, SPRAKMAPPE, familieForSti } from './familier/register.mjs';
import { alleSiderMedUkjente, familie as sidefamilie, sidetypeEllerNull } from './sidetyper.mjs';
import { SITEMAPER } from './lastmod.mjs';
import { BLOGGROT } from './blogg.mjs';

const BASE = 'https://matlyst-app.no';
export const UTFIL = 'docs/SIDEOVERSIKT.md';
const SPRAK = SPRAKREKKEFOLGE; // nb, sv, da, en
const UTEN_GRUPPE = 'uten-gruppe';

// Korte etiketter der tittelen på rotsiden ikke sier hva gruppa er. Ukjente grupper får tittelen fra rotsiden.
const ETIKETT = {
  forside: 'Forsidene',
  blogg: 'Bloggen (indeks og artikler)',
  hoytider: 'Høytidssider (USA)',
  'omregner:nav': 'Omregnernes samlesider og enhetsomregneren',
  'omregner:volum': 'Enhetsomregnere for volum',
  'omregner:vekt': 'Enhetsomregnere for vekt',
  'omregner:lengde': 'Enhetsomregnere for lengde',
  'omregner:temperatur': 'Enhetsomregnere for temperatur',
};

// Villede hull: språk en gruppe med vilje ikke har. De står i «Villet, ikke hull» og tas ut av «Hull».
// `gruppe` er radnavnet i tabellen over (for eksempel «julemiddag» eller «familie:airfryer»). Uten `varer` gjelder det hele gruppa på språket;
// med `varer` (id-ene fra «Enkeltgrupper ...») gjelder det bare de enkeltvarene i familien. `grunn` er kort og skal kunne etterprøves.
export const VILLEDE_HULL = [
  { gruppe: 'hoytider', sprak: ['nb', 'sv', 'da'], grunn: 'Amerikanske høytider (Thanksgiving, Hanukkah, Friendsgiving, USA-nyttår): sidene er skrevet for USA og følger amerikanske kilder.' },
  { gruppe: 'julebord', sprak: ['en'], grunn: 'Julebord (firmajulebord og julebuffet) er en nordisk tradisjon. Dekkes av /en/holidays/christmas-dinner/, en amerikansk side med amerikanske kilder og ikke samme side.' },
  { gruppe: 'juleaften', sprak: ['nb', 'sv', 'en'], grunn: 'Dansk tradisjon (and og flæskesteg på juleaften) med danske kilder.' },
  { gruppe: 'julemiddag', sprak: ['sv', 'da', 'en'], grunn: 'Norsk julemiddag (ribbe og pinnekjøtt) dekkes av /sv/julbord/, /da/juleaften/ og de engelske høytidssidene, uten å være samme side.' },
  { gruppe: 'nyttarsmiddag', sprak: ['da'], grunn: 'Ingen danske kilder med mengder og tider er funnet.' },
  { gruppe: 'nyttarsmiddag', sprak: ['en'], grunn: 'Dekkes av /en/holidays/new-years-eve/, som er en amerikansk side med amerikanske kilder og ikke samme side.' },
  { gruppe: 'familie:airfryer', sprak: ['en'], varer: ['flaeskesteg'], grunn: 'Dansk tradisjonsrett, ikke en amerikansk rett.' },
  { gruppe: 'familie:mengde-per-person', sprak: ['en'], varer: ['flaeskesteg'], grunn: 'Dansk tradisjonsrett, ikke en amerikansk rett.' },
  { gruppe: 'familie:steketid', sprak: ['en'], varer: ['flaeskesteg', 'pinnekjott'], grunn: 'Norsk og dansk tradisjonsrett, ikke amerikanske retter.' },
];

const sorter = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sprakForSti = (sti) => SPRAK.find((s) => s !== 'nb' && sti.startsWith(`/${s === 'en' ? 'en' : s}/`)) ?? 'nb';
const KODE_TIL_SPRAK = Object.fromEntries(Object.entries(SPRAKKODER).map(([s, k]) => [k, s]));

export function lesSitemap(rot) {
  const sider = [];
  for (const fil of SITEMAPER) {
    const xml = readFileSync(join(rot, fil), 'utf8');
    for (const [, blokk] of xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)) {
      const loc = /<loc>([^<]+)<\/loc>/u.exec(blokk)?.[1];
      if (!loc) continue;
      sider.push({ url: loc, sti: loc.replace(BASE, ''), lastmod: /<lastmod>([^<]+)<\/lastmod>/u.exec(blokk)?.[1] ?? '' });
    }
  }
  return sider;
}

function hreflangSprak(html) {
  const ut = new Set();
  for (const [, kode] of html.matchAll(/<link rel="alternate" hreflang="([^"]+)"/gu)) if (KODE_TIL_SPRAK[kode]) ut.add(KODE_TIL_SPRAK[kode]);
  return ut;
}

const tittelAv = (html) => (/<title>([^<]*)<\/title>/u.exec(html)?.[1] ?? '').replace(/&amp;/gu, '&').replace(/\s*\|\s*Matlyst\s*$/u, '').replace(/\s[—–]\s/gu, ': ').trim();

// Klynge: hva en rad i oversikten er. Familier og omregnere/blogg/høytider samles, alt annet er én rad per sidegruppe.
// Nye familier i registeret får egen klynge uten at noe her endres.
function klyngeFor(sti, html, gruppe) {
  const fam = sidefamilie(sti, html);
  if (typeof fam === 'string' && (fam.startsWith('fam:') || fam.startsWith('omregner:'))) return fam;
  if (fam === 'blogg' || Object.values(BLOGGROT).some((r) => sti.startsWith(r))) return 'blogg';
  if (!gruppe) return UTEN_GRUPPE;
  if (gruppe.id.startsWith('auto-hoytid') || sti.startsWith('/en/holidays/')) return 'hoytider';
  return `gruppe:${gruppe.id}`;
}

// Felles katalog for adressene i en klynge, per språk. Én side gir selve adressen.
function felleskatalog(stier) {
  if (stier.length === 1) return stier[0];
  const deler = stier.map((s) => s.split('/'));
  const ut = [];
  for (let i = 0; i < deler[0].length; i++) {
    if (deler.every((d) => d.length - 1 > i && d[i] === deler[0][i])) ut.push(deler[0][i]);
    else break;
  }
  return `${ut.join('/')}/`;
}

function scriptFiler(rot) {
  const ut = [];
  const gaa = (mappe, prefiks) => {
    if (!existsSync(mappe)) return;
    for (const e of readdirSync(mappe, { withFileTypes: true })) {
      if (e.isDirectory()) gaa(join(mappe, e.name), `${prefiks}${e.name}/`);
      else if (e.name.endsWith('.mjs')) ut.push({ navn: `${prefiks}${e.name}`, tekst: readFileSync(join(mappe, e.name), 'utf8') });
    }
  };
  gaa(join(rot, 'scripts'), 'scripts/');
  return ut.sort((a, b) => sorter(a.navn, b.navn));
}

// Generator: sidene skrives av inngangsskriptene (generer-norske-importguider for norsk, generer-lokalsider for sv/da/en, forside for
// forsidene; se overskriften i dokumentet). Kolonnen viser skriptene som har innholdet: de oppgir adressen som en hel, sitert streng
// (`path: 'handleliste/'` eller en nøkkel i RIKE). Treff på hele, siterte adresser gir ikke falske treff fra lenker i løpende tekst.
// Omregnere, blogg og høytider genereres fra datakilder og har faste kilder; familier har mappa si.
const utenSprakmappe = (r) => r.replace(/^\/(sv|da|en)\//u, '/').replace(/^\//u, '');
const INNGANGSSKRIPT = new Set(['generer-norske-importguider.mjs', 'generer-lokalsider.mjs']);
function finnGenerator(klynge, rotPerSprak, filer) {
  if (klynge.startsWith('fam:')) return `scripts/familier/${klynge.slice(4)}/`;
  if (klynge.startsWith('omregner:')) return 'enheter.mjs (enhetene), nb-/sv-/da-/en-enhetssider.mjs (tekst)';
  if (klynge === 'blogg') return 'blogg.mjs, blogg-kilde/ (artikler)';
  if (klynge === 'hoytider') return 'en-hoytider/';
  if (klynge === 'gruppe:forside') return 'forside.mjs';
  const innhold = new Set();
  for (const r of Object.values(rotPerSprak)) {
    if (!r) continue;
    const sti = utenSprakmappe(r);
    for (const f of filer) {
      const navn = f.navn.replace(/^scripts\//u, '');
      if (navn === 'sideoversikt.mjs' || navn === 'locale-sider.mjs' || INNGANGSSKRIPT.has(navn) || navn.startsWith('familier/')) continue;
      if (f.tekst.includes(`'${sti}'`) || f.tekst.includes(`"${sti}"`) || f.tekst.includes(`\`${sti}\``)) innhold.add(navn);
    }
  }
  return innhold.size ? [...innhold].sort(sorter).join(', ') : '(inngangsskriptet)';
}

function datafiler(rot, klynge) {
  if (klynge.startsWith('fam:')) {
    const mappe = join(rot, 'scripts/familier', klynge.slice(4));
    if (!existsSync(mappe)) return '';
    return readdirSync(mappe).filter((f) => /^data\..*\.json$/u.test(f)).sort(sorter).map((f) => `scripts/familier/${klynge.slice(4)}/${f}`).join(', ');
  }
  if (klynge === 'blogg') return 'blogg-kilde/, scripts/blogg.mjs';
  return '';
}

export function lesOversikt(rot) {
  const sitemap = lesSitemap(rot);
  const sider = sitemap.map((s) => {
    const fil = join(rot, filForSti(s.sti));
    const finnes = existsSync(fil);
    const html = finnes ? readFileSync(fil, 'utf8') : '';
    const gruppe = gruppeForSti(s.sti);
    return { ...s, sprak: sprakForSti(s.sti), finnes, html, gruppe, type: finnes ? (sidetypeEllerNull(s.sti, html) ?? 'ukjent') : 'mangler fil', hreflang: hreflangSprak(html), klynge: klyngeFor(s.sti, html, gruppe), tittel: tittelAv(html) };
  });
  const iSitemap = new Set(sider.map((s) => s.sti));
  const utenfor = alleSiderMedUkjente(rot).filter((s) => !iSitemap.has(s.sti)).map((s) => s.sti).sort(sorter);
  return { sider, utenfor };
}

const kortId = (id, familier) => familier.reduce((t, f) => t.replace(`auto-fam-${f.id}-`, ''), id).replace(/^auto-/u, '');
const celle = (t) => String(t).replace(/\|/gu, '\\|');
const kode = (t) => (t ? `\`${t}\`` : '');

export function byggOversikt(rot, familier = FAMILIER) {
  const { sider, utenfor } = lesOversikt(rot);
  const filer = scriptFiler(rot);
  const ut = [];

  // Totaler
  const perSprak = Object.fromEntries(SPRAK.map((s) => [s, sider.filter((x) => x.sprak === s).length]));
  const typer = [...new Set(sider.map((s) => s.type))].sort(sorter);
  ut.push('# Sideoversikt for matlyst-app.no', '',
    'Oppslagsdokument for KI-assistenter og eier. Lages av `scripts/sideoversikt.mjs` som siste trinn i byggekjeden (`scripts/kjede.mjs`) og skal aldri redigeres for hånd.',
    'Kilder: sitemapene (adresser og lastmod), `scripts/locale-sider.mjs` (sidegrupper), `scripts/familier/register.mjs` (familier), `scripts/sidetyper.mjs` (sidetyper) og hreflang i sidene.',
    'Dokumentet ligger i `docs/`, som ikke publiseres (se `exclude` i `_config.yml`), og står ikke i sitemap eller `llms.txt`.', '',
    '## Totaler', '', `Sider i sitemap: **${sider.length}**. Sider utenfor sitemap (noindex og tjenestesider): ${utenfor.length}.`, '',
    '| Språk | Sider |', '|---|---:|', ...SPRAK.map((s) => `| ${s} | ${perSprak[s]} |`), `| Sum | ${sider.length} |`, '',
    '| Sidetype | ' + SPRAK.join(' | ') + ' | Sum |', '|---|' + SPRAK.map(() => '---:').join('|') + '|---:|',
    ...typer.map((t) => `| ${t} | ${SPRAK.map((s) => sider.filter((x) => x.type === t && x.sprak === s).length || '').join(' | ')} | ${sider.filter((x) => x.type === t).length} |`), '');

  // Klynger
  const klynger = new Map();
  for (const s of sider) {
    if (!klynger.has(s.klynge)) klynger.set(s.klynge, []);
    klynger.get(s.klynge).push(s);
  }
  // Familier i registeret uten sider i sitemap får også en rad, så de ikke forsvinner.
  for (const f of familier) if (!klynger.has(`fam:${f.id}`)) klynger.set(`fam:${f.id}`, []);
  const rekkefolge = (k) => (k === 'gruppe:forside' ? '0' : k === UTEN_GRUPPE ? 'z' : k.startsWith('gruppe:') ? '1' : k.startsWith('fam:') ? '2' : k.startsWith('omregner:') ? '3' : '4') + k;
  const noekler = [...klynger.keys()].sort((a, b) => sorter(rekkefolge(a), rekkefolge(b)));

  const navnFor = (k) => (k.startsWith('gruppe:') ? k.slice(7).replace(/^auto-/u, '') : k.startsWith('fam:') ? `familie:${k.slice(4)}` : k);
  const rader = noekler.map((k) => {
    const xs = klynger.get(k);
    const rotPerSprak = {};
    const antall = {};
    for (const s of SPRAK) {
      const m = xs.filter((x) => x.sprak === s);
      antall[s] = m.length;
      rotPerSprak[s] = m.length ? felleskatalog(m.map((x) => x.sti).sort(sorter)) : '';
    }
    const roter = SPRAK.map((s) => rotPerSprak[s]).filter(Boolean);
    const forste = xs.filter((x) => x.sprak === 'nb')[0] ?? xs[0];
    const rotSide = xs.find((x) => x.sti === rotPerSprak[forste?.sprak]) ?? xs.slice().sort((a, b) => a.sti.length - b.sti.length)[0];
    let hva = ETIKETT[k] ?? (rotSide?.tittel || '');
    let generator = '';
    let data = datafiler(rot, k);
    if (k.startsWith('fam:')) {
      const id = k.slice(4);
      const mappe = join(rot, 'scripts/familier', id);
      const mal = existsSync(mappe) ? readdirSync(mappe).filter((f) => /^mal-.*\.mjs$/u.test(f)).sort(sorter) : [];
      generator = `scripts/familier/${id}/ (${mal.join(', ') || 'ingen mal'})`;
      if (!hva) hva = `Familie ${id}`;
    } else if (k === UTEN_GRUPPE) generator = 'ukjent';
    else generator = finnGenerator(k, rotPerSprak, filer);
    const siste = xs.map((x) => x.lastmod).sort(sorter).pop() ?? '';
    const typer = [...new Set(xs.map((x) => x.type))].sort(sorter).join(', ');
    return { k, navn: navnFor(k), xs, rotPerSprak, antall, hva, generator, data, siste, typer };
  });

  ut.push('## Sidegrupper og familier', '',
    'Én rad per familie eller sidegruppe. Tom celle betyr at gruppa ikke finnes på det språket. Tallet i parentes er antall sider i sitemap.',
    'Sidene skrives av `generer-norske-importguider.mjs` (norsk), `generer-lokalsider.mjs` (sv, da, en) og `forside.mjs` (forsidene); kolonnen «Generator / innholdskilde» viser skriptene som har innholdet.', '',
    '| Gruppe | Hva | Type | ' + SPRAK.map((s) => `Rot ${s}`).join(' | ') + ' | Generator / innholdskilde | Datafil | Siste endring |',
    '|---|---|---|' + SPRAK.map(() => '---').join('|') + '|---|---|---|',
    ...rader.map((r) => `| ${celle(r.navn)} | ${celle(r.hva)} | ${celle(r.typer)} | ${SPRAK.map((s) => (r.antall[s] ? `${kode(r.rotPerSprak[s])} (${r.antall[s]})` : '')).join(' | ')} | ${celle(r.generator)} | ${celle(r.data)} | ${r.siste} |`), '');

  // Hull
  ut.push('## Hull', '');
  const hullSprak = [];
  for (const r of rader) {
    if (r.k === UTEN_GRUPPE) continue;
    const mangler = SPRAK.filter((s) => !r.antall[s]);
    if (r.xs.length && mangler.length) hullSprak.push({ r, mangler });
  }
  // Villede hull på hele gruppa tas ut av hullene. Bare språk som faktisk mangler regnes som villet (en gruppe som er bygget siden, er ikke et hull).
  const villetGruppe = (navn, s) => VILLEDE_HULL.find((v) => v.gruppe === navn && !v.varer && v.sprak.includes(s));
  const villedeRader = [];
  const virkeligeHull = hullSprak.map(({ r, mangler }) => {
    for (const v of VILLEDE_HULL.filter((x) => x.gruppe === r.navn && !x.varer)) {
      const gjelder = v.sprak.filter((s) => mangler.includes(s));
      if (gjelder.length) villedeRader.push({ navn: r.navn, sprak: gjelder, grunn: v.grunn, finnes: SPRAK.filter((s) => r.antall[s]) });
    }
    return { r, mangler: mangler.filter((s) => !villetGruppe(r.navn, s)) };
  }).filter(({ mangler }) => mangler.length);
  ut.push('### Familier og grupper som mangler på et språk', '');
  if (!virkeligeHull.length) ut.push('Ingen.', '');
  else {
    ut.push('| Gruppe | Finnes på | Mangler på |', '|---|---|---|');
    for (const { r, mangler } of virkeligeHull) ut.push(`| ${celle(r.navn)} | ${SPRAK.filter((s) => r.antall[s]).join(', ')} | ${mangler.join(', ')} |`);
    ut.push('');
  }

  // Sidegrupper (inne i samlede klynger) der enkeltsider mangler på et språk som klynga ellers har.
  const grupperIKlynge = [];
  for (const r of rader) {
    if (r.k.startsWith('gruppe:') || r.k === UTEN_GRUPPE) continue;
    const perGruppe = new Map();
    for (const x of r.xs) {
      const id = x.gruppe?.id ?? x.sti;
      if (!perGruppe.has(id)) perGruppe.set(id, new Set());
      perGruppe.get(id).add(x.sprak);
    }
    const klyngeSprak = SPRAK.filter((s) => r.antall[s]);
    if (klyngeSprak.length < 2) continue;
    const mangler = [...perGruppe].filter(([, set]) => klyngeSprak.some((s) => !set.has(s)));
    if (mangler.length) grupperIKlynge.push({ r, mangler: mangler.sort((a, b) => sorter(a[0], b[0])), klyngeSprak });
  }
  ut.push('### Enkeltgrupper i samlede rader som mangler på et språk raden ellers har', '');
  if (!grupperIKlynge.length) ut.push('Ingen.', '');
  else {
    ut.push('| Rad | Antall grupper | Per manglende språk (grupper uten språket) |', '|---|---:|---|');
    for (const { r, mangler, klyngeSprak } of grupperIKlynge) {
      const villet = (s) => VILLEDE_HULL.filter((v) => v.gruppe === r.navn && v.varer && v.sprak.includes(s)).flatMap((v) => v.varer);
      const per = klyngeSprak.map((s) => {
        const uten = mangler.filter(([, set]) => !set.has(s)).map(([id]) => kortId(id, familier));
        const igjen = uten.filter((id) => !villet(s).includes(id));
        return igjen.length ? `${s}: ${igjen.length} (${igjen.slice(0, 6).join(', ')}${igjen.length > 6 ? ', ...' : ''})` : '';
      }).filter(Boolean).join('; ');
      if (per) ut.push(`| ${celle(r.navn)} | ${mangler.length} | ${celle(per)} |`);
      for (const v of VILLEDE_HULL.filter((x) => x.gruppe === r.navn && x.varer)) {
        const manglerHer = v.varer.filter((id) => mangler.some(([g, set]) => kortId(g, familier) === id && v.sprak.some((s) => !set.has(s))));
        if (manglerHer.length) villedeRader.push({ navn: r.navn, sprak: v.sprak, varer: manglerHer, grunn: v.grunn });
      }
    }
    ut.push('');
  }

  // Hreflang
  const hreflangHull = [];
  for (const s of sider) {
    if (!s.gruppe) continue;
    const forventet = SPRAK.filter((l) => s.gruppe.sider[l] && sider.some((x) => x.sti === s.gruppe.sider[l]));
    if (forventet.length < 2) continue;
    const mangler = forventet.filter((l) => !s.hreflang.has(l));
    const ekstra = [...s.hreflang].filter((l) => !forventet.includes(l));
    if (mangler.length || ekstra.length) hreflangHull.push({ s, mangler, ekstra });
  }
  ut.push('### Sider uten hreflang-makker der gruppa har språket', '');
  if (!hreflangHull.length) ut.push('Ingen. Alle sider i flerspråklige grupper peker på alle språkene i gruppa.', '');
  else {
    ut.push('| Side | Gruppe | Mangler hreflang til | Hreflang til språk gruppa ikke har |', '|---|---|---|---|');
    for (const { s, mangler, ekstra } of hreflangHull.sort((a, b) => sorter(a.s.sti, b.s.sti))) ut.push(`| ${kode(s.sti)} | ${celle(s.gruppe.id)} | ${mangler.join(', ')} | ${ekstra.join(', ')} |`);
    ut.push('');
  }

  const uten = klynger.get(UTEN_GRUPPE) ?? [];
  ut.push('### Uten gruppe', '', uten.length ? 'Adresser i sitemap som verken hører til en sidegruppe, en familie eller en kjent klynge:' : 'Ingen. Alle adresser i sitemap hører til en gruppe.', '');
  for (const s of uten) ut.push(`- ${s.url}`);
  if (uten.length) ut.push('');
  const utenFil = sider.filter((s) => !s.finnes);
  if (utenFil.length) ut.push('### Adresser i sitemap uten fil', '', ...utenFil.map((s) => `- ${s.url}`), '');

  ut.push('## Villet, ikke hull', '', 'Språk en gruppe med vilje ikke har (`VILLEDE_HULL` i `scripts/sideoversikt.mjs`). Disse står ikke under «Hull».', '');
  if (!villedeRader.length) ut.push('Ingen.', '');
  else {
    ut.push('| Gruppe | Språk | Hva | Grunn |', '|---|---|---|---|');
    for (const v of villedeRader) ut.push(`| ${celle(v.navn)} | ${v.sprak.join(', ')} | ${v.varer ? `enkeltvarer: ${v.varer.join(', ')}` : 'hele gruppa'} | ${celle(v.grunn)} |`);
    ut.push('');
  }

  ut.push('## Utenfor sitemap', '', utenfor.length ? 'HTML-sider som finnes, men ikke står i sitemap (noindex, tjeneste- og verifiseringssider):' : 'Ingen.', '');
  for (const sti of utenfor) ut.push(`- ${sti}`);
  if (utenfor.length) ut.push('');

  // Full liste
  ut.push('## Alle adresser', '', `${sider.length} adresser fra sitemapene, gruppert per rad og språk. Hver linje er én adresse med lastmod.`, '');
  for (const r of rader) {
    if (!r.xs.length) continue;
    ut.push(`### ${r.navn}`, '');
    for (const s of SPRAK) {
      const m = r.xs.filter((x) => x.sprak === s).sort((a, b) => sorter(a.sti, b.sti));
      if (!m.length) continue;
      ut.push(`**${s}** (${m.length})`, '', ...m.map((x) => `- ${x.url} (${x.lastmod})`), '');
    }
  }
  return `${ut.join('\n').replace(/\n+$/u, '')}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rot = fileURLToPath(new URL('..', import.meta.url));
  mkdirSync(dirname(join(rot, UTFIL)), { recursive: true });
  writeFileSync(join(rot, UTFIL), byggOversikt(rot));
}
