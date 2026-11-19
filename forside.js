(() => {
  const bevegelse = matchMedia('(prefers-reduced-motion: reduce)');
  const rolig = bevegelse.matches;
  // Overskriften skrives inn, tegn for tegn
  {
    const h1 = document.querySelector('.hero h1');
    setTimeout(() => h1?.classList.add('klar'), 1500);
    if (!rolig && h1) {
      const tekst = h1.textContent.trim(), tegn = [];
      h1.setAttribute('aria-label', tekst); h1.textContent = '';
      tekst.split(' ').forEach((ord, i, alle) => {
        const o = document.createElement('span'); o.className = 'ord'; o.setAttribute('aria-hidden', 'true');
        [...ord].forEach((t) => { const b = document.createElement('span'); b.className = 'tegn'; b.textContent = t; o.appendChild(b); tegn.push(b); });
        h1.appendChild(o); if (i < alle.length - 1) h1.appendChild(document.createTextNode(' '));
      });
      const skrivestrek = document.createElement('i'); skrivestrek.className = 'skrivestrek'; skrivestrek.setAttribute('aria-hidden', 'true');
      let n = 0;
      const neste = () => {
        if (n >= tegn.length) { skrivestrek.classList.add('ferdig'); setTimeout(() => skrivestrek.remove(), 2100); return; }
        const t = tegn[n++]; t.classList.add('inne'); t.after(skrivestrek);
        // Punktumet kommer etter en liten pause, som når man setter det med vilje
        setTimeout(neste, tegn[n] && tegn[n].textContent === '.' ? 620 : 34 + Math.random() * 34);
      };
      h1.classList.add('klar');
      setTimeout(neste, 260);
    }
  }

  // Menyen i toppen følger med mens du ruller, og viser hvor på siden du er
  {
    const folg = document.getElementById('folg'), lenker = [...folg.querySelectorAll('a')], folgmerke = folg.querySelector('.folgmerke');
    const maal = lenker.map((a) => document.getElementById(a.getAttribute('href').slice(1))), bunnen = document.querySelector('.bunn');
    let aktiv = -2, venter = false;
    const sett = (i) => {
      if (i === aktiv) return; aktiv = i;
      lenker.forEach((a, j) => { if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      if (i < 0) { folgmerke.style.opacity = 0; return; }
      const a = lenker[i]; folgmerke.style.opacity = 1; folgmerke.style.width = a.offsetWidth + 'px'; folgmerke.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    };
    const les = () => {
      venter = false; const grense = innerHeight * 0.42; let i = -1;
      if (scrollY > 120) maal.forEach((m, j) => { if (m && m.getBoundingClientRect().top <= grense) i = j; });
      if (bunnen.getBoundingClientRect().top <= grense) i = -1;
      sett(i);
    };
    addEventListener('scroll', () => { if (!venter) { venter = true; requestAnimationFrame(les); } }, { passive: true });
    addEventListener('resize', () => { aktiv = -2; les(); });
    lenker.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); maal[i]?.scrollIntoView({ behavior: rolig ? 'auto' : 'smooth', block: 'start' }); }));
    les();
  }

  // Samlebåndets CSS-animasjon går i loop uten klikk- eller hoverpause.
  // Ved redusert bevegelse fjernes videokilden, slik at plakaten vises.
  const video = document.querySelector('.film video');
  const kilde = video.getAttribute('src');
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
  const spill = () => { if (!bevegelse.matches) video.play().catch(() => {}); };
  const settBevegelse = () => {
    if (bevegelse.matches) {
      video.pause();
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
  bevegelse.addEventListener('change', settBevegelse);
  settBevegelse();
})();
