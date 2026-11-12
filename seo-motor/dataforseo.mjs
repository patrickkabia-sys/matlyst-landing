const LAND = {
  nor: { locationCode: 2578, languageCode: 'no' },
  swe: { locationCode: 2752, languageCode: 'sv' },
  dnk: { locationCode: 2208, languageCode: 'da' },
  usa: { locationCode: 2840, languageCode: 'en' },
};

export class TakNådd extends Error {
  constructor() {
    super('dataforseo: tak nådd');
    this.name = 'TakNådd';
  }
}

export async function hentDataForSeo({ login, passord, frø, land, tak }) {
  const landvalg = LAND[land];
  const resultater = [];
  let foresporsler = 0;

  for (const sokeord of frø) {
    if (foresporsler >= tak) throw new TakNådd();
    foresporsler += 1;

    const svar = await fetch(
      'https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live',
      {
        method: 'POST',
        headers: {
          authorization: `Basic ${Buffer.from(`${login}:${passord}`).toString('base64')}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify([{
          keyword: sokeord,
          location_code: landvalg.locationCode,
          language_code: landvalg.languageCode,
          include_seed_keyword: true,
        }]),
      },
    );
    if (!svar.ok) throw new Error(`dataforseo: http ${svar.status}`);

    const data = await svar.json();
    if (data.status_code !== 20_000) {
      throw new Error(`dataforseo: ${data.status_message ?? data.status_code}`);
    }
    for (const oppgave of data.tasks ?? []) {
      if (oppgave.status_code !== 20_000) {
        throw new Error(`dataforseo: ${oppgave.status_message ?? oppgave.status_code}`);
      }
    }
    const elementer = data.tasks?.flatMap((oppgave) =>
      oppgave.result?.flatMap((resultat) => resultat.items ?? []) ?? []) ?? [];
    for (const element of elementer) {
      resultater.push({
        sokeord: element.keyword,
        land,
        volum: element.keyword_info?.search_volume ?? 0,
        vanskelighet: element.keyword_properties?.keyword_difficulty ?? 0,
      });
    }
  }

  return resultater;
}
