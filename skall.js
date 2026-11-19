(() => {
  const bevegelse = matchMedia('(prefers-reduced-motion: reduce)');
  const kurve = 'cubic-bezier(.16,1,.3,1)';

  // Hyllemenyen kan mangle på sider som bare bruker deler av skallet.
  const knapp = document.getElementById('menyknapp');
  const panel = document.getElementById('panel');
  if (knapp && panel) {
    const settMeny = (aapen) => {
      knapp.setAttribute('aria-expanded', String(aapen));
      panel.hidden = !aapen;
      if (aapen && !bevegelse.matches && panel.animate) {
        panel.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: kurve });
      }
    };
    knapp.addEventListener('click', () => settMeny(panel.hidden));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) { settMeny(false); knapp.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (!panel.hidden && !panel.contains(e.target) && !knapp.contains(e.target)) settMeny(false);
    });
    const lukkVedFokusUt = (e) => {
      if (e.relatedTarget === null) return;
      if (!panel.contains(e.relatedTarget) && !knapp.contains(e.relatedTarget)) settMeny(false);
    };
    knapp.addEventListener('focusout', lukkVedFokusUt);
    panel.addEventListener('focusout', lukkVedFokusUt);
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) settMeny(false); });
  }

  // HTML-en er åpen uten JavaScript. Bare smale skjermer får hylleknapper.
  const bred = matchMedia('(min-width: 721px)');
  for (const reol of document.querySelectorAll('#panel .reol, #bunnreol')) {
    const fag = [...reol.querySelectorAll('.fag')];
    const oppdater = () => fag.forEach((f) => {
      const gammel = f.querySelector('.fagknapp');
      if (!gammel) return;
      const haddeFokus = gammel === document.activeElement;
      const hode = document.createElement(bred.matches ? 'span' : 'button');
      if (bred.matches) hode.tabIndex = -1;
      hode.className = 'fagknapp';
      hode.append(...gammel.childNodes);
      f.classList.toggle('aapen', bred.matches);
      if (!bred.matches) {
        hode.type = 'button';
        hode.setAttribute('aria-expanded', 'false');
        hode.addEventListener('click', () => {
          const aapen = !f.classList.contains('aapen');
          // Menyen viser én hylle om gangen. Bunnhyllene kan åpnes uavhengig.
          if (reol.closest('#panel')) fag.forEach((annet) => {
            annet.classList.remove('aapen');
            annet.querySelector('.fagknapp')?.setAttribute('aria-expanded', 'false');
          });
          f.classList.toggle('aapen', aapen);
          hode.setAttribute('aria-expanded', String(aapen));
        });
      }
      // Flytt fokus mens begge hodene er i DOM, så fokusvakten ser målet i panelet.
      gammel.before(hode);
      if (haddeFokus) hode.focus();
      gammel.remove();
    });
    oppdater();
    bred.addEventListener('change', oppdater);
  }

  // QR-vinduet forbedrer vanlige /app-lenker bare på PC med presis peker.
  const hent = document.getElementById('hent');
  if (hent) {
    const stor = matchMedia('(min-width:1001px) and (hover:hover) and (pointer:fine)');
    let fra = null;
    let lukker = false;
    const lukk = () => {
      if (!hent.open || lukker) return;
      if (bevegelse.matches || !hent.animate) { hent.close(); return; }
      lukker = true;
      hent.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 170, easing: 'ease-in' }).onfinish = () => { hent.close(); lukker = false; };
    };
    document.querySelectorAll('[data-hent]').forEach((a) => a.addEventListener('click', (e) => {
      if (!stor.matches || typeof hent.showModal !== 'function' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      fra = a;
      if (!hent.open) hent.showModal();
      if (!bevegelse.matches && hent.animate) hent.animate([{ opacity: 0, transform: 'scale(.94) translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: kurve });
    }));
    hent.addEventListener('click', (e) => { if (e.target === hent) lukk(); });
    hent.querySelector('.lukk')?.addEventListener('click', lukk);
    hent.addEventListener('cancel', (e) => { e.preventDefault(); lukk(); });
    hent.addEventListener('close', () => fra?.focus());
  }

  // Fast knapp vises når startpunktet er forbi og skjules før nedlastingen i bunnen.
  // Undersidene (data-sidetype) starter ved sidens egen topp; forsiden beholder første knapp i main.
  const fast = document.getElementById('fast');
  if (fast) {
    const underside = 'sidetype' in document.body.dataset;
    const forste = underside
      ? document.querySelector('.blad :is(header.locale-page-hero, header.hero, div.hero, main.doc .doc-title, main.legal-doc > header, main h1)')
      : document.querySelector('main [data-hent]');
    const neste = document.querySelector('.bunn [data-hent]');
    let venter = false;
    const les = () => {
      venter = false;
      const forbi = forste ? forste.getBoundingClientRect().bottom < 0 : scrollY >= 600;
      const vis = forbi && (!neste || neste.getBoundingClientRect().top > innerHeight + 40);
      fast.classList.toggle('vis', vis);
      fast.inert = !vis;
    };
    const ko = () => { if (!venter) { venter = true; requestAnimationFrame(les); } };
    addEventListener('scroll', ko, { passive: true });
    addEventListener('resize', ko);
    if ('ResizeObserver' in window) new ResizeObserver(ko).observe(document.body);
    les();
  }

  // Alle 40 former kommer før noen gjentas. Logoen er fortsatt en vanlig hjemlenke.
  const merke = document.getElementById('merke');
  const [bak, foran] = merke?.querySelectorAll('.merkeflis img') || [];
  if (bak && foran) {
    const former = Array.from({ length: 40 }, (_, i) => '/images/forside/logo/' + String(i + 1).padStart(2, '0') + '.webp');
    let form = 13, takt = 0, over = false, klar = false, lastet = false;
    const nesteForm = () => {
      if (bevegelse.matches || !klar) return;
      form = (form + 7) % former.length;
      const kilde = former[form], bilde = new Image();
      bilde.onload = () => {
        if (bevegelse.matches) return;
        foran.src = kilde; foran.classList.add('inn');
        setTimeout(() => { bak.src = kilde; foran.classList.remove('inn'); }, 170);
      };
      bilde.src = kilde;
    };
    const startTakt = () => {
      clearInterval(takt);
      if (!klar || bevegelse.matches) return;
      if (!lastet) { lastet = true; former.forEach((kilde) => { new Image().src = kilde; }); }
      takt = setInterval(nesteForm, over ? 280 : 3000);
    };
    merke.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      over = true; nesteForm(); startTakt();
    });
    merke.addEventListener('pointerleave', () => { over = false; startTakt(); });
    bevegelse.addEventListener('change', startTakt);
    setTimeout(() => { klar = true; startTakt(); }, 1800);
  }
})();
