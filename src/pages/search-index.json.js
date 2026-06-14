import { SIGNS } from '../lib/signs.js';
import { withBase } from '../lib/i18n.js';
export function GET() {
  const idx = SIGNS.map(s => ({
    kw: (s.kw + ' ' + s.nameDe + ' ' + s.nameEn + ' ' + (s.ar ?? '') + ' ' + (s.stvo ?? '')).toLowerCase(),
    nd: s.nameDe, ne: s.nameEn, e: s.en, d: s.de, a: s.ar, no: s.stvo,
    img: s.img, drawn: s.img ? null : s.drawn,
    url: withBase('signs/' + s.cat + '/'),
  }));
  return new Response(JSON.stringify(idx), { headers: { 'Content-Type': 'application/json' } });
}
