import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const rot = join(fileURLToPath(new URL('..', import.meta.url)), '..');
export const bildemappe = process.env.MATLYST_PROTOTYPE_BILDER || join(homedir(), 'matlyst-privat/seo-matlyst/2026-11-18/nettfilm');
export const harPrototypebilder = () => ['mat/butter.webp', 'folk', 'img'].every((sti) => existsSync(join(bildemappe, sti)));
export const seksjoner = ['.hero', '.kokebok', '.spor', '.del', '.pris', '.ofte', '.bunn', 'footer.under'];
export async function visPrototype(page) {
  const kilde = readFileSync(join(rot, 'docs/superpowers/prototyper/2026-11-18-forside.html'), 'utf8');
  const [hode, innhold] = kilde.split('</style>');
  const html = '<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + hode.replace(/<link rel="stylesheet" href="https:[^>]+>/, '<link rel="stylesheet" href="/tokens.css">') + '</style></head><body>' + innhold + '</body></html>';
  await page.route('**/t9-prototype/**', async (route) => {
    const sti = new URL(route.request().url()).pathname.slice('/t9-prototype/'.length);
    if (!sti) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
    const fil = join(bildemappe, sti);
    if (existsSync(fil)) return route.fulfill({ path: fil });
    return route.abort();
  });
  await page.goto('/t9-prototype/');
}
export async function lesTekst(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.hero h1').waitFor({ state: 'visible' });
  // Også svaravsnittene skal være synlige når innerText leses.
  await page.locator('.ofte details').evaluateAll((els) => els.forEach((el) => { el.open = true; }));
  const tekst = {};
  for (const velger of seksjoner) tekst[velger] = (await page.locator(velger).innerText()).split('\n').map((linje) => linje.trim()).filter(Boolean);
  return tekst;
}
