import { HYLLETEKST, lokaliserHyller, synligeLenker } from './hyller.mjs';
import { SKALLTEKST, SPRAKVALG, BUTIKK } from './skall-tekst.mjs';
import { SIDEGRUPPER } from './locale-sider.mjs';

// Rene HTML-funksjoner. Språkdata kommer fra samme kilde for meny og bunn.
const skjerm = (verdi) => String(verdi).replace(/[&<>"']/g, (tegn) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[tegn]);

export function sprakvelger(sprak, plass, sider) {
  const lenker = Object.entries(sider).map(([kode, href]) => {
    const navn = SPRAKVALG.navn[kode];
    return `<a href="${skjerm(href)}" lang="${kode}" hreflang="${kode}" aria-label="${navn}"${kode === sprak ? ' aria-current="page"' : ''}>${navn}</a>`;
  }).join('');
  return `<!-- språkvelger:${plass} --><span class="language-switcher language-switcher-${plass === 'topp' ? 'top' : 'bottom'}" role="navigation" aria-label="${skjerm(SPRAKVALG.aria[sprak])}">${lenker}</span><!-- /språkvelger:${plass} -->`;
}

// Siden på språket for en sidegruppe (forside, personvern, vilkår).
const side = (id, sprak) => SIDEGRUPPER.find((g) => g.id === id).sider[sprak];

// Et språk uten egne skalltekster og hyller kaster.
function sjekkSprak(sprak) {
  if (!Object.hasOwn(SKALLTEKST, sprak)) throw new RangeError(`Skalltekster mangler for ${sprak}`);
  return SKALLTEKST[sprak];
}

function hyller(sprak, meny = false) {
  const tagg = meny ? 'button' : 'span';
  const attributter = meny ? 'type="button" class="fagknapp" aria-expanded="true"' : 'class="fagknapp"';
  return lokaliserHyller(sprak, HYLLETEKST[sprak]).map((hylle) => `<div class="fag aapen"><p class="faghode"><${tagg} ${attributter}><img class="flis" src="/images/forside/logo/${skjerm(hylle.flis)}" width="52" height="52" alt="" loading="lazy"><span>${skjerm(hylle.navn)}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></${tagg}></p><ul aria-label="${skjerm(hylle.navn)}">${synligeLenker(hylle).map((lenke) => `<li><a href="${skjerm(lenke.href)}"><span>${skjerm(lenke.tekst)}</span></a></li>`).join('')}</ul></div>`).join('');
}

export function topp(sprak, valg = {}) {
  const { topp: t } = sjekkSprak(sprak);
  const folg = valg.folg ? `<nav class="folg" id="folg" aria-label="${skjerm(t.folgAria)}"><i class="folgmerke" aria-hidden="true"></i>${valg.folg.map(({ href, tekst }) => `<a href="${skjerm(href)}">${skjerm(tekst)}</a>`).join('')}</nav>` : '';
  return `<header class="topp">
  <div class="ramme">
    <a class="merke" href="${skjerm(side('forside', sprak))}" id="merke" aria-label="${skjerm(t.merkeAria)}"><span class="merkeflis"><img src="/images/forside/logo/14.webp" width="36" height="36" alt=""><img src="/images/forside/logo/14.webp" width="36" height="36" alt=""></span><span class="ordmerke">mat<em>lyst</em></span></a>
    ${folg}
    <button type="button" class="menyknapp" id="menyknapp" aria-expanded="false" aria-controls="panel" aria-label="${skjerm(t.menyAria)}">
      <span class="ikonbytte" aria-hidden="true"><svg class="linjer" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M4 16h16"></path></svg><svg class="kryss" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></span>
      <span>${skjerm(t.meny)}</span>
    </button>
    <nav class="panel" id="panel" data-meny="c" aria-label="${skjerm(t.panelAria)}" hidden>
      <div class="reol">${hyller(sprak, true)}</div>
      ${valg.sprakvelger || ''}
    </nav>
    <a class="knapp liten" href="/app" data-hent="topp">${skjerm(t.lastNed)}</a>
  </div>
</header>`;
}

// `guider` er en ferdig guideblokk (scripts/guidelenker.mjs). Uten den står plassmerket der,
// og blokka settes inn senere. Detaljene er sammenfoldet, og tomme skjules i skall.css.
export function hylledel(sprak, { guider = '' } = {}) {
  const { bunn, bunnlinje } = sjekkSprak(sprak);
  return `<section class="bunn" id="last-ned" aria-label="${skjerm(bunn.aria)}">
  <div class="ramme" data-meny="c">
    <nav class="reol" id="bunnreol" aria-label="${skjerm(bunn.menyAria)}">${hyller(sprak)}</nav>
    <details class="alle-guider"><summary>${skjerm(bunn.guider)}</summary>${guider || '<!-- guider:plass -->'}</details><div class="bunnrad"><p>${skjerm(bunnlinje)}</p><a class="knapp" href="/app" data-hent="bunn">${skjerm(bunn.knapp)}</a></div>
  </div>
</section>`;
}

export function morkBunn(sprak, { sprakvelger: velger = '', samtykkelenke = true } = {}) {
  const { under } = sjekkSprak(sprak);
  const [personvern, vilkar, kapsler] = under.lenker;
  const samtykke = samtykkelenke ? `<a href="#" data-consent-withdraw>${skjerm(kapsler)}</a>` : '';
  return `<footer class="under">
  <div class="ramme">
    <div class="stormerke ordmerke" aria-hidden="true">mat<em>lyst</em></div>
    <div class="underlinje">
      <nav aria-label="${skjerm(under.vilkarAria)}"><a href="${skjerm(side('personvern', sprak))}">${skjerm(personvern)}</a><a href="${skjerm(side('vilkar', sprak))}">${skjerm(vilkar)}</a>${samtykke}</nav>
      ${velger}
    </div>
    <div class="underlinje">
      <span class="laget">${skjerm(under.laget)} <svg class="flagg" viewBox="0 0 22 16" role="img" aria-label="${skjerm(under.flaggAlt)}"><rect width="22" height="16" fill="#BA0C2F"/><path d="M0 8h22M8 0v16" stroke="#fff" stroke-width="4"/><path d="M0 8h22M8 0v16" stroke="#00205B" stroke-width="2"/></svg></span>
      <span class="epost">${skjerm(under.epost)}</span>
    </div>
  </div>
</footer>`;
}

export function nedlasting(sprak) {
  const { fast, hent } = sjekkSprak(sprak);
  const butikk = BUTIKK[sprak];
  const [apple, google] = hent.butikker;
  return `<div class="fast" id="fast" inert><a class="knapp" href="/app" data-hent="fast">${skjerm(fast.knapp)}</a></div>
<dialog class="hent" id="hent" aria-labelledby="hentTittel">
  <div class="hentinn">
    <button type="button" class="lukk" aria-label="${skjerm(hent.lukkAria)}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
    <div class="qr"><img src="/images/forside/qr-app.svg" width="176" height="176" alt="${skjerm(hent.qrAlt)}" loading="lazy"></div>
    <p class="henttittel" id="hentTittel">${skjerm(hent.tittel)}</p>
    <p>${skjerm(hent.ingress)}</p>
    <div class="butikker"><a href="${skjerm(butikk.apple)}" target="_blank" rel="noopener">${skjerm(apple)}</a><a href="${skjerm(butikk.google)}" target="_blank" rel="noopener">${skjerm(google)}</a></div>
  </div>
</dialog>`;
}

export function samtykke(sprak) {
  const { samtykke: s } = sjekkSprak(sprak);
  return `<div class="cookie" id="cookie" hidden>
  ${s.overskrift ? `<h3>${skjerm(s.overskrift)}</h3>\n  ` : ''}<p>${skjerm(s.tekst)} <a href="${skjerm(side('personvern', sprak))}">${skjerm(s.lenke)}</a>.</p>
  <div class="cookie-actions">
    <button class="ck-btn ck-accept" id="ck-accept" type="button">${skjerm(s.godta)}</button>
    <button class="ck-btn ck-reject" id="ck-reject" type="button">${skjerm(s.avvis)}</button>
  </div>
</div>`;
}
