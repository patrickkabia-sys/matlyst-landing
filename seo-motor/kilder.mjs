export async function hentUtdrag(emne, kilder, hent) {
  const emneord = new Set(
    `${emne.sokeord} ${(emne.tagger ?? []).join(' ')}`
      .toLocaleLowerCase()
      .match(/\p{L}[\p{L}\p{N}-]{2,}/gu) ?? [],
  );
  const valgteKilder = (kilder[emne.sprak] ?? [])
    .filter((kilde) => (kilde.tagger ?? []).some((tagg) => emne.tagger.includes(tagg)))
    .slice(0, 3);
  const utdrag = [];

  for (const kilde of valgteKilder) {
    const svar = await hent(kilde.url);
    if (svar.status !== 200 || !svar.tekst?.trim()) continue;

    const avsnitt = svar.tekst
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

    for (const tekst of avsnitt) {
      const ord = tekst.toLocaleLowerCase().match(/\p{L}[\p{L}\p{N}-]{2,}/gu) ?? [];
      if (!ord.some((ordet) => emneord.has(ordet))) continue;
      utdrag.push({ url: kilde.url, tekst: tekst.slice(0, 600) });
      if (utdrag.length === 12) break;
    }
    if (utdrag.length === 12) break;
  }

  return utdrag.map((utdraget, indeks) => ({
    id: `K${indeks + 1}`,
    ...utdraget,
  }));
}
