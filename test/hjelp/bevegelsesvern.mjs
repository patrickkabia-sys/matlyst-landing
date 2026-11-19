import assert from 'node:assert/strict';

export const utenKommentarer = (kilde) => kilde.replace(/\/\*[\s\S]*?\*\//gu, '').replace(/(^|[^:])\/\/.*$/gmu, '$1');

export function krevIngenBrukerpause(kilde, fil) {
  let kode = utenKommentarer(kilde);
  // Bare observerens anonyme tilbakekall får stoppe bevegelsen. Navngitte
  // hjelpefunksjoner beholdes i søket, også når en hendelse kaller dem indirekte.
  const start = /new\s+IntersectionObserver\(\s*\([^)]*\)\s*=>\s*\{/u;
  for (let treff; (treff = start.exec(kode));) {
    const fra = treff.index + treff[0].length;
    const tegn = /'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|[{}]/gu;
    tegn.lastIndex = fra;
    let dybde = 1, slutt;
    for (let del; (del = tegn.exec(kode));) {
      if (del[0] === '{') dybde++;
      if (del[0] === '}' && --dybde === 0) { slutt = tegn.lastIndex; break; }
    }
    assert.ok(slutt, `${fil}: fant ikke slutten av observeren`);
    assert.doesNotMatch(kode.slice(fra, slutt), /addEventListener|\bon\w+\s*=/u, `${fil}: hendelser skal ikke registreres inne i observeren`);
    kode = kode.slice(0, treff.index) + kode.slice(slutt);
  }
  assert.doesNotMatch(kode, /(?:\.\s*pause\s*\(|\[\s*['"]pause['"]\s*\]\s*\(|animationPlayState|animation-play-state)/u,
    `${fil}: pausing er bare tillatt inne i IntersectionObserver, ikke i brukerhåndterere eller hjelpere`);
}

export function krevIngenCssPause(kilde) {
  const css = utenKommentarer(kilde);
  const regler = [];
  for (const [, innhold, tegn] of css.matchAll(/([^{}]*)([{}])/gu)) {
    if (tegn === '{') regler.push(innhold);
    else {
      if (regler.some((regel) => /:(?:hover|active|focus(?:-visible|-within)?)/iu.test(regel))) {
        assert.doesNotMatch(innhold, /animation-play-state\s*:/iu,
          'forside.css: peker, trykk eller fokus skal ikke styre avspillingen');
      }
      regler.pop();
    }
  }
}
