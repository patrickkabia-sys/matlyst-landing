import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'

export class KallFeil extends Error {
  constructor(grunn) {
    super(grunn)
    this.name = 'KallFeil'
    this.grunn = grunn
  }
}

export function lagKlient({ apiKey }) {
  return new Anthropic({ apiKey, maxRetries: 0 })
}

export async function kallStrukturert(
  klient,
  { instruks, innhold, skjema, effort, maxTokens },
) {
  const svar = await klient.messages.parse({
    model: 'claude-haiku-5-5',
    max_tokens: maxTokens ?? 16000,
    system: [{
      type: 'text',
      text: instruks,
      cache_control: { type: 'ephemeral' },
    }],
    messages: [{ role: 'user', content: innhold }],
    output_config: {
      effort,
      format: zodOutputFormat(skjema),
    },
  })

  if (svar.stop_reason === 'refusal' || svar.stop_reason === 'max_tokens') {
    throw new KallFeil(svar.stop_reason)
  }
  if (svar.parsed_output === null) {
    throw new KallFeil('mangler strukturert svar')
  }

  const usage = {
    input: svar.usage.input_tokens,
    output: svar.usage.output_tokens,
    cacheLes: svar.usage.cache_read_input_tokens ?? 0,
  }
  const kostnadUsd = (
    usage.input * 0.10
    + usage.output * 0.50
    + usage.cacheLes * 0.01
  ) / 1_000_000

  return { data: svar.parsed_output, usage, kostnadUsd }
}

export function fyllMal(mal, verdier) {
  return mal.replace(/\{\{([^{}]+)\}\}/gu, (plassholder, navn) => {
    if (!Object.hasOwn(verdier, navn)) {
      throw new Error(`Mangler verdi for ${plassholder}`)
    }
    return verdier[navn]
  })
}
