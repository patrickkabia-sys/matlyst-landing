// Felles mal for familien «ukemeny» på svensk, dansk og amerikansk engelsk (sv: veckomenyer, da: madplaner, en: weekly-meal-plans).
// Samme oppbygging som mal-nb.mjs: en samleside og én side per ukemeny, med sju dager, rester, handleliste og kilder.
// Tekstene per språk står i tekst-<marked>.mjs (skrevet fra meningen, ikke oversatt). Tallene står i data.<marked>.json
// med sitat fra kilden i landet: Livsmedelsverket (sv), Fødevarestyrelsen (da) og USDA FSIS (en). Siden skriver ingen tall selv:
// alt med sifre kommer fra datafila (tillatteTall). Priser, kalorier og porsjonsstørrelser står ikke på sidene.
// Oppskriftene er Arlas (sv, da) og Taste of Home (en). Vi lenker til dem og gjengir dem ikke; handlelista har varene uten mengder.
// Forfatterlinje: ingen (Organization), som de andre sv-, da- og en-sidene.
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { byggRik } from '../../rik-sider.mjs';
import { esc, tallI } from '../../kalk-kort.mjs';
import { DAGER_MARKED, handleliste, lesMenyerMarked, resteKjeder } from './meny.mjs';

// Appens gratisgrense for import fra lenker, slik de andre sidene oppgir den («5 importer per kalendermånad»).
export const GRATIS_IMPORTER = 5;

const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const liten = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const ankerDag = (dag) => dag.replace(/[åä]/gu, 'a').replace(/[öø]/gu, 'o');
const TALL_TEKST = /\d+(?:[.,]\d+)?/gu;
const tallIQ = (tekst) => String(tekst ?? '').match(TALL_TEKST) ?? [];

/** FAQPage med svaret som ren tekst: synlig FAQ (uten tagger) skal være lik JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});

/**
 * T: tekstene for ett språk (se tekst-sv.mjs, tekst-da.mjs og tekst-en.mjs).
 * Gir sideForRad, navSide, tillatteTall, tillatteTallNav og maskeNavn, som registeret (register.mjs) og vaktene (test/familier.test.mjs) bruker.
 */
export function lagMal(T) {
  const MENYER = lesMenyerMarked(T.marked);
  const sti = (rad) => `${T.rot}${rad.slug}/`;
  const menyFor = (rad) => {
    const m = MENYER.menyer[rad.id];
    if (!m) throw new Error(`ukemeny/${T.marked}/${rad.id}: ingen meny i menyer.${T.marked}.json`);
    return m;
  };
  const dagNavn = (dag) => stor(dag);

  /** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
  function hjelpere(rad, data, brukt = new Set()) {
    const tall = (id) => {
      const x = rad.tall[id];
      if (!x) throw new Error(`ukemeny/${T.marked}/${rad.id}: tallet «${id}» mangler i data.${T.marked}.json`);
      brukt.add(x.kilde);
      return x;
    };
    const kilde = (id) => {
      const k = data.kilder[id];
      if (!k) throw new Error(`ukemeny/${T.marked}/${rad.id}: kilden «${id}» finnes ikke`);
      brukt.add(id);
      return k;
    };
    /** «4 °C», «3 to 4 days»: verdien og enheten fra datafila. */
    const t = (id) => T.tallTekst(tall(id));
    const n = (id) => T.tallNr(tall(id).verdi);
    const k = (id) => { const x = kilde(id); return `${T.kortNavn(x)} (${x.aar})`; };
    const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
    const sitat = (id) => {
      const verdi = rad.tekst?.[id];
      if (!verdi) throw new Error(`ukemeny/${T.marked}/${rad.id}: sitatet «${id}» mangler i data.${T.marked}.json`);
      const [kid, ...rest] = verdi.split('|');
      kilde(kid);
      return { kilde: kid, tekst: rest.join('|') };
    };
    /** En setning fra kilden, ordrett, med kilde. Kontrolleres mot kildesiden av holdbarhet/kildekontroll.mjs. */
    const s = (id) => { const q = sitat(id); return `${T.anf[0]}${esc(q.tekst)}${T.anf[1]} (${kp(q.kilde)})`; };
    /** Samme, men uten kilde (når kilden står i setningen foran). */
    const q = (id) => `${T.anf[0]}${esc(sitat(id).tekst)}${T.anf[1]}`;
    return { t, n, k, kp, s, q, brukt };
  }

  const kilder = (data, brukt) => {
    const rekkefolge = Object.keys(data.kilder);
    const ider = [...brukt].sort((a, b) => rekkefolge.indexOf(a) - rekkefolge.indexOf(b));
    return ider.map((id) => data.kilder[id]);
  };
  const kildeliste = (list) => `<ol class="kilder" id="kilder">${list.map((k) => `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). ${T.lest} ${T.dato(k.hentet)}.</li>`).join('')}</ol>`;

  function dagKort(x) {
    const L = T.etikett;
    const rader = [[L.hvorfor, esc(x.hvorfor)]];
    if (x.lagMer) rader.push([L.lagMer, esc(x.lagMer)]);
    if (x.rest) rader.push([L.rest, T.restLinje(x)]);
    if (x.framgang) rader.push([L.framgang, `<ol>${x.framgang.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`]);
    else rader.push([L.oppskrift, `<a href="${esc(x.oppskrift)}" rel="noopener">${T.oppskriftLenke}</a>`]);
    return `<div class="scenario" id="dag-${ankerDag(x.dag)}"><h3>${dagNavn(x.dag)}: ${esc(x.rett)}</h3><dl>${rader.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
  }

  const oversikt = (meny) => `${p(T.oversiktIntro)}<table><thead><tr><th scope="col">${T.dagKolonne}</th><th scope="col">${T.middagKolonne}</th></tr></thead><tbody>${meny.dager.map((x) => `<tr><th scope="row">${dagNavn(x.dag)}</th><td>${esc(x.rett)}${x.rest ? ` <small>(${T.restMerke})</small>` : ''}</td></tr>`).join('')}</tbody></table>`;

  function resterAvsnitt(h, meny) {
    const kjeder = resteKjeder(meny).map((c) => T.restKjede({ ...c, fra: dagNavn(c.fra), til: dagNavn(c.til) }, esc));
    return p(esc(meny.vinkel)) + ul(kjeder) + `<h3>${T.restRegler}</h3>` + T.regler(h, T.hvorUke);
  }

  function handlelisteAvsnitt(meny) {
    const liste = handleliste(meny, MENYER, T.marked);
    return p(T.listeIntro)
      + liste.map((hy) => `<h3>${esc(hy.hylle)}</h3><ul class="handleliste" data-hylle="${esc(hy.hylle)}">${hy.varer.map((v) => `<li data-vare="${esc(v.vare)}">${esc(stor(v.vare))} <small>(${v.dager.map((d) => T.dagKort[DAGER_MARKED[T.marked].indexOf(d)]).join(', ')})</small></li>`).join('')}</ul>`).join('')
      + p(T.hjemmeFra(esc(T.og(MENYER.basis))));
  }

  function appAvsnitt(meny) {
    const egne = meny.dager.filter((x) => x.framgang).map((x) => x.dag);
    const lenker = meny.dager.filter((x) => x.oppskrift).length;
    return T.app({ egne: T.og(egne), harEgne: egne.length > 0, lenker, over: lenker > GRATIS_IMPORTER, gratis: GRATIS_IMPORTER });
  }

  function kildeAvsnitt(data, list, meny) {
    return p(T.kildeIntro(meny ? { hentet: T.dato(MENYER.hentet) } : null)) + kildeliste(list) + p(T.ingenTall);
  }

  function felleSpm(h) { return T.felleSpm(h); }

  const svarFor = (meny) => {
    const rester = meny.dager.filter((x) => x.rest).length;
    return T.svar({ dager: meny.dager.map((x) => `${dagNavn(x.dag)} ${liten(esc(x.rett))}`), rester, restOrd: T.ord[rester] });
  };

  /** Tallene siden kan vise: radens tall og sitater, kildenes år og lesedatoer, appens gratisgrense og menyens hentedato. */
  function tillatteTall(rad, data) {
    const s = new Set([String(GRATIS_IMPORTER)]);
    const leggTil = (n) => { s.add(n); s.add(n.replace(',', '.')); s.add(n.replace('.', ',')); };
    for (const x of Object.values(rad.tall)) { leggTil(String(x.verdi)); leggTil(T.tallNr(x.verdi)); tallIQ(x.merknad).forEach(leggTil); }
    for (const v of Object.values(rad.tekst ?? {})) tallIQ(v.split('|').slice(1).join('|')).forEach(leggTil);
    for (const k of Object.values(data.kilder)) { s.add(String(k.aar)); tallI(T.dato(k.hentet)).forEach((n) => s.add(n)); }
    tallI(T.dato(MENYER.hentet)).forEach((n) => s.add(n));
    return s;
  }
  function tillatteTallNav(data) {
    const s = new Set();
    for (const r of data.rader.filter((x) => x.status === 'kontrollert')) for (const n of tillatteTall(r, data)) s.add(n);
    return s;
  }
  /** Radens egne navn som duplikatvakten maskerer: menyens navn og rettene. */
  const maskeNavn = (rad) => [rad.navn.toLowerCase(), ...menyFor(rad).dager.map((x) => x.rett)];

  function sideForRad(rad, data, rader) {
    const meny = menyFor(rad);
    const adresse = sti(rad);
    const h = hjelpere(rad, data);
    const faq = [...meny.faq.map(([qq, a]) => [qq, esc(T.fyll(a, h))]), ...felleSpm(h)];
    const rik = byggRik({
      lang: T.marked,
      svarTekst: svarFor(meny),
      seksjoner: [
        [T.sek.dager, oversikt(meny) + meny.dager.map(dagKort).join('')],
        [T.sek.rester, resterAvsnitt(h, meny)],
        [T.sek.liste, handlelisteAvsnitt(meny)],
        [T.sek.app, appAvsnitt(meny)],
        [T.sek.kilder, kildeAvsnitt(data, kilder(data, h.brukt), meny)],
      ],
    }).html;
    const andre = (rader ?? data.rader.filter((r) => r.status === 'kontrollert')).filter((r) => r.id !== rad.id);
    const relatert = `<div class="related"><h2>${T.andre}</h2><ul>${andre.map((r) => `<li><a href="${sti(r)}">${esc(menyFor(r).h1)}</a></li>`).join('')}<li><a href="${T.rot}">${T.alle}</a></li></ul></div>`;
    const brukt = kilder(data, h.brukt);
    return {
      title: meny.tittel,
      description: meny.beskrivelse,
      eyebrow: `<a href="${T.rot}">${T.eyebrowRot}</a><span aria-hidden="true"> › </span>${esc(rad.navn)}`,
      h1: meny.h1,
      lead: esc(meny.ingress),
      steg: T.steg,
      stegTittel: T.stegTittel, forst: '', alternativ: '', grense: '', seksjoner: [],
      rik: `${rik}\n${relatert}`,
      faqTittel: T.faqTittel, faq,
      cta: T.cta,
      publisert: rad.oppdatert,
      schemas: [
        brodsmuler([{ navn: T.hjem[0], adresse: T.hjem[1] }, { navn: T.eyebrowRot, adresse: T.rot }, { navn: meny.h1, adresse }]),
        artikkel({ tittel: meny.h1, beskrivelse: meny.beskrivelse, adresse, sprak: T.marked, publisert: rad.oppdatert, kilder: brukt }),
        elementliste({ navn: T.elementNavn(meny.h1), adresse, elementer: meny.dager.map((x) => ({ navn: `${dagNavn(x.dag)}: ${x.rett}`, adresse: x.oppskrift ?? `${adresse}#dag-${ankerDag(x.dag)}` })) }),
        faqSkjema(faq),
      ],
    };
  }

  function navSide(data, rader) {
    const rad0 = rader[0];
    const h0 = hjelpere(rad0, data);
    const kort = rader.map((r) => {
      const m = menyFor(r);
      return `<div class="scenario"><h3><a href="${sti(r)}">${esc(m.h1)}</a></h3><p>${esc(m.ingress)}</p><p>${esc(T.og(m.dager.map((x) => x.rett)))}.</p></div>`;
    }).join('');
    const navn = rader.map((r) => r.navn.toLowerCase());
    const brukt = new Set();
    const hn = hjelpere(rad0, data, brukt);
    const regler = T.regler(hn, T.hvorNav);
    const faq = T.navFaq(hn);
    const rik = byggRik({
      lang: T.marked,
      svarTekst: T.navSvar(T.og(navn)),
      seksjoner: [
        [T.nav.velg, p(T.nav.velgIntro) + kort],
        [T.nav.oppsett, ul(T.nav.punkter)],
        [T.sek.restRegler, regler],
        [T.nav.egne, p(T.nav.egneTekst)],
        [T.sek.kilder, kildeAvsnitt(data, kilder(data, brukt), null)],
      ],
    }).html;
    void h0;
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title: T.nav.title,
      description: T.nav.description,
      eyebrow: T.eyebrowRot,
      h1: T.nav.h1,
      lead: T.nav.lead,
      steg: T.nav.steg,
      stegTittel: T.nav.stegTittel, forst: '', alternativ: '', grense: '', seksjoner: [],
      rik,
      faqTittel: T.nav.faqTittel,
      faq,
      cta: T.cta,
      publisert,
      schemas: [
        brodsmuler([{ navn: T.hjem[0], adresse: T.hjem[1] }, { navn: T.eyebrowRot, adresse: T.rot }]),
        artikkel({ tittel: T.nav.h1, beskrivelse: T.nav.description, adresse: T.rot, sprak: T.marked, publisert, kilder: kilder(data, brukt) }),
        elementliste({ navn: T.eyebrowRot, adresse: T.rot, elementer: rader.map((r) => ({ navn: menyFor(r).h1, adresse: sti(r) })) }),
        faqSkjema(faq),
      ],
    };
  }

  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, menyFor, alleMenyer: () => MENYER, hjelpere };
}
