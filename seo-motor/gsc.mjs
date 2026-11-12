import { GoogleAuth } from 'google-auth-library';

export async function hentGsc({ tjenestekonto, nettsted, fra, til }) {
  const credentials = typeof tjenestekonto === 'string'
    ? JSON.parse(tjenestekonto)
    : tjenestekonto;
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const klient = await auth.getClient();
  const svar = await klient.request({
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(nettsted)}/searchAnalytics/query`,
    method: 'POST',
    data: {
      startDate: fra,
      endDate: til,
      dimensions: ['query', 'country'],
      rowLimit: 25_000,
    },
  });

  return (svar.data.rows ?? [])
    .filter((rad) => rad.keys?.length >= 2)
    .map((rad) => ({
      sokeord: rad.keys[0],
      land: rad.keys[1],
      visninger: rad.impressions,
      plassering: rad.position,
    }));
}
