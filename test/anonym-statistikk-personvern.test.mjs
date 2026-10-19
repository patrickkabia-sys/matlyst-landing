import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
import { lesSide as les } from './hjelp/side.mjs';

const SIDER = {
  nb: {
    fil: 'personvern.html',
    krav: [
      /bruksstatistikken er anonym/iu,
      /hver hendelse sendes alene[^.]*Matlysts egen server[^.]*Supabase[^.]*EU[^.]*uten ID[^.]*uten innlogging/isu,
      /rundes ned til\s+hele timen[^.]*kjente hendelsesnavn/isu,
      /køen på telefonen[\s\S]{0,300}?først etter[\s\S]{0,300}?ja[\s\S]{0,300}?tømmes[\s\S]{0,300}?nei[\s\S]{0,300}?logger ut/iu,
      /raden slettes\s+etter videresending[^.]*senest etter sju dager/isu,
      /stokkes[\s\S]{0,300}?PostHog[\s\S]{0,300}?EU[\s\S]{0,300}?ny tilfeldig ID[\s\S]{0,300}?uten IP-adresse[^.]*sted[^.]*personprofil/iu,
      /ePrivacy-direktivet artikkel 5 nr\. 3/iu,
      /ekomloven § 3-15/iu,
      /GDPR fortale 26/iu,
      /IP-adresse[^.]*land[^.]*user agent[^.]*nøyaktig\s+tidspunkt[\s\S]{0,250}?driftslogger[\s\S]{0,250}?sju dager/iu,
      /Matlyst leser ikke\s+disse loggene[\s\S]{0,200}?ingen bruker-ID[^.]*innholdet i hendelsen/iu,
      /eldre appversjoner[\s\S]{0,200}?pseudonymt[^.]*gamle PostHog-prosjektet/iu,
      /samtykke \(art\. 6 nr\. 1 bokstav a\)[\s\S]{0,300}?pseudonym bruksstatistikk fra eldre appversjoner/iu,
      /pseudonyme PostHog-data[\s\S]{0,300}?eldre appversjoner[^.]*slettes[^.]*gamle konto-ID-en/iu,
      /nettstedets[\s\S]{0,200}?PostHog[\s\S]{0,200}?egen flyt/iu,
      /kan ikke slås opp per person/isu,
    ],
  },
  sv: {
    fil: 'sv/integritet/index.html',
    krav: [
      /användningsstatistiken är anonym/iu,
      /varje händelse skickas separat[^.]*Matlysts egen server[^.]*Supabase[^.]*EU[^.]*utan id[^.]*utan inloggning/isu,
      /avrundas nedåt till en hel timme[^.]*kända händelsenamn/isu,
      /lokala kön på telefonen[\s\S]{0,300}?först när[^.]*ja[\s\S]{0,300}?töms[^.]*nej[^.]*loggar ut/iu,
      /raden raderas efter vidarebefordran[^.]*senast efter sju dagar/isu,
      /blandas[\s\S]{0,300}?PostHog[^.]*EU[\s\S]{0,300}?nytt slumpmässigt id[^.]*utan IP-adress[^.]*plats[^.]*personprofil/iu,
      /ePrivacy-direktivet artikel 5\.3/iu,
      /ekomloven § 3-15/iu,
      /skäl 26 i GDPR/iu,
      /IP-adress[^.]*land[^.]*user agent[^.]*exakt tid[^.]*driftsloggar[\s\S]{0,250}?sju dagar/iu,
      /Matlyst läser inte loggarna[\s\S]{0,200}?inget användar-id[^.]*händelsens innehåll/iu,
      /äldre versioner av appen[^.]*pseudonymt[^.]*tidigare PostHog-projektet/isu,
      /samtycke enligt GDPR artikel 6\.1 a[^.]*pseudonym[^.]*äldre versioner av appen/isu,
      /pseudonyma PostHog-uppgifter[^.]*äldre versioner av appen[^.]*raderas[^.]*gamla konto-id:t/isu,
      /Webbplatsens egen PostHog-analys är ett separat flöde/iu,
      /kan inte sökas fram per person/isu,
    ],
  },
  da: {
    fil: 'da/privatliv/index.html',
    krav: [
      /brugsstatistikken er anonym/iu,
      /hver hændelse sendes for sig[^.]*Matlysts egen server[^.]*Supabase[^.]*EU[^.]*uden id[^.]*uden login/isu,
      /rundes ned til en hel time[^.]*kendte hændelsesnavne/isu,
      /køen på telefonen[\s\S]{0,300}?først[^.]*ja[\s\S]{0,300}?tømmes[^.]*nej[^.]*logger ud/iu,
      /rækken slettes efter videresendelse[^.]*senest efter syv dage/isu,
      /blandes[\s\S]{0,300}?PostHog[^.]*EU[\s\S]{0,300}?nyt tilfældigt id[^.]*uden IP-adresse[^.]*lokationsoplysninger[^.]*personprofil/iu,
      /ePrivacy-direktivets artikel 5, stk\. 3/iu,
      /ekomlovs § 3-15/iu,
      /GDPR’s betragtning 26/iu,
      /IP-adresse[^.]*land[^.]*user agent[^.]*præcist tidspunkt[^.]*driftslogge[\s\S]{0,250}?syv dage/iu,
      /Matlyst læser ikke loggene[\s\S]{0,200}?intet bruger-id[^.]*hændelsens indhold/iu,
      /ældre versioner af appen[^.]*pseudonymt[^.]*tidligere PostHog-projekt/isu,
      /samtykke efter GDPR artikel 6, stk\. 1, litra a[^.]*pseudonym[^.]*ældre versioner af appen/isu,
      /pseudonyme PostHog-oplysninger[^.]*ældre versioner af appen[^.]*slettes[^.]*gamle konto-id/isu,
      /Hjemmesidens egen PostHog-analyse er et særskilt forløb/iu,
      /kan ikke fremsøges for en bestemt person/isu,
    ],
  },
  en: {
    fil: 'en/privacy/index.html',
    krav: [
      /usage analytics are anonymous/iu,
      /each event is sent on its own[^.]*Matlyst’s own server[^.]*Supabase[^.]*EU[^.]*without an ID[^.]*without a login/isu,
      /rounded down to the hour[^.]*recognised event names/isu,
      /queue on your phone[\s\S]{0,300}?only after[^.]*yes[\s\S]{0,300}?cleared[^.]*no[^.]*sign out/iu,
      /row is deleted after it is forwarded[^.]*within seven days/isu,
      /shuffled[\s\S]{0,300}?PostHog[^.]*EU[\s\S]{0,300}?new random ID[^.]*without an IP address[^.]*location[^.]*person profile/iu,
      /Article 5\(3\) of the ePrivacy Directive/iu,
      /section 3-15 of the Norwegian Electronic Communications Act/iu,
      /GDPR Recital 26/iu,
      /IP address[^.]*country[^.]*user agent[^.]*exact time[^.]*operational logs[\s\S]{0,250}?seven days/iu,
      /Matlyst does not read the logs[\s\S]{0,200}?no user ID[^.]*event content/iu,
      /older app versions[^.]*pseudonymous data[^.]*previous PostHog project/iu,
      /consent \(GDPR Art\. 6\(1\)\(a\)\)[^.]*pseudonymous[^.]*older app versions/iu,
      /pseudonymous PostHog data[^.]*older app versions[^.]*deleted[^.]*old account ID/iu,
      /website’s[\s\S]{0,200}?PostHog[\s\S]{0,200}?separate/iu,
      /cannot be looked up by person/isu,
    ],
  },
};

for (const [sprak, { fil, krav }] of Object.entries(SIDER)) {
  test(`${sprak}: personvernteksten beskriver hele den anonyme statistikkflyten`, () => {
    const html = les(fil);
    for (const monster of krav) assert.match(html, monster, `${sprak}: mangler ${monster}`);
  });
}

test('gamle påstander om pseudonym konto-ID og kontosletting er borte', () => {
  const alle = Object.values(SIDER).map(({ fil }) => les(fil)).join('\n');
  assert.doesNotMatch(alle, /pseudonym, ikke anonym|pseudonymous, not anonymous/iu);
  assert.doesNotMatch(alle, /linked to your randomly generated account ID/iu);
  assert.doesNotMatch(alle, /statistikk(?:en)? (?:hos|i) PostHog[^.]*slettes når du sletter kontoen/isu);
  assert.doesNotMatch(alle, /analytics[^.]*deleted when you delete your account/isu);
  assert.doesNotMatch(alle, /knyttes aldri/iu);
});
