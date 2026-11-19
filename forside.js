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
  bevegelse.addEventListener('change', settBevegelse);
  settBevegelse();
  // Kokeboka følger rullingen på PC. På mobil sveipes raden direkte.
  {
    const seksjon = document.querySelector('.kokebok');
    const rom = seksjon.querySelector('.retterom'), rad = rom.querySelector('.retter');
    const stor = matchMedia('(min-width:1001px) and (hover:hover)');
    let synlig = !('IntersectionObserver' in window), venter = false;
    const les = () => {
      venter = false;
      const koblet = stor.matches && !bevegelse.matches;
      rom.classList.toggle('koblet', koblet);
      if (!koblet) { rad.style.transform = ''; return; }
      const seksjonsmaal = seksjon.getBoundingClientRect();
      if (!synlig || seksjonsmaal.bottom <= 0 || seksjonsmaal.top >= innerHeight) return;
      const r = rom.getBoundingClientRect();
      const andel = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      const start = Math.max(24, (innerWidth - 1152) / 2), slutt = innerWidth - rad.offsetWidth - start;
      rad.style.transform = 'translateX(' + (start + (slutt - start) * andel).toFixed(1) + 'px)';
    };
    addEventListener('scroll', () => {
      if (synlig && !venter && !bevegelse.matches) { venter = true; requestAnimationFrame(les); }
    }, { passive: true });
    addEventListener('resize', les);
    bevegelse.addEventListener('change', les);
    if ('IntersectionObserver' in window) new IntersectionObserver((rader) => {
      synlig = rader[0].isIntersecting;
      if (synlig) les();
    }).observe(seksjon);
    les();
  }

  // Svarene er håndskrevne eksempler fra TEKST, ferdig fylt og skjermet av generatoren.
  // Én klokke styrer skriving, venting og svar. Den går bare mens seksjonen er i bildet.
  {
    const seksjon = document.getElementById('spor');
    const tekst = seksjon.querySelector('#sporTekst'), felt = tekst.parentElement;
    const forslag = [...seksjon.querySelectorAll('.forslag')];
    const svarene = [...seksjon.querySelectorAll('.spor-eksempel')];
    const kort = seksjon.querySelector('.a-svar'), liste = seksjon.querySelector('#sporListe');
    const antall = seksjon.querySelector('#sporAntall'), forklaring = seksjon.querySelector('#sporForkl');
    const skjelett = [74, 58, 66].map((bredde) => '<div class="a-endr sk" style="--b:' + bredde + '%"><i></i><span></span></div>').join('');
    let synlig = !('IntersectionObserver' in window), ramme = 0, sist = 0, tid = 0;
    let nr = 0, vist = 0, tegn = 0, fase = 'skriver';
    const settSvar = () => {
      liste.replaceChildren(svarene[nr].content.cloneNode(true));
      antall.textContent = svarene[nr].dataset.antall;
      forklaring.textContent = svarene[nr].dataset.forklaring;
      kort.classList.remove('endrer');
      vist = nr;
    };
    const velg = (valgt) => {
      nr = valgt; tegn = 0; tid = 0; fase = 'skriver';
      forslag.forEach((knapp, i) => knapp.setAttribute('aria-pressed', String(i === nr)));
      felt.classList.remove('ferdig');
      // Et nytt valg erstatter også et påbegynt svar, uten å stoppe neste runde.
      if (bevegelse.matches) {
        tekst.textContent = forslag[nr].textContent;
        settSvar();
      } else {
        tekst.textContent = '';
      }
    };
    const tikk = (naa) => {
      ramme = 0;
      if (!synlig || bevegelse.matches) return;
      tid += naa - sist; sist = naa;
      if (fase === 'skriver') {
        const onsket = forslag[nr].textContent;
        if (tid >= 46) {
          tegn = Math.min(onsket.length, tegn + Math.floor(tid / 46)); tid %= 46;
          tekst.textContent = onsket.slice(0, tegn);
          if (tegn === onsket.length) {
            felt.classList.add('ferdig'); tid = 0;
            if (nr === vist && !kort.classList.contains('endrer')) { fase = 'viser'; }
            else {
              fase = 'venter'; kort.classList.add('endrer');
              liste.innerHTML = skjelett; antall.textContent = seksjon.dataset.endrer;
              forklaring.innerHTML = '<i class="skl"></i><i class="skl" style="width:84%"></i><i class="skl" style="width:48%"></i>';
            }
          }
        }
      } else if (fase === 'venter' && tid >= 1900) {
        settSvar(); fase = 'viser';
        // De 1900 millisekundene inngår i prototypens sju sekunder mellom ønsker.
      } else if (fase === 'viser' && tid >= 7000) {
        velg((nr + 1) % forslag.length);
      }
      ramme = requestAnimationFrame(tikk);
    };
    const start = () => {
      if (synlig && !bevegelse.matches && !ramme) { sist = performance.now(); ramme = requestAnimationFrame(tikk); }
    };
    forslag.forEach((knapp, i) => knapp.addEventListener('click', () => { velg(i); start(); }));
    if ('IntersectionObserver' in window) new IntersectionObserver((rader) => {
      synlig = rader[0].isIntersecting;
      seksjon.classList.toggle('i-bildet', synlig);
      if (synlig) start();
      else { cancelAnimationFrame(ramme); ramme = 0; }
    }).observe(seksjon);
    const settRolig = () => {
      cancelAnimationFrame(ramme); ramme = 0;
      if (bevegelse.matches) velg(0);
      else start();
    };
    bevegelse.addEventListener('change', settRolig);
    seksjon.classList.toggle('i-bildet', synlig);
    settRolig();
  }
})();
