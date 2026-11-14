import { test, expect } from '@playwright/test'

// Avmeldingssida med og uten t=hjelp, i en ekte nettleser. Funksjonen stubbes: vi
// måler hva sida viser og hva den sender, ikke selve avmeldingen (den er dekket av
// test/avmelding.test.ts og test/aktiveringSekvens.test.ts i app-repoet).
const U = '0c0ffee0-1111-4222-8333-444444444444'
const S = 'A'.repeat(43)
const FUNKSJON = 'https://uaryzmqvoqljjwqvgzoi.supabase.co/functions/v1/avmeld'

async function åpne(page, sti, query, svar = 200) {
  const sendt = []
  await page.route('**/*', (rute) => {
    const url = rute.request().url()
    if (url.startsWith('http://127.0.0.1:4173/')) return rute.continue()
    if (url.startsWith(FUNKSJON)) {
      sendt.push({ url, kropp: rute.request().postData() })
      return rute.fulfill({ status: svar, contentType: 'text/plain', body: 'ok' })
    }
    return rute.abort()
  })
  await page.goto(`${sti}${query}`)
  return sendt
}

const SIDER = [
  ['/avmeld/', 'Tips om å komme i gang', 'Nyhetsbrev'],
  ['/sv/avregistrera/', 'Tips för att komma igång', 'Nyhetsbrev'],
  ['/da/afmeld/', 'Tips til at komme i gang', 'Nyhedsbrev'],
  ['/en/unsubscribe/', 'Getting-started tips', 'Newsletter'],
]

for (const [sti, tipsKicker, nyhetKicker] of SIDER) {
  test(`${sti} med t=hjelp viser tipsvarianten og sender u og s`, async ({ page }) => {
    const sendt = await åpne(page, sti, `?u=${U}&s=${S}&t=hjelp`)
    await expect(page.locator('#bekreft-hjelp')).toBeVisible()
    await expect(page.locator('#bekreft')).toBeHidden()
    await expect(page.locator('#bekreft-hjelp .avmeld-kicker')).toHaveText(tipsKicker)
    expect(page.url()).not.toContain(U)
    expect(page.url()).not.toContain(S)
    await page.locator('#meldAv-hjelp').click()
    await expect(page.locator('#ferdig-hjelp')).toBeVisible()
    await expect(page.locator('#ferdig')).toBeHidden()
    expect(sendt).toHaveLength(1)
    expect(sendt[0].url).toBe(`${FUNKSJON}?u=${U}&s=${S}`)
    expect(sendt[0].kropp).toBe('List-Unsubscribe=One-Click')
  })

  test(`${sti} uten t viser nyhetsbrevet som før`, async ({ page }) => {
    await åpne(page, sti, `?u=${U}&s=${S}`)
    await expect(page.locator('#bekreft')).toBeVisible()
    await expect(page.locator('#bekreft-hjelp')).toBeHidden()
    await expect(page.locator('#bekreft .avmeld-kicker')).toHaveText(nyhetKicker)
  })
}

test('t=hjelp med ødelagt lenke viser tipsvariantens feilside', async ({ page }) => {
  await åpne(page, '/avmeld/', '?u=kort&t=hjelp')
  await expect(page.locator('#mangler-hjelp')).toBeVisible()
  await expect(page.locator('#mangler')).toBeHidden()
})

test('t=hjelp der funksjonen feiler viser tipsvariantens feilmelding', async ({ page }) => {
  await åpne(page, '/en/unsubscribe/', `?u=${U}&s=${S}&t=hjelp`, 500)
  await page.locator('#meldAv-hjelp').click()
  await expect(page.locator('#status-hjelp')).toContainText('hei@matlyst-app.no')
  await expect(page.locator('#status-hjelp a')).toHaveAttribute('href', 'mailto:hei@matlyst-app.no?subject=Unsubscribe%20me%20from%20the%20tips')
})

test('t med en annen verdi gir nyhetsbrevet', async ({ page }) => {
  await åpne(page, '/avmeld/', `?u=${U}&s=${S}&t=%3Cimg%20src%3Dx%3E`)
  await expect(page.locator('#bekreft')).toBeVisible()
  await expect(page.locator('img[src="x"]')).toHaveCount(0)
})
