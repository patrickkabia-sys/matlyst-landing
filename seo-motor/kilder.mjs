function htmlTilAvsnitt(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ' ')
    .replace(/<\/(?:p|div|li|h[1-6]|section|article)>/giu, '\n')
    .replace(/<br\s*\/?>/giu, '\n')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/&nbsp;/giu, ' ')
    .replace(/&amp;/giu, '&')
    .replace(/&lt;/giu, '<')
    .replace(/&gt;/giu, '>')
    .replace(/&quot;/giu, '"')
    .replace(/&#(?:39|x27);/giu, "'")
    .split(/\n+/u)
    .map((tekst) => tekst.replace(/\s+/gu, ' ').trim())
    .filter(Boolean);
}

export async function hentBestillingskilder(bestilling, kilder, hent) {
  const katalog = kilder[bestilling.sprak] ?? [];
  const tillatte = new Set(bestilling.kilde_ider);
  const valgte = katalog.filter((kilde) => tillatte.has(kilde.id));
  if (valgte.length !== tillatte.size) return [];
  const emneord = new Set(
    `${bestilling.emne} ${bestilling.vinkel}`
      .toLocaleLowerCase()
      .match(/\p{L}[\p{L}\p{N}-]{2,}/gu) ?? [],
  );
  const resultat = [];
  for (const kilde of valgte) {
    const svar = await hent(kilde.url);
    if (svar.status !== 200 || !svar.tekst?.trim()) continue;
    const avsnitt = htmlTilAvsnitt(svar.tekst);
    const relevant = avsnitt.find((tekst) => {
      const ordene = tekst.toLocaleLowerCase().match(/\p{L}[\p{L}\p{N}-]{2,}/gu) ?? [];
      return ordene.some((verdi) => emneord.has(verdi));
    }) ?? avsnitt[0];
    if (!relevant) continue;
    resultat.push({ id: kilde.id, url: kilde.url, tekst: relevant.slice(0, 600) });
  }
  return resultat;
}
