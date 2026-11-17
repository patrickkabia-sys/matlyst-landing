const ENDEPUNKT = 'https://suggestqueries.google.com/complete/search';

export class ForslagFeil extends Error {
  constructor(httpStatus = null) {
    super('forslag-feil');
    this.name = 'ForslagFeil';
    this.kode = 'forslag-feil';
    this.httpStatus = httpStatus;
  }
}

export async function hentForslag({ sprak, språkfil, hent }) {
  const rå = [];
  const kandidater = [];
  const lokale = språkfil.forslagslokale;

  for (const frø of språkfil['forslagsfrø']) {
    const url = new URL(ENDEPUNKT);
    url.searchParams.set('client', 'firefox');
    url.searchParams.set('hl', lokale.hl);
    url.searchParams.set('gl', lokale.gl);
    url.searchParams.set('q', frø.tekst);
    let svar;
    try {
      svar = await hent(url.href);
    } catch {
      throw new ForslagFeil(null);
    }
    if (svar?.status !== 200 || !Array.isArray(svar.data) || !Array.isArray(svar.data[1])) {
      throw new ForslagFeil(svar?.status ?? null);
    }
    const forslag = svar.data[1].filter((verdi) => typeof verdi === 'string' && verdi.trim());
    rå.push({ frø: frø.tekst, forslag });
    for (const sokeord of forslag) {
      kandidater.push({
        sokeord,
        sprak,
        frø,
        forslagAntall: forslag.length,
        kilde: 'forslag',
      });
    }
  }
  return { rå, kandidater };
}
