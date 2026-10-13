import { SIGNS } from '../lib/signs.js';
import { withBase } from '../lib/nav.js';
export function GET() {
  const idx = SIGNS.map(s => ({
    kw: (s.kw + ' ' + s.nameDe + ' ' + (s.stvo ?? '')).toLowerCase(),
    nd: s.nameDe, d: s.de, no: s.stvo,
    img: s.img, drawn: s.img ? null : s.drawn,
    url: withBase('signs/' + s.cat + '/'),
  }));
  return new Response(JSON.stringify(idx), { headers: { 'Content-Type': 'application/json' } });
}
