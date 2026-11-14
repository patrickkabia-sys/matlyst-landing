import { test, expect } from '@playwright/test'

// Vervekortet: /v/?k=KODE, /sv/v/, /da/v/ og /en/v/. Appen deler lenka, mottakeren
// åpner den. Testene måler oppførselen i en ekte nettleser:
// - iPhone og iPad (også iPad som melder seg som Mac) sendes til App Store,
// - Android til Google Play UTEN referrer (REFERRER_PA = false i vervekort.js);
//   slås konstanten på, får bare gyldig kode referrer=matlyst_kode%3DKODE,
// - ingen Referer-header følger med til butikkene (meta referrer no-referrer),
// - uten JavaScript står butikkene og teksten i HTML-en fra start,
// - alle andre blir på sida, som viser koden (textContent) og butikkene,
// - ugyldig kode vises ikke og går ikke inn i referrer,
// - ingenting fra spørrestrengen havner i DOM-en som HTML.
// Alle forespørsler utenfor den lokale serveren stoppes og telles. Butikkene svarer
// med en tom side, så vi ser nøyaktig hvilken adresse sida navigerte til.

const APP_STORE = 'https://apps.apple.com/app/matlyst/id6762563515'
const PLAY = 'https://play.google.com/store/apps/details?id=app.matlyst'
const KODE = 'C0FFEE'
const PLAY_MED_KODE = `${PLAY}&referrer=matlyst_kode%3D${KODE}`
const JS = new URL('../../v/vervekort.js', import.meta.url)

const UA = {
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  ipad: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  android: 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
  windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
}

const SIDER = {
  nb: { sti: '/v/', kopiert: 'Kopiert', hjem: '/' },
  sv: { sti: '/sv/v/', kopiert: 'Kopierad', hjem: '/sv/' },
  da: { sti: '/da/v/', kopiert: 'Kopieret', hjem: '/da/' },
  en: { sti: '/en/v/', kopiert: 'Copied', hjem: '/en/' },
}

async function åpne(browser, { sti = '/v/', query = '', ua = UA.windows, berøring = 0, tillatelser = [], js = true, skript = null } = {}) {
  const ctx = await browser.newContext({ userAgent: ua, locale: 'nb-NO', javaScriptEnabled: js })
  if (tillatelser.length) await ctx.grantPermissions(tillatelser, { origin: 'http://127.0.0.1:4173' })
  // iPadOS 13+ melder seg som Mac, men har berøringspunkter. Ekte Mac har 0.
  await ctx.addInitScript((n) => {
    Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { configurable: true, get: () => n })
  }, berøring)
  const navigasjoner = []
  const referere = []
  const eksterne = []
  await ctx.route('**/*', async (rute) => {
    const req = rute.request()
    const url = req.url()
    // `skript` bytter ut vervekort.js (brukes for å prøve REFERRER_PA = true).
    if (skript && url.endsWith('/v/vervekort.js')) {
      return rute.fulfill({ status: 200, contentType: 'application/javascript', body: skript })
    }
    if (url.startsWith('http://127.0.0.1:4173/')) return rute.continue()
    if (req.isNavigationRequest() && /^https:\/\/(?:apps\.apple\.com|play\.google\.com)\//.test(url)) {
      navigasjoner.push(url)
      referere.push((await req.allHeaders()).referer ?? null)
      return rute.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>butikk</title>' })
    }
    eksterne.push(url)
    return rute.abort()
  })
  const side = await ctx.newPage()
  await side.goto(`${sti}${query}`)
  await side.waitForLoadState('networkidle')
  await side.waitForTimeout(500)
  return { ctx, side, navigasjoner, referere, eksterne }
}

// ── Videresending ────────────────────────────────────────────────────────────

for (const [lang, { sti }] of Object.entries(SIDER)) {
  test(`${lang}: iPhone sendes til App Store uten Referer-header`, async ({ browser }) => {
    const { ctx, side, navigasjoner, referere, eksterne } = await åpne(browser, { sti, query: `?k=${KODE}`, ua: UA.iphone })
    expect(navigasjoner).toEqual([APP_STORE])
    expect(referere).toEqual([null])
    expect(side.url()).toBe(APP_STORE)
    expect(eksterne).toEqual([])
    await ctx.close()
  })

  test(`${lang}: Android sendes til Google Play uten referrer og uten Referer-header`, async ({ browser }) => {
    const { ctx, side, navigasjoner, referere, eksterne } = await åpne(browser, { sti, query: `?k=${KODE}`, ua: UA.android })
    expect(navigasjoner).toEqual([PLAY])
    expect(side.url()).toBe(PLAY)
    expect(referere).toEqual([null])
    expect(eksterne).toEqual([])
    await ctx.close()
  })

  test(`${lang}: datamaskin blir på sida og ser koden, butikkene og forsiden`, async ({ browser }) => {
    const { ctx, side, navigasjoner, eksterne } = await åpne(browser, { sti, query: `?k=${KODE}`, ua: UA.windows })
    expect(navigasjoner).toEqual([])
    expect(eksterne).toEqual([])
    expect(new URL(side.url()).pathname).toBe(sti)
    await expect(side.locator('#medKode')).toBeVisible()
    await expect(side.locator('#kode')).toHaveText(KODE)
    await expect(side.locator('#utenKode')).toBeHidden()
    expect(await side.locator('#appStore').getAttribute('href')).toBe(APP_STORE)
    expect(await side.locator('#play').getAttribute('href')).toBe(PLAY)
    expect(await side.locator('#appStore').getAttribute('rel')).toBe('noreferrer noopener')
    expect(await side.locator('#play').getAttribute('rel')).toBe('noreferrer noopener')
    expect(await side.locator('meta[name="referrer"]').getAttribute('content')).toBe('no-referrer')
    expect(await side.evaluate(() => document.referrer)).toBe('')
    await expect(side.locator('#appStore')).toBeVisible()
    await expect(side.locator('#play')).toBeVisible()
    expect(await side.locator('.vk-lesmer a').getAttribute('href')).toBe(SIDER[lang].hjem)
    await ctx.close()
  })

  test(`${lang}: kopier-knappen legger koden på utklippstavlen`, async ({ browser }) => {
    const { ctx, side } = await åpne(browser, { sti, query: `?k=${KODE}`, tillatelser: ['clipboard-read', 'clipboard-write'] })
    await side.locator('#kopier').click()
    await expect(side.locator('#status')).toHaveText(SIDER[lang].kopiert)
    expect(await side.evaluate(() => navigator.clipboard.readText())).toBe(KODE)
    await ctx.close()
  })
}

test('iPad sendes til App Store', async ({ browser }) => {
  const { ctx, navigasjoner } = await åpne(browser, { query: `?k=${KODE}`, ua: UA.ipad })
  expect(navigasjoner).toEqual([APP_STORE])
  await ctx.close()
})

test('iPad som melder seg som Mac (berøring) sendes til App Store', async ({ browser }) => {
  const { ctx, navigasjoner } = await åpne(browser, { query: `?k=${KODE}`, ua: UA.mac, berøring: 5 })
  expect(navigasjoner).toEqual([APP_STORE])
  await ctx.close()
})

test('Mac uten berøring blir på sida', async ({ browser }) => {
  const { ctx, side, navigasjoner, eksterne } = await åpne(browser, { query: `?k=${KODE}`, ua: UA.mac })
  expect(navigasjoner).toEqual([])
  expect(eksterne).toEqual([])
  await expect(side.locator('#kode')).toHaveText(KODE)
  await ctx.close()
})

// ── Ugyldig kode ─────────────────────────────────────────────────────────────

const UGYLDIGE = [
  ['script-tagg', '<script>window.pwned=1</script>'],
  ['img onerror', '<img src=x onerror="window.pwned=1">'],
  ['små bokstaver', 'abc'],
  ['små bokstaver, seks tegn', 'c0ffee'],
  ['sju tegn', 'C0FFEE1'],
  ['fem tegn', 'C0FFE'],
  ['ikke-heks', 'C0FFEG'],
  ['linjeskift etter koden', 'C0FFEE\n'],
  ['mellomrom foran', ' C0FFEE'],
  ['tom', ''],
]

for (const [navn, k] of UGYLDIGE) {
  const query = `?k=${encodeURIComponent(k)}`

  test(`ugyldig kode (${navn}): vises ikke og havner ikke i DOM-en`, async ({ browser }) => {
    const { ctx, side, navigasjoner, eksterne } = await åpne(browser, { query })
    expect(navigasjoner).toEqual([])
    expect(eksterne).toEqual([])
    await expect(side.locator('#medKode')).toBeHidden()
    await expect(side.locator('#kode')).toHaveText('')
    await expect(side.locator('#utenKode')).toBeVisible()
    expect(await side.locator('#play').getAttribute('href')).toBe(PLAY)
    const dom = await side.evaluate(() => document.documentElement.outerHTML)
    if (k.trim()) expect(dom).not.toContain(k.trim())
    expect(await side.evaluate(() => window.pwned)).toBeUndefined()
    expect(await side.locator('script').count()).toBe(1)
    await ctx.close()
  })

  test(`ugyldig kode (${navn}): Android får Play uten referrer`, async ({ browser }) => {
    const { ctx, navigasjoner } = await åpne(browser, { query, ua: UA.android })
    expect(navigasjoner).toEqual([PLAY])
    await ctx.close()
  })
}

test('uten k: Android får Play uten referrer, datamaskin ser sida uten kode', async ({ browser }) => {
  const a = await åpne(browser, { ua: UA.android })
  expect(a.navigasjoner).toEqual([PLAY])
  await a.ctx.close()
  const d = await åpne(browser)
  expect(d.navigasjoner).toEqual([])
  await expect(d.side.locator('#medKode')).toBeHidden()
  await d.ctx.close()
})

// ── Ingenting fra spørrestrengen i HTML ──────────────────────────────────────

test('HTML-kilden er den samme med og uten kode, og har verken koden eller andre parametere', async ({ request }) => {
  for (const { sti } of Object.values(SIDER)) {
    const ren = await (await request.get(sti)).text()
    const medKode = await (await request.get(`${sti}?k=${KODE}&x=MARKOR4711`)).text()
    expect(medKode).toBe(ren)
    expect(medKode).not.toContain(KODE)
    expect(medKode).not.toContain('MARKOR4711')
  }
})

test('andre parametere havner aldri i DOM-en, og koden står bare som tekst i #kode', async ({ browser }) => {
  const { ctx, side } = await åpne(browser, { query: `?k=${KODE}&x=MARKOR4711&lang=en` })
  const funn = await side.evaluate((kode) => {
    const dom = document.documentElement.outerHTML
    const attributter = []
    for (const el of document.querySelectorAll('*')) {
      for (const a of el.attributes) if (a.value.includes(kode)) attributter.push(`${el.id || el.tagName}.${a.name}`)
    }
    const tekst = [...document.querySelectorAll('body *')]
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.includes(kode)))
      .map((el) => el.id || el.tagName)
    return { markør: dom.includes('MARKOR4711'), hode: document.head.outerHTML.includes(kode), tittel: document.title, attributter, tekst }
  }, KODE)
  expect(funn.markør).toBe(false)
  expect(funn.hode).toBe(false)
  expect(funn.tittel).not.toContain(KODE)
  expect(funn.attributter).toEqual([])
  expect(funn.tekst).toEqual(['kode'])
  await ctx.close()
})

// ── Referrer-konstanten ──────────────────────────────────────────────────────

test('REFERRER_PA står AV i kilden', async () => {
  const { readFileSync } = await import('node:fs')
  const kilde = readFileSync(JS, 'utf8')
  expect(kilde).toMatch(/^\s*var REFERRER_PA = false;$/m)
})

test('slås REFERRER_PA på, får gyldig kode referrer og ugyldig kode ingen', async ({ browser }) => {
  const { readFileSync } = await import('node:fs')
  const på = readFileSync(JS, 'utf8').replace('var REFERRER_PA = false;', 'var REFERRER_PA = true;')
  expect(på).toContain('var REFERRER_PA = true;')
  const gyldig = await åpne(browser, { query: `?k=${KODE}`, ua: UA.android, skript: på })
  expect(gyldig.navigasjoner).toEqual([PLAY_MED_KODE])
  await gyldig.ctx.close()
  const ugyldig = await åpne(browser, { query: '?k=C0FFEE1', ua: UA.android, skript: på })
  expect(ugyldig.navigasjoner).toEqual([PLAY])
  await ugyldig.ctx.close()
})

// ── Uten JavaScript ──────────────────────────────────────────────────────────

for (const [lang, { sti, hjem }] of Object.entries(SIDER)) {
  for (const [navn, query, ua] of [
    ['gyldig kode, datamaskin', `?k=${KODE}`, UA.windows],
    ['ugyldig kode, iPhone', '?k=%3Cscript%3E', UA.iphone],
    ['ingen kode, Android', '', UA.android],
  ]) {
    test(`${lang} uten JavaScript (${navn}): tekst og begge butikkene står i HTML-en`, async ({ browser }) => {
      const { ctx, side, navigasjoner, eksterne } = await åpne(browser, { sti, query, ua, js: false })
      expect(navigasjoner).toEqual([])
      expect(eksterne).toEqual([])
      await expect(side.locator('h1')).toBeVisible()
      expect((await side.locator('h1').innerText()).trim().length).toBeGreaterThan(10)
      await expect(side.locator('.vk-steg li')).toHaveCount(2)
      await expect(side.locator('#utenKode')).toBeVisible()
      await expect(side.locator('#appStore')).toBeVisible()
      await expect(side.locator('#play')).toBeVisible()
      expect(await side.locator('#appStore').getAttribute('href')).toBe(APP_STORE)
      expect(await side.locator('#play').getAttribute('href')).toBe(PLAY)
      for (const id of ['#appStore', '#play']) {
        const boks = await side.locator(id).boundingBox()
        expect(boks.height).toBeGreaterThanOrEqual(44)
      }
      expect(await side.locator('.vk-lesmer a').getAttribute('href')).toBe(hjem)
      await expect(side.locator('#medKode')).toBeHidden()
      await ctx.close()
    })
  }
}
