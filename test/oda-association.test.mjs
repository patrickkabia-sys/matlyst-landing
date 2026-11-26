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

test('Android association grants App Links only to the Play-signed Matlyst app', () => {
  const file = new URL('../.well-known/assetlinks.json', import.meta.url)
  const association = JSON.parse(readFileSync(file, 'utf8'))
  assert.deepEqual(association, [{
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'app.matlyst',
      sha256_cert_fingerprints: [
        'DF:DC:44:D5:ED:74:F2:B8:E7:4E:57:25:0B:A3:02:A1:FA:AE:41:B8:98:45:00:C3:DB:7C:A2:A3:F4:BD:E0:F7',
      ],
    },
  }])
})
