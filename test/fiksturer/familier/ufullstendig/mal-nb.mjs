// Rød fikstur: malen gir sider uten steg (utvid() ville ha droppet dem stille).
export const tillatteTall = () => new Set();
const side = { title: 'x', description: 'x', eyebrow: 'x', h1: 'x', lead: 'x', rik: '<p>x</p>', faq: [['a', 'b']], cta: 'x', publisert: '2026-11-20', schemas: [{}] };
export const navSide = () => side;
export const sideForRad = () => side;
