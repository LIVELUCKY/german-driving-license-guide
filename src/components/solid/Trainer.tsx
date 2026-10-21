import { createMemo, createSignal, For, onMount, Show } from 'solid-js';

type Option = { t: string; ok: boolean; why: string };
type Item = { topic: string; points: number; q: string; options: Option[]; ref: string };
type Mode = 'ueben' | 'pruefung';

const STORE = 'fs_trainer_v1';
const EXAM_SIZE = 30;
const shuffle = <T,>(a: T[]): T[] => {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
};
const allRight = (it: Item, picked: ReadonlySet<number>) => it.options.every((o, i) => o.ok === picked.has(i));

function loadWeak(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(STORE) ?? '{}') as Record<string, number>; } catch { return {}; }
}

// Exam-style practice: tick every true statement; an item only counts when every option is judged right.
export default function Trainer(props: { items: Item[] }) {
  const topics = [...new Set(props.items.map(i => i.topic))];
  const [mode, setMode] = createSignal<Mode>('ueben');
  const [topic, setTopic] = createSignal<string>('alle');
  // Deterministic first render (server = hydration); reordered by weakness on mount.
  const [queue, setQueue] = createSignal<Item[]>(props.items.slice());
  const [picked, setPicked] = createSignal<ReadonlySet<number>>(new Set());
  const [checked, setChecked] = createSignal(false);
  const [weak, setWeak] = createSignal<Record<string, number>>({});
  // exam state
  const [answers, setAnswers] = createSignal<{ item: Item; right: boolean }[]>([]);
  const [done, setDone] = createSignal(false);

  const key = (it: Item) => it.q;
  const persist = (w: Record<string, number>) => { setWeak(w); try { localStorage.setItem(STORE, JSON.stringify(w)); } catch { /* private mode */ } };
  const pool = createMemo(() => props.items.filter(i => topic() === 'alle' || i.topic === topic()));
  const current = () => queue()[0];

  // Practice: items you got wrong before come first.
  const startPractice = () => {
    const w = weak();
    setQueue(shuffle(pool().slice()).sort((a, b) => (w[key(b)] ?? 0) - (w[key(a)] ?? 0)));
    setPicked(new Set<number>()); setChecked(false);
  };
  const startExam = () => {
    setQueue(shuffle(props.items.slice()).slice(0, EXAM_SIZE).map(it => ({ ...it, options: shuffle(it.options.slice()) })));
    setAnswers([]); setDone(false); setPicked(new Set<number>()); setChecked(false);
  };
  const switchMode = (m: Mode) => { setMode(m); m === 'ueben' ? startPractice() : startExam(); };
  const toggle = (i: number) => {
    if (checked() && mode() === 'ueben') return;
    const next = new Set(picked()); next.has(i) ? next.delete(i) : next.add(i); setPicked(next);
  };
  const check = () => {
    const it = current(); if (!it) return;
    const right = allRight(it, picked());
    const w = { ...weak() }; w[key(it)] = right ? Math.max((w[key(it)] ?? 0) - 1, 0) : (w[key(it)] ?? 0) + 2; persist(w);
    if (mode() === 'pruefung') {
      setAnswers([...answers(), { item: it, right }]);
      const rest = queue().slice(1); setQueue(rest); setPicked(new Set<number>());
      if (!rest.length) setDone(true);
    } else setChecked(true);
  };
  const next = () => { setQueue(queue().slice(1)); setPicked(new Set<number>()); setChecked(false); };

  const errorPoints = createMemo(() => answers().filter(a => !a.right).reduce((n, a) => n + a.item.points, 0));
  const wrongFives = createMemo(() => answers().filter(a => !a.right && a.item.points === 5).length);
  const passed = () => errorPoints() <= 10 && wrongFives() < 2;

  onMount(() => { setWeak(loadWeak()); startPractice(); });

  const chip = 'cursor-pointer rounded-full border-2 border-line px-3.5 py-1.5 text-[.85rem] font-bold';
  const btn = 'cursor-pointer rounded-box border-2 border-line px-4.5 py-2.5 font-bold';

  return (
    <div id="trainer" class="max-w-[820px] print:hidden">
      <div class="mb-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Modus">
        <button type="button" class={`${chip} ${mode() === 'ueben' ? 'bg-ink text-bg' : 'bg-surface text-ink'}`} aria-pressed={mode() === 'ueben'} onClick={() => switchMode('ueben')}>✍️ Üben</button>
        <button type="button" class={`${chip} ${mode() === 'pruefung' ? 'bg-ink text-bg' : 'bg-surface text-ink'}`} aria-pressed={mode() === 'pruefung'} onClick={() => switchMode('pruefung')}>⏱️ Prüfungssimulation ({Math.min(EXAM_SIZE, props.items.length)} Fragen)</button>
      </div>
      <Show when={mode() === 'ueben'}>
        <div class="mb-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Thema">
          <For each={['alle', ...topics]}>{t => (
            <button type="button" aria-pressed={topic() === t} onClick={() => { setTopic(t); startPractice(); }}
              class={`cursor-pointer rounded-full border px-2.5 py-1 text-[.78rem] font-bold ${topic() === t ? 'border-ink bg-ink text-bg' : 'border-soft bg-surface text-ink'}`}>{t === 'alle' ? 'Alle Themen' : t}</button>
          )}</For>
        </div>
      </Show>

      <div class="flex min-h-[260px] flex-col gap-3.5 rounded-box border-2 border-line bg-surface p-[clamp(16px,3vw,24px)] shadow-hard">
        <Show when={!(mode() === 'pruefung' && done())} fallback={
          <>
            <p class={`trainer-result font-display text-[clamp(1.3rem,4vw,1.9rem)] ${passed() ? 'text-go' : 'text-warn'}`}>{passed() ? '✓ Bestanden' : '✗ Nicht bestanden'}</p>
            <p class="text-[.95rem]"><b>{errorPoints()}</b> Fehlerpunkte (erlaubt: 10) · <b>{wrongFives()}</b> falsche 5-Punkte-Fragen (ab 2 durchgefallen)</p>
            <Show when={answers().some(a => !a.right)}>
              <p class="text-[.85rem] font-bold">Das wiederholen:</p>
              <ul class="flex flex-col gap-1.5 text-[.86rem]">
                <For each={answers().filter(a => !a.right)}>{a => <li class="border-l-4 border-warn pl-2.5">{a.item.q} <span class="text-muted">({a.item.topic}, {a.item.points} P.)</span></li>}</For>
              </ul>
            </Show>
            <div class="mt-auto"><button type="button" class={`${btn} bg-ink text-bg`} onClick={startExam}>Neue Simulation</button></div>
          </>
        }>
          <Show when={current()} fallback={
            <>
              <p class="font-medium">🎉 Alle Fragen dieses Themas durch.</p>
              <div class="mt-auto"><button type="button" class={`${btn} bg-ink text-bg`} onClick={startPractice}>Nochmal</button></div>
            </>
          }>{it => (
            <>
              <p class="flex flex-wrap items-center gap-2 text-[.75rem] font-bold tracking-wide text-muted uppercase">
                <span>{it().topic}</span><span class={`rounded-full px-2 py-0.5 text-bg ${it().points >= 5 ? 'bg-warn' : 'bg-ink'}`}>{it().points} Punkte</span>
                <Show when={mode() === 'pruefung'}><span>Frage {answers().length + 1} von {answers().length + queue().length}</span></Show>
              </p>
              <p class="trainer-q text-[clamp(1.02rem,2.5vw,1.25rem)] leading-snug font-medium">{it().q}</p>
              <p class="text-[.8rem] text-muted">Kreuze <b class="text-ink">alle</b> richtigen Antworten an. Es können eine, zwei oder drei sein.</p>
              <div class="grid gap-2">
                <For each={it().options}>{(o, i) => {
                  const on = () => picked().has(i());
                  const state = () => !checked() ? (on() ? 'border-ink bg-bg2' : 'border-soft bg-surface') : o.ok === on() ? 'border-go bg-go/10' : 'border-warn bg-warn/10';
                  return (
                    <button type="button" role="checkbox" aria-checked={on()} onClick={() => toggle(i())}
                      class={`trainer-option flex cursor-pointer gap-3 rounded-box border-2 px-3.5 py-2.5 text-left ${state()}`}>
                      <span class={`mt-0.5 grid size-5 flex-none place-items-center rounded border-2 border-ink text-[.75rem] font-bold ${on() ? 'bg-ink text-bg' : ''}`} aria-hidden="true">{on() ? '✓' : ''}</span>
                      <span>
                        <span class="font-bold">{o.t}</span>
                        <Show when={checked()}>
                          <span class="mt-1 block text-[.84rem]"><b class={o.ok ? 'text-go' : 'text-warn'}>{o.ok ? 'Stimmt.' : 'Stimmt nicht.'}</b> {o.why}</span>
                        </Show>
                      </span>
                    </button>
                  );
                }}</For>
              </div>
              <Show when={checked()}>
                <div class={`trainer-feedback rounded-box border-2 px-3.5 py-2.5 ${allRight(it(), picked()) ? 'border-go bg-go/15' : 'border-warn bg-warn/10'}`} aria-live="polite">
                  {allRight(it(), picked()) ? '✓ Alle richtig beurteilt.' : `✗ Nicht ganz: in der Prüfung wären das ${it().points} Fehlerpunkte.`} <span class="text-[.78rem] text-muted">({/^\d/.test(it().ref) ? `ähnlich wie Katalogfrage ${it().ref}` : `Quelle: ${it().ref}`})</span>
                </div>
              </Show>
              <div class="mt-auto flex gap-2">
                <Show when={mode() === 'ueben' && checked()} fallback={<button type="button" class={`trainer-check ${btn} bg-ink text-bg`} onClick={check}>{mode() === 'pruefung' ? 'Weiter' : 'Prüfen'}</button>}>
                  <button type="button" class={`trainer-next ${btn} bg-ink text-bg`} onClick={next}>Nächste Frage →</button>
                </Show>
              </div>
            </>
          )}</Show>
        </Show>
      </div>
    </div>
  );
}
