// Felles bygger for familien «rester» på svensk, dansk og amerikansk engelsk: samleside og én side per vare.
// Rettene er våre forslag (typer retter, uten oppskrifter) og har ingen tall. Oppbevaring står bare med tall eller sitat fra en kilde i landet,
// og tallene og sitatene er de samme som i familiene holdbarhet og frysing på samme språk (data.<marked>.json, kontrollert av
// holdbarhet/kildekontroll.mjs rester <marked>). Prosaen skriver aldri et tall selv: h.t(felt) og h.n(felt) leser dem fra datafila,
// h.q(id) gir et sitat fra radens `tekst` («kildeId|sitat»), og h.k(id) navngir kilden. Alt som slås opp noteres, så kildelista
// på siden er nøyaktig de kildene siden bruker.
import { lesData } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { byggRik } from '../../rik-sider.mjs';
import { esc } from '../../kalk-kort.mjs';
import { kortListe, p, ul } from '../erstatning/bygg.mjs';

export { kortListe, p, ul };
const TALL = /\d+(?:[.,]\d+)?/gu;
const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
/** FAQPage med svaret som ren tekst: synlig FAQ (uten tagger) skal være lik JSON-LD. Svarene i c.faq er ren tekst og HTML-kodes først på siden. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: String(a).replace(/<[^>]+>/gu, '').trim() } })),
});

/**
 * cfg: { lang, hjem: [navn, adresse], rot, innhold, nav, eyebrow, cta, relatertTittel, kildeH2, kildeIntro, lest, post, stegTittel,
 *        faqTittel, til, sitat: [apning, lukking], maaneder, dato(iso), grad (mellomrom foran °C/°F), enkelt: { flertall: entall }, se: { holdbarhet, frysing, tittel, rot } }.
 */
export function lagMal(cfg) {
  const dato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return cfg.dato(a, m, d); };
  const sti = (rad) => `${cfg.rot}${rad.slug}/`;
  const tallTekst = (v) => (cfg.desimal === '.' ? String(v) : String(v).replace('.', ','));
  const enhetTekst = (e, v) => (v === 1 && cfg.enkelt?.[e] ? cfg.enkelt[e] : e);
  const mellom = (e) => (/^°[CF]$/u.test(e) ? cfg.grad + e : ` ${e}`);

  /** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
  function hjelpere(rad, data, brukt = new Set()) {
    const tall = (felt) => {
      const x = rad.tall[felt];
      if (!x) throw new Error(`rester/${rad.id}: tallet «${felt}» finnes ikke i data.${cfg.lang}.json`);
      brukt.add(x.kilde);
      return x;
    };
    const verdi = (x) => tallTekst(x.verdi);
    /** «3 till 4 dagar», «1 vecka», «4 °C». Felt uten -min/-maks er ett tall. */
    const t = (felt) => {
      if (rad.tall[felt]) { const x = tall(felt); return `${verdi(x)}${mellom(enhetTekst(x.enhet, x.verdi))}`; }
      const min = tall(`${felt}-min`);
      const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
      if (!maks || maks.verdi === min.verdi) return `${verdi(min)}${mellom(enhetTekst(min.enhet, min.verdi))}`;
      return `${verdi(min)} ${cfg.til} ${verdi(maks)}${mellom(enhetTekst(maks.enhet, maks.verdi))}`;
    };
    const n = (felt) => verdi(tall(felt));
    const kilde = (id) => {
      const k = data.kilder[id];
      if (!k) throw new Error(`rester/${rad.id}: kilden «${id}» finnes ikke i data.${cfg.lang}.json`);
      brukt.add(id);
      return k;
    };
    /** «Livsmedelsverket (2026)», og kilden noteres. */
    const navnet = (id) => cfg.kort?.[kilde(id).utgiver] ?? kilde(id).utgiver;
    const k = (id) => `${navnet(id)} (${kilde(id).aar})`;
    const kp = (id) => `${navnet(id)}, ${kilde(id).aar}`;
    /** En setning fra kilden, ordrett, med kilde. Kontrolleres mot kildesiden. */
    const q = (id) => {
      const v = rad.tekst?.[id];
      if (!v) throw new Error(`rester/${rad.id}: sitatet «${id}» finnes ikke i data.${cfg.lang}.json`);
      const [kid, ...rest] = v.split('|');
      return `${cfg.sitat[0]}${esc(rest.join('|'))}${cfg.sitat[1]} (${kp(kid)})`;
    };
    return { t, n, k, kp, q, brukt, har: (felt) => Boolean(rad.tall[felt] || rad.tall[`${felt}-min`]), harQ: (id) => Boolean(rad.tekst?.[id]) };
  }

  function kildeAvsnitt(kilder) {
    return p(cfg.kildeIntro)
      + `<ol class="kilder" id="kilder">${kilder.map((k) => `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). ${cfg.lest} ${dato(k.hentet)}.</li>`).join('')}</ol>`
      + p(cfg.post);
  }

  const bygg = (rad, data) => {
    const mal = cfg.innhold[rad.id];
    if (!mal) throw new Error(`rester/${rad.id}: ingen tekst i tekst-${cfg.lang}.mjs`);
    const h = hjelpere(rad, data);
    const c = mal(h, rad);
    return { ...c, kilder: [...h.brukt] };
  };

  /** Lenker til holdbarhet og frysing på samme språk, bare for rader som finnes i datafilene. */
  function seOgsaa(rad) {
    const ut = [];
    for (const [fam, ider] of Object.entries(cfg.se.lenker[rad.id] ?? {})) {
      const mappe = new URL(`../${fam}/`, import.meta.url);
      const d = lesData(decodeURIComponent(mappe.pathname), cfg.lang);
      for (const id of ider) {
        const r = d.rader.find((x) => x.id === id && x.status === 'kontrollert');
        if (!r) throw new Error(`rester/${rad.id}: raden ${fam}/${id} finnes ikke i data.${cfg.lang}.json`);
        ut.push(`<a href="${cfg.se.rot[fam]}${r.slug}/">${esc(cfg.se.navn[fam])}: ${esc(r.navn)}</a>`);
      }
    }
    return ut.length ? p(`${cfg.se.tittel} ${ut.join(', ')}.`) : '';
  }

  /** Tallene siden kan vise: radens tall, tall i sitatene og årene og lesedatoene til kildene. */
  function tillatteTall(rad, data) {
    const s = new Set();
    const legg = (x) => { s.add(x); s.add(x.replace(/^-/u, '')); s.add(x.replace(',', '.')); s.add(x.replace('.', ',')); };
    for (const t of Object.values(rad.tall)) legg(tallTekst(t.verdi));
    for (const v of Object.values(rad.tekst ?? {})) (v.split('|').slice(1).join('|').match(TALL) ?? []).forEach(legg);
    for (const k of Object.values(data.kilder)) { s.add(String(k.aar)); dato(k.hentet).match(TALL).forEach(legg); (k.navn.match(TALL) ?? []).forEach(legg); }
    return s;
  }
  function tillatteTallNav(data) {
    const s = new Set();
    for (const r of data.rader.filter((x) => x.status === 'kontrollert')) for (const x of tillatteTall(r, data)) s.add(x);
    return s;
  }
  const maskeNavn = (rad) => [rad.navn.toLowerCase(), rad.slug];

  function sideForRad(rad, data, rader) {
    const c = bygg(rad, data);
    const adresse = sti(rad);
    const kilder = c.kilder.map((id) => data.kilder[id]);
    const seksjoner = c.seksjoner.map(([h, html]) => [h, h === cfg.oppbevaringH2 ? `${html}${seOgsaa(rad)}` : html]);
    const rik = byggRik({ lang: cfg.lang, svarTekst: c.svar, seksjoner: [...seksjoner, [cfg.kildeH2, kildeAvsnitt(kilder)]] }).html;
    const andre = rader.filter((r) => r.id !== rad.id);
    const relatert = `<div class="related"><h2>${esc(cfg.relatertTittel)}</h2><ul>${andre.map((r) => `<li><a href="${sti(r)}">${esc(bygg(r, data).lenke ?? bygg(r, data).h1)}</a></li>`).join('')}<li><a href="${cfg.rot}">${esc(cfg.nav.lenke)}</a></li></ul></div>`;
    return {
      title: c.tittel,
      description: c.beskrivelse,
      eyebrow: `<a href="${cfg.rot}">${esc(cfg.eyebrow)}</a><span aria-hidden="true"> › </span>${esc(stor(rad.navn))}`,
      h1: c.h1,
      lead: c.ingress,
      steg: c.steg,
      stegTittel: cfg.stegTittel, forst: '', alternativ: '', grense: '', seksjoner: [],
      rik: `${rik}\n${relatert}`,
      faqTittel: cfg.faqTittel, faq: c.faq.map(([qq, a]) => [qq, esc(a)]),
      cta: cfg.cta,
      publisert: rad.oppdatert,
      schemas: [
        brodsmuler([{ navn: cfg.hjem[0], adresse: cfg.hjem[1] }, { navn: cfg.nav.lenke, adresse: cfg.rot }, { navn: c.h1, adresse }]),
        artikkel({ tittel: c.h1, beskrivelse: c.beskrivelse, adresse, sprak: cfg.lang, publisert: rad.oppdatert, kilder }),
        faqSkjema(c.faq),
      ],
    };
  }

  function navSide(data, rader) {
    const sider = rader.map((r) => ({ rad: r, c: bygg(r, data), href: sti(r) }));
    const n = cfg.nav.innhold(sider);
    const kilder = [...new Set(sider.flatMap((s) => s.c.kilder))].map((id) => data.kilder[id]);
    const rik = byggRik({ lang: cfg.lang, svarTekst: n.svar, seksjoner: [...n.seksjoner, [cfg.kildeH2, kildeAvsnitt(kilder)]] }).html;
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title: n.tittel,
      description: n.beskrivelse,
      eyebrow: esc(cfg.eyebrow),
      h1: n.h1,
      lead: n.ingress,
      steg: n.steg,
      stegTittel: cfg.stegTittel, forst: '', alternativ: '', grense: n.grense ?? '', seksjoner: [],
      rik,
      faqTittel: cfg.faqTittel, faq: n.faq.map(([qq, a]) => [qq, esc(a)]),
      cta: cfg.cta,
      publisert,
      schemas: [
        brodsmuler([{ navn: cfg.hjem[0], adresse: cfg.hjem[1] }, { navn: n.h1, adresse: cfg.rot }]),
        artikkel({ tittel: n.h1, beskrivelse: n.beskrivelse, adresse: cfg.rot, sprak: cfg.lang, publisert, kilder }),
        elementliste({ navn: n.h1, adresse: cfg.rot, elementer: sider.map((s) => ({ navn: s.c.h1, adresse: s.href })) }),
        faqSkjema(n.faq),
      ],
    };
  }

  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, bygg };
}
