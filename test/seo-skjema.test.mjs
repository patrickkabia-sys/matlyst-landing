import test from 'node:test';
import assert from 'node:assert/strict';

import { ArtikkelSkjema, lesData } from '../seo-motor/skjema.mjs';

const gyldigArtikkel = {
  sprak: 'nb',
  emne_id: 'rester-nb',
  slug: 'slik-bruker-du-rester',
  tittel: 'Slik bruker du restene til middag',
  meta: 'Få enkle og praktiske tips til å bruke middagsrester i nye retter, planlegge ukemenyen og kaste mindre mat hjemme i hverdagen.',
  ingress: 'Middagsrester kan bli et nytt måltid når du kjøler dem raskt ned og planlegger hvordan de skal brukes.',
  seksjoner: [
    { type: 'avsnitt', overskrift: 'Start med det du har', tekst: 'Se gjennom restene og velg hva som bør brukes først.' },
    { type: 'tabell', overskrift: 'Fra rest til rett', rader: [['Kokt ris', 'Stekt ris']] },
    { type: 'liste', overskrift: 'Planlegg neste måltid', punkter: ['Merk beholderen', 'Sett retten i ukemenyen'] },
  ],
  faq: [
    { sporsmal: 'Hva kan jeg lage av kokt ris?', svar: 'Bruk risen i stekt ris eller en enkel bolle.' },
    { sporsmal: 'Hvordan husker jeg restene?', svar: 'Legg dem inn i ukemenyen før du setter dem kaldt.' },
    { sporsmal: 'Kan jeg samle restene i handlelista?', svar: 'Skriv bare opp det som mangler til den nye retten.' },
  ],
  pastander: [{ tekst: 'Kjøl restene raskt ned.', kilde_id: 'K1' }],
  appkobling: 'bruk-det-jeg-har',
  tagger: ['rester', 'ukemeny'],
};

test('ArtikkelSkjema godtar gyldig artikkel', () => {
  assert.equal(ArtikkelSkjema.safeParse(gyldigArtikkel).success, true);
});

test('ArtikkelSkjema avviser ukjent appkobling', () => {
  const artikkel = { ...gyldigArtikkel, appkobling: 'måltidsplan' };

  assert.equal(ArtikkelSkjema.safeParse(artikkel).success, false);
});

test('alle fire språkfiler har samme nøkler i appCta', () => {
  const nokler = ['nb', 'sv', 'da', 'en'].map((sprak) =>
    Object.keys(lesData(`sprak/${sprak}.json`).appCta).sort(),
  );

  assert.deepEqual(nokler, nokler.map(() => nokler[0]));
});

test('en.json har britiskeOrd med minst tick, the shop, expiry', () => {
  const { britiskeOrd } = lesData('sprak/en.json');

  assert.ok(['tick', 'the shop', 'expiry'].every((ord) => britiskeOrd.includes(ord)));
});

test('forbudt.json inneholder matprat.no, godt.no, nom.no', () => {
  const forbudt = JSON.stringify(lesData('forbudt.json'));

  assert.ok(['matprat.no', 'godt.no', 'nom.no'].every((domene) => forbudt.includes(domene)));
});
