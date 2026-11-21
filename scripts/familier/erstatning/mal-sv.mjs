// Malen för familjen «erstatning» (sv): samlingssida (/sv/ersatta/) och en sida per vara, skrivna från data.sv.json och tekst-sv.mjs.
// Själva byggandet är gemensamt för de svenska familjerna (../mal-sv-felles.mjs). Mängderna är hämtade från svenska källor (KronJäst, Kungsörnen, Dansukker, Svenska Ägg), inte översatta.
import { lagMal } from '../mal-sv-felles.mjs';
import { TEKST, nav } from './tekst-sv.mjs';

export const ROT = '/sv/ersatta/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Ersätta ingredienser', alleTekst: 'Ersätta ingredienser: alla varor', cta: 'Se vad du kan laga med det du har i Matlyst', TEKST, nav,
  // «1 dl», «1 msk» och «1 tsk» i tabellernas första kolumn är måttenheterna källan använder, inte en siffra från en källa.
  ekstraTall: () => ['1'],
  app: [['Se vad du har i skafferiet', 'Lägg in det du har hemma i skafferiet i Matlyst, så ser du vad du kan laga innan du handlar.'], ['Fråga Matlyst om en ersättning', 'Öppna ett recept i appen och fråga Matlyst vad du kan använda i stället. Funktionen är Pro, använder AI och har en månadskvot, så läs svaret innan du börjar.']],
});
