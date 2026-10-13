import warn from '../data/signs/warn.json';
import prio from '../data/signs/prio.json';
import prohibit from '../data/signs/prohibit.json';
import mandate from '../data/signs/mandate.json';
import info from '../data/signs/info.json';
import supp from '../data/signs/supp.json';
import signal from '../data/signs/signal.json';
import officialIds from '../data/official.json';
import { withBase } from './nav.js';

const raw = [...warn, ...prio, ...prohibit, ...mandate, ...info, ...supp, ...signal];

export const CATS = [
  { id: 'warn',     de: 'Gefahrzeichen',         color: 'var(--warn)',     d: 'Rote Dreiecke: Gefahr voraus, langsamer.' },
  { id: 'prio',     de: 'Vorfahrt',              color: 'var(--prio)',     d: 'Wer zuerst fährt. Heben „rechts vor links“ auf.' },
  { id: 'prohibit', de: 'Verbote',               color: 'var(--prohibit)', d: 'Rote Ringe: was drin ist, ist verboten.' },
  { id: 'mandate',  de: 'Gebote',                color: 'var(--mandate)',  d: 'Blaue Kreise: du musst tun, was sie zeigen.' },
  { id: 'info',     de: 'Richtzeichen',          color: 'var(--info)',     d: 'Tafeln mit Hinweisen und Sonderregeln.' },
  { id: 'supp',     de: 'Zusatzzeichen',         color: 'var(--supp)',     d: 'Kleine Tafeln, die das Schild darüber einschränken.' },
  { id: 'signal',   de: 'Ampeln & Markierungen', color: 'var(--signal)',   d: 'Ampeln, Polizei und die Linien auf der Straße.' },
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
