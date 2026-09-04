/* Selvbetjent importsperre for matskapere.
   Skjemaet ligger i skapere/index.html og poster JSON til edge-funksjonen
   `sperr-meg`. Ingen tredjeparts-bibliotek, ingen alert(): all tilbakemelding
   skjer i sida, i et aria-live-område. */
(function () {
  'use strict';

  /* ─── KONTRAKT ────────────────────────────────────────────────────────────
     URL, feltnavn og svarformat eies av edge-funksjonen `sperr-meg`
     (supabase/functions/sperr-meg i app-repoet). Endres kontrakten der, er
     DETTE objektet det eneste stedet den skal rettes på nettsida.
     Trenger funksjonen apikey eller Authorization, legges hodet inn i
     `hoder` her, ikke i fetch-kallet under.

     Kroppen vi sender:
       { handle: "...", epost: "...", bekreftet: true, emne: "" }
     `epost` utelates når feltet er tomt. `emne` er honningkrukka og sendes
     ALLTID, tom for et menneske. Endepunktet avviser en utfylt `emne`.

     Suksess er ALLTID 200, også når håndtaket alt var sperret: svaret er
     bit for bit likt i begge tilfeller, med vilje, slik at det ikke avslører
     om noen har sperret seg før. Det finnes ingen 409.
       { ok: true, sperret: true, type: "...", kilde: "...", melding: "..." }
     `kilde` er den normaliserte kilden, og den er trygg å vise.

     Feil:
       { ok: false, feil: "...", melding: "..." }
       400  ikke_bekreftet | tom | ugyldig_kilde | ukjent_profil |
            krever_manuell | ugyldig_kropp
       429  for_mange
       500  uventet
     `melding` er ferdig formulert og skal vises UENDRET. Særlig
     `krever_manuell` sier noe skjemaet ikke kan gjette, nemlig at kilden er
     stor nok til å måtte gjennom et menneske. Egne tekster her ville slettet
     den forklaringen, så de er kun reserve for når `melding` mangler. */
  var SPERR_ENDEPUNKT = {
    url: 'https://uaryzmqvoqljjwqvgzoi.supabase.co/functions/v1/sperr-meg',
    felt: {
      kilde: 'handle',          // «@navn», «navn», «instagram.com/navn» eller «https://minblogg.no»
      epost: 'epost',           // valgfri, tom streng sendes ikke
      bekreftelse: 'bekreftet', // alltid true, avkryssingen er påkrevd i skjemaet
      agn: 'emne'               // honningkrukke, sendes alltid, tom for et menneske
    },
    svar: {
      kilde: 'kilde',           // normalisert kilde, brukes i kvitteringen
      melding: 'melding'        // ferdig tekst, vises uendret i feilboksen
    },
    hoder: { 'Content-Type': 'application/json' },
    tidsgrenseMs: 15000
  };
  /* ─────────────────────────────────────────────────────────────────────── */

  var EPOST = 'hei@matlyst-app.no';

  var form = document.getElementById('sperre-form');
  if (!form) return;

  var kilde = document.getElementById('sperre-kilde');
  var epost = document.getElementById('sperre-epost');
  var agn = document.getElementById('sperre-emne');
  var bekreft = document.getElementById('sperre-bekreft');
  var knapp = document.getElementById('sperre-send');
  var status = document.getElementById('sperre-status');
  var feilKilde = document.getElementById('sperre-kilde-feil');
  var feilEpost = document.getElementById('sperre-epost-feil');
  var feilBekreft = document.getElementById('sperre-bekreft-feil');

  var sender = false;

  function visFeltfeil(felt, boks, melding) {
    boks.textContent = melding;
    boks.hidden = false;
    if (felt.type !== 'checkbox') felt.setAttribute('aria-invalid', 'true');
  }

  function nullstillFeltfeil() {
    [[kilde, feilKilde], [epost, feilEpost], [bekreft, feilBekreft]].forEach(function (par) {
      par[1].textContent = '';
      par[1].hidden = true;
      par[0].removeAttribute('aria-invalid');
    });
  }

  function visStatus(melding, erOk) {
    status.textContent = melding;
    status.className = 'sperre-status' + (erOk ? ' ok' : '');
  }

  function tomStatus() {
    status.textContent = '';
    status.className = 'sperre-status';
  }

  // Bevisst løs sjekk: e-post er valgfritt, og et for strengt mønster avviser
  // gyldige adresser. Vi ser bare etter én krøllalfa med tekst på hver side.
  function serUtSomEpost(v) {
    return /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(v);
  }

  // Plukker ut en streng fra svaret bare hvis den faktisk er en streng med
  // innhold. Mangler den, faller vi tilbake på egen tekst.
  function tekst(json, nokkel) {
    if (!json) return '';
    var v = json[nokkel];
    return typeof v === 'string' && v.trim() ? v.trim() : '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sender) return;

    nullstillFeltfeil();
    tomStatus();

    var kildeVerdi = kilde.value.trim();
    var epostVerdi = epost.value.trim();
    var forste = null;

    if (!kildeVerdi) {
      visFeltfeil(kilde, feilKilde, 'Skriv inn kontoen eller nettstedet ditt, for eksempel @navnet_ditt eller minblogg.no.');
      forste = forste || kilde;
    }
    if (epostVerdi && !serUtSomEpost(epostVerdi)) {
      visFeltfeil(epost, feilEpost, 'Sjekk e-postadressen. Den ser ikke ut som en gyldig adresse.');
      forste = forste || epost;
    }
    if (!bekreft.checked) {
      visFeltfeil(bekreft, feilBekreft, 'Du må bekrefte at kontoen eller nettstedet er ditt.');
      forste = forste || bekreft;
    }
    if (forste) {
      forste.focus();
      return;
    }

    var kropp = {};
    kropp[SPERR_ENDEPUNKT.felt.kilde] = kildeVerdi;
    kropp[SPERR_ENDEPUNKT.felt.bekreftelse] = true;
    // Sendes alltid, også tom. Endepunktet avviser den hvis en bot har fylt den.
    kropp[SPERR_ENDEPUNKT.felt.agn] = agn ? agn.value.trim() : '';
    if (epostVerdi) kropp[SPERR_ENDEPUNKT.felt.epost] = epostVerdi;

    sender = true;
    knapp.disabled = true;
    knapp.textContent = 'Sender …';
    visStatus('Legger inn sperra …', false);

    var avbryt = typeof AbortController === 'function' ? new AbortController() : null;
    var klokke = avbryt ? setTimeout(function () { avbryt.abort(); }, SPERR_ENDEPUNKT.tidsgrenseMs) : null;

    fetch(SPERR_ENDEPUNKT.url, {
      method: 'POST',
      headers: SPERR_ENDEPUNKT.hoder,
      body: JSON.stringify(kropp),
      signal: avbryt ? avbryt.signal : undefined
    })
      .then(function (svar) {
        if (klokke) clearTimeout(klokke);
        // Kroppen leses i BEGGE retninger: kvitteringen trenger `kilde`, og
        // feilboksen skal vise serverens egen `melding`. Er kroppen ikke JSON,
        // går vi videre uten den i stedet for å kaste.
        return svar.json().catch(function () { return null; }).then(function (json) {
          return { type: svar.ok ? 'ok' : 'serverfeil', kode: svar.status, json: json };
        });
      })
      .catch(function () {
        if (klokke) clearTimeout(klokke);
        return { type: 'nettfeil' };
      })
      .then(function (utfall) {
        sender = false;

        if (utfall.type === 'ok') {
          // Vis den normaliserte kilden fra svaret, ikke det brukeren skrev:
          // det er den strengen sperra faktisk gjelder for.
          var vistKilde = tekst(utfall.json, SPERR_ENDEPUNKT.svar.kilde) || kildeVerdi;
          visStatus(
            'Kilden din er sperret nå. Ingen kan importere fra ' + vistKilde + ' til Matlyst, og for en sperret kilde lagres ingenting. ' +
            'Sperra gjelder framtidige importer. Finner du noe som alt er lagret, si det til ' + EPOST + ', så fjerner vi det.',
            true
          );
          knapp.textContent = 'Sperret';
          kilde.readOnly = true;
          epost.readOnly = true;
          bekreft.disabled = true;
          status.focus();
          return;
        }

        knapp.disabled = false;
        knapp.textContent = 'Sperr kilden min';

        if (utfall.type === 'nettfeil') {
          visStatus('Vi fikk ikke kontakt med Matlyst, så sperra ble ikke lagt inn. Sjekk nettforbindelsen og prøv igjen, eller send kontoen din til ' + EPOST + '.', false);
          return;
        }

        // Serverens melding først, uendret. Reservetekstene under brukes bare
        // når svaret ikke hadde noen.
        var fraServer = tekst(utfall.json, SPERR_ENDEPUNKT.svar.melding);
        if (fraServer) {
          visStatus(fraServer, false);
          return;
        }
        if (utfall.kode === 429) {
          visStatus('Vi har fått for mange forespørsler fra deg akkurat nå. Vent noen minutter og prøv igjen, eller send kontoen din til ' + EPOST + '.', false);
        } else if (utfall.kode === 400) {
          visStatus('Vi klarte ikke å lese det du skrev inn, så sperra ble ikke lagt inn. Sjekk kontoen eller nettadressen og prøv igjen, eller send den til ' + EPOST + '.', false);
        } else {
          visStatus('Noe gikk galt hos oss, så sperra ble ikke lagt inn. Prøv igjen om litt, eller send kontoen din til ' + EPOST + ', så ordner vi det manuelt.', false);
        }
      });
  });

  // Rydder feilmeldingen bort så snart brukeren retter feltet.
  [[kilde, feilKilde], [epost, feilEpost]].forEach(function (par) {
    par[0].addEventListener('input', function () {
      if (par[1].hidden) return;
      par[1].hidden = true;
      par[1].textContent = '';
      par[0].removeAttribute('aria-invalid');
    });
  });
  bekreft.addEventListener('change', function () {
    if (!bekreft.checked || feilBekreft.hidden) return;
    feilBekreft.hidden = true;
    feilBekreft.textContent = '';
  });
})();
