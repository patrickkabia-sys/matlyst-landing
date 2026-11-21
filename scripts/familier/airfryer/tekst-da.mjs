// Tekst til familien «airfryer» (da): tid og temperatur i airfryer, og omregning fra ovn. Hver sætning gengiver, hvad en navngiven dansk kilde siger.
// Tal skrives aldrig her: h.t(felt) henter dem fra data.da.json, hvor hvert tal har sitatet fra kilden. Setninger fra kilden hentes ordret med h.s(id).
// Kilder: Madens Verden (egne sider og tabellen over kernetemperatur, 2024 til 2026), Arla (2026) og Danish Crown (producent, 2026).
// Alle tider er vejledende, og kilderne skriver, at airfryere varierer. Omregningsreglen er Madens Verdens (minus grader, 20 procent kortere tid) og Arlas tabel.
// Undgå ordene køleskab, rester, plan, uge, find, gem, sådan, ovn, trin, lav, timer, opskrift, erstat og køb i h2-overskrifter, undtagen i app-blokken: scripts/app-bevis.mjs ville ellers lægge appkort ind under dem.

const S = '/da/stegetid/';
const K = '/da/kernetemperatur/';
const HVOR = '/da/hvor-meget-pr-person/';
const A = '/da/airfryer/';
const L = (slug, tekst) => [`${A}${slug}/`, tekst];
const TID = 'Tabel med tider og temperaturer';


/** Omregneren: ét statisk eksempel (en række fra Arlas tabel) og tabellen som data, så siden virker uden JavaScript og skriptet ikke har egne tal. Skriptet er airfryer-omregner.js (samme som på norsk). */
function omregner(h) {
  const rader = [1, 2, 3, 4, 5, 6].map((i) => [Number(h.n(`a${i}-ovn`)), Number(h.n(`a${i}-af`))]);
  const tider = [1, 2, 3, 4, 5, 6].map((i) => [Number(h.n(`a${i}-mo`)), Number(h.n(`a${i}-ma`))]);
  for (const [ovn, af] of tider) if (Math.abs(af - ovn * 0.8) > 1e-9) throw new Error(`omregner: tiden ${ovn} er ikke en femtedel kortere (${af})`);
  const data = { rader, tider, feilTemp: 'Tabellen vi bygger på, dækker {min} til {max} °C. Skriv en temperatur inden for.', feilTid: 'Skriv antal minutter som et tal.', svar: ['I airfryeren: ', '{temp} °C', ' i ', '{tid} minutter', '.'] };
  // Ingen class-attributter: stilen ligger i airfryer-omregner.css og vælger på data-attributterne.
  return `<link rel="stylesheet" href="/airfryer-omregner.css"><script src="/airfryer-omregner.js" defer></script>
<form data-oaf onsubmit="return false" aria-label="Omregner fra ovn med varmluft til airfryer">
  <div data-oaf-rad>
    <label><span>Temperatur i ovnen (varmluft, °C)</span><input data-felt="temp" type="text" inputmode="numeric" autocomplete="off" value="${h.n('a3-ovn')}"></label>
    <label><span>Tid i ovnen (minutter)</span><input data-felt="tid" type="text" inputmode="numeric" autocomplete="off" value="${h.n('a3-mo')}"></label>
  </div>
  <p data-oaf-svar data-felt="svar" role="status" aria-live="polite">I airfryeren: <strong>${h.n('a3-af')} °C</strong> i <strong>${h.n('a3-ma')} minutter</strong>.</p>
  <p data-oaf-merk>Vejledende. Reglen er Arlas tabel (${h.kp('arla-airfryer')}) og gælder en ovn med varmluft.</p>
  <script type="application/json" data-oaf-data>${JSON.stringify(data, null, 1)}</script>
</form>`;
}

export const TEKST = {
  'ovn-til-airfryer': (h) => ({
    ord: 'ovn til airfryer',
    title: 'Ovn til airfryer: omregn temperatur og tid',
    h1: 'Ovn til airfryer: sådan omregner du temperatur og tid',
    description: `Madens Verden: sænk temperaturen ${h.t('m-ovn', { ca: true })} og forkort tiden med omkring ${h.t('m-tid')}. Arla har en tabel fra ${h.t('a1-ovn')} til ${h.t('a6-ovn')}. Her er begge.`,
    lead: `${h.k('mv-konvert')} sænker temperaturen ${h.t('m-ovn', { ca: true })} og forkorter tiden med omkring ${h.t('m-tid')}. ${h.k('arla-airfryer')} har en tabel, der viser det samme i tal.`,
    kilder: [
      `${h.k('mv-konvert')} skriver: ${h.s('hurtig', { med: false })}`,
      `${h.k('arla-airfryer')} skriver: ${h.s('arla', { med: false })}`,
      `Et eksempel fra Madens Verden: en opskrift, der skal have ${h.t('m-eks30')} i ovnen, får typisk omkring ${h.t('m-eks24')} i airfryeren.`,
      `Madens Verden anbefaler at kontrollere maden før tiden er gået: ${h.s('mvkontrol', { med: false })} ${h.s('mvkontrol2', { med: false })}`,
    ],
    tabell: {
      tittel: 'Arlas tabel fra ovn til airfryer', kilde: 'arla-airfryer', intro: 'Arlas tabel gælder en ovn med varmluft. Den er en tommelfingerregel.', kolonner: ['Ovn, varmluft', 'Airfryer', 'Minutter i ovn', 'Minutter i airfryer'],
      rader: [1, 2, 3, 4, 5, 6].map((i) => [['Første række', 'Anden række', 'Tredje række', 'Fjerde række', 'Femte række', 'Sjette række'][i - 1], `a${i}-ovn`, `a${i}-af`, `a${i}-mo`, `a${i}-ma`]),
    },
    ekstra: [
      ['Omregner: temperatur og tid', h.p(['Skriv temperaturen og tiden fra opskriften. Svaret er et tal at begynde med, ikke en facit.']) + omregner(h)],
      ['Madens Verdens regel for temperaturen', h.p([
        `Madens Verden skiller mellem to slags ovn. Fra over- og undervarme: ${h.s('mtemp1', { med: false })} Fra varmluft: ${h.s('mtemp2', { med: false })}`,
        h.tabell({
          tittel: 'Temperatur fra ovn til airfryer', kolonner: ['Ovn', 'Airfryer'],
          rader: [['Over- og undervarme', 'm-ou180', 'm-ou160'], ['Over- og undervarme', 'm-u200', 'm-u180'], ['Varmluft', 'm-v200', 'm-v']],
        }),
        `Er opskriften angivet til ${h.t('m-v200')} varmluft, kan du begynde ved ${h.t('m-v')}. Første kontrol efter ${h.t('m-kontrol', { ca: true })} for en ret, der skal have ${h.t('m-eks30')} i ovnen.`,
      ])],
      ['Et forsøg fra Forbrugerrådet', h.p([`${h.k('arla-airfryer')} refererer et forsøg fra Forbrugerrådet med en kylling på ${h.t('f-vaegt')}: ${h.t('f-ovn')} i ovnen og ${h.t('f-af')} i airfryeren, hvor kyllingen var delt i to halve for at kunne være i beholderen.`])],
      ['Det skal du vide om kurven', h.p([`Arla skriver: ${h.s('stanniol', { med: false })}`, `Madens Verden skriver, at mange airfryere højst kan indstilles til ${h.t('max')}. Arla skriver om flydende ting: ${h.s('ikke', { med: false })}`])],
    ],
    faq: [
      ['Hvordan omregner man fra ovn til airfryer?', `${h.k('mv-konvert')} sænker temperaturen ${h.t('m-ovn', { ca: true })} fra over- og undervarme og ${h.t('m-luft')} fra varmluft, og forkorter tiden med omkring ${h.t('m-tid')}.`],
      ['Hvor længe skal maden være i airfryer, hvis ovnen skal have 30 minutter?', `${h.k('mv-konvert')} skriver, at en opskrift, der skal have ${h.t('m-eks30')} i ovnen, får omkring ${h.t('m-eks24')} i airfryeren.`],
      ['Skal airfryeren forvarmes?', `${h.k('arla-airfryer')} skriver: ${h.s('forvarm', { med: false })}`],
    ],
    andre: [L('kyllingebryst', 'Kyllingebryst i airfryer'), L('laks', 'Laks i airfryer'), [S, 'Stegetid i ovn']],
  }),

  kyllingfilet: (h) => ({
    ord: 'kyllingebryst i airfryer',
    title: 'Kyllingebryst i airfryer: tid og temperatur',
    h1: 'Kyllingebryst i airfryer: tid og temperatur',
    description: `Madens Verden: ${h.t('tid', { ca: true })} ved ${h.t('temp')} i airfryer, og kernetemperaturen skal være ${h.t('kerne')}. Se tallene og hvad der gælder for store stykker.`,
    lead: `${h.k('mv-bryst')} steger kyllingebryst ${h.t('tid', { ca: true })} ved ${h.t('temp')} i airfryer. Kernetemperaturen skal være ${h.t('kerne')}.`,
    kilder: [
      `${h.k('mv-bryst')} skriver: ${h.s('store', { med: false })}`,
      `Madens Verdens oversigt over kernetemperatur har en linje for kylling i airfryer: bryst ${h.t('tabel')} ved ${h.t('temp')}, hviletid ${h.t('hvile')}. ${h.s('tider')}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-bryst', intro: 'Tallene er fra Madens Verden. Tiderne er vejledende, og modellerne varierer.', kolonner: ['Hvad', 'Temperatur', 'Tid', 'Kernetemperatur'], rader: [['Kyllingebryst, opskrift', 'temp', 'tid', 'kerne'], ['Kyllingebryst, oversigten', 'temp', 'tabel', 'kerne']] },
    ekstra: [['Ovn eller airfryer', h.p([`Kyllingebryst i ovn og på pande har sin egen side: <a href="${S}kyllingebryst/">kyllingebryst i ovn</a>. Om hvor meget kyllingebryst der skal regnes pr. person, står der på <a href="${HVOR}kylling/">hvor meget kylling pr. person</a>.`])]],
    faq: [
      ['Hvor længe skal kyllingebryst være i airfryer?', `${h.k('mv-bryst')} regner med ${h.t('tid', { ca: true })} ved ${h.t('temp')}.`],
      ['Hvilken kernetemperatur skal kyllingebryst have?', `${h.k('mv-bryst')} skriver ${h.t('kerne')}.`],
    ],
    soster: [K + 'kylling/', 'Kernetemperatur for kylling'],
    andre: [L('kyllinglar', 'Kyllingelår i airfryer'), L('hel-kylling', 'Hel kylling i airfryer'), L('ovn-til-airfryer', 'Ovn til airfryer')],
  }),

  kyllinglar: (h) => ({
    ord: 'kyllingelår i airfryer',
    title: 'Kyllingelår i airfryer: tid og temperatur',
    h1: 'Kyllingelår i airfryer: tid og temperatur',
    description: `Madens Verden: kyllingelår ${h.t('samlet', { ca: true })} ved ${h.t('temp')} i airfryer, og kernetemperaturen skal være mindst ${h.t('kerne')}. Se hvordan tiden deles.`,
    lead: `${h.k('mv-laar')} steger kyllingeunderlår ${h.t('tid1')} ved ${h.t('temp')}, pensler med marinade og giver ${h.t('tid2')} mere. I alt ${h.t('samlet', { ca: true })}.`,
    kilder: [
      `${h.k('mv-laar')} skriver, at kernetemperaturen skal være mindst ${h.t('kerne')}. ${h.s('knogle', { med: false })} Er temperaturen for lav, gives yderligere ${h.t('stor')}.`,
      `Madens Verden bruger underlår, som normalt vejer ${h.t('vaegt')} stykket. Om marinaden skriver Madens Verden: ${h.s('marin', { med: false })}`,
      `Madens Verdens oversigt har en linje for lår i airfryer: ${h.t('tabel')} ved ${h.t('temp')}.`,
    ],
    tabell: { tittel: TID, kilde: 'mv-laar', intro: 'Tallene er fra Madens Verden. Tiden afhænger af størrelsen og af airfryeren.', kolonner: ['Hvad', 'Temperatur', 'Tid', 'Kernetemperatur'], rader: [['Underlår, opskrift (først uden marinade)', 'temp', 'samlet', 'kerne'], ['Lår, oversigten', 'temp', 'tabel', 'kerne']] },
    ekstra: [['Ét lag i kurven', h.p([`Madens Verden skriver: ${h.s('lag', { med: false })}`])]],
    faq: [
      ['Hvor længe skal kyllingelår være i airfryer?', `${h.k('mv-laar')} regner med ${h.t('tid1')} uden marinade og ${h.t('tid2')} efter, ved ${h.t('temp')}.`],
      ['Hvilken kernetemperatur skal kyllingelår have?', `${h.k('mv-laar')} skriver mindst ${h.t('kerne')}.`],
    ],
    soster: [K + 'kylling/', 'Kernetemperatur for kylling'],
    andre: [L('kyllingebryst', 'Kyllingebryst i airfryer'), L('hel-kylling', 'Hel kylling i airfryer')],
  }),

  'hel-kylling': (h) => ({
    ord: 'hel kylling i airfryer',
    title: 'Hel kylling i airfryer: tid og temperatur',
    h1: 'Hel kylling i airfryer: tid og temperatur',
    description: `Både Madens Verden og Arla bruger ${h.t('arla-tid')} med brystet nedad og ${h.t('opad')} med brystet opad ved ${h.t('temp')}, for en kylling på omkring ${h.t('vaegt')}.`,
    lead: `${h.k('mv-hel')} og ${h.k('arla-hel')} bruger samme metode: ${h.t('bryst')} med brystet nedad og ${h.t('opad')} med brystet opad, ved ${h.t('temp')}.`,
    kilder: [
      `${h.k('mv-hel')} regner med omkring ${h.t('samlet')} i alt ved ${h.t('temp')} for en kylling på ${h.t('vaegt', { ca: true })}. Kyllingen hviler ${h.t('hvile')} før udskæring.`,
      `${h.k('arla-hel')} bruger en kylling på ${h.t('arla-vaegt', { ca: true })}: ${h.t('arla-tid')} ved ${h.t('arla-temp')} med brystet nedad, derefter yderligere ${h.t('arla-tid')}, og ${h.t('arla-hvile', { ca: true })} hvile.`,
      `Madens Verden om tiden: ${h.s('vejl', { med: false })} ${h.s('termo', { med: false })}`,
      `Kernetemperaturen er ${h.t('kerne')}. ${h.s('maal')}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-hel', intro: 'To kilder, samme metode.', kolonner: ['Kilde', 'Temperatur', 'Første side', 'Anden side'], rader: [['Madens Verden', 'temp', 'bryst', 'opad'], ['Arla', 'arla-temp', 'arla-tid', 'arla-tid']] },
    ekstra: [
      ['Kurvens størrelse', h.p([`Madens Verden skriver: ${h.s('kurv', { med: false })}`, `Arla skriver: ${h.s('stor', { med: false })}`])],
    ],
    faq: [
      ['Hvor længe skal en hel kylling være i airfryer?', `${h.k('mv-hel')} regner med omkring ${h.t('samlet')} ved ${h.t('temp')} for en kylling på ${h.t('vaegt', { ca: true })}, og ${h.k('arla-hel')} med ${h.t('arla-tid')} på hver side.`],
      ['Hvilken kernetemperatur skal en hel kylling have?', `${h.k('mv-kerne')} skriver ${h.t('kerne')}. ${h.s('maal')}`],
    ],
    soster: [S + 'hel-kylling/', 'Hel kylling i ovn'],
    andre: [L('kyllingebryst', 'Kyllingebryst i airfryer'), L('ovn-til-airfryer', 'Ovn til airfryer')],
  }),

  laks: (h) => ({
    ord: 'laks i airfryer',
    title: 'Laks i airfryer: tid og temperatur',
    h1: 'Laks i airfryer: tid og temperatur',
    description: `Madens Verden: laks i airfryer skal have ${h.t('tid')} ved ${h.t('temp')}, når airfryeren starter kold. Opskriften bruger ${h.t('vaegt', { ca: true })} laks.`,
    lead: `${h.k('mv-laks')} giver ${h.t('tid')} ved ${h.t('temp')}, når airfryeren starter kold. Madens Verden bruger ${h.t('vaegt', { ca: true })} laks til fire personer.`,
    kilder: [
      `${h.k('mv-laks')} regner med ${h.t('pp')} laks pr. person. Til en actifry uden rørearm er stegetiden omkring ${h.t('actifry')}.`,
      `Om stykket skriver Madens Verden: ${h.s('tykke', { med: false })}`,
      `${h.s('ben')}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-laks', intro: 'Tallene er fra Madens Verden.', kolonner: ['Hvad', 'Temperatur', 'Tid', 'Mængde'], rader: [['Laksestykke', 'temp', 'tid', 'vaegt'], ['Laks i actifry', null, 'actifry', null]] },
    ekstra: [['Laks i ovn', h.p([`Laks i ovn har sin egen side med tider og en kernetemperatur: <a href="${S}laks-i-ovn/">laks i ovn</a>. Hvor meget fisk der skal regnes pr. person, står på <a href="${HVOR}fisk/">hvor meget fisk pr. person</a>.`])]],
    faq: [
      ['Hvor længe skal laks være i airfryer?', `${h.k('mv-laks')} regner med ${h.t('tid')} ved ${h.t('temp')}, med start fra kold airfryer.`],
      ['Hvor meget laks skal man regne pr. person?', `${h.k('mv-laks')} regner med ${h.t('pp')} pr. person.`],
    ],
    andre: [L('ovn-til-airfryer', 'Ovn til airfryer'), [S + 'laks-i-ovn/', 'Laks i ovn']],
  }),

  'pommes-frites': (h) => ({
    ord: 'pommes frites i airfryer',
    title: 'Pommes frites i airfryer: tid og temperatur',
    h1: 'Pommes frites i airfryer: tid og temperatur',
    description: `Madens Verden giver kartoffelstavene først ${h.t('tid1')} ved ${h.t('temp1')} og derefter ${h.t('tid2', { ca: true })} ved ${h.t('temp2')}. Se hele metoden og tipsene.`,
    lead: `${h.k('mv-pommes')} bruger to trin: ${h.t('tid1')} ved ${h.t('temp1')} for at tørre kartoflerne og derefter ${h.t('tid2', { ca: true })} ved ${h.t('temp2')}.`,
    kilder: [
      `${h.k('mv-pommes')} skærer kartoflerne i stave på ${h.t('tyk', { ca: true })} og lader dem stå i iskoldt vand i ${h.t('vand', { ca: true })}. Efter tørringen vendes de med olie. Afhængigt af airfryer, mængde og tykkelse kan de have brug for yderligere ${h.t('mere')}.`,
      `Om tørringen skriver Madens Verden: ${h.s('tor', { med: false })}`,
      `Om kurven skriver Madens Verden: ${h.s('flere', { med: false })} ${h.s('ryst', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-pommes', intro: 'Tallene er fra Madens Verden.', kolonner: ['Trin', 'Temperatur', 'Tid'], rader: [['Først: tørring', 'temp1', 'tid1'], ['Så: stegning', 'temp2', 'tid2']] },
    ekstra: [['Flere hold', h.p(['Stavene skal ligge løst i kurven, så den varme luft kan cirkulere. Gør kurven fuld, bliver pommes fritterne ikke sprøde. Madens Verden anbefaler flere hold i en meget fyldt kurv.'])]],
    faq: [
      ['Hvor længe skal pommes frites være i airfryer?', `${h.k('mv-pommes')} regner med ${h.t('tid1')} ved ${h.t('temp1')} og derefter ${h.t('tid2', { ca: true })} ved ${h.t('temp2')}.`],
      ['Skal kartoflerne ligge i vand først?', `${h.k('mv-pommes')} lader stavene stå i iskoldt vand i ${h.t('vand', { ca: true })}.`],
    ],
    andre: [L('ovn-til-airfryer', 'Ovn til airfryer'), [S + 'bagt-kartoffel/', 'Bagekartofler i ovn']],
  }),

  bacon: (h) => ({
    ord: 'bacon i airfryer',
    title: 'Bacon i airfryer: tid og temperatur',
    h1: 'Bacon i airfryer: tid og temperatur',
    description: `Madens Verden: bacon i airfryer ${h.t('tid')} ved ${h.t('temp')}, op til ${h.t('antal')} ad gangen. Tykkere skiver skal have lidt længere.`,
    lead: `${h.k('mv-bacon')} giver baconskiverne ${h.t('tid')} ved ${h.t('temp')}. Der er typisk plads til ${h.t('antal', { ca: true })} ad gangen.`,
    kilder: [
      `${h.k('mv-bacon')} skriver: ${h.s('tyk', { med: false })}`,
      `Og: ${h.s('model', { med: false })}`,
      `Madens Verden skriver om forvarmning: ${h.s('forvarm', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-bacon', intro: 'Tallene er fra Madens Verden.', kolonner: ['Hvad', 'Temperatur', 'Tid', 'Antal ad gangen'], rader: [['Baconskiver', 'temp', 'tid', { felt: 'antal', ca: true }]] },
    ekstra: [],
    faq: [
      ['Hvor længe skal bacon være i airfryer?', `${h.k('mv-bacon')} regner med ${h.t('tid')} ved ${h.t('temp')}.`],
      ['Hvor mange skiver bacon er der plads til?', `${h.k('mv-bacon')} har typisk plads til ${h.t('antal', { ca: true })} i sin airfryer.`],
    ],
    andre: [L('ovn-til-airfryer', 'Ovn til airfryer'), L('kjottboller', 'Frikadeller i airfryer')],
  }),

  kjottboller: (h) => ({
    ord: 'frikadeller i airfryer',
    title: 'Frikadeller i airfryer: tid og temperatur',
    h1: 'Frikadeller i airfryer: tid og temperatur',
    description: `Madens Verden: frikadeller i airfryer ${h.t('tid')} ved ${h.t('temp')}. Kernetemperaturen for frikadeller er ${h.t('kerne')}. Se tallene.`,
    lead: `${h.k('mv-frikadeller')} giver frikadellerne ${h.t('tid')} ved ${h.t('temp')}. Kernetemperaturen skal være ${h.t('kerne')}, skriver Madens Verdens oversigt.`,
    kilder: [
      `${h.k('mv-frikadeller')} former ${h.t('antal', { ca: true })} frikadeller af ${h.t('fars')} fars. Om kurven skriver siden: ${h.s('papir', { med: false })}`,
      `Om tiden: ${h.s('model', { med: false })}`,
      `${h.k('mv-kerne')} har en linje for frikadeller og kødboller: kernetemperatur ${h.t('kerne')}, hviletid ${h.t('hvile')}. ${h.s('farve')}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-frikadeller', intro: 'Tallene er fra Madens Verden.', kolonner: ['Hvad', 'Temperatur', 'Tid', 'Kernetemperatur'], rader: [['Frikadeller', 'temp', 'tid', 'kerne']] },
    ekstra: [],
    faq: [
      ['Hvor længe skal frikadeller være i airfryer?', `${h.k('mv-frikadeller')} regner med ${h.t('tid')} ved ${h.t('temp')}.`],
      ['Hvilken kernetemperatur skal frikadeller have?', `${h.k('mv-kerne')} skriver ${h.t('kerne')}.`],
    ],
    soster: [K + 'hakket-koed/', 'Kernetemperatur for hakket kød'],
    andre: [L('bacon', 'Bacon i airfryer'), [HVOR + 'hakket-koed/', 'Hvor meget hakket kød pr. person?']],
  }),

  egg: (h) => ({
    ord: 'æg i airfryer',
    title: 'Æg i airfryer: tid og temperatur for blødkogte og hårdkogte æg',
    h1: 'Æg i airfryer: tid og temperatur',
    description: `Madens Verden: æg i airfryer ved ${h.t('temp')}, blødkogt ${h.t('bloed')}, smilende ${h.t('smil')} og hårdkogt ${h.t('haard')}, for æg i størrelse M eller L.`,
    lead: `${h.k('mv-aeg')} sætter airfryeren på ${h.t('temp')} og giver ${h.t('bloed')} til blødkogt, ${h.t('smil')} til smilende og ${h.t('haard')} til hårdkogt.`,
    kilder: [
      `${h.s('model')}`,
      `Madens Verden skriver også: ${h.s('gummi', { med: false })}`,
      `Efter kogningen: ${h.s('koldt', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-aeg', intro: 'Tallene gælder æg i størrelse M eller L.', kolonner: ['Æg', 'Temperatur', 'Tid'], rader: [['Blødkogt', 'temp', 'bloed'], ['Smilende', 'temp', 'smil'], ['Hårdkogt', 'temp', 'haard']] },
    ekstra: [['I gryde i stedet', h.p([`Kogetider i gryde fra Arla og Madens Verden står på <a href="${S}aeg/">hvor længe skal man koge æg</a>.`])]],
    faq: [
      ['Kan man koge æg i airfryer?', `Ja. ${h.k('mv-aeg')} skriver ${h.t('temp')} og ${h.t('bloed')} til blødkogt.`],
      ['Hvor længe skal et hårdkogt æg være i airfryer?', `${h.k('mv-aeg')} skriver ${h.t('haard')} ved ${h.t('temp')}, og at tiden kan variere med modellen.`],
    ],
    andre: [[S + 'aeg/', 'Hvor længe skal man koge æg?'], L('ovn-til-airfryer', 'Ovn til airfryer')],
  }),

  andebryst: (h) => ({
    ord: 'andebryst i airfryer',
    title: 'Andebryst i airfryer: tid og temperatur',
    h1: 'Andebryst i airfryer: tid og temperatur',
    description: `Madens Verden: andebryst ${h.t('tid1')} ved ${h.t('temp1')}, derefter ${h.t('tid2')} ved ${h.t('temp2')}. Oversigten skriver ${h.t('sikker')}, opskriften tager dem ud ved ${h.t('mvkerne', { ca: true })}.`,
    lead: `${h.k('mv-and')} steger andebryst ${h.t('tid1')} ved ${h.t('temp1')} og derefter ${h.t('tid2')} ved ${h.t('temp2')}, så skindet bliver sprødt.`,
    kilder: [
      `Madens Verdens oversigt over kernetemperatur skriver andebryst ${h.t('sikker')} og kalder det: ${h.s('forsigtig', { med: false })}`,
      `I opskriften steger ${h.k('mv-and')} ${h.t('vaegt')} andebryst og tager dem ud ved ${h.t('mvkerne', { ca: true })}, når kødet skal være let rosa. De hviler ${h.t('hvile')}.`,
      `Om skindet skriver Madens Verden: ${h.s('rids', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-and', intro: 'Tallene er fra Madens Verden.', kolonner: ['Trin', 'Temperatur', 'Tid'], rader: [['Først', 'temp1', 'tid1'], ['Derefter', 'temp2', 'tid2']] },
    ekstra: [['To tal for kernetemperaturen', h.p([`De to tal fra Madens Verden er ikke ens: ${h.t('sikker')} i oversigten og ${h.t('mvkerne', { ca: true })} i opskriften. Oversigten kalder ${h.t('sikker')} en dansk forsigtighedsanbefaling. Opskriften siger: ${h.s('rosa', { med: false })} Vi har ikke fundet et tal fra Fødevarestyrelsen for andebryst.`])]],
    faq: [
      ['Hvor længe skal andebryst være i airfryer?', `${h.k('mv-and')}: ${h.t('tid1')} ved ${h.t('temp1')} og derefter ${h.t('tid2')} ved ${h.t('temp2')}.`],
      ['Hvilken kernetemperatur skal andebryst have?', `Oversigten hos ${h.k('mv-and')} skriver ${h.t('sikker')}. Opskriften tager andebryst ud ved ${h.t('mvkerne', { ca: true })}.`],
    ],
    soster: [K + 'and/', 'Kernetemperatur for and'],
    andre: [[S + 'and/', 'Hel and i ovn'], L('flaeskesteg', 'Flæskesteg i airfryer')],
  }),

  flaeskesteg: (h) => ({
    ord: 'flæskesteg i airfryer',
    title: 'Flæskesteg i airfryer: tid og temperatur',
    h1: 'Flæskesteg i airfryer: tid og temperatur',
    description: `Danish Crown giver en flæskesteg på ${h.t('vaegt', { ca: true })} ${h.t('tid', { ca: true })} ved ${h.t('temp')} og derefter ${h.t('svaer')} ved ${h.t('svaertemp')}. Kernetemperaturen er ${h.t('kerne')}.`,
    lead: `${h.k('dc-flaesk')} giver en flæskesteg på ${h.t('vaegt', { ca: true })} ${h.t('tid')} ved ${h.t('temp')} og derefter ${h.t('svaer')} ved ${h.t('svaertemp')} for sprød svær.`,
    kilder: [
      `${h.k('dc-flaesk')} anbefaler en kernetemperatur på ${h.t('kerne')}. Stegen hviler ${h.t('hvile', { ca: true })} utildækket.`,
      `Danish Crown skriver: ${h.s('termo', { med: false })}`,
      `Om opsætningen: ${h.s('vand', { med: false })} ${h.s('rids', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'dc-flaesk', intro: 'Tallene er fra Danish Crowns opskrift, som er en producentside. De gælder en steg på cirka et kilo.', kolonner: ['Del', 'Temperatur', 'Tid'], rader: [['Først', 'temp', 'tid'], ['Til sprød svær', 'svaertemp', 'svaer']] },
    ekstra: [['Større stege', h.p(['Danish Crown skriver, at en større steg kan være bedre i en almindelig ovn. Tiden for en flæskesteg i ovn står på siden om <a href="/da/stegetid/flaeskesteg/">hvor længe skal flæskestegen have i ovnen</a>.'])]],
    faq: [
      ['Hvor længe skal flæskesteg være i airfryer?', `${h.k('dc-flaesk')} giver ${h.t('tid')} ved ${h.t('temp')} og derefter ${h.t('svaer')} ved ${h.t('svaertemp')} for en steg på ${h.t('vaegt', { ca: true })}.`],
      ['Hvilken kernetemperatur skal flæskesteg have?', `${h.k('dc-flaesk')} skriver ${h.t('kerne')}.`],
    ],
    soster: [K + 'flaeskesteg/', 'Kernetemperatur for flæskesteg'],
    andre: [[S + 'flaeskesteg/', 'Flæskesteg i ovn'], [HVOR + 'flaeskesteg/', 'Hvor meget flæskesteg pr. person?']],
  }),
};

export function nav({ rader, sti, h, p, esc }) {
  const forste = h(rader.find((r) => r.id === 'ovn-til-airfryer'));
  const OV = {
    kyllingfilet: [['Kyllingebryst', 'tid']], kyllinglar: [['Kyllingelår, i alt', 'samlet']], 'hel-kylling': [['Hel kylling, i alt', 'samlet']], laks: [['Laksestykke', 'tid']], 'pommes-frites': [['Pommes frites, anden fase', 'tid2']],
    bacon: [['Bacon', 'tid']], kjottboller: [['Frikadeller', 'tid']], egg: [['Hårdkogt æg', 'haard']], andebryst: [['Andebryst, første fase', 'tid1']], flaeskesteg: [['Flæskesteg, cirka et kilo', 'tid']],
  };
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OV[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${x.t(felt)}</td><td>${x.t(felt.startsWith('tid2') ? 'temp2' : felt.startsWith('tid1') ? 'temp1' : 'temp')}</td><td>${x.k(r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde)}</td></tr>`);
  }).join('');
  return {
    title: 'Airfryer: tid og temperatur for kylling, laks, bacon og mere',
    h1: 'Airfryer: tid og temperatur',
    description: 'Tid og temperatur i airfryer for kyllingebryst, kyllingelår, hel kylling, laks, pommes frites, bacon, frikadeller, æg, andebryst og flæskesteg, plus omregning fra ovn. Tal fra Madens Verden, Arla og Danish Crown.',
    lead: `Tiderne i airfryer er vejledende, og alle kilderne skriver, at airfryere varierer. Hvert tal står hos en navngiven kilde med årstal. Skal du omregne fra ovn, sænker Madens Verden temperaturen ${forste.t('m-ovn', { ca: true })} og forkorter tiden med omkring ${forste.t('m-tid')}.`,
    rik: [
      `<h2>Det siger kilderne</h2>${p([
        `${forste.k('arla-airfryer')} skriver: ${forste.s('arla', { med: false })}`,
        'Kilderne her er Madens Verden, Arla og Danish Crown. De to første er danske madsider, og Danish Crown er en producent. Tallene er derfor vejledende, ikke en norm.',
      ])}`,
      `<h2>Tider for alle retter</h2><p>Vælg en ret for tabellen, kilderne og kernetemperaturen.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Tid og temperatur i airfryer"><table class="sprik"><thead><tr><th scope="col">Ret</th><th scope="col">Hvad tallet gælder</th><th scope="col">Tid</th><th scope="col">Temperatur</th><th scope="col">Kilde</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      `<h2>Omregning fra ovn</h2><p>${forste.k('mv-konvert')} og ${forste.k('arla-airfryer')} har hver sin regel eller tabel. Se <a href="${sti(rader.find((r) => r.id === 'ovn-til-airfryer'))}">ovn til airfryer</a>.</p>`,
      '<h2>Varer der ikke er med</h2><p>Der er ingen side om for eksempel fiskepinde, pølser, grøntsager eller frosne varer, fordi vi ikke fandt en dansk kilde med tal, vi kunne kontrollere. Kernetemperaturen for kød står på siden om kernetemperatur.</p>',
      `<div class="related"><h2>Læs også</h2><ul><li><a href="${S}">Stegetid i ovn for flæskesteg, and og kalkun</a></li><li><a href="${K}">Kernetemperatur for kød og fjerkræ</a></li></ul></div>`,
    ].join('\n'),
    faqTittel: 'Spørgsmål om airfryer',
    faq: [
      ['Skal airfryeren forvarmes?', `${forste.k('arla-airfryer')} skriver: ${forste.s('forvarm', { med: false })}`],
      ['Må man bruge stanniol i airfryer?', `${forste.k('arla-airfryer')} skriver: ${forste.s('stanniol', { med: false })}`],
      ['Hvordan omregner man fra ovn til airfryer?', `${forste.k('mv-konvert')} sænker temperaturen ${forste.t('m-ovn', { ca: true })} fra over- og undervarme og forkorter tiden med omkring ${forste.t('m-tid')}.`],
    ],
  };
}
