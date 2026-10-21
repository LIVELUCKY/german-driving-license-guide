// Base-aware URL builder: BASE_URL is "/" locally and "/<repo>/" on GitHub Pages project sites.
const RAW_BASE = import.meta.env.BASE_URL || '/';
export const BASE = RAW_BASE.endsWith('/') ? RAW_BASE : RAW_BASE + '/';
export const withBase = (p = '') => BASE + String(p).replace(/^\/+/, '');
export const urlFor = (slug = '') => withBase(slug ? `${slug}/` : '');

// Theory pages in learning order (most exam points first). "weiter" follows this order.
export const THEORIE = [
  { slug: 'vorfahrt', label: 'Vorfahrt',  icon: '🚦', d: 'Wer fährt zuerst, mit Grund. Viele 5-Punkte-Fragen.' },
  { slug: 'gefahren', label: 'Gefahren',  icon: '⚠️', d: 'Gefahrenlehre: womit du rechnen musst.' },
  { slug: 'zeichen',  label: 'Zeichen',   icon: '🪧', d: 'Oft verwechselte Schilder und der ganze Katalog.' },
  { slug: 'zahlen',   label: 'Zahlen',    icon: '🔢', d: 'Formeln, Zahlen nach Situation, Tempo, Straßenarten.' },
  { slug: 'regeln',   label: 'Regeln',    icon: '📋', d: 'Alkohol, Punkte, Licht, Unfall, Fahrzeug.' },
  { slug: 'begriffe', label: 'Begriffe',  icon: '📖', d: 'Fachwörter kurz erklärt, Quellen.' },
];

// Header (desktop): every page. Bottom tab bar (phones): the five main entries.
export const NAV = [
  { slug: '', label: 'Start', icon: '🏠' },
  ...THEORIE,
  { slug: 'ueben',  label: 'Üben',   icon: '🃏', d: 'Karten wischen, Quiz, Meine Fehler.' },
  { slug: 'praxis', label: 'Praxis', icon: '🚗', d: 'Praktische Prüfung, Manöver, Fehler.' },
  { slug: 'legal',  label: 'Rechtliches' },
];
export const TABS = [
  { slug: '', label: 'Start', icon: '🏠' },
  { slug: 'theorie', label: 'Lernen', icon: '📚', match: ['theorie', ...THEORIE.map(t => t.slug)] },
  { slug: 'ueben', label: 'Üben', icon: '🃏' },
  { slug: 'praxis', label: 'Praxis', icon: '🚗' },
  { slug: 'signs', label: 'Alle Zeichen', icon: '🔍' },
];

export function prevNext(slug) {
  const i = THEORIE.findIndex(t => t.slug === slug);
  if (i < 0) return { prev: null, next: null };
  const fmt = t => t && { url: urlFor(t.slug), title: t.label };
  return { prev: fmt(THEORIE[i - 1]), next: fmt(THEORIE[i + 1] ?? { slug: 'ueben', label: 'Üben' }) };
}
