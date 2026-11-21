// Den felles malen for «dl till gram» (sv) og «dl til gram» (da): en samleside og én side per vare, skrevet fra data.<marked>.json.
// Malen kjenner ingen språk selv. Ord, setninger, enhetsnavn og kilder til tekst står i språkpakken (sprak-nordisk.mjs), og varenes
// betegnelser i tekst-sv.mjs og tekst-da.mjs. Strukturen er den samme som i mal-nb.mjs (som er uendret) og kalkulatorkortet det samme.
// Malen skriver bare tall som kan regnes ut fra datafila (se tillatteTall). Tallene er de samme som i data.nb.json.
import { kilderFor, publiserbare } from '../felles.mjs';
import { artikkel, elementliste, webApplikasjon as webApp } from '../skjema.mjs';
import { esc, gramTekst as gramFelles, kalkSkjelett, mengdeTekst as mengdeFelles, tallI } from './felles-mal.mjs';

const USDA_FELT = ['dl_usda', 'dl_usda_pakket', 'dl_usda_siktet'];
const fmt = (n) => String(n).replace('.', ',');
const gram = (n) => `${fmt(n)} g`;
const ord = (rad) => rad.navn.toLowerCase();
const gramTekst = (n) => gramFelles(n, { komma: true });
const mengdeTekst = (n) => mengdeFelles(n, { komma: true });
const gramVerdi = (n) => Number(gramTekst(n).replace(',', '.'));
const kortUsdaNavn = (navn) => navn.replace(/\s*\(Includes[^)]*\)/u, '');
// Rapportens toppede skjetall ligger i datafila, men vises ikke (se VIS_TOPPET i mal-nb.mjs): de lar seg ikke skille fra strøkne mål.
const FASTE_MENGDER = ['0,25', '0,5', '1', '1,5', '2', '2,5', '3', '4', '5', '10', '15', '25', '50', '100', '150', '250', '500', '1000', '236.5882365'];
const kildeTall = (k, dato) => [String(k.aar), ...tallI(dato(k.hentet))];

/** Lager malen for ett språk. `L` er språkpakken, `TEKST` varenes håndskrevne tekster (variant, flytende, naer). */
export function lagMal(L, TEKST) {
  const ROT = L.rot;
  const dato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return L.dato(a, m, d, L.maaneder[m - 1]); };
  const sortNavn = (a, b) => a.navn.localeCompare(b.navn, L.lokal);
  const q = (t) => `${L.q[0]}${t}${L.q[1]}`;
  const og = (liste) => (liste.length > 1 ? `${liste.slice(0, -1).join(', ')} ${L.og} ${liste.at(-1)}` : liste[0]);

  /** Alle utregninger på siden, ett sted. `skjeer` er gram per skje i den rekkefølgen språkpakken lister dem; ss og ts er matskje og teskje. */
  function utregnet(rad) {
    const dl = rad.tall.dl.verdi;
    const skjeer = L.skjeer.map(([kort, ml]) => [kort, gramVerdi(dl * ml / 100)]);
    const ss = gramVerdi(dl * 15 / 100);
    const ts = gramVerdi(dl * 5 / 100);
    return {
      dl, ss, ts, skjeer,
      tabell: [...skjeer.map(([kort, g]) => [L.tabellEnhet[kort], g]), [L.halv, gramVerdi(dl / 2)], ['1 dl', dl], ['2 dl', 2 * dl], ['3 dl', 3 * dl], ['4 dl', 4 * dl], ['5 dl', 5 * dl], [L.liter, 10 * dl]],
      tilbake: [100, 250, 500, 1000].map((g) => [g, mengdeTekst(g / dl)]),
    };
  }

  const synligRad = (rad) => ({ ...rad, tall: Object.fromEntries(Object.entries(rad.tall).filter(([k]) => k === 'dl' || USDA_FELT.includes(k))) });
  const usdaTall = (rad) => USDA_FELT.filter((k) => rad.tall[k]).map((k) => {
    const m = /^(\d+(?:[.,]\d+)?) g (per .+)$/u.exec(rad.tall[k].merknad ?? '');
    const mal = L.usdaMal[m?.[2].replace(/^per /u, '')];
    if (!mal) throw new Error(`${rad.id}: ukjent USDA-mål «${rad.tall[k].merknad}», legg det til i usdaMal i sprak-nordisk.mjs (${L.marked})`);
    return { verdi: rad.tall[k].verdi, gPerCup: m[1], mal };
  });

  const KALK = {
    varer: null,
    ml: L.kalkMl,
    g: { g: 1, kg: 1000 },
    kort: L.kalkKort,
    steg: { volum: ['0,5', '1', '2', '3', '5', '10'], ml: ['25', '50', '100', '250', '500', '1000'], g: ['50', '100', '150', '250', '500', '1000'], kg: ['0,25', '0,5', '1', '1,5', '2', '5'] },
    feil: L.feil,
  };
  const sti = (rad) => `${ROT}${rad.slug}/`;
  const lenke = (rad, tekst = rad.navn) => `<a href="${sti(rad)}">${esc(tekst)}</a>`;

  /** Kalkulatorkortet (samme HTML-kontrakt som mal-nb). Med `fast` står varen fast øverst; ellers velges den i en liste. */
  function kalkHtml({ rader, fast }) {
    const varer = fast ? [fast] : [...rader].sort(sortNavn);
    const forste = fast ?? varer.find((r) => r.id === 'hvetemel') ?? varer[0];
    const indeks = varer.indexOf(forste);
    const dl = forste.tall.dl.verdi;
    const json = JSON.stringify({ ...KALK, varer: varer.map((r) => [ord(r), r.tall.dl.verdi]) });
    const vare = fast
      ? `<div class="kalkvare"><span><span class="hva">${L.kalk.vare}</span><br><b>${esc(fast.navn)}</b></span><a href="${ROT}">${L.kalk.byttVare}</a></div>`
      : `<div class="kalkvare"><label><span class="hva">${L.kalk.vare}</span><select data-felt="vare">${varer.map((r, i) => `<option value="${i}"${i === indeks ? ' selected' : ''}>${esc(r.navn)}</option>`).join('')}</select></label></div>`;
    return kalkSkjelett({
      etiketter: { aria: L.kalk.aria, mengde: L.kalk.mengde, fra: L.kalk.fra, til: L.kalk.til, bytt: L.kalk.bytt, vanlige: L.kalk.vanlige },
      enheter: L.enheter, fra: 'dl', til: 'g', data: JSON.parse(json), vareHtml: vare,
      start: { mengde: '2', svar: fmt(2 * dl), setning: `2 dl ${esc(ord(forste))} = ${gram(2 * dl)}`, hurtig: KALK.steg.volum.map((v) => [v, `${v} dl`]) },
    });
  }

  const kildeNavn = (k) => (k.navn.includes(String(k.aar)) ? k.navn : `${k.navn} (${k.aar})`);
  const vert = (adresse) => new URL(adresse).hostname;
  const kildeliste = (kilder) => `<h2>${L.kilder.h2}</h2>\n<ol class="kilder" id="kilder">${kilder.map((k) => `<li>${esc(kildeNavn(k))}. ${esc(k.utgiver)}. <a href="${esc(k.adresse)}" rel="noopener">${esc(vert(k.adresse))}</a>. ${L.kilder.hentet(dato(k.hentet))}.</li>`).join('')}</ol>`;

  const APPKORT = `<h2>${L.appkort.h2}</h2>
<aside class="i-appen i-enheter"><div class="i-appen-tekst"><p class="i-appen-tittel"><img src="/images/icon-64.png" width="22" height="22" alt="">I Matlyst</p><p>${L.appkort.tekst}</p><a class="more" href="${L.appkort.lenke}">${L.appkort.les}</a></div><div class="i-appen-media"><img class="tel" src="${L.appkort.bilde}-400.webp" srcset="${L.appkort.bilde}-400.webp 400w, ${L.appkort.bilde}-800.webp 800w" sizes="200px" width="400" height="867" loading="lazy" decoding="async" alt="${esc(L.appkort.alt)}"></div></aside>`;

  const EYEBROW_VARE = `${L.eyebrowRot}<span aria-hidden="true"> › </span><a href="${ROT}">${L.navn}</a>`;
  const EYEBROW_NAV = `${L.eyebrowRot}<span aria-hidden="true"> › </span>${L.navn}`;
  const SKJELETT = { stegTittel: L.skjelett.stegTittel, forst: '', alternativ: '', grense: '', seksjoner: [], cta: L.skjelett.cta };
  // Brødsmulene lager generatoren selv (som for «cups to grams»). Valutakoder står ikke på sv- og da-sider (test/locale-pages.test.mjs),
  // så kalkulatoren beskrives uten tilbud; den er gratis (isAccessibleForFree).
  const webApplikasjon = (arg) => { const { offers, ...ren } = webApp(arg); return ren; };

  /**
   * Tallene DEN siden kan bruke: radens egne kildetall, de utregnede verdiene, de faste mengdene, tall i postnavn og varianter,
   * og år og datoer for kildene siden viser. Tall fra den nære varen tillates bare der de vises.
   */
  function tillatteTall(rad, data) {
    const s = new Set(FASTE_MENGDER);
    const legg = (n) => s.add(fmt(n));
    const u = utregnet(rad);
    [u.dl, u.ss, u.ts, 2 * u.dl].forEach(legg);
    u.skjeer.forEach(([, g]) => legg(g));
    u.tabell.forEach(([, g]) => legg(g));
    u.tilbake.forEach(([, d]) => s.add(d));
    for (const t of [rad.tekst?.matvaretabell, rad.tekst?.andrePoster, rad.tekst?.usdaNavn, rad.tekst?.usdaFdcId, TEKST[rad.id]?.variant]) tallI(t).forEach((n) => s.add(n));
    for (const k of USDA_FELT) {
      if (!rad.tall[k]) continue;
      legg(rad.tall[k].verdi);
      tallI(rad.tall[k].merknad).forEach((n) => s.add(n));
    }
    const naer = publiserbare(data).find((r) => r.id === TEKST[rad.id]?.naer?.[0]);
    if (naer) { legg(naer.tall.dl.verdi); tallI(TEKST[naer.id].variant).forEach((n) => s.add(n)); }
    kildeTall(data.kilder.matvaretabellen, dato).forEach((n) => s.add(n));
    if (usdaTall(rad).length) kildeTall(data.kilder.usda, dato).forEach((n) => s.add(n));
    return s;
  }

  /** Samlesiden: alle varenes dl, matskje og teskje (varetabellen), antallet og indeksene i varevalget, eksemplet i spørsmålene og kildenes år og datoer. */
  function tillatteTallNav(data) {
    const alle = publiserbare(data);
    const s = new Set(FASTE_MENGDER);
    s.add(String(alle.length));
    alle.forEach((_, i) => s.add(String(i)));
    for (const r of alle) { const u = utregnet(r); [u.dl, u.ss, u.ts].forEach((n) => s.add(fmt(n))); }
    const hvete = alle.find((r) => r.id === 'hvetemel') ?? alle[0];
    const u = utregnet(hvete);
    s.add(fmt(2 * u.dl)); s.add(u.tilbake[0][1]);
    kildeTall(data.kilder.matvaretabellen, dato).forEach((n) => s.add(n));
    return s;
  }

  function sprikAvsnitt(rad) {
    const usda = usdaTall(rad);
    if (!usda.length) return '';
    const dl = rad.tall.dl.verdi;
    const o = ord(rad);
    const lik = usda.every((u) => u.verdi === dl);
    const innledning = lik ? L.sprikLik(gram(dl), esc(o)) : L.sprikOlik(gram(dl), esc(o), og(usda.map((u) => gram(u.verdi))));
    const rader = [
      `<tr class="valgt"><td>${L.MVT}<small>${q(esc(rad.tekst.matvaretabell))}. ${L.sprikValgt}</small></td><td>${gram(dl)}</td></tr>`,
      ...usda.map((u) => `<tr><td>USDA FoodData Central<small>${q(esc(rad.tekst.usdaNavn))} (FDC ${rad.tekst.usdaFdcId}). ${esc(L.sprikUsda(`${u.gPerCup} g`, u.mal))}</small></td><td>${gram(u.verdi)}</td></tr>`),
    ];
    return `<h2>${L.sprikH2}</h2>
<p>${innledning}</p>
<table class="sprik"><thead><tr><th scope="col">${L.sprikTh[0]}</th><th scope="col">${L.sprikTh[1]}</th></tr></thead><tbody>${rader.join('')}</tbody></table>`;
  }

  function andrePosterAvsnitt(rad) {
    const andre = JSON.parse(rad.tekst.andrePoster ?? '[]');
    if (!andre.length) return '';
    const rader = andre.map(([navn, dl]) => `<tr><td>${q(esc(navn))}</td><td>${gram(dl)}</td></tr>`).join('');
    return `<h2>${L.andrePosterH2}</h2>
<p>${L.andrePosterP(esc(rad.tekst.matvaretabell))}</p>
<table class="sprik"><thead><tr><th scope="col">${L.andrePosterTh[0]}</th><th scope="col">${L.andrePosterTh[1]}</th></tr></thead><tbody>${rader}</tbody></table>`;
  }

  function spmForRad(rad, data, rader, u) {
    const t = TEKST[rad.id];
    const o = ord(rad);
    const g = { ss: gram(u.ss), ts: gram(u.ts) };
    const spm = [
      [L.qHvorMange(o), L.aHvorMange(esc(t.variant), gram(u.dl), esc(rad.tekst.matvaretabell))],
      [L.qTilbake(o), L.aTilbake(o, u.tilbake[0][1], u.dl)],
      [L.qSkje(o), L.aSkje(g, t.flytende)],
    ];
    const naer = (t.naer ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
    const usda = usdaTall(rad);
    if (naer[0]) {
      const n = naer[0];
      const dlN = n.tall.dl.verdi;
      const svar = dlN === u.dl
        ? L.aNaerLik(esc(TEKST[n.id].variant), gram(dlN), esc(t.variant))
        : L.aNaerOlik(esc(TEKST[n.id].variant), gram(dlN), gram(u.dl), esc(t.variant));
      // Ingen lenke i svaret: FAQPage-dataene tar svaret som ren tekst (som på «cups to grams»); lenken til varen står i «Andre varer».
      spm.push([L.qNaer(ord(n), o), svar]);
    } else if (!usda.length) {
      spm.push([L.qLiter(o), L.aLiter(o, gram(10 * u.dl), u.tilbake[3][1])]);
    } else {
      const deler = usda.map((x) => esc(L.usdaDel(x.gPerCup, x.mal, Math.round(Number(x.gPerCup.replace(',', '.')) / 2.365882))));
      spm.push([L.qUsda(o), L.aUsda(esc(kortUsdaNavn(rad.tekst.usdaNavn)), deler, gram(u.dl))]);
    }
    return [...spm, ...(t.ekstraSpm ?? [])];
  }

  function andreVarer(rad, rader) {
    const naer = (TEKST[rad.id]?.naer ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
    const i = rader.indexOf(rad);
    const etter = [...rader.slice(i + 1), ...rader.slice(0, i)].filter((r) => !naer.includes(r));
    const valgt = [...naer, ...etter].slice(0, 8);
    return `<div class="related"><h2>${L.andreVarer}</h2><ul>${[...valgt.map((r) => `<li>${lenke(r)}</li>`), `<li><a href="${ROT}">${L.alleVarer}</a></li>`].join('')}</ul></div>`;
  }

  function kortsvar(rad, u) {
    const t = TEKST[rad.id];
    const skjeer = L.skjeerKort({ ss: gram(u.ss), ts: gram(u.ts) }, t.flytende);
    return `${L.kortsvar(esc(t.variant), gram(u.dl), skjeer)}\n<p class="kilde">${L.kildeVare(esc(rad.tekst.matvaretabell))}</p>`;
  }

  function sideForRad(rad, data, rader) {
    const u = utregnet(rad);
    const o = ord(rad);
    const adresse = sti(rad);
    const lang = L.titleLang(o);
    const title = `${lang} | Matlyst`.length <= 60 ? lang : L.titleKort(o);
    const medUsda = usdaTall(rad).length > 0;
    const variant = esc(TEKST[rad.id].variant);
    const description = L.description(variant, gram(u.dl), medUsda);
    const lead = L.lead(variant, gram(u.dl));
    const tabell = `<table class="otabell"><thead><tr><th scope="col">${esc(rad.navn)}</th><th scope="col">${L.tabellTh}</th></tr></thead><tbody>${u.tabell.map(([e, g]) => `<tr><td>${e}</td><td>${gram(g)}</td></tr>`).join('')}</tbody></table>`;
    const eks = u.tilbake.map(([g, d]) => `<li><b>${g === 1000 ? '1 kg' : `${g} g`}</b><span>${d} dl</span></li>`).join('');
    const rik = [
      `<div class="oto"><div class="okort"><h2>${L.tabellH2(esc(o))}</h2><p>${L.tabellKort(variant, gram(u.dl))}</p>${tabell}</div>`,
      `<div class="okort"><h2>${L.tilbakeH2}</h2><p>${L.tilbakeP(o, u.dl)}</p><p class="formel"><span>${L.formelDl}</span><i>=</i><span>${L.formelGram}</span><i>÷</i><b>${u.dl}</b></p><p class="liten">${L.eksempler}</p><ul class="eksempler">${eks}</ul></div></div>`,
      APPKORT,
      sprikAvsnitt(rad),
      andrePosterAvsnitt(rad),
      kildeliste(kilderFor(data, [synligRad(rad)])),
      andreVarer(rad, rader),
    ].filter(Boolean).join('\n');
    return {
      title, description, eyebrow: EYEBROW_VARE, h1: L.h1(rad.navn), lead,
      topp: `${kalkHtml({ rader, fast: rad })}\n${kortsvar(rad, u)}`,
      steg: L.steg, ...SKJELETT, rik,
      faqTittel: L.faqTittelVare(o), faq: spmForRad(rad, data, rader, u),
      publisert: rad.oppdatert,
      schemas: [
        webApplikasjon({ navn: L.h1(rad.navn), beskrivelse: description, adresse, sprak: L.marked }),
        artikkel({ tittel: L.h1(rad.navn), beskrivelse: description, adresse, sprak: L.marked, publisert: rad.oppdatert, kilder: kilderFor(data, [synligRad(rad)]) }),
        'faq',
      ],
    };
  }

  /** Radens egne navn som duplikatvakten maskerer: ord og variant, og postene vi valgte bort. */
  const maskeNavn = (rad) => [ord(rad), TEKST[rad.id]?.variant, ...JSON.parse(rad.tekst?.andrePoster ?? '[]').map(([n]) => n)];

  function navSide(data, rader) {
    const sortert = [...rader].sort(sortNavn);
    const etterVekt = [...rader].sort((a, b) => a.tall.dl.verdi - b.tall.dl.verdi);
    const lett = etterVekt[0];
    const tung = etterVekt.at(-1);
    const kjent = (id) => rader.find((r) => r.id === id);
    const eks = [kjent('hvetemel'), kjent('sukker'), kjent('havregryn')].filter(Boolean);
    const eksTekst = eks.map((r) => L.eksSetning(ord(r), gram(r.tall.dl.verdi)));
    const rekke = og(eksTekst);
    const rows = sortert.map((r) => { const u = utregnet(r); return `<tr><td>${lenke(r)}</td><td>${gram(u.dl)}</td><td>${gram(u.ss)}</td><td>${gram(u.ts)}</td></tr>`; }).join('');
    const title = L.navTitle(rader.length);
    const description = L.navDescription(rader.length);
    const kilder = kilderFor(data, rader.map((r) => ({ ...r, tall: { dl: r.tall.dl } })));
    const f = eks[0] ?? lett;
    const rik = [
      `<h2>${L.navH2}</h2><p>${L.navIntro}</p>
<div class="varerull"><table class="varer"><thead><tr>${L.navTh.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`,
      APPKORT,
      `<h2>${L.navForskjellH2}</h2><p>${L.navForskjell(ord(tung), gram(tung.tall.dl.verdi), ord(lett), gram(lett.tall.dl.verdi))}</p>
<h2>${L.navHurH2}</h2><p>${L.navHur}</p>`,
      kildeliste(kilder),
      `<div class="related"><h2>${L.relatedH2}</h2><ul>${L.related.map(([slug, tekst]) => `<li><a href="${L.relatedRot}${slug}/">${tekst}</a></li>`).join('')}</ul></div>`,
    ].join('\n');
    const faq = [
      [L.navFaq.q1, L.navFaq.a1(eksTekst.length ? `${rekke.charAt(0).toUpperCase()}${rekke.slice(1)}` : '')],
      [L.navFaq.q2, L.navFaq.a2(ord(f), gram(f.tall.dl.verdi), gram(2 * f.tall.dl.verdi))],
      [L.navFaq.q3, L.navFaq.a3(ord(f), utregnet(f).tilbake[0][1])],
      [L.navFaq.q4, L.navFaq.a4],
    ];
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title, description, eyebrow: EYEBROW_NAV, h1: L.navn, lead: L.navLead,
      topp: `${kalkHtml({ rader })}\n${L.navKort(rekke)}`,
      steg: L.steg, ...SKJELETT, rik,
      faqTittel: L.faqTittelNav, faq, publisert,
      schemas: [
        webApplikasjon({ navn: L.navn, beskrivelse: description, adresse: ROT, sprak: L.marked }),
        artikkel({ tittel: L.navn, beskrivelse: description, adresse: ROT, sprak: L.marked, publisert, kilder }),
        elementliste({ navn: `${L.navn}: ${L.alleVarer.toLowerCase()}`, adresse: ROT, elementer: sortert.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
        'faq',
      ],
    };
  }

  return { utregnet, kalkHtml, tillatteTall, tillatteTallNav, sideForRad, navSide, maskeNavn, gramTekst, mengdeTekst };
}
