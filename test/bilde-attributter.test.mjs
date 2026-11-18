import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { MERKER, settDimensjoner } from '../scripts/bilde-attributter.mjs';

test('merker uten mål får width og height', () => {
  const ut = settDimensjoner('<img src="/images/appstore-badge.svg" alt="Download">');
  assert.match(ut, /width="120" height="40"/u);
  assert.match(settDimensjoner("<img alt='x' src='/images/googleplay-badge-en.png'>"), /width="134" height="40"/u);
});

test('idempotent og rører ikke andre bilder eller merker som har mål', () => {
  const med = '<img src="/images/appstore-badge.svg" width="104" height="40" alt="x">';
  assert.equal(settDimensjoner(med), med);
  const annet = '<img src="/images/hjem.jpg" alt="x">';
  assert.equal(settDimensjoner(annet), annet);
  const en = settDimensjoner('<img src="/images/appstore-badge.svg" alt="x">');
  assert.equal(settDimensjoner(en), en);
});

test('forholdet i dimensjonene stemmer med Google Play-filen (564 x 168)', () => {
  const [b, h] = MERKER['/images/googleplay-badge-en.png'];
  assert.ok(Math.abs(b / h - 564 / 168) < 0.05);
});

test('alle merker på alle sider har width og height', () => {
  const rot = new URL('..', import.meta.url).pathname;
  const mangler = [];
  const gaa = (mappe) => {
    for (const d of readdirSync(mappe, { withFileTypes: true })) {
      if (d.isDirectory()) { if (!['node_modules', '.git', 'test-results', 'playwright-report'].includes(d.name)) gaa(`${mappe}/${d.name}`); continue; }
      if (!d.name.endsWith('.html')) continue;
      const html = readFileSync(`${mappe}/${d.name}`, 'utf8');
      for (const m of html.matchAll(/<img\b[^>]*(?:appstore-badge|googleplay-badge)[^>]*>/giu)) {
        if (!/\swidth=/iu.test(m[0]) || !/\sheight=/iu.test(m[0])) mangler.push(`${mappe.replace(rot, '')}/${d.name}`);
      }
    }
  };
  gaa(rot.replace(/\/$/u, ''));
  assert.deepEqual([...new Set(mangler)], []);
});
