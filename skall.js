(() => {
  const bevegelse = matchMedia('(prefers-reduced-motion: reduce)');
  const kurve = 'cubic-bezier(.16,1,.3,1)';

  // Navnet skal stå urørt når nettleseren oversetter siden («matlyst» ble til «medbegær»).
  for (const merke of document.querySelectorAll('.ordmerke')) merke.setAttribute('translate', 'no');

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

  // Innholdsfortegnelsen foldes sammen under 721 px. Uten JavaScript og på PC står lista åpen.
  const smal = matchMedia('(max-width: 720px)');
  document.querySelectorAll('.toc').forEach((toc, i) => {
    const tittel = toc.querySelector('.toc-title');
    const liste = toc.querySelector('ol, ul');
    if (!tittel || !liste) return;
    if (!liste.id) liste.id = 'toc-liste-' + i;
    const oppdater = () => {
      const gammel = toc.querySelector('.toc-knapp');
      if (!smal.matches) {
        if (gammel) { gammel.replaceWith(tittel); liste.hidden = false; }
        return;
      }
      if (gammel) return;
      const knapp = document.createElement('button');
      knapp.type = 'button';
      knapp.className = 'toc-knapp';
      knapp.setAttribute('aria-expanded', 'false');
      knapp.setAttribute('aria-controls', liste.id);
      knapp.textContent = tittel.textContent;
      knapp.addEventListener('click', () => {
        const aapen = knapp.getAttribute('aria-expanded') !== 'true';
        knapp.setAttribute('aria-expanded', String(aapen));
        liste.hidden = !aapen;
      });
      tittel.replaceWith(knapp);
      liste.hidden = true;
    };
    oppdater();
    smal.addEventListener('change', oppdater);
    // Et trykk på en lenke i lista lukker den igjen, så overskriften er synlig.
    liste.addEventListener('click', (e) => {
      if (!smal.matches || !e.target.closest('a')) return;
      toc.querySelector('.toc-knapp')?.setAttribute('aria-expanded', 'false');
      liste.hidden = true;
    });
  });

  // Brede tabeller ruller sideveis i en egen boks i stedet for å bryte ut av lesekolonnen.
  document.querySelectorAll('.locale-prose table').forEach((tabell) => {
    if (tabell.closest('.table-wrap')) return;
    let overskrift = tabell.previousElementSibling;
    while (overskrift && !/^H[1-6]$/.test(overskrift.tagName)) overskrift = overskrift.previousElementSibling;
    const boks = document.createElement('div');
    boks.className = 'table-wrap';
    boks.tabIndex = 0;
    boks.setAttribute('role', 'region');
    boks.setAttribute('aria-label', (overskrift?.textContent || tabell.querySelector('caption')?.textContent || 'Tabell').trim());
    tabell.replaceWith(boks);
    boks.append(tabell);
  });

  // Toppen får en hårlinje nederst når siden er rullet (samme uttrykk på alle sider).
  {
    const topp = document.querySelector('header.topp');
    let ventet = false;
    const sett = () => { ventet = false; topp?.classList.toggle('rullet', scrollY > 0); };
    if (topp) { addEventListener('scroll', () => { if (!ventet) { ventet = true; requestAnimationFrame(sett); } }, { passive: true }); sett(); }
  }

  // Fast knapp vises når startpunktet er forbi og skjules før nedlastingen i bunnen.
  // Undersidene (data-sidetype) starter ved sidens egen topp; forsiden beholder første knapp i main.
  const fast = document.getElementById('fast');
  if (fast) {
    const underside = 'sidetype' in document.body.dataset;
    const forste = underside
      ? document.querySelector('.blad :is(header.locale-page-hero, header.hero, div.hero, main.doc .doc-title, main.legal-doc > header, main h1)') ?? document.querySelector('header.topp')
      : document.querySelector('main [data-hent]');
    const neste = document.querySelector('.bunn [data-hent]');
    let venter = false;
    // Forsidens fliser (#trio og #spor) er høye nok til å fylle en mobilskjerm: knappen skjules mens de er i bildet, og kommer tilbake etterpå.
    const ibildet = new Set();
    const les = () => {
      venter = false;
      const forbi = forste ? forste.getBoundingClientRect().bottom < 0 : scrollY >= 600;
      const vis = forbi && ibildet.size === 0 && (!neste || neste.getBoundingClientRect().top > innerHeight + 40);
      fast.classList.toggle('vis', vis);
      fast.inert = !vis;
    };
    const ko = () => { if (!venter) { venter = true; requestAnimationFrame(les); } };
    if (!underside && 'IntersectionObserver' in window) {
      const flater = new IntersectionObserver((rader) => {
        rader.forEach((rad) => { if (rad.isIntersecting) ibildet.add(rad.target); else ibildet.delete(rad.target); });
        ko();
      });
      for (const id of ['trio', 'spor']) { const el = document.getElementById(id); if (el) flater.observe(el); }
    }
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
