// Språknøytral malkode for familien «dl til gram»: tallreglene, HTML-escaping og kalkulatorkortets skjelett.
// Både mal-nb.mjs og den engelske malen bruker den. Det som er språkavhengig (enhetsnavn, etiketter, setninger, datoer) står i malene.
// Tallreglene er de samme som i kalkulatorkortet (site.js, svarTekst), låst av test/playwright/kalk-tabell.spec.mjs.

const tegn = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const esc = (t) => String(t).replace(/[&<>"]/gu, (c) => tegn[c]);

/** Alle tall i en tekst, slik de står (desimaltegn punktum eller komma). */
export const tallI = (tekst) => String(tekst ?? '').match(/\d+(?:[.,]\d+)?/gu) ?? [];

/** Tallet med `sifre` gjeldende sifre, uten overflødige nuller. Halve runder opp også når flyttallet ligger like under. `komma` velger desimaltegnet. */
export const sigTekst = (n, sifre, { komma = false } = {}) => {
  const d = Math.min(100, Math.max(0, sifre - 1 - Math.floor(Math.log10(Math.abs(n)))));
  const t = (Math.round(Number((n * 10 ** d).toPrecision(12))) / 10 ** d).toFixed(d);
  const ren = t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t;
  return komma ? ren.replace('.', ',') : ren;
};
/** Gram: hele gram fra 10 g (halve runder opp), under 10 g to gjeldende sifre (4.6, 2.8, 0.52). */
export const gramTekst = (n, { komma = false } = {}) => (n === 0 ? '0' : Math.abs(n) >= 10 ? String(Math.round(Number(n.toPrecision(12)))) : sigTekst(n, 2, { komma }));
/** Alle andre enheter: 100 og over som heltall, 10 til 100 med tre gjeldende sifre, under 10 med to. */
export const mengdeTekst = (n, { komma = false } = {}) => (n === 0 ? '0' : Math.abs(n) >= 100 ? String(Math.round(Number(n.toPrecision(12)))) : sigTekst(n, Math.abs(n) >= 10 ? 3 : 2, { komma }));

export const PIL = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>';
export const BYTT = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"></path></svg>';

const valg = (enheter, valgt) => enheter.map(([v, t]) => `<option value="${v}"${v === valgt ? ' selected' : ''}>${t}</option>`).join('');

/**
 * Kalkulatorkortet (HTML-kontrakten fra designspec 16.8) uten språk.
 * `etiketter`: { aria, mengde, fra, til, bytt, vanlige }. `enheter`: [[verdi, tekst]]. `fra` og `til`: valgt enhet.
 * `data`: objektet som blir script.kalk-data. `start`: { mengde, svar, setning, hurtig: [[verdi, tekst]] }, det statiske eksempelet uten JavaScript
 * (setning og hurtigtekster er ferdig escapet). `vareHtml`: raden øverst i kortet (fast vare eller varevalg). `id` er valgfritt.
 */
export function kalkSkjelett({ id, etiketter, enheter, fra, til, data, start, vareHtml }) {
  const json = JSON.stringify(data);
  const hurtig = start.hurtig.map(([v, t]) => `<button type="button" data-v="${v}">${t}</button>`).join('');
  return `<form class="kalk"${id ? ` id="${id}"` : ''} data-kalk="volumvekt" onsubmit="return false" aria-label="${esc(etiketter.aria)}">
  ${vareHtml}
  <div class="kalkrad">
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">${esc(etiketter.mengde)}</span><input data-felt="mengde" type="text" inputmode="decimal" autocomplete="off" value="${esc(start.mengde)}"></label>
      <label class="kalkenhet"><span class="skjult">${esc(etiketter.fra)}</span><select data-felt="fra">${valg(enheter, fra)}</select>${PIL}</label>
    </div>
    <button type="button" class="bytt" data-felt="bytt" aria-label="${esc(etiketter.bytt)}">${BYTT}</button>
    <div class="kalkside til">
      <output class="kalktall" data-felt="svar">${start.svar}</output>
      <label class="kalkenhet"><span class="skjult">${esc(etiketter.til)}</span><select data-felt="til">${valg(enheter, til)}</select>${PIL}</label>
    </div>
  </div>
  <div class="hurtig" role="group" aria-label="${esc(etiketter.vanlige)}">${hurtig}</div>
  <p class="kalksetning" data-felt="setning" role="status" aria-live="polite">${start.setning}</p>
  <script type="application/json" class="kalk-data">${json.replaceAll('<', '\\u003c')}</script>
</form>`;
}
