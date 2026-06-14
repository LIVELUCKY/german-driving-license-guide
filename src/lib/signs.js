import warn from '../data/signs/warn.json';
import prio from '../data/signs/prio.json';
import prohibit from '../data/signs/prohibit.json';
import mandate from '../data/signs/mandate.json';
import info from '../data/signs/info.json';
import supp from '../data/signs/supp.json';
import signal from '../data/signs/signal.json';

const raw = [...warn, ...prio, ...prohibit, ...mandate, ...info, ...supp, ...signal];
import officialIds from '../data/official.json';
import { withBase } from './i18n.js';

export const CATS = [
  { id: 'warn',     en: 'Warning',            de: 'Gefahrzeichen',      color: 'var(--warn)',
    d_en: 'Red triangles — danger ahead, slow down.',            d_de: 'Rote Dreiecke — Gefahr voraus, langsamer.',
    ar: 'تحذير',          d_ar: 'مثلثات حمراء — خطر أمامك، أبطئ.' },
  { id: 'prio',     en: 'Priority',           de: 'Vorfahrt',           color: 'var(--prio)',
    d_en: 'Who goes first. They override right-before-left.',    d_de: 'Wer zuerst fährt. Heben „rechts vor links” auf.',
    ar: 'أولوية المرور',  d_ar: 'من يسير أولاً. تلغي قاعدة اليمين قبل اليسار.' },
  { id: 'prohibit', en: 'Prohibitory',        de: 'Verbote',            color: 'var(--prohibit)',
    d_en: 'Red rings — what is drawn inside is banned.',         d_de: 'Rote Ringe — was drin ist, ist verboten.',
    ar: 'محظورات',        d_ar: 'حلقات حمراء — ما بداخلها محظور.' },
  { id: 'mandate',  en: 'Mandatory',          de: 'Gebote',             color: 'var(--mandate)',
    d_en: 'Blue circles — you must do what they show.',          d_de: 'Blaue Kreise — du musst tun, was sie zeigen.',
    ar: 'إلزاميات',       d_ar: 'دوائر زرقاء — يجب فعل ما تشير إليه.' },
  { id: 'info',     en: 'Information',        de: 'Richtzeichen',       color: 'var(--info)',
    d_en: 'Panels with information and special road rules.',     d_de: 'Tafeln mit Hinweisen und Sonderregeln.',
    ar: 'إرشادات',        d_ar: 'لوحات بمعلومات وقواعد مرور خاصة.' },
  { id: 'supp',     en: 'Supplementary',      de: 'Zusatzzeichen',      color: 'var(--supp)',
    d_en: 'Small plates that narrow the sign above.',            d_de: 'Kleine Tafeln, die das Schild darüber einschränken.',
    ar: 'لوحات إضافية',   d_ar: 'لوحات صغيرة تحدد نطاق اللافتة فوقها.' },
  { id: 'signal',   en: 'Signals & markings', de: 'Ampeln & Markierungen', color: 'var(--signal)',
    d_en: 'Lights, police and the lines on the road.',           d_de: 'Ampeln, Polizei und die Linien auf der Straße.',
    ar: 'إشارات وعلامات', d_ar: 'أضواء وشرطة وخطوط الطريق.' },
];

const slug = s => s.toLowerCase()
  .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

export const SIGNS = raw.map(s => {
  const id = slug(s.nameDe);
  const official = officialIds.includes(id);
  return { ...s, id, official, img: official ? withBase(`signs/${id}.svg`) : null };
});

export const byCat = id => SIGNS.filter(s => s.cat === id);
export const catOf = id => CATS.find(c => c.id === id);
