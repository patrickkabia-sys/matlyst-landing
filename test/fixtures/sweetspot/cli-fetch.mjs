// Injiserer lokale svar og fjerner reell ventetid i CLI-testen.
globalThis.fetch = async url => {
  const ord = new URL(url).searchParams.get('q');
  const domene = { mat: 'matprat.no', grønt: 'blogg.no' }[ord];
  if (!domene) throw new Error('Uventet søkeord i testen');
  return new Response(`<a class="result__url">www.${domene}/sti</a>`);
};
globalThis.setTimeout = callback => queueMicrotask(callback);
