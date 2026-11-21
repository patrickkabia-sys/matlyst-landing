// Malen for familien «steketid» (nb): samleside og én side per rett, skrevet fra data.nb.json og tekst-nb.mjs.
// Kalkulatoren på kalkunsiden bruker kalkulatorkortet i site.js: faktoren (minutter per kilo) står i skjemaets data, fra datafila.
import { kalkTid, lagMal } from './mal-felles.mjs';
import { TEKST, nav } from './tekst-nb.mjs';

export const ROT = '/steketid/';
// Kokemodus og ukemeny: app-bevis.mjs legger skjermbilde eller video under disse overskriftene (reglene «kokemodus» og «plan»).
const APP = '<h2>Følg tiden med tidtaker i kokemodus</h2><p>I Matlyst blir stegene en sjekkliste, og kokemodus foreslår tidtakere.</p>\n<h2>Planlegg middagen i ukemenyen</h2><p>Legg oppskriften på dagen du skal lage den, så ser du uka samlet.</p>';

/** Vektene kalkulatoren tilbyr som hurtigvalg: fra og med til og med vekten i MatPrats tabell (hel kalkun), i hele kilo. */
const vekter = (rad) => {
  const fra = rad.tall['kg-tab-min'].verdi; const til = rad.tall['kg-tab-maks'].verdi;
  return Array.from({ length: til - fra + 1 }, (_, i) => fra + i);
};
const perKilo = (rad) => rad.tall['per-kilo'].verdi;

export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, navEkstra: '<div class="related"><h2>Les også</h2><ul><li><a href="/airfryer/">Airfryer: tid og temperatur for vanlig mat</a></li></ul></div>',
  eyebrowNavn: 'Steketid', alleTekst: 'Steketid for alle rettene', cta: 'Lag middagen steg for steg i Matlyst',
  stegTittel: 'Slik leser du tabellen', steg0: 'Finn retten', steg1: 'Tidene står i tabellen, med kilde.', app: APP, TEKST, nav,
  kalk: (rad, h) => kalkTid({ perKilo: perKilo(rad), ordKilde: `${h.k('mp-hel-kalkun')}: ${h.t('per-kilo')} ved ${h.t('ovn')}`, eksempelKg: rad.tall['ex-kg'].verdi, steg: vekter(rad).map(String) }),
  // Tallene i kalkulatoren som ikke er kildetall: enhetsfaktorer i skjemaets data, eksempelet i feilmeldingen, og vekt ganger faktor for hvert hurtigvalg.
  ekstraTall: (rad) => (rad.id === 'kalkun' ? ['0', '1', '60', '6,5', '30,0', '1,0', '60,0', ...vekter(rad).flatMap((kg) => [String(kg), String(kg * perKilo(rad))])] : []),
});
