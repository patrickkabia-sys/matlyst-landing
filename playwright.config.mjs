import { defineConfig } from '@playwright/test';

// BASE_URL peker revisjonen mot en kjørende nettside (f.eks. live), og da startes ingen lokal tjener.
const ekstern = process.env.BASE_URL;

export default defineConfig({
  testDir: './test/playwright',
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: ekstern || 'http://127.0.0.1:4173',
    browserName: 'chromium',
    headless: true,
  },
  ...(ekstern
    ? {}
    : {
        webServer: {
          command: 'python3 -m http.server 4173 --bind 127.0.0.1',
          url: 'http://127.0.0.1:4173/',
          reuseExistingServer: false,
          timeout: 15_000,
        },
      }),
});
