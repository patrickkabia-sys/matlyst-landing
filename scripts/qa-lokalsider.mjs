#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const out = process.argv[2] || 'qa/sv-da/skjermbilder';
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9335;
const profile = mkdtempSync(join(tmpdir(), 'matlyst-lokalsider-'));

function htmlFiler(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? htmlFiler(path) : entry.name === 'index.html' ? [path] : [];
  });
}

function vent(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function endepunkt() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json());
      const page = pages.find((candidate) => candidate.type === 'page' && candidate.url === 'about:blank');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await vent(100);
  }
  throw new Error('Chrome DevTools svarte ikke');
}

function cdp(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const svar = new Map();
  const klar = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  ws.addEventListener('message', (event) => {
    const melding = JSON.parse(event.data);
    const pending = svar.get(melding.id);
    if (!pending) return;
    svar.delete(melding.id);
    if (melding.error) pending.reject(new Error(melding.error.message));
    else pending.resolve(melding.result);
  });
  return {
    klar,
    send(method, params = {}) {
      const requestId = ++id;
      return new Promise((resolve, reject) => {
        svar.set(requestId, { resolve, reject });
        ws.send(JSON.stringify({ id: requestId, method, params }));
      });
    },
    close() { ws.close(); },
  };
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--disable-background-networking', `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });

try {
  const session = cdp(await endepunkt());
  await session.klar;
  await session.send('Page.enable');
  const filer = [...htmlFiler('sv'), ...htmlFiler('da')].sort();
  for (const fil of filer) {
    const path = `/${fil.slice(0, -'index.html'.length)}`;
    const navn = fil.slice(0, -'/index.html'.length).replaceAll('/', '-');
    for (const [bredde, hoyde] of [[390, 844], [1280, 900]]) {
      await session.send('Emulation.setDeviceMetricsOverride', {
        width: bredde, height: hoyde, deviceScaleFactor: 1, mobile: false,
      });
      await session.send('Page.navigate', { url: `${baseUrl}${path}` });
      await vent(180);
      await session.send('Runtime.evaluate', {
        expression: 'document.fonts.ready', awaitPromise: true, returnByValue: true,
      });
      await session.send('Runtime.evaluate', {
        expression: `(() => {
          scrollTo(0, 0);
          const style = document.createElement('style');
          style.textContent = '.hero-side,.hero-eyebrow,.hero h1 .a,.reveal{opacity:1!important;transform:none!important;animation:none!important}';
          document.head.appendChild(style);
        })()`,
      });
      const { data } = await session.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
      writeFileSync(join(out, `${navn}-${bredde}.png`), Buffer.from(data, 'base64'));
    }
  }
  session.close();
  console.log(`Skrev ${filer.length * 2} skjermbilder til ${out}`);
} finally {
  chrome.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => chrome.once('exit', resolve)),
    vent(2000),
  ]);
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
