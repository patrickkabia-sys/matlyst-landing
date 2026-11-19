export function overskrifter(html) {
  return [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gu)]
    .map(([, tagg, tekst]) => `${tagg}:${tekst.replace(/<[^>]*>/gu, '').replace(/\s+/gu, ' ').trim()}`);
}
