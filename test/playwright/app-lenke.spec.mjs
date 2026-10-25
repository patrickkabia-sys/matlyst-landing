import { test, expect } from '@playwright/test'

// /app er reklamelenken: iPhone/iPad til App Store, Android til Play, resten
// får begge knappene. Butikkene stoppes i nettverket, så testen måler hvor
// siden PRØVER å sende brukeren, uten å laste Apple eller Google.
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0'
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'

async function målForUa(browser, ua, sti) {
  const ctx = await browser.newContext({ userAgent: ua })
  const side = await ctx.newPage()
  let mål = null
  await side.route(/apps\.apple\.com|play\.google\.com/, (rute) => {
    mål = rute.request().url()
    return rute.fulfill({ status: 200, body: 'butikk' })
  })
  await side.goto(sti)
  await expect.poll(() => mål).not.toBeNull()
  await ctx.close()
  return mål
}

test('iPhone går rett til App Store uten landkode, med kilde', async ({ browser }) => {
  const mål = await målForUa(browser, IPHONE, '/app/?k=ig-en')
  expect(mål).toBe('https://apps.apple.com/app/matlyst/id6762563515?ct=ig-en')
})

test('Android går rett til Play med kilden i install-referreren', async ({ browser }) => {
  const mål = await målForUa(browser, ANDROID, '/app/?k=ig-en')
  expect(mål.startsWith('https://play.google.com/store/apps/details?id=app.matlyst&referrer=')).toBe(true)
  expect(decodeURIComponent(new URL(mål).searchParams.get('referrer'))).toBe('utm_source=ig-en&utm_medium=app-lenke')
})

test('ugyldig kilde faller tilbake til app-lenke', async ({ browser }) => {
  const mål = await målForUa(browser, IPHONE, '/app/?k=%22%3E%3Cscript%3E')
  expect(mål).toBe('https://apps.apple.com/app/matlyst/id6762563515?ct=app-lenke')
})

test('PC blir stående og viser begge butikkene', async ({ page }) => {
  await page.goto('/app/?k=ig-en')
  await expect(page.locator('#btn-ios')).toHaveAttribute('href', 'https://apps.apple.com/app/matlyst/id6762563515?ct=ig-en')
  await expect(page.locator('#btn-android')).toHaveAttribute('href', /^https:\/\/play\.google\.com\/store\/apps\/details\?id=app\.matlyst&referrer=utm_source%3Dig-en/)
  expect(new URL(page.url()).pathname).toBe('/app/')
})
