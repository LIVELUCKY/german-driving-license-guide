// Answer patterns measured on the official Klasse-B catalogue (1113 multiple-choice questions, 3321 answers).
// `p` = how often the pattern matched the official answer. Only for when you do not know the rule.
export type Muster = { t: string; p: string; why?: string };

export const MUSTER: Muster[] = [
  { t: 'Steht <b>„bremsbereit“</b> in der Antwort: meist richtig', p: '17 von 18', why: 'Bremsbereit sein schadet nie.' },
  { t: '<b>„Rechtzeitig“</b> oder <b>„frühzeitig“</b>: meist richtig', p: '16 von 17' },
  { t: 'Was <b>„plötzlich“</b> passieren kann: meist richtig', p: '19 von 21', why: 'Gefahrenlehre heißt: mit dem Unerwarteten rechnen.' },
  { t: 'Was passieren <b>kann</b> oder <b>könnte</b>: meist richtig', p: '227 von 284' },
  { t: '<b>Hupe</b>, Lichthupe, Schallzeichen: meist falsch. Ausnahme: Warnung bei Gefahr, z. B. vor einem Falschfahrer', p: '18 von 21 falsch', why: 'Hupen erschreckt und löst kein Problem.' },
  { t: '<b>„Unverändert“</b> oder „mit gleicher Geschwindigkeit weiter“: meist falsch. Ausnahme: Unfall auf der Gegenseite, Hilfe ist schon da', p: '12 von 15 falsch', why: 'In einer Gefahrenfrage gibt es fast immer einen Grund, etwas zu ändern.' },
  { t: '<b>„Immer“</b> oder <b>„stets“</b>: meist falsch', p: '21 von 28 falsch' },
  { t: 'Druck machen (hupen, Lichthupe, zügig, beschleunigen, unverändert weiter): meist falsch', p: '64 von 89 falsch' },
  { t: '<b>Fahrstreifen wechseln</b> als Lösung: meist falsch', p: '23 von 33 falsch' },
];

export const FRAGETYPEN: Muster[] = [
  { t: '<b>„Womit müssen Sie rechnen?“</b>: meist stimmen mehrere, oft alle drei', p: '77 % der Antworten richtig, in 45 % der Fragen alle' },
  { t: '<b>„Was kann passieren?“</b> / „Welche Gefahren?“: auch hier stimmen meist mehrere', p: '76 % der Antworten richtig' },
  { t: '<b>„Wie verhalten Sie sich?“</b>: fast nie alles richtig, mindestens eine ist falsch', p: '205 von 212 Fragen' },
  { t: '<b>Vorfahrt-Fragen</b> (Kapitel 1.3.01): immer 5 Punkte, fast nie alles richtig', p: '46 von 47 Fragen' },
];

// Per situation. Small numbers, so read them as a hint only.
export const PRO_SITUATION: { icon: string; t: string; hook: string; rules: Muster[] }[] = [
  { icon: '🚦', t: 'Vorfahrt', hook: 'Jede Antwort einzeln nach der Regel prüfen', rules: [{ t: 'Nur rund die Hälfte der Antworten stimmt. Jede Antwort nach der Regel prüfen', p: '52 %' }, { t: 'Antwort mit „immer“, „nur“, „alle“: meist falsch', p: '6 von 8 falsch' }] },
  { icon: '🧒', t: 'Fußgänger, Kinder, Ältere', hook: 'Weiterfahren ist hier falsch', rules: [{ t: '„Weiterfahren“: falsch', p: '14 von 14 falsch' }, { t: '„Kann/könnte“: richtig', p: '17 von 19' }, { t: '„Bremsbereit“: richtig', p: '6 von 6' }] },
  { icon: '🚲', t: 'Radfahrer', hook: '„Immer“ und „müssen“ meist falsch', rules: [{ t: '„Immer“, „nur“, „alle“: meist falsch', p: '5 von 6 falsch' }, { t: '„Muss“ oder „müssen“: meist falsch', p: '6 von 9 falsch' }] },
  { icon: '🚗', t: 'Überholen', hook: 'Was passieren kann: richtig', rules: [{ t: '„Kann/könnte“: richtig', p: '35 von 39' }, { t: 'Druck machen: falsch', p: '11 von 14 falsch' }, { t: '„Wie verhalten Sie sich?“: nie alles richtig', p: '0 von 28' }] },
  { icon: '🛣️', t: 'Autobahn', hook: 'Vorsicht und Warnblinker: richtig', rules: [{ t: 'Vorsicht (langsamer, Abstand, bremsbereit): richtig', p: '9 von 10' }, { t: 'Warnblinker (Stauende): richtig', p: '6 von 6' }, { t: 'Fahrstreifen wechseln: meist falsch', p: '6 von 8 falsch' }] },
  { icon: '🌙', t: 'Nacht und Licht', hook: 'Fernlicht als Lösung: meist falsch', rules: [{ t: 'Fernlicht als Lösung: meist falsch', p: '9 von 11 falsch' }, { t: '„Womit rechnen?“: fast alles richtig', p: '11 von 12' }] },
  { icon: '🌧️', t: 'Nässe und Glätte', hook: 'Langsamer und Abstand: richtig', rules: [{ t: 'Vorsicht (langsamer, Abstand): richtig', p: '11 von 13' }, { t: '„Kann/könnte“: richtig', p: '22 von 28' }] },
  { icon: '↩️', t: 'Abbiegen', hook: 'Verhalten-Fragen: fast nie alles richtig', rules: [{ t: '„Kann/könnte“: richtig', p: '10 von 13' }, { t: '„Wie verhalten Sie sich?“: fast nie alles richtig', p: '1 von 13' }] },
  { icon: '🚂', t: 'Bahnübergang', hook: 'Anhalten und warten: meist richtig', rules: [{ t: 'Anhalten oder warten: meist richtig', p: '6 von 9' }, { t: '„Wie verhalten Sie sich?“: nie alles richtig', p: '0 von 6' }] },
  { icon: '🍺', t: 'Alkohol, Ablenkung, Gefühle', hook: 'Was passieren kann: richtig', rules: [{ t: '„Kann/könnte“: richtig', p: '17 von 19' }, { t: 'Oft sind alle drei richtig', p: '38 % der Fragen' }] },
  { icon: '🔧', t: 'Technik', hook: '„Muss“ meist richtig, „alle“ falsch', rules: [{ t: '„Muss …“ (Pflicht, Werkstatt): meist richtig', p: '13 von 14' }, { t: '„Alle“, „jeder“: meist falsch', p: '7 von 8 falsch' }] },
  { icon: '🌱', t: 'Umwelt', hook: 'Erst die Richtung der Frage lesen', rules: [{ t: 'Erst die Richtung der Frage lesen: bei „Was erhöht den Verbrauch?“ ist „stark beschleunigen“ richtig. Sparsam = niedrige Drehzahl, früh hochschalten, gleichmäßig fahren', p: 'Falle' }, { t: '„Immer“, „nur“, „alle“: meist falsch', p: '5 von 7 falsch' }] },
];
