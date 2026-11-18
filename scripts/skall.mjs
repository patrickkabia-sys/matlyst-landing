import { HYLLER, synligeLenker } from './hyller.mjs';

// Rene HTML-funksjoner. Språkdata kommer fra samme kilde for meny og bunn.
const skjerm = (verdi) => String(verdi).replace(/[&<>"']/g, (tegn) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[tegn]);
const spraknavn = { nb: ['NO', 'Norsk'], sv: ['SV', 'Svenska'], da: ['DA', 'Dansk'], en: ['EN', 'English'] };

export function sprakvelger(sprak, plass, sider) {
  const lenker = Object.entries(sider).map(([kode, href]) => {
    const [kort, navn] = spraknavn[kode];
    return `<a href="${skjerm(href)}" lang="${kode}" hreflang="${kode}" aria-label="${navn}"${kode === sprak ? ' aria-current="page"' : ''}>${kort}</a>`;
  }).join('');
  return `<!-- språkvelger:${plass} --><span class="language-switcher language-switcher-${plass === 'topp' ? 'top' : 'bottom'}" role="navigation" aria-label="Språk">${lenker}</span><!-- /språkvelger:${plass} -->`;
}

// Bare bokmål er levert i denne oppgaven. Et nytt språk må ha egne tekster og hyller.
function sjekkSprak(sprak) {
  if (sprak !== 'nb') throw new RangeError(`Skalltekster mangler for ${sprak}`);
}

function hyller(sprak) {
  return HYLLER[sprak].map((hylle) => `<div class="fag aapen"><h3 class="faghode"><div class="fagknapp"><img class="flis" src="/images/forside/logo/${skjerm(hylle.flis)}" width="52" height="52" alt="" loading="lazy"><span>${skjerm(hylle.navn)}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></div></h3><ul>${synligeLenker(hylle).map((lenke) => `<li><a href="${skjerm(lenke.href)}"><span>${skjerm(lenke.tekst)}</span></a></li>`).join('')}</ul></div>`).join('');
}

export function topp(sprak, valg = {}) {
  sjekkSprak(sprak);
  const folg = valg.folg ? `<nav class="folg" id="folg" aria-label="På denne siden"><i class="folgmerke" aria-hidden="true"></i>${valg.folg.map(({ href, tekst }) => `<a href="${skjerm(href)}">${skjerm(tekst)}</a>`).join('')}</nav>` : '';
  return `<header class="topp">
  <div class="ramme">
    <a class="merke" href="/" id="merke" aria-label="Matlyst, til forsiden"><span class="merkeflis"><img src="/images/forside/logo/14.webp" width="36" height="36" alt=""><img src="/images/forside/logo/14.webp" width="36" height="36" alt=""></span><span class="ordmerke">mat<em>lyst</em></span></a>
    ${folg}
    <button type="button" class="menyknapp" id="menyknapp" aria-expanded="false" aria-controls="panel" aria-label="Meny">
      <span class="ikonbytte" aria-hidden="true"><svg class="linjer" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M4 16h16"></path></svg><svg class="kryss" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></span>
      <span>Meny</span>
    </button>
    <a class="knapp liten" href="/app" data-hent="topp">Last ned</a>

    <nav class="panel" id="panel" data-meny="c" aria-label="Hovedmeny" hidden>
      <div class="reol">${hyller(sprak)}</div>
      ${valg.sprakvelger || ''}
    </nav>
  </div>
</header>`;
}

export function hylledel(sprak) {
  sjekkSprak(sprak);
  return `<section class="bunn" id="last-ned" aria-label="Alt på Matlyst">
  <div class="ramme" data-meny="c">
    <nav class="reol" id="bunnreol" aria-label="Bunnmeny">${hyller(sprak)}</nav>
    <div class="bunnrad"><p>Den oppskriften du lagret? Lag den i kveld.</p><a class="knapp" href="/app" data-hent="bunn">Last ned gratis</a></div>
  </div>
</section>`;
}

export function morkBunn(sprak, valg = {}) {
  sjekkSprak(sprak);
  return `<footer class="under">
  <div class="ramme">
    <div class="stormerke ordmerke" aria-hidden="true">mat<em>lyst</em></div>
    <div class="underlinje">
      <nav aria-label="Vilkår"><a href="/personvern.html">Personvern</a><a href="/vilkar.html">Vilkår</a><a href="#" data-consent-withdraw>Informasjonskapsler</a></nav>
      ${valg.sprakvelger || ''}
    </div>
    <div class="underlinje">
      <span class="laget">© 2026 Matlyst. Laget i Norge <svg class="flagg" viewBox="0 0 22 16" role="img" aria-label="Norsk flagg"><rect width="22" height="16" fill="#BA0C2F"/><path d="M0 8h22M8 0v16" stroke="#fff" stroke-width="4"/><path d="M0 8h22M8 0v16" stroke="#00205B" stroke-width="2"/></svg></span>
      <span class="epost">hei@matlyst-app.no</span>
    </div>
  </div>
</footer>`;
}

export function nedlasting(sprak) {
  sjekkSprak(sprak);
  return `<div class="fast" id="fast" inert><a class="knapp" href="/app" data-hent="fast">Last ned gratis</a></div>
<dialog class="hent" id="hent" aria-labelledby="hentTittel">
  <div class="hentinn">
    <button type="button" class="lukk" aria-label="Lukk"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
    <div class="qr"><img src="/images/forside/qr-app.svg" width="176" height="176" alt="QR-kode til matlyst-app.no/app" loading="lazy"></div>
    <h2 id="hentTittel">Skann med telefonen</h2>
    <p>Kameraet tar deg til riktig butikk, enten du har iPhone eller Android.</p>
    <div class="butikker"><a href="https://apps.apple.com/no/app/matlyst/id6762563515" target="_blank" rel="noopener">App Store</a><a href="https://play.google.com/store/apps/details?id=app.matlyst" target="_blank" rel="noopener">Google Play</a></div>
  </div>
</dialog>`;
}

export function samtykke(sprak) {
  sjekkSprak(sprak);
  return `<div class="cookie" id="cookie" hidden>
  <h3>Vi bruker informasjonskapsler</h3>
  <p>Vi måler hva som fungerer, slik at vi kan forbedre Matlyst. Du bestemmer. Les mer i <a href="/personvern.html">personvernerklæringen</a>.</p>
  <div class="cookie-actions">
    <button class="ck-btn ck-accept" id="ck-accept" type="button">Godta</button>
    <button class="ck-btn ck-reject" id="ck-reject" type="button">Bare nødvendige</button>
  </div>
</div>`;
}
