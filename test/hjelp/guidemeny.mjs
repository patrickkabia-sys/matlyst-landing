import assert from 'node:assert/strict';

export function krevGuidemeny(html, guider, viaHub, lesHub) {
  const nav = html.match(/<section\b[^>]*class="bunn"[^>]*>[\s\S]*?<\/section>/u)?.[0];
  assert.ok(nav, 'forsiden mangler hyllemenyen');
  const lenker = new Set([...nav.matchAll(/href="([^"]+)"/gu)].map((m) => m[1]));
  for (const [guide, hub] of Object.entries(viaHub)) {
    assert.ok(guider.some(({ sti }) => sti === guide), `VIA_HUB har en ukjent guide: ${guide}`);
    assert.ok(!lenker.has(guide), `VIA_HUB trengs ikke lenger for ${guide}`);
    assert.ok(lenker.has(hub), `hyllemenyen mangler hubben ${hub} for ${guide}`);
  }
  const mangler = [];
  for (const { sti } of guider) {
    if (lenker.has(sti)) continue;
    const hub = viaHub[sti];
    if (!hub) { mangler.push(`${sti}: ingen direkte lenke eller VIA_HUB`); continue; }
    // Relatert-blokken er den kuraterte hub-til-eike-grafen i seo-data/lenkekart.json.
    // test/lenker-sett.test.mjs krever allerede alle eikene; bare guidebunnen utelates.
    const innhold = lesHub(hub)
      .replace(/<!-- guider:bunn -->[\s\S]*?<!-- \/guider:bunn -->/gu, '')
      .match(/<main\b[^>]*>[\s\S]*?<\/main>/u)?.[0];
    assert.ok(innhold, `${hub} mangler hovedinnhold`);
    if (!innhold.includes(`href="${sti}"`)) mangler.push(`${sti}: mangler i hovedinnholdet på ${hub}`);
  }
  assert.deepEqual(mangler, [], 'guider som ikke nås gjennom hyllemenyen');
}
