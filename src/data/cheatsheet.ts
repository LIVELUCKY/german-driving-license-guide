// Content data for the cheat sheet. Every number here must be sourced (see CLAUDE.md).
import { SIGNS } from '../lib/signs.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const img = (id: string) => (SIGNS.find((s: any) => s.id === id) as any)?.img;

// Sign pairs people mix up in the exam: [left id, left text, right id, right text, why they differ].
export const PAIRS = [
  ['vorfahrt-gewaehren', '<b>Vorfahrt gewähren</b> (205): nur anhalten, wenn jemand kommt', 'stop', '<b>Stopp</b> (206): <b>immer</b> anhalten, Räder stehen, an der Haltlinie', 'Dreieck = Vorfahrt lassen. Achteck = Stopp steht dort, wo du erst im Stand genug siehst. Darum dort immer anhalten.'],
  ['vorfahrt', '<b>Vorfahrt</b> (301): nur an der <b>nächsten</b> Kreuzung', 'vorfahrtstrasse', '<b>Vorfahrtstraße</b> (306): bis zum nächsten Zeichen 205, 206 oder 307', 'Dreieck = Warnung für eine Stelle, also nur die nächste Kreuzung. Gelbe Raute = die ganze Straße, bis ein Schild sie beendet.'],
  ['eingeschraenktes-halteverbot', '<b>Eingeschränktes Haltverbot</b> (286): bis 3 Min halten, Ein-/Aussteigen, Be-/Entladen ok', 'absolutes-halteverbot', '<b>Absolutes Haltverbot</b> (283): gar nicht halten', 'Ein Strich streicht nur das Parken (länger als 3 Min). Das Kreuz streicht alles, auch kurzes Halten.'],
  ['ueberholverbot', '<b>Überholverbot</b> (276): keine <b>mehrspurigen</b> Kfz. Motorrad, Rad, Mofa darfst du überholen', 'ueberholverbot-fuer-lkw', '<b>Überholverbot Lkw</b> (277): gilt für Kfz über 3,5 t, nicht für Pkw und Bus', 'Schau auf das rote Fahrzeug: es darf nicht überholen. Rotes Auto = gilt für dich. Roter Lkw = nur für schwere Lkw, die beim Überholen lange brauchen.'],
  ['tempo-30-zone', '<b>Tempo-30-Zone</b> (274.1): 30, meist rechts vor links', 'verkehrsberuhigter-bereich', '<b>Verkehrsberuhigter Bereich</b> (325.1): Schritttempo, Kinder spielen überall, Parken nur auf markierten Flächen', 'Zone mit „30“: die Straße bleibt Straße, nur langsamer. Blaues Schild mit Kind und Haus: die Straße ist Spielfläche, darum Schritttempo.'],
] as const;
// Section bar: chips point to the first section of each group, in reading order.
export const JUMP = [
  { label: 'Theorie', links: [['pruefung', 'Prüfung'], ['vorfahrt', 'Vorfahrt'], ['verhalten', 'Gefahren'], ['vergessen', 'Zeichen'], ['formeln', 'Formeln'], ['zahlen-situation', 'Zahlen'], ['tempo', 'Tempo'], ['strassen', 'Straßen'], ['alkohol', 'Alkohol & Punkte'], ['licht', 'Licht & Unfall'], ['fahrzeug', 'Fahrzeug'], ['zahlen', 'Zahlenfragen'], ['fehler-liste', 'Meine Fehler'], ['begriffe', 'Begriffe']] },
  { label: 'Praxis', links: [['praxis', 'Prüfung'], ['aufgaben', 'Manöver'], ['situationen', 'Im Verkehr'], ['sichern', 'Sichern'], ['fehler', 'Sofort durch'], ['quellen', 'Quellen']] },
].map(g => ({ label: g.label, links: g.links.map(([id, label]) => ({ href: `#${id}`, label: label! })) }));

// Stopping distance per the textbook formulas used in the official question catalogue.
export const STOP = [30, 40, 50, 70, 100, 130].map(v => {
  const r = (v / 10) * 3, b = (v / 10) ** 2;
  return { v, r, b, sum: r + b, emergency: b / 2 };
});
export const maxStop = Math.max(...STOP.map(s => s.sum));
export const pct = (m: number) => (m / maxStop) * 100;

// Each formula: worked chains for 50 and 100 km/h (value, operation, value, …, result) plus a memory hook.
export const FORMULAS = [
  { name: 'Reaktionsweg', x: '(v ÷ 10) × 3',
    ex: [['50', 'Null weg', '5', '× 3', '15 m'], ['100', 'Null weg', '10', '× 3', '30 m']],
    k: '„Null weg, mal drei.“', m: '1 Sekunde Schreck = 3-mal die Tacho-Ziffer (das Tempo ohne die letzte Null). Bei 2 Sekunden Reaktion doppelt so lang.' },
  { name: 'Bremsweg', x: '(v ÷ 10)²', 
    ex: [['50', 'Null weg', '5', '× 5', '25 m'], ['100', 'Null weg', '10', '× 10', '100 m']],
    k: '„Zahl mal Zahl.“', m: 'Die Zahl mal sich selbst. Darum wird der Bremsweg bei doppeltem Tempo 4-mal so lang.' },
  { name: 'Gefahrbremsung', x: '(v ÷ 10)² ÷ 2',
    ex: [['50', 'Bremsweg', '25', '÷ 2', '12,5 m'], ['100', 'Bremsweg', '100', '÷ 2', '50 m']],
    k: '„In Gefahr nur halb so weit.“', m: 'Voll in die Eisen = halber Bremsweg.' },
  { name: 'Anhalteweg', x: 'Reaktionsweg + Bremsweg', hl: true,
    ex: [['50', 'Reaktion + Bremsen', '15 + 25', '=', '40 m'], ['100', 'Reaktion + Bremsen', '30 + 100', '=', '130 m']],
    k: '„Schreck plus Bremsen, dann stehst du.“', m: 'Erst erschrecken, dann bremsen: beides zusammen. Das Auto steht erst nach dem Anhalteweg.' },
  { name: 'Anhalteweg bei Gefahr', x: 'Reaktionsweg + Bremsweg ÷ 2',
    ex: [['50', 'Reaktion + halber Bremsweg', '15 + 12,5', '=', '27,5 m'], ['100', 'Reaktion + halber Bremsweg', '30 + 50', '=', '80 m']],
    m: 'Nur der Bremsweg wird halbiert, der Reaktionsweg bleibt.' },
  { name: 'Sicherheitsabstand', x: 'v ÷ 2 (in Metern)',
    ex: [['80', 'halbieren', '40 m'], ['100', 'halbieren', '50 m']],
    k: '„Halber Tacho.“', m: 'Ohne Zahlen: 2 Sekunden Abstand, „einundzwanzig, zweiundzwanzig“.' },
  { name: 'Anhänger mit Klasse B', x: '3.500 − Pkw (zul. Gesamtmasse)',
    ex: [['3.500 kg', '− Pkw 2.400 kg', '1.100 kg Anhänger']],
    m: 'Bis 750 kg geht immer. Schwerer nur, wenn Pkw + Anhänger zusammen höchstens 3.500 kg (zulässig) wiegen. Zulässige Gesamtmasse = was das Auto voll beladen höchstens wiegen darf (Fahrzeugschein, Feld F.2).' },
  { name: 'Stützlast', x: 'mind. 4 % vom Anhänger',
    ex: [['600 kg', '× 4 %', '24 kg']],
    m: 'Vier Prozent drücken auf die Anhängerkupplung (nicht auf das Kupplungspedal), sonst schlingert der Anhänger.' },
  { name: 'Überholweg (Idee hinter 800 m)', x: 'Strecke × v ÷ (v − v Lkw)',
    ex: [['100 gegen 70 km/h', 'Überholweg', '≈ 410 m', '+ Gegenverkehr fährt gleich weit', '≈ 800 m Sicht']],
    m: 'Du überholst nur mit der Differenz (30 km/h). Der Gegenverkehr fährt dir in der gleichen Zeit genauso weit entgegen. Darum braucht man doppelt so viel freie Sicht.' },
] as const;

// T trick: every formula only needs T = speed ÷ 10.
export const TROWS = [30, 50, 70, 80, 100, 130].map(v => {
  const t = v / 10;
  return { v, t, r: 3 * t, b: t * t, g: (t * t) / 2, a: 3 * t + t * t, s: v / 2 };
});
export const de = (x: number) => String(Math.round(x * 10) / 10).replace('.', ',');

