import { createMemo, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { buildCards, loadBoxes, nextBox, pick, SAFE, saveBoxes, shuffle, type Card, type Group } from './cards';

type Task = { q: string; work: string; value: number };
type Mode = 'formel' | 'zahlen';

const SPEEDS = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130];
const de = (x: number) => String(Math.round(x * 10) / 10).replace('.', ',');
const parseNum = (s: string) => Number(s.replace(/[^\d,.-]/g, '').replace(',', '.'));

// Formula drill: answers come from exactly the formulas taught on the page (T = speed ÷ 10).
const TASKS: ((v: number) => Task)[] = [
  v => { const t = v / 10; return { q: `Reaktionsweg bei ${v} km/h?`, work: `(${v} ÷ 10) × 3 = ${t} × 3`, value: t * 3 }; },
  v => { const t = v / 10; return { q: `Normaler Bremsweg bei ${v} km/h?`, work: `(${v} ÷ 10)² = ${t} × ${t}`, value: t * t }; },
  v => { const t = v / 10; return { q: `Bremsweg bei Gefahrbremsung, ${v} km/h?`, work: `(${t} × ${t}) ÷ 2`, value: t * t / 2 }; },
  v => { const t = v / 10; return { q: `Anhalteweg bei ${v} km/h?`, work: `Reaktion ${de(t * 3)} + Bremsen ${de(t * t)}`, value: t * 3 + t * t }; },
  v => { const t = v / 10; return { q: `Anhalteweg bei Gefahr, ${v} km/h?`, work: `Reaktion ${de(t * 3)} + halber Bremsweg ${de(t * t / 2)}`, value: t * 3 + t * t / 2 }; },
  v => ({ q: `Sicherheitsabstand außerorts bei ${v} km/h?`, work: `halber Tacho: ${v} ÷ 2`, value: v / 2 }),
  () => { const v = pick([30, 40, 50, 60]), t = v / 10; return { q: `Bremsweg bei ${v} km/h = ${de(t * t)} m. Wie lang bei ${2 * v} km/h?`, work: `doppeltes Tempo = 4-facher Bremsweg: ${de(t * t)} × 4`, value: 4 * t * t }; },
  v => { const t = v / 10; return { q: `Reaktionsweg bei ${v} km/h mit 2 Sekunden Reaktionszeit?`, work: `(${v} ÷ 10) × 3 × 2`, value: t * 6 }; },
];

export default function Quiz(props: { groups: Group[] }) {
  const cards: Card[] = buildCards(props.groups);
  const topics = props.groups.map(g => g.h);

  const [mode, setMode] = createSignal<Mode>('formel');
  // Formula mode. Fixed first task so server render and hydration match.
  const [task, setTask] = createSignal<Task>(TASKS[3]!(50));
  const [input, setInput] = createSignal('');
  // Catalogue mode
  const [chosen, setChosen] = createSignal<ReadonlySet<string>>(new Set(topics));
  const [boxes, setBoxes] = createSignal<Record<string, number>>({});
  const [queue, setQueue] = createSignal<Card[]>([]);
  const [options, setOptions] = createSignal<string[]>([]);
  // Shared
  const [answered, setAnswered] = createSignal<null | { right: boolean; picked?: string }>(null);
  const [ok, setOk] = createSignal(0);
  const [no, setNo] = createSignal(0);
  let inputEl: HTMLInputElement | undefined;

  const pool = createMemo(() => cards.filter(c => chosen().has(c.topic)));
  const safeCount = createMemo(() => pool().filter(c => (boxes()[c.n] ?? 0) >= SAFE).length);
  const seenCount = createMemo(() => pool().filter(c => c.n in boxes()).length);
  const card = () => queue()[0];

  const persist = (b: Record<string, number>) => { setBoxes(b); saveBoxes(b); };
  const prepare = (c?: Card) => { setAnswered(null); setOptions(c ? shuffle([c.a, ...shuffle(c.others.slice()).slice(0, 2)]) : []); };
  // Lowest Leitner box first, shuffled inside each box: weak cards come up more often.
  const buildQueue = () => {
    const b = boxes();
    const q = shuffle(pool().slice()).sort((x, y) => (b[x.n] ?? 0) - (b[y.n] ?? 0));
    setQueue(q); prepare(q[0]);
  };

  const start = (m: Mode) => {
    setMode(m); setOk(0); setNo(0); setAnswered(null); setInput('');
    if (m === 'zahlen') buildQueue(); else setTask(pick(TASKS)(pick(SPEEDS)));
  };
  const toggleTopic = (t: string) => {
    const next = new Set(chosen());
    next.has(t) ? next.delete(t) : next.add(t);
    if (next.size === 0) return; // keep at least one topic
    setChosen(next); buildQueue();
  };

  const checkFormula = () => {
    if (answered() || input().trim() === '') return;
    const right = Math.abs(parseNum(input()) - task().value) < 0.05;
    right ? setOk(ok() + 1) : setNo(no() + 1);
    setAnswered({ right });
  };
  const choose = (opt: string) => {
    const c = card(); if (!c || answered()) return;
    const right = opt === c.a;
    right ? setOk(ok() + 1) : setNo(no() + 1);
    const b = { ...boxes() }; b[c.n] = nextBox(b[c.n], right); persist(b);
    setAnswered({ right, picked: opt });
  };
  const next = () => {
    if (mode() === 'formel') { setTask(pick(TASKS)(pick(SPEEDS))); setInput(''); setAnswered(null); queueMicrotask(() => inputEl?.focus()); return; }
    const [first, ...rest] = queue();
    // A missed card comes back three cards later.
    const a = answered();
    if (first && a && !a.right) rest.splice(Math.min(3, rest.length), 0, first);
    setQueue(rest); prepare(rest[0]);
  };
  const reset = () => { persist({}); buildQueue(); setOk(0); setNo(0); };

  onMount(() => {
    setBoxes(loadBoxes());
    const onKey = (e: KeyboardEvent) => {
      const root = document.getElementById('quiz');
      const inside = root?.contains(document.activeElement) || document.activeElement === document.body;
      if (!inside || mode() !== 'zahlen') return;
      if (!answered() && ['1', '2', '3'].includes(e.key)) { const o = options()[Number(e.key) - 1]; if (o) { e.preventDefault(); choose(o); } }
      else if (answered() && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight')) { e.preventDefault(); next(); }
    };
    addEventListener('keydown', onKey);
    onCleanup(() => removeEventListener('keydown', onKey));
  });

  const chip = 'cursor-pointer rounded-full border-2 border-line px-3.5 py-1.5 text-[.85rem] font-bold';
  const btn = 'cursor-pointer rounded-box border-2 border-line px-4.5 py-2.5 font-bold';
  const feedback = (right: boolean) => right ? 'border-go bg-go/15' : 'border-warn bg-warn/10';

  return (
    <div id="quiz" class="quiz max-w-[760px] print:hidden">
      <div class="mb-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Was willst du üben?">
        <button type="button" class={`${chip} ${mode() === 'formel' ? 'bg-ink text-bg' : 'bg-surface text-ink'}`} aria-pressed={mode() === 'formel'} onClick={() => start('formel')}>🧮 Formeln rechnen</button>
        <button type="button" class={`${chip} ${mode() === 'zahlen' ? 'bg-ink text-bg' : 'bg-surface text-ink'}`} aria-pressed={mode() === 'zahlen'} onClick={() => start('zahlen')}>📘 Zahlenfragen ({cards.length})</button>
      </div>

      <Show when={mode() === 'zahlen'}>
        <div class="mb-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Themen">
          <For each={props.groups}>{g => (
            <button type="button" aria-pressed={chosen().has(g.h)} onClick={() => toggleTopic(g.h)}
              class={`cursor-pointer rounded-full border px-2.5 py-1 text-[.78rem] font-bold ${chosen().has(g.h) ? 'border-ink bg-surface text-ink' : 'border-soft bg-transparent text-muted line-through'}`}>{g.i} {g.h}</button>
          )}</For>
        </div>
        <div class="mb-2.5 flex items-center gap-3 text-[.8rem] text-muted">
          <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-soft" role="progressbar" aria-label="Sicher gewusst" aria-valuemin={0} aria-valuemax={pool().length} aria-valuenow={safeCount()}>
            <div class="h-full bg-go transition-[width]" style={{ width: `${(safeCount() / Math.max(pool().length, 1)) * 100}%` }} />
          </div>
          <span class="quiz-progress"><b class="text-ink">{safeCount()}</b> / {pool().length} sicher · {seenCount()} geübt</span>
          <button type="button" class="cursor-pointer underline underline-offset-2" onClick={reset}>zurücksetzen</button>
        </div>
      </Show>

      <div class="flex min-h-[220px] flex-col gap-3.5 rounded-box border-2 border-line bg-surface p-[clamp(16px,3vw,24px)] shadow-hard">
        <Show when={mode() === 'formel'} fallback={
          <Show when={card()} fallback={
            <>
              <p class="quiz-q text-[clamp(1.05rem,2.6vw,1.3rem)] font-medium">🎉 Runde geschafft!</p>
              <div class="mt-auto"><button type="button" class={`quiz-next ${btn} bg-ink text-bg`} onClick={buildQueue}>Neue Runde</button></div>
            </>
          }>
            <p class="text-[.75rem] font-bold tracking-wide text-muted uppercase">{card()!.topic} · {card()!.n}</p>
            <p class="quiz-q text-[clamp(1.05rem,2.6vw,1.3rem)] leading-snug font-medium" innerHTML={card()!.q} />
            <div class="grid gap-2" role="group" aria-label="Antworten">
              <For each={options()}>{(o, i) => {
                const state = () => { const a = answered(); return !a ? '' : o === card()!.a ? 'border-go bg-go/15' : o === a.picked ? 'border-warn bg-warn/10' : 'border-line bg-surface opacity-60'; };
                return (
                  <button type="button" disabled={!!answered()} onClick={() => choose(o)}
                    class={`quiz-option flex cursor-pointer items-baseline gap-3 rounded-box border-2 px-3.5 py-2.5 text-left font-bold disabled:cursor-default ${state() || 'border-line bg-surface hover:bg-bg2'}`}>
                    <span class="grid size-6 flex-none place-items-center rounded-full bg-ink text-[.75rem] text-bg" aria-hidden="true">{i() + 1}</span><span innerHTML={o} />
                  </button>
                );
              }}</For>
            </div>
            <Show when={answered()}>{a => (
              <>
                <div class={`quiz-a rounded-box border-2 px-3.5 py-2.5 ${feedback(a().right)}`} aria-live="polite">
                  <Show when={a().right} fallback={<>✗ Richtig ist: <b innerHTML={card()!.a} /></>}>✓ Richtig.</Show>
                </div>
                <div class="mt-auto"><button type="button" class={`quiz-next ${btn} bg-ink text-bg`} onClick={next}>Weiter →</button></div>
              </>
            )}</Show>
          </Show>
        }>
          <p class="quiz-q text-[clamp(1.05rem,2.6vw,1.3rem)] leading-snug font-medium">{task().q}</p>
          <div class="flex flex-wrap items-center gap-2" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (answered()) next(); else checkFormula(); } }}>
            <label class="flex items-center gap-2 rounded-box border-2 border-line bg-bg px-3 py-2 focus-within:border-accent-text">
              <input ref={inputEl} inputmode="decimal" autocomplete="off" aria-label="Deine Antwort in Metern" placeholder="z. B. 27,5"
                class="quiz-input w-28 bg-transparent font-display text-lg text-ink outline-none" value={input()} onInput={e => setInput(e.currentTarget.value)} readOnly={!!answered()} />
              <span class="font-bold text-muted">m</span>
            </label>
            <Show when={!answered()} fallback={<button type="button" class={`quiz-next ${btn} bg-ink text-bg`} onClick={next}>Weiter →</button>}>
              <button type="button" class={`quiz-check ${btn} bg-ink text-bg`} onClick={checkFormula}>Prüfen</button>
            </Show>
          </div>
          <Show when={answered()}>{a => (
            <div class={`quiz-a rounded-box border-2 px-3.5 py-2.5 ${feedback(a().right)}`} aria-live="polite">
              {a().right ? '✓ Richtig: ' : '✗ Richtig ist: '}{task().work} = <b>{de(task().value)} m</b>
            </div>
          )}</Show>
        </Show>
      </div>
      <p class="quiz-score mt-2 text-[.85rem] text-muted">
        <Show when={ok() + no()} fallback={mode() === 'zahlen' ? 'Tasten 1, 2, 3 wählen, Leertaste weiter. Dein Fortschritt bleibt in diesem Browser gespeichert.' : 'Zahl eintippen, Enter prüft, Enter nochmal geht weiter.'}>
          ✓ {ok()} richtig · ✗ {no()} falsch<Show when={mode() === 'zahlen'}> · noch {queue().length} in dieser Runde</Show>
        </Show>
      </p>
    </div>
  );
}
