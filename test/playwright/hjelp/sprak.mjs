// Forside-testene kjøres mot ett språk om gangen: FORSIDE_SPRAK=sv npx playwright test forside.
// `npm run test:forside` kjører alle fire. Uten variabelen er språket norsk.
export const SPRAK = process.env.FORSIDE_SPRAK || 'nb';
export const SIDER = { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' };
if (!Object.hasOwn(SIDER, SPRAK)) throw new Error(`Ukjent FORSIDE_SPRAK: ${SPRAK}`);
export const STI = SIDER[SPRAK];
