// Road types compared. Sources: StVO § 3, § 9 Abs. 5, § 10, § 12, § 17 Abs. 4, § 18, § 25, § 45 Abs. 1c,
// Anlage 2 (Z. 242.1, 244.1, 244.3, 274.1) and Anlage 3 (Z. 306, 310, 325.1, 330.1, 331.1).
export const COLS = ['Wer darf fahren', 'Tempo Pkw', 'Halten / Parken', 'Wenden / Rückwärts', 'Fußgänger', 'Besonders'] as const;
export type Road = { sign: string | null; icon?: string; name: string; zeichen: string; cells: [string, string, string, string, string, string] };
export const ROADS: Road[] = [
  { sign: 'autobahn', name: 'Autobahn', zeichen: '330.1', cells: [
    'nur Kfz, die bauartbedingt <b>mehr als 60 km/h</b> schaffen (auch mit Anhänger)',
    '<b>kein Limit</b> außerorts, 130 empfohlen. Schilder gehen vor',
    '<b>Halten verboten</b>, auch auf dem Seitenstreifen. Parken nur auf Parkplätzen',
    '<b>verboten</b>',
    '<b>dürfen nicht</b> auf die Autobahn',
    'rein nur an <b>Anschlussstellen</b>, raus nur an Ausfahrten. Durchgehende Fahrbahn hat Vorfahrt'] },
  { sign: 'kraftfahrstrasse', name: 'Kraftfahrstraße', zeichen: '331.1', cells: [
    'wie Autobahn: nur Kfz <b>mehr als 60 km/h</b>',
    '<b>100</b> außerorts, frei bei getrennten Fahrbahnen oder 2 Spuren je Richtung',
    '<b>Halten verboten</b>, auch auf dem Seitenstreifen',
    '<b>verboten</b>',
    'nur an Kreuzungen, Einmündungen oder dafür vorgesehenen Stellen <b>queren</b>',
    'rein und raus nur an <b>Kreuzungen und Einmündungen</b>. Durchgehende Fahrbahn hat Vorfahrt'] },
  { sign: null, icon: '🌳', name: 'Landstraße', zeichen: 'außerorts', cells: [
    'alle, auch Rad und Traktor',
    '<b>100</b> (frei bei getrennten Fahrbahnen oder 2 Spuren je Richtung)',
    'nach § 12, rechten Seitenstreifen nutzen. Auf Vorfahrtstraße (306) <b>nicht auf der Fahrbahn parken</b>. Nachts eigene Beleuchtung',
    'erlaubt, niemanden gefährden',
    'ohne Gehweg <b>am linken Rand</b> gehen, wenn zumutbar',
    'Überholen darf mit Hupe oder Lichthupe angekündigt werden. Seitenabstand Rad <b>2 m</b>'] },
  { sign: 'ortstafel', name: 'Innerorts', zeichen: '310', cells: [
    'alle',
    '<b>50</b> ab der Ortstafel',
    'nach § 12. Nachts reichen Parkleuchten',
    'erlaubt, niemanden gefährden',
    'auf dem Gehweg',
    'Kfz bis 3,5 t: freie Spurwahl, wenn es <b>mehrere markierte Spuren</b> je Richtung gibt. Seitenabstand Rad <b>1,5 m</b>'] },
  { sign: 'tempo-30-zone', name: 'Tempo-30-Zone', zeichen: '274.1', cells: [
    'alle',
    '<b>30</b> in der ganzen Zone, bis zum Ende-Schild',
    'normal (§ 12)',
    'normal',
    'normal',
    'meist <b>rechts vor links</b>, in der Regel keine Ampelkreuzungen'] },
  { sign: 'verkehrsberuhigter-bereich', name: 'Verkehrsberuhigter Bereich', zeichen: '325.1', cells: [
    'alle Fahrzeuge',
    '<b>Schrittgeschwindigkeit</b>',
    'Parken nur auf <b>markierten Flächen</b> (außer Ein-/Aussteigen, Be-/Entladen)',
    'normal',
    'dürfen die <b>ganze Straße</b> nutzen, Kinder spielen überall. Notfalls warten',
    'rausfahren nach § 10: <b>allen Vorrang</b> geben, kein rechts vor links'] },
  { sign: 'fahrradstrasse', name: 'Fahrradstraße / -zone', zeichen: '244.1 / 244.3', cells: [
    'Rad und E-Scooter. Andere <b>nur mit Zusatzzeichen</b>',
    '<b>max. 30</b> für alle, notfalls langsamer',
    'normal (§ 12)',
    'normal',
    'normal',
    'Räder dürfen <b>nebeneinander</b> fahren. Radverkehr nicht gefährden oder behindern'] },
  { sign: 'fussgaengerzone', name: 'Fußgängerzone', zeichen: '242.1', cells: [
    'nur Fußgänger. Fahrzeuge <b>nur mit Zusatzzeichen</b>, auch Anlieger nicht',
    'wenn erlaubt: Schrittgeschwindigkeit',
    'ohne Zusatzzeichen kein Fahrzeugverkehr',
    '–',
    'haben <b>Vorrang</b>, notfalls warten',
    'rausfahren nach § 10'] },
];
// The pair the exam likes to mix up.
export const AB_VS_KFS: [string, string, string][] = [
  ['Tempo', 'kein Limit, 130 empfohlen', '100 (frei nur bei getrennten Fahrbahnen oder 2 Spuren je Richtung)'],
  ['Rein und raus', 'nur an Anschlussstellen', 'an Kreuzungen und Einmündungen'],
  ['Kreuzungen', 'keine', 'möglich (dort hat die Kraftfahrstraße Vorfahrt)'],
  ['Fußgänger', 'nie', 'dürfen an Kreuzungen, Einmündungen oder dafür vorgesehenen Stellen queren'],
  ['Gleich bei beiden', 'nur Kfz > 60 km/h, nicht halten, nicht wenden, nicht rückwärts', ''],
];
