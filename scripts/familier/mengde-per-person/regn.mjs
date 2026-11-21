// Regnereglene for «mengde per person»: ÉN kilde for tallene i tabellene, i kalkulatorens startsvar og i kalkulatorkortet.
// site.js (blokken mellom «porsjon:start» og «porsjon:slutt») har en kopi av delTekst og totalt som JavaScript uten moduler;
// test/mengde-per-person.test.mjs kjører den kopien mot funksjonene her og feller drift.
// Tallskrivemåten er den samme overalt: hele gram under 1 kg, ellers kg med opptil to desimaler, og dl under 1 liter, ellers liter.

export const PERSONER = Object.freeze([2, 4, 6, 8, 10, 12]);
export const START = Object.freeze({ voksne: 4, barn: 0 });
// Enhetene vi regner i. `stor` tar over fra og med `grense` (målt i den lille enheten, etter avrunding).
export const ENHETER = Object.freeze({
  g: { stor: 'kg', faktor: 1000, desimaler: [0, 2] },
  dl: { stor: 'liter', faktor: 10, desimaler: [2, 2] },
});

const rund = (n, d) => Math.round(Number((n * 10 ** d).toPrecision(12))) / 10 ** d;
const pent = (n, d) => {
  const t = rund(n, d).toFixed(d);
  return (t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t).replace('.', ',');
};

/** { tall, enhet } for en mengde i g eller dl. */
export function del(n, enhet) {
  const e = ENHETER[enhet];
  const liten = rund(n, e.desimaler[0]);
  if (liten >= e.faktor) return { tall: pent(n / e.faktor, e.desimaler[1]), enhet: e.stor };
  return { tall: pent(n, e.desimaler[0]), enhet };
}

/** «60 g», «1,2 kg», «60 til 100 g», «800 g til 1,2 kg». */
export function delTekst(min, maks, enhet, til = 'til') {
  const a = del(min, enhet);
  if (maks === min) return `${a.tall} ${a.enhet}`;
  const b = del(maks, enhet);
  return a.enhet === b.enhet ? `${a.tall} ${til} ${b.tall} ${b.enhet}` : `${a.tall} ${a.enhet} ${til} ${b.tall} ${b.enhet}`;
}

/** Mengden for voksne og barn: hvert barn teller `barnFaktor` av en voksen. */
export const totalt = (perPerson, voksne, barn, barnFaktor) => perPerson * (voksne + barnFaktor * barn);

/** Alle delene (for eksempel gram og dl) for en variant, som tekster. `variant.deler`: [{ min, maks, enhet }]. */
export const variantDeler = (variant, voksne, barn, barnFaktor, til = 'til') => variant.deler.map((d) => delTekst(totalt(d.min, voksne, barn, barnFaktor), totalt(d.maks, voksne, barn, barnFaktor), d.enhet, til));

export const ordVoksne = (n, t) => (n === 1 ? t.voksen : t.voksne);

/** Setningen under kalkulatoren: «Ris: 4 voksne og 2 barn trenger 360 g eller 6 dl.» */
export function setning(variant, voksne, barn, barnFaktor, t) {
  const hvem = `${voksne} ${ordVoksne(voksne, t)}${barn > 0 ? ` ${t.og} ${barn} ${barn === 1 && t.ettBarn ? t.ettBarn : t.barn}` : ''}`;
  return `${variant.navn}: ${hvem} ${t.trenger} ${variantDeler(variant, voksne, barn, barnFaktor, t.til).join(` ${t.eller} `)}.`;
}
