// Shared logic for the numeric catalogue questions (Quiz and Swipe).
// Every answer shown comes from the official catalogue: a wrong option is the official
// answer of another question with the same unit (m with m, km/h with km/h …).
export type Row = { q: string; a: string; n: string };
export type Group = { h: string; i: string; rows: Row[] };
export type Card = Row & { topic: string; others: string[]; sameUnit: string[] };

export const shuffle = <T,>(a: T[]): T[] => {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
};
export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]!;

const TIME = /^(Sek|Sekunden|Min|Minuten|Stunden|Wochen|Monate|Monaten|Jahre|Jahren)$/;
const unit = (a: string) => {
  const u = /\d[\d.,]*\s*([A-Za-zäöüÄÖÜß%‰/]+)/.exec(a.replace(/<[^>]+>/g, ''))?.[1] ?? 'text';
  return TIME.test(u) ? 'zeit' : u;
};

// Bare answer without another question's explanation: "50 km/h (27,5 m &gt; 20 m)" -> "50 km/h".
const core = (a: string) => a.replace(/\s*\(.*?\)\s*/g, ' ').trim();
const value = (a: string) => /\d[\d.,]*/.exec(a.replace(/<[^>]+>/g, ''))?.[0] ?? a;

export function buildCards(groups: Group[]): Card[] {
  const all = groups.flatMap(g => g.rows.map(r => ({ ...r, topic: g.h })));
  return all.map(r => {
    // A wrong option must differ in its number, or it would look identical to the right answer.
    const differs = (x: string) => x !== r.a && value(x) !== value(r.a);
    // Answers without a unit ("weiterfahren", "4-mal so lang") have no real look-alikes.
    const same = unit(r.a) === 'text' ? [] : [...new Set(all.filter(x => differs(x.a) && unit(x.a) === unit(r.a)).map(x => core(x.a)))];
    const group = [...new Set(all.filter(x => x.topic === r.topic && differs(x.a)).map(x => core(x.a)))];
    // `sameUnit` only holds real look-alikes; `others` falls back to the topic so the quiz always has 3 options.
    return { ...r, sameUnit: same, others: same.length >= 2 ? same : [...same, ...group.filter(x => !same.includes(x))] };
  });
}

// Leitner boxes per catalogue question number, shared by Quiz and Swipe.
const STORE = 'fs_quiz_v1';
export const SAFE = 2; // "sicher" from box 2 (right twice in a row)
export function loadBoxes(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(STORE) ?? '{}') as Record<string, number>; } catch { return {}; }
}
export function saveBoxes(b: Record<string, number>) {
  try { localStorage.setItem(STORE, JSON.stringify(b)); } catch { /* private mode: progress just is not kept */ }
}
export const nextBox = (box: number | undefined, right: boolean) => right ? Math.min((box ?? 0) + 1, 3) : 0;
