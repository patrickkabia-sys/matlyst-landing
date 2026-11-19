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
    // Patrick 19.11 (slik Apple gjør): siden ruller som nettleseren vil; det som følger rullingen glir mot målet, bare med transform.
    // x += (maal - x) * 0,14 per bilderute (tidsbasert), og løkka stopper når avviket er under 0,1 px.
    let x = null, maal = 0, ramme = 0, sist = 0;
    const sett = () => { rad.style.transform = 'translateX(' + x.toFixed(1) + 'px)'; };
    const glid = (naa) => {
      ramme = 0;
      if (!synlig || x === null) return;
      const dt = Math.min(64, naa - sist); sist = naa;
      x += (maal - x) * (1 - Math.pow(1 - 0.14, dt / 16.667));
      if (Math.abs(maal - x) < 0.1) { x = maal; sett(); return; }
      sett();
      ramme = requestAnimationFrame(glid);
    };
    const les = () => {
      venter = false;
      const koblet = stor.matches && !bevegelse.matches;
      rom.classList.toggle('koblet', koblet);
      if (!koblet) { cancelAnimationFrame(ramme); ramme = 0; x = null; rad.style.transform = ''; return; }
      const seksjonsmaal = seksjon.getBoundingClientRect();
      if (!synlig || seksjonsmaal.bottom <= 0 || seksjonsmaal.top >= innerHeight) return;
      const r = rom.getBoundingClientRect();
      const andel = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      const start = Math.max(24, (innerWidth - 1152) / 2), slutt = innerWidth - rad.offsetWidth - start;
      maal = start + (slutt - start) * andel;
      if (x === null) { x = maal; sett(); return; }
      if (!ramme) { sist = performance.now(); ramme = requestAnimationFrame(glid); }
    };
    addEventListener('scroll', () => {
      if (synlig && !venter && !bevegelse.matches) { venter = true; requestAnimationFrame(les); }
    }, { passive: true });
    addEventListener('resize', les);
    bevegelse.addEventListener('change', les);
    if ('IntersectionObserver' in window) new IntersectionObserver((rader) => {
      synlig = rader[0].isIntersecting;
      if (synlig) les(); else { cancelAnimationFrame(ramme); ramme = 0; }
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
    // Patrick 19.11: på mobil vises bare to endringer, og tallet i etiketten følger med (første tall i teksten fra TEKST).
    const smal = matchMedia('(max-width:720px)');
    const antallTekst = (tekst) => (smal.matches ? tekst.replace(/\d+/, (n) => Math.min(2, Number(n))) : tekst);
    const settSvar = () => {
      liste.replaceChildren(svarene[nr].content.cloneNode(true));
      antall.textContent = antallTekst(svarene[nr].dataset.antall);
      forklaring.textContent = svarene[nr].dataset.forklaring;
      seksjon.querySelector('#sporSvar').setAttribute('aria-label', svarene[nr].dataset.aria);
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
    const tilpassAntall = () => { if (!kort.classList.contains('endrer')) antall.textContent = antallTekst(svarene[vist].dataset.antall); };
    smal.addEventListener('change', tilpassAntall);
    tilpassAntall();
    seksjon.classList.toggle('i-bildet', synlig);
    settRolig();
  }
  // Pris, personvern og svar glir inn én gang, som i prototypen.
  if ('IntersectionObserver' in window) {
    const inn = new IntersectionObserver((rader) => rader.forEach((rad) => {
      if (!rad.isIntersecting) return;
      inn.unobserve(rad.target);
      if (bevegelse.matches) return;
      const fra = rad.target.dataset.inn;
      // Patrick 19.11: inn-sveipet er bare opacity og en liten translateY (12 px), ferdig før brukeren når flaten; stort sideveis sveip ser ut som risting.
      const start = 'translateY(12px)';
      rad.target.animate([{ opacity: 0, transform: start }, { opacity: 1, transform: 'none' }], { duration: 600, fill: 'backwards', easing: 'cubic-bezier(.16,1,.3,1)' });
    }), { threshold: 0.18 });
    const flater = document.querySelectorAll('.plan[data-inn], .vernblokk[data-inn], .svarliste[data-inn]');
    flater.forEach((el) => inn.observe(el));
    bevegelse.addEventListener('change', () => {
      if (bevegelse.matches) flater.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    });
  }
  // Hvert kort har en egen tidslinje. Klokka går bare mens kortet er i bildet.
  // Kortstabling på mobil (klassen `stabel` på #trio, av som standard): en rute som den neste har dekket, står stille på samme måte som en rute utenfor bildet.
  const trio = document.getElementById('trio');
  const smalSkjerm = matchMedia('(max-width:720px)');
  const stabler = () => trio.classList.contains('stabel') && smalSkjerm.matches;
  const kortRegister = [];
  const mal = (rute) => { const r = rute.getBoundingClientRect(), n = rute.nextElementSibling?.getBoundingClientRect(); return { r, n }; };
  // Det som sees av ruta er det den neste ikke dekker (bare noen piksler av stabelkanten).
  const dekkes = (rute) => {
    if (!stabler() || !rute.nextElementSibling?.classList.contains('rute')) return false;
    const { r, n } = mal(rute);
    const over = Math.max(0, Math.min(r.bottom, n.top) - r.top), under = Math.max(0, r.bottom - Math.max(n.bottom, r.top));
    return over + under < 16;
  };
  {
    let venter = false;
    const les = () => { venter = false; kortRegister.forEach((k) => k.sett(dekkes(k.rute))); };
    const ko = () => { if (!venter) { venter = true; requestAnimationFrame(les); } };
    addEventListener('scroll', ko, { passive: true });
    addEventListener('resize', ko);
    smalSkjerm.addEventListener('change', ko);
    if (trio) new MutationObserver(ko).observe(trio, { attributes: true, attributeFilter: ['class'] });
    // Fokus på et element i en dekket rute ruller ruta fram: den settes til sitt eget plassnivå i stabelen.
    trio?.addEventListener('focusin', (e) => {
      const rute = e.target.closest('.rute');
      if (!rute || !stabler() || !dekkes(rute)) return;
      const ruter = [...trio.children], i = ruter.indexOf(rute);
      const gap = parseFloat(getComputedStyle(trio).rowGap) || 0;
      const naturlig = trio.getBoundingClientRect().top + scrollY + ruter.slice(0, i).reduce((sum, el) => sum + el.offsetHeight + gap, 0);
      scrollTo({ top: naturlig - parseFloat(getComputedStyle(rute).top), behavior: bevegelse.matches ? 'auto' : 'smooth' });
    });
    ko();
  }
  const kortloep = (id, bygg) => {
    const app = document.getElementById(id), rute = app.closest('.rute');
    let synlig = !('IntersectionObserver' in window), ioSynlig = synlig, dekket = false, ramme = 0, sist = 0, tid = 0, neste = 0, innkommet = false, inngang = null;
    const animer = (el, rammer, valg) => {
      if (!bevegelse.matches && synlig) return el.animate(rammer, valg);
    };
    const settInn = (el, verdi) => {
      if (el.textContent === verdi) return;
      el.textContent = verdi;
      animer(el, [{ opacity: 0, transform: 'translateY(7px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
    };
    const trykk = (el) => animer(el, [{ transform: 'scale(1)' }, { transform: 'scale(.88)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
    const pek = (el, ms = 950) => {
      const scene = app.querySelector('.a-lagscene') || app;
      const tapp = app.querySelector('.a-tapp'), s = scene.getBoundingClientRect(), r = el.getBoundingClientRect();
      tapp.style.transform = `translate(${r.left + r.width / 2 - s.left}px,${r.top + r.height / 2 - s.top}px)`;
      const holder = ms > 1000;
      animer(tapp.firstElementChild, [{ opacity: 0, transform: 'scale(1.5)' }, { opacity: 1, transform: 'scale(1)', offset: holder ? .14 : .35 }, { opacity: 1, transform: 'scale(.86)', offset: holder ? .88 : .55 }, { opacity: 0, transform: 'scale(1)' }], { duration: ms, easing: 'ease-out' });
      animer(tapp.lastElementChild, [{ opacity: 0, transform: 'scale(1)' }, { opacity: .85, transform: 'scale(1)', offset: holder ? .14 : .52 }, { opacity: 0, transform: 'scale(2.6)' }], { duration: ms, easing: holder ? 'linear' : 'ease-out' });
    };
    const forloep = bygg(app, { settInn, trykk, pek, animer, begynn: () => { tid = 0; neste = 1; } });
    const tikk = (naa) => {
      ramme = 0;
      if (!synlig || bevegelse.matches) return;
      tid += naa - sist; sist = naa;
      while (neste < forloep.steg.length && tid >= forloep.steg[neste][0]) forloep.steg[neste++][1]();
      if (tid >= forloep.lengde) { tid %= forloep.lengde; neste = 0; }
      ramme = requestAnimationFrame(tikk);
    };
    const start = () => {
      if (synlig && !bevegelse.matches && !ramme) { sist = performance.now(); ramme = requestAnimationFrame(tikk); }
    };
    // Ruta går bare mens den er i bildet og ikke dekket av den neste.
    const bruk = (tvang) => {
      const ny = ioSynlig && !dekket;
      if (ny === synlig && !tvang) return;
      synlig = ny;
      rute.classList.toggle('i-bildet', synlig);
      if (synlig) {
        rute.getAnimations({ subtree: true }).forEach((a) => { if (a.playState === 'paused') a.play(); });
        if (!innkommet && !bevegelse.matches) {
          innkommet = true;
          inngang = animer(rute, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 600, fill: 'backwards', easing: 'cubic-bezier(.16,1,.3,1)' });
        }
        start();
      } else {
        cancelAnimationFrame(ramme); ramme = 0;
        // Innsveipet er en engangsbevegelse: pauses det utenfor bildet, står kortet igjen utenfor kolonnen (translateX 96 px).
        if (inngang) { inngang.finish(); inngang = null; }
        rute.getAnimations({ subtree: true }).forEach((a) => a.pause());
      }
    };
    if ('IntersectionObserver' in window) new IntersectionObserver((rader) => { ioSynlig = rader[0].isIntersecting; bruk(true); }, { threshold: .08 }).observe(rute);
    kortRegister.push({ rute, sett: (d) => { if (d === dekket) return; dekket = d; rute.classList.toggle('dekket', d); if ('IntersectionObserver' in window) bruk(false); } });
    const roligKort = () => {
      cancelAnimationFrame(ramme); ramme = 0;
      rute.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      tid = 0; neste = 0;
      if (bevegelse.matches) { innkommet = true; forloep.slutt(); }
      // Utenfor bildet beholdes stillbildet til neste synlige ramme.
      else if (synlig) { forloep.steg[0][1](); neste = 1; start(); }
    };
    bevegelse.addEventListener('change', roligKort);
    roligKort();
  };
  kortloep('demoSkaler', (app, { settInn, trykk }) => {
    const antall = app.querySelector('.antall'), pluss = app.querySelector('.pluss');
    const sett = (i) => {
      settInn(antall, antall.dataset.antall.split('|')[i]);
      app.querySelectorAll('[data-m]').forEach((m) => settInn(m, m.dataset.m.split('|')[i]));
    };
    return { lengde: 8500, slutt: () => sett(2), steg: [[0, () => sett(0)], [2400, () => { trykk(pluss); sett(1); }], [4300, () => { trykk(pluss); sett(2); }]] };
  });
  kortloep('demoLag', (app, { pek, trykk }) => {
    const scene = app.querySelector('.a-lagscene'), timer = app.querySelector('.a-timer'), tid = app.querySelector('.a-tid');
    const steg = app.querySelector('.a-steg'), start = app.querySelector('.start'), tider = app.dataset.tider.split('|');
    const maal = () => scene.style.setProperty('--kh', timer.offsetHeight + 'px');
    addEventListener('resize', maal); maal();
    const nullstill = () => { steg.classList.remove('ferdig'); scene.classList.remove('timer'); tid.textContent = tider[0]; };
    return { lengde: 16780, slutt: () => { nullstill(); steg.classList.add('ferdig'); }, steg: [
      [0, nullstill], [2800, () => pek(app.querySelector('u'))], [3440, () => { maal(); scene.classList.add('timer'); }],
      [5940, () => pek(start)], [6460, () => trykk(start)],
      ...tider.slice(1).map((tekst, i) => [6980 + i * 1000, () => { tid.textContent = tekst; }]),
      [11980, () => scene.classList.remove('timer')], [12980, () => steg.classList.add('ferdig')],
    ] };
  });
  kortloep('demoPlan', (app, { trykk }) => ({
    lengde: 10320, slutt: () => app.classList.add('aapen'), steg: [
      [0, () => app.classList.remove('aapen')], [3400, () => trykk(app.querySelector('.a-uke'))],
      [3660, () => app.classList.add('aapen')], [10060, () => trykk(app.querySelector('.a-uke'))],
    ],
  }));
  kortloep('demoHandle', (app, { settInn, trykk, pek }) => {
    const rett = app.querySelector('.handle-rett'), meny = app.querySelector('.a-meny'), ark = app.querySelector('.a-ark');
    const antall = ark.querySelector('.antall'), pluss = ark.querySelector('.pluss'), oppdater = ark.querySelector('.a-oppdater');
    const porsjoner = antall.dataset.antall.split('|');
    const sett = (i) => app.querySelectorAll('[data-m]').forEach((m) => settInn(m, m.dataset.m.split('|')[i]));
    const merker = app.querySelector('.a-merker');
    // Patrick 19.11: rettene står på en sveipbar linje på mobil. Før «hold inne» rulles linja så retten står først og helt synlig; ved start går den tilbake.
    const rullRad = (rad, mal, mykt) => { if (rad.scrollWidth > rad.clientWidth) rad.scrollTo({ left: Math.max(0, mal.getBoundingClientRect().left - rad.getBoundingClientRect().left + rad.scrollLeft - 12), behavior: mykt && !bevegelse.matches ? 'smooth' : 'auto' }); };
    const lukk = () => { ark.classList.remove('vis'); meny.classList.remove('vis'); app.classList.remove('modal'); rett.classList.remove('valgt'); };
    return { lengde: 17150, slutt: () => { lukk(); sett(1); antall.textContent = porsjoner[2]; if (merker) merker.scrollTo({ left: 0, behavior: 'auto' }); }, steg: [
      [0, () => { lukk(); sett(0); antall.textContent = porsjoner[0]; if (merker) merker.scrollTo({ left: 0, behavior: 'auto' }); }],
      [2000, () => { if (merker) rullRad(merker, rett, true); }],
      [3000, () => { pek(rett, 1300); rett.classList.add('valgt'); }],
      [4250, () => { const h = app.getBoundingClientRect(), r = rett.getBoundingClientRect(); // Menyen klemmes alltid innenfor flaten (12 px luft), vannrett og loddrett.
        const klem = (v, lav, hoy) => Math.max(lav, Math.min(v, Math.max(lav, hoy)));
        meny.style.left = klem(r.left - h.left, 12, h.width - meny.offsetWidth - 12) + 'px'; meny.style.top = klem(r.bottom - h.top + 8, 12, h.height - meny.offsetHeight - 12) + 'px'; app.classList.add('modal'); meny.classList.add('vis'); }],
      [5750, () => pek(meny.firstElementChild, 900)], [6180, () => trykk(meny.firstElementChild)],
      [6600, () => { meny.classList.remove('vis'); ark.classList.add('vis'); }],
      [8300, () => { trykk(pluss); settInn(antall, porsjoner[1]); }], [9600, () => { trykk(pluss); settInn(antall, porsjoner[2]); }],
      [11100, () => trykk(oppdater)], [11550, lukk], [11950, () => sett(1)],
    ] };
  });
  kortloep('demoHus', (app, { animer, begynn }) => {
    const knapper = [...app.querySelectorAll('.a-husvelg button')], maler = [...app.querySelectorAll('.hus-eksempel')], flate = app.querySelector('.a-husflate');
    let nr = 0;
    const leggInn = () => {
      flate.querySelector('.ny')?.classList.remove('skjult');
      flate.querySelector(`[data-n="${maler[nr].dataset.sist}"]`)?.classList.add('la-inn');
    };
    const tegn = (i, ferdig = false) => {
      nr = i; flate.replaceChildren(maler[nr].content.cloneNode(true));
      knapper.forEach((b, j) => b.setAttribute('aria-pressed', String(j === nr)));
      // Det valgte husstandsvalget skal alltid være synlig i sveiperaden (mobil).
      const rad = app.querySelector('.a-husvelg');
      if (rad && rad.scrollWidth > rad.clientWidth) rad.scrollTo({ left: Math.max(0, knapper[nr].getBoundingClientRect().left - rad.getBoundingClientRect().left + rad.scrollLeft - 8), behavior: bevegelse.matches ? 'auto' : 'smooth' });
      if (ferdig) leggInn();
      animer(flate, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
    };
    knapper.forEach((b, i) => b.addEventListener('click', () => { tegn(i, bevegelse.matches); begynn(); }));
    return { lengde: 7800, slutt: () => tegn(nr, true), steg: [
      [0, () => tegn(nr)], [2600, leggInn], [4800, () => flate.querySelector('.la-inn')?.classList.remove('la-inn')],
      [7799, () => { nr = (nr + 1) % maler.length; }],
    ] };
  });
})();
