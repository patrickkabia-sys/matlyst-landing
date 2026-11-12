import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { lesData } from '../seo-motor/skjema.mjs'
import { lesNettsted, ordOverlapp, slugify } from '../seo-motor/nettsted.mjs'
import { gjenkjennSprak } from '../seo-motor/sprakgjenkjenning.mjs'
import { sjekkFast } from '../seo-motor/vern.mjs'

const repoRot = new URL('../', import.meta.url)
const fixtureRot = new URL('../seo-motor/test/fixtures/artikler/', import.meta.url)
const nettsted = lesNettsted(repoRot)
const forbudt = lesData('forbudt.json')
const grenser = lesData('grenser.json')
const sprakfiler = Object.fromEntries(
  ['nb', 'sv', 'da', 'en'].map((sprak) => [sprak, lesData(`sprak/${sprak}.json`)]),
)

function lesFixture(navn = 'gyldig') {
  const grunnlag = JSON.parse(readFileSync(new URL('gyldig.json', fixtureRot), 'utf8'))
  const endring = navn === 'gyldig'
    ? {}
    : JSON.parse(readFileSync(new URL(`${navn}.json`, fixtureRot), 'utf8'))
  const artikkel = { ...grunnlag, ...endring }
  const ekstraTekst = artikkel.ekstraTekst ?? ''
  artikkel.seksjoner = artikkel.seksjoner.map((seksjon) => ({
    ...seksjon,
    tekst: `${`${artikkel.sprakTekst} `.repeat(25).trim()}${ekstraTekst}`,
  }))
  delete artikkel.sprakTekst
  delete artikkel.ekstraTekst
  return artikkel
}

function sjekk(navn) {
  return sjekkFast(lesFixture(navn), { nettsted, forbudt, sprakfiler, grenser })
}

test('gyldig artikkel passerer', () => {
  assert.equal(nettsted.stier.has('/ukemeny/'), true)
  assert.deepEqual(sjekk('gyldig'), { ok: true, grunner: [] })
})

test('språkgjenkjenning skiller nb, sv, da og en', () => {
  const stoppord = Object.fromEntries(
    Object.entries(sprakfiler).map(([sprak, sprakfil]) => [sprak, sprakfil.stoppord]),
  )
  const eksempler = {
    nb: 'Hva kan jeg gjøre med det jeg har, og hva blir best av dette?',
    sv: 'Vad kan jag göra med det jag har, och vad blir bäst av detta?',
    da: 'Hvad kan jeg gøre med det, jeg har, og hvad bliver bedst af dette?',
    en: 'What can I do with what I have, and what will be best for this?',
  }

  for (const [sprak, tekst] of Object.entries(eksempler)) {
    assert.equal(gjenkjennSprak(tekst, stoppord), sprak)
  }
})

test('nettstedindeksen leser hele metadata med apostrof', () => {
  const side = nettsted.sider.find(({ sti }) => sti === '/en/blog/leftovers-in-the-fridge/')

  assert.match(side.meta, /Here's how long the usual ones last/)
  assert.match(side.meta, /USDA guidelines\.$/)
})

test('for lang tittel avvises', () => {
  assert.match(sjekk('for-lang-tittel').grunner.join(' '), /tittel/i)
})

test('slugify gir ascii og vern avviser kollisjon', () => {
  assert.equal(slugify('Rømmegrøt på 10 min'), 'rommegrot-pa-10-min')
  assert.match(sjekk('slug-kollisjon').grunner.join(' '), /slug/i)
})

test('nesten-duplikat avvises', () => {
  assert.ok(ordOverlapp(
    'Koketider for ris, pasta, egg og grønnsaker',
    'Koketider for egg, ris, pasta og grønnsaker',
  ) > 0.5)
  assert.match(sjekk('nesten-duplikat').grunner.join(' '), /overlapp/i)
})

test('lenke til matprat.no avvises', () => {
  assert.match(sjekk('forbudt-lenke').grunner.join(' '), /forbudt/i)
})

test('død intern lenke avvises', () => {
  assert.match(sjekk('dod-intern-lenke').grunner.join(' '), /intern lenke/i)
})

test('absolutt død intern lenke avvises', () => {
  const artikkel = lesFixture()
  artikkel.lenker = [{ sti: 'https://matlyst-app.no/finnes-ikke/', tittel: 'Les mer' }]

  assert.match(
    sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }).grunner.join(' '),
    /intern lenke/i,
  )
})

test('tall uten påstand avvises', () => {
  assert.match(sjekk('tall-uten-pastand').grunner.join(' '), /tall/i)
})

test('delstreng i et annet tall teller ikke som påstand', () => {
  const artikkel = lesFixture()
  artikkel.seksjoner[0].tekst += ' Stek grønnsakene i 5 minutter.'
  artikkel.pastander = [{ tekst: 'Stek grønnsakene i 15 minutter.', kilde_id: 'K1' }]

  assert.match(
    sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }).grunner.join(' '),
    /tall/i,
  )
})

test('ukjent kilde_id avvises', () => {
  assert.match(sjekk('ukjent-kilde').grunner.join(' '), /kilde_id/i)
})

test('svensk tekst merket da avvises', () => {
  assert.match(sjekk('svensk-som-da').grunner.join(' '), /språk/i)
})

test('en-tekst med «the shop» avvises', () => {
  assert.match(sjekk('britisk-engelsk').grunner.join(' '), /britisk/i)
})

test('helseord avvises', () => {
  assert.match(sjekk('helseord').grunner.join(' '), /helseord/i)
})

test('bøyde helseord avvises', () => {
  const artikkel = lesFixture()
  artikkel.seksjoner[0].tekst += ' Rådene er ikke laget for allergikere eller for å telle kalorier.'

  assert.match(
    sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }).grunner.join(' '),
    /helseord/i,
  )
})
