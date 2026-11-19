// Revisjonsmotoren: bevis for at en side ikke ruller sidelengs, ikke klipper eller
// overlapper tekst, ikke gir konsollfeil og ikke kaller fremmede verter.

/**
 * Geometrikontrollene, kjørt inne i siden på nåværende rulleposisjon.
 * Funksjonen serialiseres til siden og må ikke bruke noe utenfra.
 */
function geometri({ unntak, krom, tilsiktet }) {
  const alle = ['.skip-link', ...unntak].join(',');
  const sidelengs = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);

  const beskriv = (el, tekst) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    else if (el.classList.length) s += '.' + [...el.classList].join('.');
    return `${s} «${tekst.trim().replace(/\s+/g, ' ').slice(0, 40)}»`;
  };

  const skjult = (el) => {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse') return true;
      if (parseFloat(cs.opacity) === 0) return true;
      if (e.hidden) return true;
      // Innhold i en lukket details er ikke synlig (bortsett fra summary).
      if (e.parentElement && e.parentElement.tagName === 'DETAILS' && !e.parentElement.open && e.tagName !== 'SUMMARY') return true;
      const r = e.getBoundingClientRect();
      if (cs.overflow !== 'visible' && (r.width <= 1 || r.height <= 1)) return true;
      if (/^rect\(\s*0(px)?[ ,]+0(px)?[ ,]+0(px)?[ ,]+0(px)?\s*\)$/.test(cs.clip)) return true;
      if (/inset\(\s*(50%|100%)/.test(cs.clipPath)) return true;
    }
    return false;
  };

  const blad = document.querySelector('.blad') || document.body;
  const bladBoks = blad.getBoundingClientRect();

  const tekst = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue;
    if (el.closest(alle)) continue;
    if (skjult(el)) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rekter = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
    if (!rekter.length) continue;
    tekst.push({ n, el, rekter });
  }

  // Tekst utenfor boks: hver klippende forfar (overflow ulik visible) sjekkes per akse.
  // En rullbar akse (auto/scroll) klipper ikke i den aksen, men en nærmere hidden/clip-boks teller.
  const utenforBoks = [];
  for (const { n, el, rekter } of tekst) {
    const tilsiktetKlipp = tilsiktet.length > 0 && !!el.closest(tilsiktet.join(','));
    let ute = false;
    for (let e = el; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      if (tilsiktetKlipp) break;
      const cs = getComputedStyle(e);
      const klippX = cs.overflowX !== 'visible' && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll';
      const klippY = cs.overflowY !== 'visible' && cs.overflowY !== 'auto' && cs.overflowY !== 'scroll';
      if (!klippX && !klippY) continue;
      const b = e.getBoundingClientRect();
      for (const r of rekter) {
        if (klippX && (r.left < b.left - 1 || r.right > b.right + 1)) ute = true;
        if (klippY && (r.top < b.top - 1 || r.bottom > b.bottom + 1)) ute = true;
      }
    }
    if (!tilsiktetKlipp) {
      for (const r of rekter) {
        if (r.left < bladBoks.left - 1 || r.right > bladBoks.right + 1) ute = true;
      }
    }
    if (ute) utenforBoks.push(beskriv(el, n.nodeValue));
  }

  // Overlapp: ingen krymping utover 1 px avrundingstoleranse. Bare par der nøyaktig
  // én side ligger i sidens egen flytende kromflate (krom) er unntatt.
  const iKrom = (el) => krom.length > 0 && !!el.closest(krom.join(','));
  const linjer = [];
  tekst.forEach((t, i) => {
    for (const r of t.rekter) linjer.push({ i, krom: iKrom(t.el), el: t.el, n: t.n, l: r.left, r: r.right, t: r.top, b: r.bottom });
  });
  linjer.sort((a, b) => a.t - b.t);
  const overlapp = [];
  const sett = new Set();
  for (let x = 0; x < linjer.length; x++) {
    const a = linjer[x];
    for (let y = x + 1; y < linjer.length; y++) {
      const b = linjer[y];
      if (b.t >= a.b) break;
      if (a.i === b.i || a.el === b.el) continue;
      if (a.krom !== b.krom) continue;
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const w = Math.min(a.r, b.r) - Math.max(a.l, b.l) - 1;
      const h = Math.min(a.b, b.b) - Math.max(a.t, b.t) - 1;
      if (w > 0 && h > 0 && w * h > 4) {
        const nokkel = a.i + ':' + b.i;
        if (sett.has(nokkel)) continue;
        sett.add(nokkel);
        overlapp.push({ top: a.t, s: `${beskriv(a.el, a.n.nodeValue)} over ${beskriv(b.el, b.n.nodeValue)}` });
      }
    }
  }
  overlapp.sort((a, b) => a.top - b.top);

  // Iframes revideres ikke innvendig (tredjepartsinnhold), men skal ikke selv sprenge bredden.
  const iframer = [];
  document.querySelectorAll('iframe').forEach((f) => {
    const r = f.getBoundingClientRect();
    if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
      iframer.push(`iframe${f.id ? '#' + f.id : ''} «${(f.getAttribute('src') || '').slice(0, 60)}»`);
    }
  });

  return { sidelengs, utenforBoks, overlapp: overlapp.map((o) => o.s), iframer };
}

const pause = (page, ms) => page.waitForTimeout(ms);

/**
 * Reviderer siden over et definert observasjonsvindu:
 *  1. venter på nettverksro pluss 1 s,
 *  2. kjører geometrikontrollene på hver rulleposisjon (ett visningsvindu om gangen, til bunnen),
 *  3. åpner alle details og kjører kontrollene en gang til,
 *  4. venter 500 ms til slutt, slik at samleren fra samleFeil() får med sene feil.
 * Kalleren leser samleren ETTER at revider() er ferdig.
 * Iframes revideres ikke innvendig; en iframe som selv sprenger bredden rapporteres i `iframer`.
 * @param {{ unntak?: string[], krom?: string[], tilsiktetKlipp?: string[] }} valg
 *   unntak: velgere som hoppes over helt. krom: sidens egne flytende flater (bare par med én side her er unntatt fra overlapp).
 *   tilsiktetKlipp: velgere hvis etterkommere kan være klippet med vilje.
 * @returns {Promise<{ sidelengs: number, utenforBoks: string[], overlapp: string[], iframer: string[] }>}
 */
export async function revider(page, { unntak = [], krom = ['.topp', '.fast', '.samtykke'], tilsiktetKlipp = [] } = {}) {
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  await pause(page, 1000);

  const sum = { sidelengs: 0, utenforBoks: [], overlapp: [], iframer: [] };
  const slaaSammen = (r) => {
    sum.sidelengs = Math.max(sum.sidelengs, r.sidelengs);
    for (const k of ['utenforBoks', 'overlapp', 'iframer']) {
      for (const v of r[k]) if (!sum[k].includes(v)) sum[k].push(v);
    }
  };
  const arg = { unntak, krom, tilsiktet: tilsiktetKlipp };

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  for (let steg = 0; steg < 80; steg++) {
    const { y, maks, h } = await page.evaluate(() => ({
      y: window.scrollY,
      maks: document.documentElement.scrollHeight - window.innerHeight,
      h: window.innerHeight,
    }));
    slaaSammen(await page.evaluate(geometri, arg));
    if (y >= maks - 1) break;
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), Math.min(y + h, maks));
    await pause(page, 120);
  }

  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelectorAll('details').forEach((d) => { d.open = true; });
  });
  await pause(page, 120);
  slaaSammen(await page.evaluate(geometri, arg));

  await pause(page, 500);
  return sum;
}

const samlere = new WeakMap();

/** Samleren som hører til en side (satt av samleFeil eller av zoom med opphav). */
export function feilFor(page) {
  return samlere.get(page);
}

/**
 * Samler konsollfeil, fremmede forespørsler og manglende filer. Sett lyttere før første goto.
 * Fremmed = enhver origin ulik `opphav`. Objektet som returneres er levende: det fylles
 * til siden lukkes, og navigasjon (omlasting, zoom, skalering) tømmer det aldri.
 * Avbrutte medieforespørsler (video/lyd, ERR_ABORTED) er normalt og regnes ikke som mangler.
 */
export function samleFeil(page, opphav) {
  const feil = { konsoll: [], fremmede: [], mangler: [] };
  samlere.set(page, feil);
  page.on('console', (m) => {
    if (m.type() === 'error') feil.konsoll.push(m.text());
  });
  page.on('pageerror', (e) => feil.konsoll.push(String(e.message || e)));
  page.on('request', (req) => {
    const url = req.url();
    if (!/^https?:/i.test(url)) return;
    if (new URL(url).origin !== opphav) feil.fremmede.push(url);
  });
  page.on('response', (res) => {
    const url = res.url();
    if (/^https?:/i.test(url) && new URL(url).origin === opphav && res.status() >= 400 && !/\/favicon\.ico$/.test(url)) {
      feil.mangler.push(`${res.status()} ${url}`);
    }
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    if (!/^https?:/i.test(url) || new URL(url).origin !== opphav) return;
    const aarsak = req.failure()?.errorText || '';
    if (req.resourceType() === 'media' && /ERR_ABORTED/.test(aarsak)) return;
    feil.mangler.push(`feilet ${url}`);
  });
  return feil;
}

// CDP-innstillingen følger sesjonen, så den holdes åpen så lenge siden lever.
const sesjoner = new WeakMap();
async function settStandardSkrift(page, px) {
  let cdp = sesjoner.get(page);
  if (!cdp) {
    cdp = await page.context().newCDPSession(page);
    sesjoner.set(page, cdp);
  }
  await cdp.send('Page.setFontSizes', { fontSizes: { standard: px } });
}

/**
 * Hever nettleserens standard skriftstørrelse fra 16 til 32 px («tekststørrelse 200 %» i
 * nettleserens innstillinger). Dette skalerer rem/em og tekst uten fast størrelse, IKKE px-tekst.
 * Siden CSS-en bruker px, er det bredden på 360 px som dekker 200 % zoom (720 px), ikke denne.
 * Innstillingen nullstilles når siden navigerer til en annen adresse (omlasting beholder den),
 * og kan nullstilles uttrykkelig med nullstillTekst().
 */
export async function storTekst(page) {
  await settStandardSkrift(page, 32);
  const url = page.url();
  const lytter = (frame) => {
    if (frame !== page.mainFrame() || frame.url() === url) return;
    page.off('framenavigated', lytter);
    settStandardSkrift(page, 16).catch(() => {});
  };
  page.on('framenavigated', lytter);
}

export async function nullstillTekst(page) {
  await settStandardSkrift(page, 16);
}

/** Beregnet font-size for hvert tekstelement som treffer `utvalg`. */
async function malFont(page, utvalg) {
  return page.evaluate((v) => {
    const ut = [];
    document.querySelectorAll(v).forEach((el, i) => {
      const harTekst = [...el.childNodes].some((c) => c.nodeType === 3 && c.nodeValue.trim());
      if (!harTekst) return;
      ut.push({ element: `${v}[${i}]`, px: parseFloat(getComputedStyle(el).fontSize) });
    });
    return ut;
  }, utvalg);
}

const kø = new WeakMap();
/**
 * Faktor mellom font-size med og uten storTekst. Siden lastes på nytt med og uten
 * innstillingen. Tilbakestilles til 16 px i `finally`, også når noe feiler.
 */
export function skalering(page, utvalg) {
  // Innstillingen er felles for siden, så kall på samme side må gå etter hverandre.
  const forrige = kø.get(page) || Promise.resolve();
  const neste = forrige.catch(() => {}).then(() => skaleringEnkelt(page, utvalg));
  kø.set(page, neste);
  return neste;
}

async function skaleringEnkelt(page, utvalg) {
  try {
    await settStandardSkrift(page, 16);
    await page.reload();
    const uten = await malFont(page, utvalg);
    await settStandardSkrift(page, 32);
    await page.reload();
    const med = await malFont(page, utvalg);
    return uten.map((u, i) => ({ element: u.element, faktor: (med[i]?.px ?? NaN) / u.px }));
  } finally {
    await settStandardSkrift(page, 16).catch(() => {});
  }
}

/**
 * Emulert nettleserzoom: visningsbredde fraBredde / faktor og deviceScaleFactor faktor.
 * Gi `{ opphav }` for å få samleren installert FØR første navigasjon (hent den med feilFor(side)).
 */
export async function zoom(browser, sti, faktor, fraBredde = 1280, { opphav } = {}) {
  const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const context = await browser.newContext({
    baseURL,
    viewport: { width: Math.round(fraBredde / faktor), height: 800 },
    deviceScaleFactor: faktor,
  });
  const page = await context.newPage();
  if (opphav) samleFeil(page, opphav);
  await page.goto(sti);
  return page;
}
