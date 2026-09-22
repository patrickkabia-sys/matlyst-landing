// Leser tegnkartet (cmap) rett ut av en woff2-fil, uten avhengigheter.
//
// Finnes fordi vakten over fontene var verdilos uten det: den sjekket at fila
// lo pa disken, og nettleserens document.fonts.check() ser bare pa
// unicode-range og innlastingsstatus, aldri pa om fonten faktisk har et glyf
// for tegnet. Fire Fraunces-filer uten en eneste bokstav i A til Z passerte
// begge.
//
// woff2-formatet: 48 bytes header, en tabellkatalog, og sa alle tabellene
// brotli-komprimert i ett stykke. cmap transformeres aldri, sa den ligger som
// den er i den dekomprimerte strommen.
// Spesifikasjon: https://www.w3.org/TR/WOFF2/

import { readFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';

// Rekkefolgen er normativ: flaggets fem nederste bits er en indeks inn i denne
// lista. 63 betyr at taggen folger som fire raa bytes.
const KJENTE_TAGGER = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm',
  'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern',
  'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC',
  'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar',
  'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty',
  'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat',
  'Gloc', 'Feat', 'Sill',
];

function lesUIntBase128(buf, pos) {
  let verdi = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[pos++];
    if (i === 0 && b === 0x80) throw new Error('UIntBase128 med ledende null');
    verdi = (verdi << 7) | (b & 0x7f);
    if ((b & 0x80) === 0) return [verdi >>> 0, pos];
  }
  throw new Error('UIntBase128 for lang');
}

function hentTabell(fil, tagg) {
  const buf = readFileSync(fil);
  if (buf.length < 48 || buf.toString('latin1', 0, 4) !== 'wOF2') {
    throw new Error(`${fil} er ikke en woff2-fil`);
  }
  const antall = buf.readUInt16BE(12);
  const komprimertLengde = buf.readUInt32BE(20);

  let pos = 48;
  const tabeller = [];
  for (let i = 0; i < antall; i++) {
    const flagg = buf[pos++];
    const indeks = flagg & 0x3f;
    let navn;
    if (indeks === 0x3f) {
      navn = buf.toString('latin1', pos, pos + 4);
      pos += 4;
    } else {
      navn = KJENTE_TAGGER[indeks];
    }
    const transform = (flagg >> 6) & 0x03;
    let origLengde;
    [origLengde, pos] = lesUIntBase128(buf, pos);
    // glyf og loca er transformert nar versjonen er 0; for alle andre tabeller
    // er versjon 0 nulltransform. Bare transformerte tabeller har egen lengde.
    const transformert =
      navn === 'glyf' || navn === 'loca' ? transform !== 3 : transform !== 0;
    let lengde = origLengde;
    if (transformert) [lengde, pos] = lesUIntBase128(buf, pos);
    tabeller.push({ navn, lengde });
  }

  const data = brotliDecompressSync(buf.subarray(pos, pos + komprimertLengde));
  let start = 0;
  for (const t of tabeller) {
    if (t.navn === tagg) return data.subarray(start, start + t.lengde);
    // Tabellene ligger rett etter hverandre i strommen, uten fyll. Fyllet i
    // spesifikasjonen gjelder den gjenoppbygde sfnt-fila, ikke denne.
    start += t.lengde;
  }
  throw new Error(`${fil} har ingen ${tagg}-tabell`);
}

function lesFormat4(t, off) {
  const segX2 = t.readUInt16BE(off + 6);
  const seg = segX2 / 2;
  const slutt = off + 14;
  const startO = slutt + segX2 + 2;
  const deltaO = startO + segX2;
  const rangeO = deltaO + segX2;
  const dekket = new Set();
  for (let i = 0; i < seg; i++) {
    const e = t.readUInt16BE(slutt + i * 2);
    const s = t.readUInt16BE(startO + i * 2);
    if (s === 0xffff) continue;
    for (let cp = s; cp <= e && cp !== 0xffff; cp++) {
      const rangeOff = t.readUInt16BE(rangeO + i * 2);
      let glyf;
      if (rangeOff === 0) {
        glyf = (cp + t.readInt16BE(deltaO + i * 2)) & 0xffff;
      } else {
        const p = rangeO + i * 2 + rangeOff + (cp - s) * 2;
        if (p + 1 >= t.length) continue;
        glyf = t.readUInt16BE(p);
        if (glyf !== 0) glyf = (glyf + t.readInt16BE(deltaO + i * 2)) & 0xffff;
      }
      if (glyf !== 0) dekket.add(cp);
    }
  }
  return dekket;
}

function lesFormat12(t, off) {
  const grupper = t.readUInt32BE(off + 12);
  const dekket = new Set();
  for (let i = 0; i < grupper; i++) {
    const g = off + 16 + i * 12;
    const s = t.readUInt32BE(g);
    const e = t.readUInt32BE(g + 4);
    const glyf = t.readUInt32BE(g + 8);
    if (glyf === 0) continue;
    for (let cp = s; cp <= e; cp++) dekket.add(cp);
  }
  return dekket;
}

/** Alle kodepunkter fonten faktisk har et glyf for. */
export function kodepunkter(fil) {
  const t = hentTabell(fil, 'cmap');
  const antall = t.readUInt16BE(2);
  const dekket = new Set();
  for (let i = 0; i < antall; i++) {
    const off = t.readUInt32BE(4 + i * 8 + 4);
    const format = t.readUInt16BE(off);
    if (format === 4) for (const cp of lesFormat4(t, off)) dekket.add(cp);
    else if (format === 12) for (const cp of lesFormat12(t, off)) dekket.add(cp);
  }
  return dekket;
}
