// Revisjonsmotoren: bevis for at en side ikke ruller sidelengs, ikke klipper eller
// overlapper tekst, ikke gir konsollfeil og ikke kaller fremmede verter.

/**
 * Kjører kontrollene i siden. Unntak er CSS-velgere som hoppes over.
 * @returns {{ sidelengs: number, utenforBoks: string[], overlapp: string[] }}
 */
export async function revider(page, { unntak = [] } = {}) {
  return page.evaluate((unntakVelgere) => {
    const alle = ['.skip-link', ...unntakVelgere].join(',');
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

    const rullbar = (cs) => /(auto|scroll)/.test(cs.overflowX + cs.overflowY);

    const blad = document.querySelector('.blad') || document.body;
    const sidelengsBoks = blad.getBoundingClientRect();

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

    const utenforBoks = [];
    for (const { n, el, rekter } of tekst) {
      // Tekst i en rullbar boks (eller under en) er ikke klippet, bare scrollet.
      let rullbarForelder = false;
      let boks = null;
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
        if (rullbar(cs)) { rullbarForelder = true; break; }
        if (!boks) boks = e;
      }
      if (rullbarForelder) continue;
      let ute = false;
      for (const r of rekter) {
        if (boks) {
          const b = boks.getBoundingClientRect();
          if (r.left < b.left - 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.bottom > b.bottom + 1) ute = true;
        }
        if (r.left < sidelengsBoks.left - 1 || r.right > sidelengsBoks.right + 1) ute = true;
      }
      if (ute) utenforBoks.push(beskriv(el, n.nodeValue));
    }

    // Overlapp: kort på øvre kant, så kan vi stoppe tidlig. Rektene krympes litt loddrett
    // fordi tekstens innholdsboks er høyere enn linjehøyden.
    // Fastlåste flater (cookiebanner, topplinje) ligger med vilje oppå innholdet.
    const fastRot = (el) => {
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        if (getComputedStyle(e).position === 'fixed') return e;
      }
      return null;
    };
    const linjer = [];
    tekst.forEach((t, i) => {
      for (const r of t.rekter) {
        const krymp = r.height * 0.1;
        linjer.push({ i, fast: fastRot(t.el), el: t.el, n: t.n, l: r.left, r: r.right, t: r.top + krymp, b: r.bottom - krymp });
      }
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
        if (a.fast !== b.fast) continue;
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const w = Math.min(a.r, b.r) - Math.max(a.l, b.l);
        const h = Math.min(a.b, b.b) - Math.max(a.t, b.t);
        if (w > 0 && h > 0 && w * h > 4) {
          const nokkel = a.i + ':' + b.i;
          if (sett.has(nokkel)) continue;
          sett.add(nokkel);
          overlapp.push({ top: a.t, s: `${beskriv(a.el, a.n.nodeValue)} over ${beskriv(b.el, b.n.nodeValue)}` });
        }
      }
    }
    overlapp.sort((a, b) => a.top - b.top);

    return { sidelengs, utenforBoks, overlapp: overlapp.map((o) => o.s) };
  }, unntak);
}

/**
 * Samler konsollfeil, fremmede forespørsler og manglende filer. Sett lyttere før første goto.
 * Fremmed = enhver origin ulik `opphav`.
 */
export function samleFeil(page, opphav) {
  const feil = { konsoll: [], fremmede: [], mangler: [] };
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
    if (/^https?:/i.test(url) && new URL(url).origin === opphav) feil.mangler.push(`feilet ${url}`);
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

/** Nettleserens tekststørrelse på 200 % (standard 16 px til 32 px). Gjelder rem og em, ikke px. */
export async function storTekst(page) {
  await settStandardSkrift(page, 32);
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

/**
 * Faktor mellom font-size med og uten storTekst. Siden lastes på nytt med og uten
 * innstillingen, og settes tilbake til 16 px til slutt.
 */
const kø = new WeakMap();
export function skalering(page, utvalg) {
  // Innstillingen er felles for siden, så kall på samme side må gå etter hverandre.
  const forrige = kø.get(page) || Promise.resolve();
  const neste = forrige.catch(() => {}).then(() => skaleringEnkelt(page, utvalg));
  kø.set(page, neste);
  return neste;
}

async function skaleringEnkelt(page, utvalg) {
  await settStandardSkrift(page, 16);
  await page.reload();
  const uten = await malFont(page, utvalg);
  await storTekst(page);
  await page.reload();
  const med = await malFont(page, utvalg);
  await settStandardSkrift(page, 16);
  return uten.map((u, i) => ({ element: u.element, faktor: (med[i]?.px ?? NaN) / u.px }));
}

/** Emulert nettleserzoom: visningsbredde fraBredde / faktor og deviceScaleFactor faktor. */
export async function zoom(browser, sti, faktor, fraBredde = 1280) {
  const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const context = await browser.newContext({
    baseURL,
    viewport: { width: Math.round(fraBredde / faktor), height: 800 },
    deviceScaleFactor: faktor,
  });
  const page = await context.newPage();
  await page.goto(sti);
  return page;
}
