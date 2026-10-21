// Exam numbers grouped by the situation you meet them in (not by value: same-value grouping mixes
// unrelated rules and causes confusion). Every number keeps its reason, so it can be rebuilt by logic.
// Sources: StVO §§ 3, 4, 5, 12, 13, 15, 17, 19, 20, 22, 24a/24c StVG, § 43 StVZO, FeV; catalogue numbers in zahlenfragen.json.
export type Zahl = { n: string; unit: string; fam: 'kmh' | 'm' | 'pm' | 'zeit' | 'x'; t: string; why?: string };
export type Situation = { icon: string; title: string; hook: string; rows: Zahl[] };

export const SITUATIONEN: Situation[] = [
  { icon: '🅿️', title: 'Du parkst oder hältst', hook: '5 an der Ecke, 8 mit Radweg, 15 am Bus', rows: [
    { n: '5', unit: 'm', fam: 'm', t: 'vor und hinter Kreuzung oder Einmündung nicht parken', why: 'Abbieger und Fußgänger müssen gesehen werden und um die Ecke kommen' },
    { n: '8', unit: 'm', fam: 'm', t: 'vor der Kreuzung, wenn rechts ein baulicher Radweg ist', why: 'Rechtsabbieger müssen Radfahrer früh sehen' },
    { n: '5', unit: 'm', fam: 'm', t: 'vor dem Zebrastreifen nicht halten', why: 'Fußgänger am Rand müssen sichtbar bleiben' },
    { n: '10', unit: 'm', fam: 'm', t: 'vor Ampel, Andreaskreuz, Vorfahrt gewähren, Stopp nicht halten, wenn du sie verdeckst', why: 'Andere müssen das Zeichen sehen' },
    { n: '15', unit: 'm', fam: 'm', t: 'vor und hinter dem Haltestellenschild nicht parken', why: 'Der Bus braucht Platz zum Anfahren und Ausscheren' },
    { n: '3', unit: 'm', fam: 'm', t: 'Restfahrbahn bis zur durchgezogenen Linie, sonst Parkverbot', why: 'Daneben muss noch ein Fahrzeug durchpassen' },
    { n: '3', unit: 'Min', fam: 'zeit', t: 'länger als 3 Minuten halten oder das Auto verlassen = parken' },
    { n: '½ h', unit: 'Parkscheibe', fam: 'zeit', t: 'auf den nächsten halben Stundenstrich stellen (10:05 → 10:30)' },
    { n: '2,8', unit: 't', fam: 'x', t: 'Parken auf dem Gehweg (Zeichen 315) nur bis zu diesem Gewicht' },
  ] },
  { icon: '🚂', title: 'Am Bahnübergang', hook: 'Drei Streifen, je 80 Meter', rows: [
    { n: '240 · 160 · 80', unit: 'm', fam: 'm', t: 'Baken mit 3, 2, 1 Streifen vor dem Übergang', why: 'Jeder Streifen sind 80 m: du siehst, wie nah die Gleise sind' },
    { n: 'ab 1. Bake', unit: '', fam: 'x', t: 'keine Kraftfahrzeuge mehr überholen', why: 'Niemand soll vor den Gleisen ausweichen oder bremsen müssen' },
    { n: '5 / 50', unit: 'm', fam: 'm', t: 'vor und hinter dem Andreaskreuz nicht parken: innerorts 5, außerorts 50', why: 'Außerorts fährt man schneller, das Kreuz muss früher zu sehen sein' },
    { n: '10', unit: 'km/h', fam: 'kmh', t: 'mit Zusatzschild 10: heranfahren und queren höchstens 10' },
  ] },
  { icon: '🌫️', title: 'Schlechte Sicht', hook: '50 Meter Sicht, 50 Sachen', rows: [
    { n: '50', unit: 'km/h', fam: 'kmh', t: 'höchstens, wenn du durch Nebel, Schnee oder Regen weniger als 50 m siehst', why: 'Bei 50 ist der Anhalteweg 40 m: du kannst noch innerhalb der Sicht anhalten' },
    { n: '50', unit: 'm', fam: 'm', t: 'Nebelschlussleuchte nur bei Nebel und Sicht unter 50 m', why: 'Sonst blendet sie den Hintermann' },
    { n: '50', unit: 'm', fam: 'm', t: 'Abstand der Leitpfosten', why: 'Damit kannst du Sicht und Abstand schätzen' },
    { n: '½', unit: 'Sicht', fam: 'x', t: 'auf schmaler Straße musst du innerhalb der halben Sichtweite anhalten können', why: 'Der Gegenverkehr braucht die andere Hälfte' },
  ] },
  { icon: '🚗', title: 'Du fährst: Tempo', hook: '50 innen, 100 außen, 130 empfohlen', rows: [
    { n: '50', unit: 'km/h', fam: 'kmh', t: 'innerorts, sofort ab der Ortstafel' },
    { n: '100', unit: 'km/h', fam: 'kmh', t: 'Pkw außerorts' },
    { n: '130', unit: 'km/h', fam: 'kmh', t: 'Autobahn: nur Richtgeschwindigkeit, kein Limit', why: 'Schneller ist erlaubt, aber bei Unfall haftest du oft mit' },
    { n: '80', unit: 'km/h', fam: 'kmh', t: 'außerorts mit Anhänger, mit Bus, Kfz über 3,5 t bis 7,5 t (außer Pkw)', why: 'Schwere Fahrzeuge haben längere Bremswege' },
    { n: '60', unit: 'km/h', fam: 'kmh', t: 'außerorts Lkw über 7,5 t' },
    { n: '50', unit: 'km/h', fam: 'kmh', t: 'mit Schneeketten' },
    { n: '> 60', unit: 'km/h', fam: 'kmh', t: 'so schnell muss dein Fahrzeug bauartbedingt sein für Autobahn und Kraftfahrstraße (Prüfung: 61)', why: 'Langsame Fahrzeuge wären dort ein Hindernis' },
  ] },
  { icon: '↔️', title: 'Du überholst oder hältst Abstand', hook: 'Anderthalb drinnen, zwei draußen', rows: [
    { n: '1,5', unit: 'm', fam: 'm', t: 'Seitenabstand zu Rad, E-Scooter, Fußgänger innerorts' },
    { n: '2', unit: 'm', fam: 'm', t: 'dasselbe außerorts', why: 'Höheres Tempo, mehr Sog und Schreck für den Radfahrer' },
    { n: '½ Tacho', unit: 'm', fam: 'm', t: 'Sicherheitsabstand außerorts (100 km/h → 50 m), sonst 2 Sekunden', why: 'Bei 100 km/h sind 50 m etwa 1,8 Sekunden: genug Zeit zum Reagieren' },
    { n: '15', unit: 'm', fam: 'm', t: 'Abstand in der Kolonne in der Stadt bei 50 (3 Pkw-Längen)' },
    { n: '50', unit: 'm', fam: 'm', t: 'Mindestabstand Lkw über 3,5 t und Bus auf der Autobahn ab 50 km/h' },
    { n: '800', unit: 'm', fam: 'm', t: 'freie Sicht, um mit 100 einen Lkw mit 70 zu überholen', why: 'Überholweg ca. 400 m, der Gegenverkehr kommt dir gleich weit entgegen' },
    { n: '7', unit: 'm', fam: 'm', t: 'Zug länger als 7 m: außerorts Lücke für Überholer lassen' },
  ] },
  { icon: '🍺', title: 'Alkohol und Drogen', hook: 'Null, drei, fünf, elf, sechzehn', rows: [
    { n: '0,0', unit: '‰', fam: 'pm', t: 'in der Probezeit und unter 21', why: 'Wenig Erfahrung plus Alkohol ist besonders gefährlich' },
    { n: '0,3', unit: '‰', fam: 'pm', t: 'mit Ausfallerscheinung (z. B. Schlangenlinien, Unfall durch Alkohol) = Straftat' },
    { n: '0,5', unit: '‰', fam: 'pm', t: 'auch ohne Fehler: Ordnungswidrigkeit, Bußgeld und Fahrverbot' },
    { n: '1,1', unit: '‰', fam: 'pm', t: 'absolut fahruntüchtig: immer Straftat' },
    { n: '1,6', unit: '‰', fam: 'pm', t: 'MPU (auch mit dem Fahrrad)' },
    { n: '0,1', unit: '‰ pro h', fam: 'pm', t: 'so langsam baut der Körper ab: 1,0 ‰ braucht ca. 10 Stunden', why: 'Kaffee oder Schlaf ändern daran nichts' },
    { n: '3,5', unit: 'ng/ml', fam: 'pm', t: 'THC-Grenze im Blut. Mit Alkohol zusammen: verboten' },
  ] },
  { icon: '📦', title: 'Ladung und Anhänger', hook: 'Ab 1 Meter Fahne, bis 1,5 raus, 3 nur kurz', rows: [
    { n: '1', unit: 'm', fam: 'm', t: 'Ladung steht hinten mehr als 1 m über die Rückstrahler: kennzeichnen', why: 'Der Hintermann muss das Ende der Ladung sehen' },
    { n: '1,5', unit: 'm', fam: 'm', t: 'so weit darf Ladung hinten höchstens raus (bei Fahrt über 100 km)' },
    { n: '3', unit: 'm', fam: 'm', t: 'nur wenn die Fahrt höchstens 100 km lang ist' },
    { n: '50', unit: 'cm', fam: 'x', t: 'nach vorn nur ab 2,5 m Höhe (darunter gar nicht)' },
    { n: '750', unit: 'kg', fam: 'x', t: 'Anhänger geht mit Klasse B immer' },
    { n: '3.500', unit: 'kg', fam: 'x', t: 'Auto bis dahin; mit schwererem Anhänger darf der ganze Zug höchstens so viel wiegen', why: 'Mehr Gewicht braucht Übung (BE oder B96)' },
    { n: '4', unit: '%', fam: 'x', t: 'Stützlast mindestens (600 kg Anhänger → 24 kg)', why: 'Sonst schlingert der Anhänger' },
    { n: '18', unit: 'm', fam: 'm', t: 'Pkw mit Anhänger höchstens so lang' },
  ] },
  { icon: '🚨', title: 'Panne und Unfall', hook: 'Zwei Pfosten, hundert Meter', rows: [
    { n: '100', unit: 'm', fam: 'm', t: 'Warndreieck außerorts und auf der Autobahn (Prüfungsantwort), innerorts ca. 50', why: 'Bei hohem Tempo braucht der Verkehr mehr Vorwarnung' },
    { n: '112', unit: '', fam: 'x', t: 'europaweiter Notruf (Polizei 110)' },
    { n: '5', unit: 'm', fam: 'm', t: 'Abschleppseil höchstens so lang, gut sichtbar kennzeichnen' },
    { n: '5', unit: 'm', fam: 'm', t: 'Abstand bei Stillstand im Tunnel-Stau', why: 'Rettungskräfte und du selbst brauchen Platz zum Aussteigen' },
  ] },
  { icon: '🪪', title: 'Papiere, Punkte, Fristen', hook: '4 ermahnt, 6 verwarnt, 8 weg', rows: [
    { n: '2', unit: 'Jahre', fam: 'zeit', t: 'Probezeit; nach A- oder 2 B-Verstößen 2 Jahre länger + Aufbauseminar' },
    { n: '4 · 6 · 8', unit: 'Punkte', fam: 'x', t: 'Ermahnung · Verwarnung · Führerschein weg' },
    { n: '2,5 · 5 · 10', unit: 'Jahre', fam: 'zeit', t: 'dann werden 1-, 2- und 3-Punkte-Einträge gelöscht' },
    { n: '3, dann 2', unit: 'Jahre', fam: 'zeit', t: 'erste HU beim Neuwagen, danach alle 2 Jahre' },
    { n: '12', unit: 'Monate', fam: 'zeit', t: 'so lange gilt die bestandene Theorie für die Praxisprüfung' },
    { n: '12 / 150', unit: 'Jahre / cm', fam: 'x', t: 'Kindersitz, solange das Kind unter 12 und unter 150 cm ist' },
    { n: '1,6', unit: 'mm', fam: 'x', t: 'Mindestprofil der Reifen', why: 'Weniger Profil = Aquaplaning und langer Bremsweg' },
  ] },
];

// Same situation, different place: the contrast is what the exam tests.
// [situation, innerorts, außerorts, Autobahn]; '–' = does not apply there.
export const ORT_VERGLEICH: [string, string, string, string][] = [
  ['Tempo Pkw', '50 km/h', '100 km/h', 'kein Limit, 130 empfohlen'],
  ['Tempo mit Anhänger', '50 km/h', '80 km/h', '80 km/h (100 mit Plakette)'],
  ['Tempo Lkw über 7,5 t', '50 km/h', '60 km/h', '80 km/h'],
  ['Seitenabstand zu Rad und Fußgänger', '1,5 m', '2 m', '–'],
  ['Sicherheitsabstand', 'ca. 15 m bei 50 (3 Pkw-Längen)', 'halber Tacho', 'halber Tacho; Lkw/Bus mind. 50 m'],
  ['Warndreieck hinter dem Auto', 'ca. 50 m', 'ca. 100 m', 'ca. 100 m (Prüfungsantwort)'],
  ['Parken vor und hinter dem Andreaskreuz verboten', '5 m', '50 m', '–'],
  ['Gefahrzeichen stehen vor der Gefahr', 'kurz davor', '150 bis 250 m', 'wie außerorts, sonst Entfernung auf Zusatzschild'],
  ['Nachts parken: Beleuchtung', 'Parkleuchten reichen', 'eigene Beleuchtung (Standlicht)', 'Parken nur auf Parkplätzen'],
  ['Überholen mit Hupe oder Lichthupe ankündigen', 'nein (nur bei Gefahr)', 'erlaubt', 'erlaubt'],
  ['Fußgänger ohne Gehweg', 'rechts oder links am Rand', 'links am Rand, wenn zumutbar', 'verboten'],
  ['Wenden und Rückwärtsfahren', 'erlaubt, niemanden gefährden', 'erlaubt, niemanden gefährden', 'verboten'],
  ['Spur wählen', 'Kfz bis 3,5 t frei, wenn mehrere Spuren markiert sind', 'rechts fahren', 'rechts fahren, links nur zum Überholen'],
  ['Rettungsgasse bei Stau', '–', 'ab 2 Spuren je Richtung', 'immer'],
];
