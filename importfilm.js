// GENERERT av scripts/hanna-innhold.mjs fra forside.js (importfilm:start til importfilm:slutt). Ikke rediger.
(() => {
  const bevegelse = matchMedia('(prefers-reduced-motion: reduce)');
  const rolig = bevegelse.matches;
  // Felles håndtering av bevegelsesendringer: hver del (kort, Spør Matlyst, film) melder inn hva den gjør når bevegelse slås av (rolig) og på (levende).
  // «change» kan utebli: Chromium sender ikke hendelsen hvis siden leser .matches mellom at innstillingen byttes og at hendelsen leveres, og løkkene leser den hver ramme.
  // Derfor avstemmer vi også mot .matches på steder som alt kjører (rammeløkkene), ved rulling og når fanen blir synlig igjen. Delene kalles bare når tilstanden har endret seg.
  const bevegelseDeler = [];
  let bevegelseRolig = rolig;
  const avstemBevegelse = () => {
    const na = bevegelse.matches;
    if (na === bevegelseRolig) return;
    bevegelseRolig = na;
    bevegelseDeler.forEach((del) => (na ? del.rolig : del.levende)());
  };
  bevegelse.addEventListener('change', avstemBevegelse);
  addEventListener('scroll', avstemBevegelse, { passive: true });
  document.addEventListener('visibilitychange', avstemBevegelse);
  // Film og samlebånd går i loop mens de er i bildet, uten brukerstyrt pause.
  // Ved redusert bevegelse fjernes videokilden, slik at plakaten vises.
  const video = document.querySelector('.film video');
  const kilde = video.getAttribute('src');
  const band = document.querySelector('.band');
  const bane = band.querySelector('.bane');
  let filmSynlig = !('IntersectionObserver' in window);
  const steg = [...document.querySelectorAll('.st')];
  const tider = steg.map((knapp) => Number(knapp.dataset.t));
  const markerSteg = () => {
    let naa = 0;
    tider.forEach((tid, i) => { if (video.currentTime >= tid) naa = i; });
    steg.forEach((knapp, i) => {
      knapp.parentElement.classList.toggle('naa', i === naa);
      if (i === naa) knapp.setAttribute('aria-current', 'step');
      else knapp.removeAttribute('aria-current');
    });
  };
  const fart = () => { video.defaultPlaybackRate = 1.2; video.playbackRate = 1.2; };
  video.addEventListener('loadedmetadata', fart);
  video.addEventListener('play', fart);
  video.addEventListener('timeupdate', markerSteg);
  const spill = () => { if (filmSynlig && !bevegelse.matches) video.play().catch(() => {}); };
  const settBevegelse = () => {
    steg.forEach((knapp) => {
      if (bevegelse.matches) knapp.setAttribute('aria-disabled', 'true');
      else knapp.removeAttribute('aria-disabled');
    });
    if (bevegelse.matches) {
      // load() uten kilde stopper filmen og viser plakaten.
      video.removeAttribute('src');
      video.load();
      document.querySelector('.hero h1')?.classList.add('klar');
      markerSteg();
    } else {
      video.src = kilde;
      fart();
      spill();
    }
  };
  steg.forEach((knapp, i) => knapp.addEventListener('click', () => {
    if (bevegelse.matches) return;
    video.currentTime = tider[i] + 0.05;
    markerSteg();
    spill();
  }));
  if ('IntersectionObserver' in window) {
    const synlighet = new IntersectionObserver((rader) => {
      rader.forEach((rad) => {
        if (rad.target === video) {
          filmSynlig = rad.isIntersecting;
          if (filmSynlig) spill();
          else video.pause();
        } else {
          bane.style.animationPlayState = rad.isIntersecting ? 'running' : 'paused';
        }
      });
    });
    synlighet.observe(video);
    synlighet.observe(band);
  }
  bevegelseDeler.push({ rolig: settBevegelse, levende: settBevegelse });
  settBevegelse();
})();
