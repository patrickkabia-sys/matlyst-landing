(function () {
  'use strict';

  var tekster = {
    nb: {
      avbrutt: 'Tilkoblingen ble avbrutt',
      feil: 'TikTok returnerte en feil. Prøv autoriseringslenken på nytt.',
      tom: 'Ingenting å vise',
      tomHjelp: 'Denne siden brukes bare som returadresse når du kobler til TikTok. Åpne autoriseringslenken fra terminalen.',
      koblet: 'Koblet til',
      tillatelser: 'Tillatelser gitt: ',
      kopiert: 'Kopiert',
    },
    sv: {
      avbrutt: 'Anslutningen avbröts',
      feil: 'TikTok returnerade ett fel. Öppna auktoriseringslänken igen.',
      tom: 'Inget att visa',
      tomHjelp: 'Den här sidan används endast som returadress när du ansluter TikTok. Öppna auktoriseringslänken från terminalen.',
      koblet: 'Ansluten',
      tillatelser: 'Beviljade behörigheter: ',
      kopiert: 'Kopierad',
    },
    da: {
      avbrutt: 'Forbindelsen blev afbrudt',
      feil: 'TikTok returnerede en fejl. Åbn godkendelseslinket igen.',
      tom: 'Intet at vise',
      tomHjelp: 'Denne side bruges kun som returadresse, når du opretter forbindelse til TikTok. Åbn godkendelseslinket fra terminalen.',
      koblet: 'Forbundet',
      tillatelser: 'Tildelte tilladelser: ',
      kopiert: 'Kopieret',
    },
  };

  var sprak = String(document.documentElement.lang || 'nb').split('-')[0];
  var tekst = tekster[sprak] || tekster.nb;
  var q = new URLSearchParams(location.search);
  var code = q.get('code');
  var feil = q.get('error');
  var tittel = document.getElementById('tittel');
  var hjelp = document.getElementById('hjelp');
  var detalj = document.getElementById('detalj');

  if (feil) {
    tittel.textContent = tekst.avbrutt;
    tittel.className = 'err';
    hjelp.textContent = tekst.feil;
    detalj.textContent = feil + (q.get('error_description') ? ' — ' + q.get('error_description') : '');
    return;
  }

  if (!code) {
    tittel.textContent = tekst.tom;
    hjelp.textContent = tekst.tomHjelp;
    return;
  }

  tittel.textContent = tekst.koblet;
  document.getElementById('kode').textContent = code;
  document.getElementById('boks').hidden = false;
  var gitt = q.get('scopes');
  if (gitt) detalj.textContent = tekst.tillatelser + gitt;

  document.getElementById('kopier').addEventListener('click', function () {
    var knapp = this;
    var ferdig = function () { knapp.textContent = tekst.kopiert; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(ferdig, function () {});
      return;
    }
    try {
      var rekkevidde = document.createRange();
      rekkevidde.selectNode(document.getElementById('kode'));
      var utvalg = window.getSelection();
      utvalg.removeAllRanges();
      utvalg.addRange(rekkevidde);
      document.execCommand('copy');
      utvalg.removeAllRanges();
      ferdig();
    } catch (e) {}
  });
})();
