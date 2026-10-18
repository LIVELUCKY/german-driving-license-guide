// Content data for the cheat sheet. Every number here must be sourced (see CLAUDE.md).
import { SIGNS } from '../lib/signs.js';
import ZAHLEN from './zahlenfragen.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const img = (id: string) => (SIGNS.find((s: any) => s.id === id) as any)?.img;

// Sign pairs people mix up in the exam: [left id, left text, right id, right text].
export const PAIRS = [
  ['vorfahrt-gewaehren', '<b>Vorfahrt gewähren</b> (205): nur anhalten, wenn jemand kommt', 'stop', '<b>Stopp</b> (206): <b>immer</b> anhalten, Räder stehen, an der Haltlinie'],
  ['vorfahrt', '<b>Vorfahrt</b> (301): nur an der <b>nächsten</b> Kreuzung', 'vorfahrtstrasse', '<b>Vorfahrtstraße</b> (306): bis zum nächsten Zeichen 205, 206 oder 307'],
  ['eingeschraenktes-halteverbot', '<b>Eingeschränktes Haltverbot</b> (286): bis 3 Min halten, Ein-/Aussteigen, Be-/Entladen ok', 'absolutes-halteverbot', '<b>Absolutes Haltverbot</b> (283): gar nicht halten'],
  ['ueberholverbot', '<b>Überholverbot</b> (276): keine <b>mehrspurigen</b> Kfz. Motorrad, Rad, Mofa darfst du überholen', 'ueberholverbot-fuer-lkw', '<b>Überholverbot Lkw</b> (277): gilt für Kfz über 3,5 t, nicht für Pkw und Bus'],
  ['tempo-30-zone', '<b>Tempo-30-Zone</b> (274.1): 30, meist rechts vor links', 'verkehrsberuhigter-bereich', '<b>Verkehrsberuhigter Bereich</b> (325.1): Schritttempo, Kinder spielen überall, Parken nur auf markierten Flächen'],
] as const;
// Section bar: chips point to the first section of each group, in reading order.
export const JUMP = [
  { label: 'Theorie', links: [['pruefung', 'Prüfung'], ['formeln', 'Formeln'], ['zahlenkarte', 'Zahlen-Landkarte'], ['tempo', 'Tempo'], ['meter', 'Meter'], ['vorfahrt', 'Vorfahrt'], ['alkohol', 'Alkohol & Punkte'], ['licht', 'Licht & Unfall'], ['fahrzeug', 'Fahrzeug'], ['vergessen', 'Oft verwechselt'], ['verhalten', 'Oft gefragt'], ['zahlen', 'Fragenkatalog'], ['test', 'Selbsttest']] },
  { label: 'Praxis', links: [['praxis', 'Prüfung'], ['aufgaben', 'Manöver'], ['situationen', 'Im Verkehr'], ['sichern', 'Sichern'], ['fehler', 'Sofort durch'], ['quellen', 'Quellen']] },
].map(g => ({ label: g.label, links: g.links.map(([id, label]) => ({ href: `#${id}`, label: label! })) }));
export const QUIZ_CARDS = ZAHLEN.flatMap(g => g.rows);

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
    m: '1 Sekunde Schreck = 3-mal die Tacho-Ziffer. Bei 2 Sekunden Reaktion doppelt so lang.' },
  { name: 'Bremsweg', x: '(v ÷ 10)²', 
    ex: [['50', 'Null weg', '5', '× 5', '25 m'], ['100', 'Null weg', '10', '× 10', '100 m']],
    m: 'Die Zahl mal sich selbst. Darum wird der Bremsweg bei doppeltem Tempo 4-mal so lang.' },
  { name: 'Gefahrbremsung', x: '(v ÷ 10)² ÷ 2',
    ex: [['50', 'Bremsweg', '25', '÷ 2', '12,5 m'], ['100', 'Bremsweg', '100', '÷ 2', '50 m']],
    m: 'Voll in die Eisen = halber Bremsweg.' },
  { name: 'Anhalteweg', x: 'Reaktionsweg + Bremsweg', hl: true,
    ex: [['50', 'Reaktion + Bremsen', '15 + 25', '=', '40 m'], ['100', 'Reaktion + Bremsen', '30 + 100', '=', '130 m']],
    m: 'Erst erschrecken, dann bremsen: beides zusammen. Das Auto steht erst nach dem Anhalteweg.' },
  { name: 'Anhalteweg bei Gefahr', x: 'Reaktionsweg + Bremsweg ÷ 2',
    ex: [['50', 'Reaktion + halber Bremsweg', '15 + 12,5', '=', '27,5 m'], ['100', 'Reaktion + halber Bremsweg', '30 + 50', '=', '80 m']],
    m: 'Nur der Bremsweg wird halbiert, der Reaktionsweg bleibt.' },
  { name: 'Sicherheitsabstand', x: 'v ÷ 2 (in Metern)',
    ex: [['80', 'halbieren', '40 m'], ['100', 'halbieren', '50 m']],
    m: '„Halber Tacho“. Ohne Zahlen: 2 Sekunden Abstand, „einundzwanzig, zweiundzwanzig“.' },
  { name: 'Anhänger mit Klasse B', x: '3.500 − Pkw (zul. Gesamtmasse)',
    ex: [['3.500 kg', '− Pkw 2.400 kg', '1.100 kg Anhänger']],
    m: 'Bis 750 kg geht immer. Schwerer nur, wenn Pkw + Anhänger zusammen höchstens 3.500 kg (zulässig) wiegen.' },
  { name: 'Stützlast', x: 'mind. 4 % vom Anhänger',
    ex: [['600 kg', '× 4 %', '24 kg']],
    m: 'Vier Prozent drücken auf die Kupplung, sonst schlingert der Anhänger.' },
  { name: 'Überholweg (Idee hinter 800 m)', x: 'Strecke × v ÷ (v − v Lkw)',
    ex: [['100 gegen 70 km/h', 'Überholweg', '≈ 410 m', '+ Gegenverkehr fährt gleich weit', '≈ 800 m Sicht']],
    m: 'Du überholst nur mit der Differenz (30 km/h). Der Gegenverkehr fährt dir in der gleichen Zeit genauso weit entgegen. Darum braucht man doppelt so viel freie Sicht.' },
] as const;

// Distances in metres, drawn as bars on one shared scale (max 50 m).
export const RULER = [
  { m: 1.5, t: 'Seitenabstand zu Rad, E-Scooter, Fußgänger', s: 'innerorts (§ 5 Abs. 4)' },
  { m: 2,   t: 'Seitenabstand zu Rad, E-Scooter, Fußgänger', s: 'außerorts' },
  { m: 3,   t: 'Restfahrbahn bis zur durchgezogenen Linie, sonst Parkverbot', s: 'Zeichen 295' },
  { m: 5,   t: 'Parkverbot vor und hinter Kreuzung/Einmündung', s: '§ 12 Abs. 3' },
  { m: 5,   t: 'Haltverbot vor dem Zebrastreifen (und darauf)', s: 'Zeichen 293' },
  { m: 5,   t: 'Parkverbot vor und hinter Andreaskreuz innerorts', s: 'Zeichen 201' },
  { m: 5,   t: 'Abschleppseil: maximaler Abstand', s: '§ 43 StVZO' },
  { m: 8,   t: 'Parkverbot vor Kreuzung, wenn rechts ein baulicher Radweg ist', s: 'nur davor' },
  { m: 10,  t: 'Haltverbot vor Ampel, Andreaskreuz, Vorfahrt gewähren, Stopp', s: 'nur wenn du sie verdeckst' },
  { m: 15,  t: 'Parkverbot vor und hinter Haltestellenschild', s: 'Zeichen 224' },
  { m: 50,  t: 'Parkverbot vor und hinter Andreaskreuz außerorts', s: 'Zeichen 201' },
  { m: 50,  t: 'Abstand Lkw > 3,5 t / Bus auf Autobahn ab 50 km/h', s: '§ 4 Abs. 3' },
  { m: 50,  t: 'Leitpfosten stehen alle …', s: 'zum Schätzen von Abstand und Sicht' },
];
// T trick: every formula only needs T = speed ÷ 10.
export const TROWS = [30, 50, 70, 80, 100, 130].map(v => {
  const t = v / 10;
  return { v, t, r: 3 * t, b: t * t, g: (t * t) / 2, a: 3 * t + t * t, s: v / 2 };
});
export const de = (x: number) => String(Math.round(x * 10) / 10).replace('.', ',');

// Number map: one number, every rule it stands for.
// Each row: [unit family for the colour, exact unit, meaning]. Families: kmh, m, pm (‰), zeit, x (other).
export const ZAHLENKARTE: { n: string; items: [string, string, string][] }[] = [
  { n: '0,0', items: [['pm', '‰', 'Probezeit und unter 21']] },
  { n: '0,3', items: [['pm', '‰', '+ Ausfallerscheinung = Straftat']] },
  { n: '0,5', items: [['pm', '‰', 'Ordnungswidrigkeit, Fahrverbot']] },
  { n: '1', items: [['m', 'm', 'Ladung hinten ohne Kennzeichnung']] },
  { n: '1,1', items: [['pm', '‰', 'absolut fahruntüchtig']] },
  { n: '1,5', items: [['m', 'm', 'Seitenabstand Rad innerorts'], ['m', 'm', 'Ladung hinten max. (über 100 km)'], ['m', 'm', 'rote Fahne/Leuchte max. hoch']] },
  { n: '1,6', items: [['x', 'mm', 'Mindestprofil'], ['pm', '‰', 'MPU, auch mit dem Rad']] },
  { n: '2', items: [['m', 'm', 'Seitenabstand Rad außerorts'], ['zeit', 'Sek', 'Abstand („zweiundzwanzig“)'], ['zeit', 'Jahre', 'Probezeit, HU-Intervall'], ['zeit', 'Wochen', 'Anhänger allein parken']] },
  { n: '3', items: [['m', 'm', 'Ladung hinten bis 100 km Fahrt'], ['m', 'm', 'Restfahrbahn zur durchgezogenen Linie'], ['zeit', 'Min', 'länger halten = parken'], ['zeit', 'Jahre', 'bis zur ersten HU'], ['x', '×', 'Grundfahraufgaben, Nachtfahrten']] },
  { n: '4', items: [['x', '%', 'Stützlast mindestens'], ['x', '×', 'Bremsweg bei doppeltem Tempo'], ['x', '×', 'Autobahnfahrten vor der Prüfung']] },
  { n: '5', items: [['m', 'm', 'Parkverbot an Kreuzung'], ['m', 'm', 'Haltverbot vor Zebrastreifen'], ['m', 'm', 'Andreaskreuz innerorts (Parken)'], ['m', 'm', 'Abschleppseil max.'], ['m', 'm', 'Abstand im Tunnel-Stau'], ['x', '×', 'Überlandfahrten vor der Prüfung'], ['zeit', 'Jahre', '2-Punkte-Verstoß gelöscht']] },
  { n: '8', items: [['m', 'm', 'Parkverbot vor Kreuzung mit Radweg'], ['m', 'm', 'Lücke beim Längsparken (Prüfung)'], ['x', 'Punkte', 'Führerschein weg']] },
  { n: '10', items: [['m', 'm', 'Haltverbot vor Ampel, 201, 205, 206 (wenn verdeckt)'], ['kmh', 'km/h', 'Bahnübergang mit Schild 10'], ['x', 'Punkte', 'Fehlerpunkte max. in der Theorie'], ['zeit', 'Jahre', 'Straftat mit Entzug gelöscht']] },
  { n: '12', items: [['zeit', 'Jahre', 'Kindersitz darunter (und unter 150 cm)'], ['zeit', 'Monate', 'gilt die bestandene Theorie']] },
  { n: '15', items: [['m', 'm', 'Parkverbot an Haltestelle'], ['m', 'm', 'Abstand Kolonne in der Stadt'], ['zeit', 'Min', 'Testfahrt bei B197']] },
  { n: '18', items: [['m', 'm', 'Pkw + Anhänger max. lang'], ['zeit', 'Jahre', 'Mindestalter (begleitet: 17)']] },
  { n: '30', items: [['kmh', 'km/h', 'Tempo-30-Zone, Fahrradstraße'], ['kmh', 'km/h', 'Gefahrbremsung mindestens'], ['kmh', 'km/h', 'ohne Gurt schon schwer verletzt'], ['x', 'Fragen', 'in der Theorieprüfung'], ['zeit', 'Min', 'reine Fahrzeit mindestens']] },
  { n: '45', items: [['kmh', 'km/h', 'Moped, S-Pedelec'], ['zeit', 'Min', 'je Sonderfahrt']] },
  { n: '50', items: [['kmh', 'km/h', 'innerorts'], ['kmh', 'km/h', 'bei Sicht unter 50 m'], ['kmh', 'km/h', 'mit Schneeketten'], ['m', 'm', 'Leitpfosten-Abstand'], ['m', 'm', 'Andreaskreuz außerorts (Parken)'], ['m', 'm', 'Abstand Lkw/Bus auf Autobahn'], ['x', 'cm', 'Ladung vorn ab 2,5 m Höhe']] },
  { n: '60', items: [['kmh', 'km/h', 'Lkw über 7,5 t außerorts'], ['kmh', 'km/h', 'Bus mit stehenden Fahrgästen'], ['kmh', 'km/h', 'Autobahn: Fahrzeug muss mehr schaffen']] },
  { n: '80', items: [['kmh', 'km/h', 'Anhänger, Bus, über 3,5 t'], ['kmh', 'km/h', 'mit Notrad'], ['m', 'm', 'je Bakenstreifen am Bahnübergang']] },
  { n: '100', items: [['kmh', 'km/h', 'Pkw außerorts'], ['kmh', 'km/h', 'Anhänger mit Tempo-100-Plakette'], ['m', 'm', 'Warndreieck (Prüfungsantwort)'], ['x', 'km', 'Grenze für 3 m Überstand']] },
  { n: '130', items: [['kmh', 'km/h', 'Richtgeschwindigkeit, kein Limit']] },
  { n: '150', items: [['x', 'cm', 'Kindersitz darunter (und unter 12)'], ['m', 'm', 'bis 250 m: Gefahrzeichen außerorts davor']] },
  { n: '3.500', items: [['x', 'kg', 'Klasse B; mit Anhänger über 750 kg auch der ganze Zug']] },
];
export const UNIT: Record<string, string> = { kmh: 'km/h', m: 'Meter', pm: 'Promille', zeit: 'Zeit', x: 'Sonstiges' };
