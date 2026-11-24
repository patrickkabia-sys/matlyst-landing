import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('Oda HTTPS callback associates only the intended iOS app and path', () => {
  const file = new URL('../.well-known/apple-app-site-association', import.meta.url)
  const association = JSON.parse(readFileSync(file, 'utf8'))
  assert.deepEqual(association.webcredentials.apps, ['7M27YA42P2.app.matlyst'])
  assert.deepEqual(association.applinks.details, [{
    appIDs: association.webcredentials.apps,
    components: [{ '/': '/oda/callback' }],
  }])
  assert.ok(Buffer.byteLength(JSON.stringify(association)) < 128 * 1024)
})

test('Jekyll includes the otherwise hidden association directory', () => {
  const config = readFileSync(new URL('../_config.yml', import.meta.url), 'utf8')
  assert.match(config, /^include:\s*\n\s+- ["']?\.well-known["']?\s*$/m)
})
