import { readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'

// /bekreft/ er mellomlandingen for bekreftelseslenken i e-posten. Supabase-lenka
// (/auth/v1/verify?token=…) er et engangstoken, og forhåndshentere i
// e-postklienter bruker det opp før brukeren trykker. Sida skal derfor ALDRI
// røre lenka selv: ingen forespørsel, ingen preconnect, ingen omdirigering.
// Først et menneskelig trykk på knappen åpner den.
//
// Testene måler oppførsel i en ekte nettleser. Alle forespørsler utenfor den
// lokale serveren stoppes og telles. `BEKREFT_FIL` bytter ut sida med en annen
// fil (brukes til å bevise at testene blir røde for en ødelagt side).
// App-repoet har en enklere vakt i test/bekreftLanding.test.ts.

const VERT = 'uaryzmqvoqljjwqvgzoi.supabase.co'
const GOD = `https://${VERT}/auth/v1/verify?token=pkce_3f9a1c&type=signup&redirect_to=matlyst%3A%2F%2F`
const TOKEN = 'pkce_3f9a1c'
const ERSTATNING = process.env.BEKREFT_FIL ? readFileSync(process.env.BEKREFT_FIL, 'utf8') : null

async function åpne(browser, query, locale = 'nb-NO') {
  const ctx = await browser.newContext({ locale })
  const side = await ctx.newPage()
  const eksterne = []
  await side.route('**/*', (rute) => {
    const url = rute.request().url()
    if (ERSTATNING && new URL(url).pathname === '/bekreft/') {
      return rute.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: ERSTATNING })
    }
    if (url.startsWith('http://127.0.0.1:4173/')) return rute.continue()
    eksterne.push(url)
    return rute.abort()
  })
  await side.goto(`/bekreft/${query}`)
  await side.waitForLoadState('networkidle')
  await side.waitForTimeout(300)
  return { ctx, side, eksterne }
}

// Alt i DOM-en som peker ut av sida, bortsett fra selve knappen.
async function utpekere(side) {
  return side.evaluate(() => {
    const funn = []
    for (const el of document.querySelectorAll('[href],[src],[srcset],[action],[data],[poster]')) {
      if (el.id === 'knapp') continue
      for (const attr of ['href', 'src', 'srcset', 'action', 'data', 'poster']) {
        const v = el.getAttribute(attr)
        if (v && /supabase|verify|^javascript:/i.test(v)) funn.push(`${el.tagName} ${attr}=${v}`)
      }
    }
    for (const el of document.querySelectorAll('link[rel]')) {
      if (/preconnect|dns-prefetch|prefetch|preload|prerender|modulepreload/i.test(el.rel)) funn.push(`link rel=${el.rel} ${el.href}`)
    }
    for (const el of document.querySelectorAll('meta[http-equiv]')) {
      if (/refresh/i.test(el.httpEquiv)) funn.push(`meta refresh ${el.content}`)
    }
    if (document.querySelector('script[type="speculationrules"]')) funn.push('speculationrules')
    return funn
  })
}

function rørerSupabase(eksterne) {
  return eksterne.filter((u) => u.includes('supabase') || u.includes(TOKEN))
}

const GYLDIGE = [
  ['bokmål', `?u=${encodeURIComponent(GOD)}`, 'nb-NO', 'Bekreft e-postadressen'],
  ['svensk via ?lang', `?u=${encodeURIComponent(GOD)}&lang=sv`, 'nb-NO', 'Bekräfta e-postadressen'],
  ['dansk via nettleseren', `?u=${encodeURIComponent(GOD)}`, 'da-DK', 'Bekræft e-mailadressen'],
  ['engelsk via nettleseren', `?u=${encodeURIComponent(GOD)}`, 'en-US', 'Confirm email address'],
  ['ukjent språk faller til bokmål', `?u=${encodeURIComponent(GOD)}`, 'fr-FR', 'Bekreft e-postadressen'],
]

for (const [navn, query, locale, knappetekst] of GYLDIGE) {
  test(`gyldig lenke (${navn}): knappen har nøyaktig lenka, og ingenting hentes før trykket`, async ({ browser, baseURL }) => {
    const { ctx, side, eksterne } = await åpne(browser, query, locale)
    const knapp = side.locator('#knapp')
    await expect(knapp).toBeVisible()
    await expect(knapp).toHaveText(knappetekst)
    expect(await knapp.getAttribute('href')).toBe(GOD)
    expect(await knapp.getAttribute('rel')).toBe('noreferrer noopener')
    expect(rørerSupabase(eksterne)).toEqual([])
    expect(await utpekere(side)).toEqual([])
    expect(side.url().startsWith(`${baseURL}/bekreft/`)).toBe(true)
    await ctx.close()
  })
}

const UGYLDIGE = [
  ['vertssuffiks', `https://${VERT}.evil.no/auth/v1/verify?token=a&type=signup`],
  ['@-triks med brukerinfo', `https://evil.no@${VERT}/auth/v1/verify?token=a&type=signup`],
  ['@-triks etter verten', `https://${VERT}@evil.no/auth/v1/verify?token=a&type=signup`],
  ['dobbel koding', encodeURIComponent(GOD)],
  ['store bokstaver i verten', `https://${VERT.toUpperCase()}/auth/v1/verify?token=a&type=signup`],
  ['protokollrelativ //vert', `//${VERT}/auth/v1/verify?token=a&type=signup`],
  ['http i stedet for https', `http://${VERT}/auth/v1/verify?token=a&type=signup`],
  ['javascript:', 'javascript:alert(1)'],
  ['annet Supabase-prosjekt', 'https://abcdefghijklmnopqrst.supabase.co/auth/v1/verify?token=a&type=signup'],
  ['annen sti', `https://${VERT}/auth/v1/verifyX?token=a&type=signup`],
  ['feil vert', 'https://example.com/x'],
]

for (const [navn, u] of UGYLDIGE) {
  test(`ugyldig lenke (${navn}): ingen knapp, feilmelding`, async ({ browser }) => {
    const { ctx, side, eksterne } = await åpne(browser, `?u=${encodeURIComponent(u)}`)
    expect(await side.locator('#knapp').getAttribute('href')).toBeNull()
    await expect(side.locator('#knapp')).toBeHidden()
    await expect(side.locator('#feil')).toBeVisible()
    await expect(side.locator('#feilTittel')).toHaveText('Denne lenken virker ikke')
    expect(rørerSupabase(eksterne)).toEqual([])
    expect(await utpekere(side)).toEqual([])
    await ctx.close()
  })
}

test('ukodet u (kuttet ved første &): ingen knapp, feilmelding', async ({ browser }) => {
  const { ctx, side, eksterne } = await åpne(browser, `?u=${GOD}`)
  expect(await side.locator('#knapp').getAttribute('href')).toBeNull()
  await expect(side.locator('#feil')).toBeVisible()
  expect(rørerSupabase(eksterne)).toEqual([])
  await ctx.close()
})

test('manglende u: ingen knapp, feilmelding', async ({ browser }) => {
  const { ctx, side } = await åpne(browser, '')
  expect(await side.locator('#knapp').getAttribute('href')).toBeNull()
  await expect(side.locator('#feil')).toBeVisible()
  await ctx.close()
})
