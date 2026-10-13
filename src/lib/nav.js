// Base-aware URL builder: BASE_URL is "/" locally and "/<repo>/" on GitHub Pages project sites.
const RAW_BASE = import.meta.env.BASE_URL || '/';
export const BASE = RAW_BASE.endsWith('/') ? RAW_BASE : RAW_BASE + '/';
export const withBase = (p = '') => BASE + String(p).replace(/^\/+/, '');
export const urlFor = (slug = '') => withBase(slug ? `${slug}/` : '');

// One cheat-sheet page; the sign catalogue and legal page are appendices.
export const NAV = [
  { slug: '',      label: 'Spickzettel' },
  { slug: 'signs', label: 'Zeichen' },
  { slug: 'legal', label: 'Rechtliches' },
];
