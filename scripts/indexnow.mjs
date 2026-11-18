// IndexNow: varsler Bing, Yandex og andre om nye eller endrede sider.
// Kjører som tørrkjøring (skriver bare listen). Sending krever --send og skal først skje etter at
// sidene er publisert og Patrick har sagt ja. Nøkkelfila ligger i rota og heter <nøkkel>.txt.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'matlyst-app.no';
const ENDEPUNKT = 'https://api.indexnow.org/IndexNow';

export function finnNokkel(mappe) {
  const filer = readdirSync(mappe).filter((f) => /^[0-9a-f]{32}\.txt$/u.test(f));
  if (filer.length !== 1) throw new Error(`Forventet én nøkkelfil, fant ${filer.length}`);
  const nokkel = filer[0].slice(0, -4);
  if (readFileSync(join(mappe, filer[0]), 'utf8').trim() !== nokkel) throw new Error('Nøkkelfila må inneholde nøkkelen');
  return nokkel;
}

export function urlerFraSitemap(xml, host = HOST) {
  return [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/gu)].map((m) => m[1]).filter((u) => new URL(u).host === host);
}

export function lagNutlast({ nokkel, urler, host = HOST }) {
  if (!urler.length) throw new Error('Ingen URL-er');
  if (urler.length > 10000) throw new Error('Maks 10 000 URL-er per kall');
  return { host, key: nokkel, keyLocation: `https://${host}/${nokkel}.txt`, urlList: [...new Set(urler)] };
}

export async function send(nyttlast, hent = fetch) {
  const svar = await hent(ENDEPUNKT, { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(nyttlast) });
  if (![200, 202].includes(svar.status)) throw new Error(`IndexNow svarte ${svar.status}`);
  return svar.status;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rot = new URL('../', import.meta.url);
  const filer = process.argv.slice(2).filter((a) => a.endsWith('.xml'));
  const urler = (filer.length ? filer : ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml'])
    .flatMap((f) => urlerFraSitemap(readFileSync(new URL(f, rot), 'utf8')));
  const nyttlast = lagNutlast({ nokkel: finnNokkel(rot.pathname), urler });
  if (process.argv.includes('--send')) console.log('Sendt, status', await send(nyttlast));
  else console.log(`Tørrkjøring: ${nyttlast.urlList.length} URL-er, nøkkelfil ${nyttlast.keyLocation}. Bruk --send etter publisering.`);
}
