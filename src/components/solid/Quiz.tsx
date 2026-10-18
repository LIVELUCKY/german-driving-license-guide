import { createSignal, Match, Show, Switch } from 'solid-js';

type Card = { q: string; a: string; n: string };
type Task = { q: string; work: string; result: string };
type Mode = 'formel' | 'zahlen';

const SPEEDS = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130];
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]!;
const de = (x: number) => String(Math.round(x * 10) / 10).replace('.', ',');
const shuffle = <T,>(a: T[]): T[] => {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
};

// Formula drill: answers are computed with exactly the formulas taught on the page (T = speed ÷ 10).
const TASKS: ((v: number) => Task)[] = [
  v => { const t = v / 10; return { q: `Reaktionsweg bei ${v} km/h?`, work: `(${v} ÷ 10) × 3 = ${t} × 3`, result: `${de(t * 3)} m` }; },
  v => { const t = v / 10; return { q: `Normaler Bremsweg bei ${v} km/h?`, work: `(${v} ÷ 10)² = ${t} × ${t}`, result: `${de(t * t)} m` }; },
  v => { const t = v / 10; return { q: `Bremsweg bei Gefahrbremsung, ${v} km/h?`, work: `(${t} × ${t}) ÷ 2`, result: `${de(t * t / 2)} m` }; },
  v => { const t = v / 10; return { q: `Anhalteweg bei ${v} km/h?`, work: `Reaktion ${de(t * 3)} + Bremsen ${de(t * t)}`, result: `${de(t * 3 + t * t)} m` }; },
  v => { const t = v / 10; return { q: `Anhalteweg bei Gefahr, ${v} km/h?`, work: `Reaktion ${de(t * 3)} + halber Bremsweg ${de(t * t / 2)}`, result: `${de(t * 3 + t * t / 2)} m` }; },
  v => ({ q: `Sicherheitsabstand außerorts bei ${v} km/h?`, work: `halber Tacho: ${v} ÷ 2`, result: `${de(v / 2)} m` }),
  () => { const v = pick([30, 40, 50, 60]), t = v / 10; return { q: `Bremsweg bei ${v} km/h = ${de(t * t)} m. Wie lang bei ${2 * v} km/h?`, work: `doppeltes Tempo = 4-facher Bremsweg: ${de(t * t)} × 4`, result: `${de(4 * t * t)} m` }; },
  v => { const t = v / 10; return { q: `Reaktionsweg bei ${v} km/h mit 2 Sekunden Reaktionszeit?`, work: `(${v} ÷ 10) × 3 × 2`, result: `${de(t * 6)} m` }; },
];

export default function Quiz(props: { cards: Card[] }) {
  const [mode, setMode] = createSignal<Mode>('formel');
  // Fixed first task so server render and hydration match; random from the first answer on.
  const [task, setTask] = createSignal<Task>(TASKS[3]!(50));
  const [deck, setDeck] = createSignal<Card[]>([]);
  const [shown, setShown] = createSignal(false);
  const [ok, setOk] = createSignal(0);
  const [no, setNo] = createSignal(0);
  let okBtn!: HTMLButtonElement;

  const start = (m: Mode) => {
    setMode(m); setOk(0); setNo(0); setShown(false);
    if (m === 'zahlen') setDeck(shuffle(props.cards.slice()));
    else setTask(pick(TASKS)(pick(SPEEDS)));
  };
  const reveal = () => { setShown(true); okBtn?.focus(); };
  const answer = (knew: boolean) => {
    knew ? setOk(ok() + 1) : setNo(no() + 1);
    if (mode() === 'zahlen') {
      const [first, ...rest] = deck();
      // A missed card comes back three cards later (spaced repetition in small).
      if (!knew && first) rest.splice(Math.min(3, rest.length), 0, first);
      setDeck(rest);
    } else setTask(pick(TASKS)(pick(SPEEDS)));
    setShown(false);
  };
  const card = () => deck()[0];
  const chip = 'cursor-pointer rounded-full border-2 border-line px-3.5 py-1.5 text-[.85rem] font-bold';
  const btn = 'cursor-pointer rounded-box border-2 border-line px-4.5 py-2.5 font-bold';
  const done = () => mode() === 'zahlen' && !card();

  return (
    <div class="quiz max-w-[720px] print:hidden">
      <div class="mb-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Was willst du üben?">
        <button type="button" class={mode() === 'formel' ? `${chip} bg-ink text-bg` : `${chip} bg-surface text-ink`} aria-pressed={mode() === 'formel'} onClick={() => start('formel')}>Formeln rechnen</button>
        <button type="button" class={mode() === 'zahlen' ? `${chip} bg-ink text-bg` : `${chip} bg-surface text-ink`} aria-pressed={mode() === 'zahlen'} onClick={() => start('zahlen')}>Zahlenfragen ({props.cards.length})</button>
      </div>
      <div class="flex min-h-[190px] flex-col gap-3.5 rounded-box border-2 border-line bg-surface p-[clamp(16px,3vw,24px)] shadow-hard">
        <Switch>
          <Match when={done()}>
            <p class="quiz-q text-[clamp(1.05rem,2.6vw,1.3rem)] leading-snug font-medium">🎉 Alle Zahlenfragen durch!</p>
            <div class="mt-auto flex flex-wrap gap-2"><button type="button" class={`quiz-show ${btn} bg-ink text-bg`} onClick={() => start('zahlen')}>Nochmal von vorn</button></div>
          </Match>
          <Match when={true}>
            <p class="quiz-q text-[clamp(1.05rem,2.6vw,1.3rem)] leading-snug font-medium">
              <Show when={mode() === 'zahlen'} fallback={task().q}><span innerHTML={card()?.q ?? ''} /></Show>
            </p>
            <Show when={shown()}>
              <div class="quiz-a rounded-box bg-sun px-3.5 py-3 text-base text-fixed-ink [&_small]:opacity-70" aria-live="polite">
                <Show when={mode() === 'zahlen'} fallback={<>{task().work} = <b>{task().result}</b></>}>
                  <b innerHTML={card()?.a ?? ''} /> <small>({card()?.n})</small>
                </Show>
              </div>
            </Show>
            <div class="mt-auto flex flex-wrap gap-2">
              <Show when={shown()} fallback={<button type="button" class={`quiz-show ${btn} bg-ink text-bg`} onClick={reveal}>Antwort zeigen</button>}>
                <button type="button" class={`quiz-ok ${btn} border-go bg-surface text-ink`} ref={okBtn} onClick={() => answer(true)}>✓ Gewusst</button>
                <button type="button" class={`quiz-no ${btn} border-warn bg-surface text-ink`} onClick={() => answer(false)}>✗ Nochmal</button>
              </Show>
            </div>
          </Match>
        </Switch>
      </div>
      <p class="quiz-score mt-2 text-[.85rem] text-muted">
        <Show when={ok() + no()} fallback={mode() === 'zahlen' ? `${deck().length} Karten, zufällig gemischt` : 'Zufällige Tempos, unendlich viele Aufgaben'}>
          ✓ {ok()} gewusst · ✗ {no()} nochmal<Show when={mode() === 'zahlen'}> · noch {deck().length} offen</Show>
        </Show>
      </p>
    </div>
  );
}
