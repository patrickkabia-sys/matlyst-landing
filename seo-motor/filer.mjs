import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function lesJson(fil, reserve) {
  return existsSync(fil) ? JSON.parse(readFileSync(fil, 'utf8')) : reserve;
}

export function skrivJson(fil, data) {
  mkdirSync(dirname(fileURLToPath(fil)), { recursive: true });
  writeFileSync(fil, `${JSON.stringify(data, null, 2)}\n`);
}

export function datafil(rot, navn) {
  return new URL(`seo-data/${navn}`, rot);
}

export function lesLogg(rot) {
  const mappe = datafil(rot, 'logg/');
  if (!existsSync(mappe)) return [];
  return readdirSync(mappe)
    .filter((navn) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(navn))
    .sort()
    .map((navn) => lesJson(new URL(navn, mappe), null))
    .filter(Boolean);
}
