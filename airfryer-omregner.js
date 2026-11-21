// Omregneren fra ovn med varmluft til airfryer (/airfryer/ og /airfryer/ovn-til-airfryer/).
// Filen har ingen tall og ingen tekst selv: tabellen og meldingene ligger i skjemaets egen script[data-oaf-data], som scripts/familier/airfryer/tekst-nb.mjs skriver fra datafila.
// Temperatur: lineært mellom raden over og under i tabellen. Tid: gjennomsnittet av tid i airfryer delt på tid i ovn, fra de samme radene.
(() => {
  const skjemaer = document.querySelectorAll('form[data-oaf]');
  for (const skjema of skjemaer) {
    try {
      const data = JSON.parse(skjema.querySelector('script[data-oaf-data]').textContent);
      const temp = skjema.querySelector('[data-felt="temp"]');
      const tid = skjema.querySelector('[data-felt="tid"]');
      const svar = skjema.querySelector('[data-felt="svar"]');
      if (!data.rader.length || !data.tider.length || !temp || !tid || !svar) continue;
      const rader = [...data.rader].sort((a, b) => a[0] - b[0]);
      const faktor = data.tider.reduce((sum, [ovn, af]) => sum + af / ovn, 0) / data.tider.length;
      const tall = (felt) => {
        const t = String(felt.value).trim().replace(',', '.');
        if (!/^\d+(\.\d+)?$/u.test(t)) return null;
        const n = Number(t);
        return Number.isFinite(n) && n > 0 ? n : null;
      };
      const tempUt = (ovn) => {
        for (let i = 1; i < rader.length; i += 1) {
          const [o1, a1] = rader[i - 1];
          const [o2, a2] = rader[i];
          if (ovn <= o2) return a1 + ((a2 - a1) * (ovn - o1)) / (o2 - o1);
        }
        return null;
      };
      const regn = () => {
        const t = tall(temp);
        const m = tall(tid);
        const min = rader[0][0];
        const maks = rader.at(-1)[0];
        if (t === null || t < min || t > maks) { svar.textContent = data.feilTemp.replace('{min}', min).replace('{max}', maks); return; }
        if (m === null) { svar.textContent = data.feilTid; return; }
        const verdier = { '{temp}': Math.round(tempUt(t)), '{tid}': Math.max(1, Math.round(m * faktor)) };
        // Delene med like indekser er vanlig tekst, de med odde indekser står i fet skrift (svaret bygges uten innerHTML).
        svar.replaceChildren(...data.svar.map((del, i) => {
          const tekst = del.replace(/\{(?:temp|tid)\}/gu, (nokkel) => verdier[nokkel]);
          if (i % 2 === 0) return document.createTextNode(tekst);
          const fet = document.createElement('strong');
          fet.textContent = tekst;
          return fet;
        }));
      };
      temp.addEventListener('input', regn);
      tid.addEventListener('input', regn);
    } catch {
      // Et ødelagt skjema hoppes over, og det statiske svaret i HTML-en blir stående.
    }
  }
})();
