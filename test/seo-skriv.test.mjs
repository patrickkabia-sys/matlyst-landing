import assert from 'node:assert/strict';
import test from 'node:test';

import { granskArtikkel } from '../seo-motor/gransk.mjs';
import { skrivArtikkel } from '../seo-motor/skriv.mjs';

const emne = {
  id: 'rester-nb',
  sprak: 'nb',
  sokeord: 'middag av rester',
  tagger: ['rester'],
};
const utdrag = [{
  id: 'K1',
  url: 'https://offentlig.example/rester',
  tekst: 'Rester kan brukes i en ny middag.',
}];
const sprakfil = {
  stemme: ['Skriv jordnært.'],
  unngå: ['fyllprosa'],
  typografi: ['Bruk komma som desimalskilletegn.'],
  appCta: {
    ukemeny: { tittel: 'Planlegg uka', tekst: 'Legg retten i ukemenyen.' },
  },
};
const artikkel = {
  sprak: 'sv',
  emne_id: 'feil-id',
  slug: 'Rømmegrøt på 10 min',
  tittel: 'Bruk restene til middag',
  meta: 'Se hvordan rester kan bli til en ny middag med enkel planlegging, trygg oppbevaring og råvarer du allerede har hjemme på kjøkkenet.',
  ingress: 'Rester kan bli en ny middag.',
  seksjoner: [
    { type: 'avsnitt', overskrift: 'Finn restene', tekst: 'Se hva du har.' },
    { type: 'avsnitt', overskrift: 'Velg en rett', tekst: 'Bruk restene først.' },
    { type: 'avsnitt', overskrift: 'Planlegg', tekst: 'Legg retten i ukemenyen.' },
  ],
  faq: [
    { sporsmal: 'Hva kan jeg bruke?', svar: 'Bruk restene.' },
    { sporsmal: 'Når?', svar: 'Planlegg neste middag.' },
    { sporsmal: 'Hvordan?', svar: 'Se hva du har.' },
  ],
  pastander: [{ tekst: 'Rester kan brukes i en ny middag.', kilde_id: 'K1' }],
  appkobling: 'ukemeny',
  tagger: ['rester'],
};

function falskKlient(parsedOutput) {
  const kall = [];
  return {
    kall,
    klient: {
      messages: {
        parse: async (argumenter) => {
          kall.push(argumenter);
          return {
            parsed_output: parsedOutput,
            stop_reason: 'end_turn',
            usage: {
              input_tokens: 100,
              output_tokens: 50,
              cache_read_input_tokens: 0,
              cache_creation_input_tokens: 0,
            },
          };
        },
      },
    },
  };
}

test('skribenten sender språkregler og utdrag i instruksen', async () => {
  const { klient, kall } = falskKlient(artikkel);

  await skrivArtikkel(klient, {
    emne,
    utdrag,
    sprakfil,
    mal: 'Regler: {{sprakregler}}\nEmne: {{emne}}\nUtdrag: {{utdrag}}\nApp: {{appkoblinger}}',
  });

  assert.equal(kall.length, 1);
  assert.match(kall[0].system[0].text, /Skriv jordnært\./u);
  assert.match(kall[0].system[0].text, /Rester kan brukes i en ny middag\./u);
  assert.equal(kall[0].output_config.effort, 'medium');
});

test('slug normaliseres', async () => {
  const { klient } = falskKlient(artikkel);

  const resultat = await skrivArtikkel(klient, {
    emne,
    utdrag,
    sprakfil,
    mal: '{{sprakregler}}{{emne}}{{utdrag}}{{appkoblinger}}',
  });

  assert.equal(resultat.artikkel.slug, 'rommegrot-pa-10-min');
  assert.equal(resultat.artikkel.sprak, 'nb');
  assert.equal(resultat.artikkel.emne_id, 'rester-nb');
});

test('gransker AVVIST gir godkjent=false med grunn', async () => {
  const { klient, kall } = falskKlient({
    beslutning: 'AVVIST',
    grunn: 'Påstanden støttes ikke av utdraget.',
  });

  const resultat = await granskArtikkel(klient, {
    artikkel,
    utdrag,
    sprakfil,
    mal: '{{sprakregler}}{{emne}}{{utdrag}}{{appkoblinger}}',
  });

  assert.deepEqual(resultat, {
    godkjent: false,
    grunn: 'Påstanden støttes ikke av utdraget.',
    kostnadUsd: 0.000035,
  });
  assert.equal(kall[0].output_config.effort, 'low');
});
