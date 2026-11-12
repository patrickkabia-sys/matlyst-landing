import test from 'node:test';
import assert from 'node:assert/strict';

import { z } from 'zod';

import {
  KallFeil,
  fyllMal,
  kallStrukturert,
  lagKlient,
} from '../seo-motor/claude.mjs';

const skjema = z.object({ svar: z.string() });
const grunnsvar = {
  id: 'msg_test',
  type: 'message',
  role: 'assistant',
  model: 'claude-haiku-5-5',
  content: [{ type: 'text', text: '{"svar":"klart"}', citations: null }],
  parsed_output: { svar: 'klart' },
  stop_reason: 'end_turn',
  stop_sequence: null,
  stop_details: null,
  usage: {
    cache_creation: null,
    cache_creation_input_tokens: 1_000_000,
    cache_read_input_tokens: 1_000_000,
    inference_geo: null,
    input_tokens: 1_000_000,
    output_tokens: 1_000_000,
    output_tokens_details: null,
    server_tool_use: null,
    service_tier: 'standard',
    speed: 'standard',
  },
};

function falskKlient(svar = grunnsvar) {
  const kall = [];
  return {
    kall,
    klient: {
      messages: {
        parse: async (argumenter) => {
          kall.push(argumenter);
          return svar;
        },
      },
    },
  };
}

test('returnerer data og kostnad', async () => {
  const { klient } = falskKlient();

  const resultat = await kallStrukturert(klient, {
    instruks: 'Skriv strukturert.',
    innhold: 'Svar kort.',
    skjema,
    effort: 'low',
  });

  assert.deepEqual(resultat, {
    data: { svar: 'klart' },
    usage: {
      input: 1_000_000,
      output: 1_000_000,
      cacheLes: 1_000_000,
      cacheSkriv: 1_000_000,
    },
    kostnadUsd: 0.735,
  });
});

test('refusal gir KallFeil', async () => {
  const { klient } = falskKlient({ ...grunnsvar, stop_reason: 'refusal' });

  await assert.rejects(
    kallStrukturert(klient, {
      instruks: 'Instruks',
      innhold: 'Innhold',
      skjema,
      effort: 'low',
    }),
    (feil) => feil instanceof KallFeil && feil.grunn === 'refusal',
  );
});

test('null parsed_output gir KallFeil', async () => {
  const { klient } = falskKlient({ ...grunnsvar, parsed_output: null });

  await assert.rejects(
    kallStrukturert(klient, {
      instruks: 'Instruks',
      innhold: 'Innhold',
      skjema,
      effort: 'medium',
    }),
    (feil) => feil instanceof KallFeil && feil.grunn === 'mangler strukturert svar',
  );
});

test('fyllMal kaster ved manglende verdi', () => {
  assert.throws(
    () => fyllMal('Emne: {{emne}}\nUtdrag: {{utdrag}}', { emne: 'rester' }),
    /utdrag/,
  );
});

test('modell er claude-haiku-5-5', async () => {
  const { klient, kall } = falskKlient();

  await kallStrukturert(klient, {
    instruks: 'Skriv strukturert.',
    innhold: 'Svar kort.',
    skjema,
    effort: 'medium',
    maxTokens: 2048,
  });

  assert.equal(kall.length, 1);
  assert.equal(kall[0].model, 'claude-haiku-5-5');
  assert.equal(kall[0].max_tokens, 2048);
  assert.deepEqual(kall[0].system, [{
    type: 'text',
    text: 'Skriv strukturert.',
    cache_control: { type: 'ephemeral' },
  }]);
  assert.deepEqual(kall[0].messages, [{ role: 'user', content: 'Svar kort.' }]);
  assert.equal(kall[0].output_config.effort, 'medium');
  assert.equal(kall[0].output_config.format.type, 'json_schema');
});

test('lagKlient slår av retries', () => {
  const klient = lagKlient({ apiKey: 'testnøkkel' });

  assert.equal(klient.maxRetries, 0);
});
