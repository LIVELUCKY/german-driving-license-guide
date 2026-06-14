export const DEFAULT_LANG = 'de';
export const LOCALES = ['de', 'en', 'ar'];

// Base-aware URL builder: BASE_URL is "/" locally and "/<repo>/" on GitHub Pages project sites.
const RAW_BASE = import.meta.env.BASE_URL || '/';
export const BASE = RAW_BASE.endsWith('/') ? RAW_BASE : RAW_BASE + '/';
export const withBase = (p = '') => BASE + String(p).replace(/^\/+/, '');

// Locale prefix map — '' means no prefix (default locale = German at root)
const LOCALE_PREFIX = { de: '', en: 'en/', ar: 'ar/' };

export const NAV = [
  { slug: '',           en: 'Home',             de: 'Start',            ar: 'الرئيسية' },
  { slug: 'cheatsheet', en: 'Cheatsheet',       de: 'Spickzettel',      ar: 'ورقة الغش',   d_en: 'The must-know rules at a glance',         d_de: 'Die wichtigsten Regeln auf einen Blick',        d_ar: 'أهم القواعد في لمحة' },
  { slug: 'grammar',    en: 'How signs work',   de: 'Zeichen-Logik',    ar: 'منطق الإشارات', d_en: 'Decode any sign from its parts',         d_de: 'Jedes Schild aus seinen Bausteinen lesen',      d_ar: 'اقرأ أي إشارة من أجزائها' },
  { slug: 'signs',      en: 'All signs',        de: 'Alle Zeichen',     ar: 'كل الإشارات', d_en: 'Browse the full catalogue by category',   d_de: 'Den ganzen Katalog nach Kategorie durchsuchen', d_ar: 'تصفح الكتالوج الكامل حسب الفئة' },
  { slug: 'streets',    en: 'Streets & speeds', de: 'Straßen & Tempo',  ar: 'الطرق والسرعات', d_en: 'Road types and the full speed matrix',  d_de: 'Straßentypen und die komplette Tempo-Matrix',   d_ar: 'أنواع الطرق ومصفوفة السرعات' },
  { slug: 'priority',   en: 'Right of way',     de: 'Vorfahrt',         ar: 'حق الأولوية', d_en: 'Who goes first, made visual',             d_de: 'Wer zuerst fährt — anschaulich',               d_ar: 'من يمر أولاً — توضيح مرئي' },
  { slug: 'theory',     en: 'Theory',           de: 'Theorie',          ar: 'النظرية',    d_en: 'Everything the written exam asks',          d_de: 'Alles für die Theorieprüfung',                 d_ar: 'كل ما يسأل عنه الاختبار النظري' },
  { slug: 'practical',  en: 'Practical',        de: 'Praxis',           ar: 'الجانب العملي', d_en: 'Maneuvers, checks and the driving test', d_de: 'Manöver, Kontrollen und die Prüfung',          d_ar: 'المناورات والفحوصات واختبار القيادة' },
  { slug: 'quiz',       en: 'Sign quiz',        de: 'Zeichen-Quiz',     ar: 'اختبار الإشارات', d_en: 'Test yourself on 10 random signs',     d_de: 'Teste dich mit 10 zufälligen Zeichen',         d_ar: 'اختبر نفسك على 10 إشارات عشوائية' },
  { slug: 'legal',      en: 'Legal',            de: 'Rechtliches',      ar: 'قانوني',     d_en: 'Licences, attribution and privacy',         d_de: 'Lizenzen, Quellen und Datenschutz',            d_ar: 'التراخيص والإسناد والخصوصية' },
];

export function urlFor(lang, slug) {
  const prefix = LOCALE_PREFIX[lang] ?? '';
  return withBase(prefix + (slug ? `${slug}/` : ''));
}

export function prevNext(lang, slug) {
  const i = NAV.findIndex(n => n.slug === slug);
  const prev = i > 0 ? NAV[i - 1] : null;
  const next = i >= 0 && i < NAV.length - 1 ? NAV[i + 1] : null;
  const label = n => n[lang] ?? n.de;
  const fmt = n => n && { url: urlFor(lang, n.slug), title: label(n) };
  return { prev: fmt(prev), next: fmt(next) };
}

// Convenience: pick the right label for the current lang (falls back to EN)
export const t = (lang, en, de, ar) => {
  if (lang === 'de') return de;
  if (lang === 'ar' && ar) return ar;
  return en;
};

// RTL languages
export const isRTL = (lang) => lang === 'ar';
