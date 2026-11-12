export function gjenkjennSprak(tekst, stoppord) {
  const ord = tekst.toLocaleLowerCase().match(/\p{L}+/gu) ?? []
  let valgtSprak = Object.keys(stoppord)[0]
  let flestTreff = -1

  for (const [sprak, spraketsStoppord] of Object.entries(stoppord)) {
    const kjenteOrd = new Set(spraketsStoppord.map((stopp) => stopp.toLocaleLowerCase()))
    const treff = ord.filter((ordet) => kjenteOrd.has(ordet)).length
    if (treff > flestTreff) {
      valgtSprak = sprak
      flestTreff = treff
    }
  }

  return valgtSprak
}
