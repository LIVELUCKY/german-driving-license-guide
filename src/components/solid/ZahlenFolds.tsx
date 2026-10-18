import { createSignal, For, Show } from 'solid-js';
import { fold } from '../ui/fold';

type Row = { q: string; a: string; n: string };
type Group = { h: string; i: string; hook: string; rows: Row[] };

// Catalogue questions in chunks. Recall mode hides every answer behind a button:
// answer in your head first, then reveal (active recall beats re-reading).
export default function ZahlenFolds(props: { groups: Group[] }) {
  const [recall, setRecall] = createSignal(false);
  const [revealed, setRevealed] = createSignal<ReadonlySet<string>>(new Set());
  const toggle = (id: string) => {
    const next = new Set(revealed());
    next.has(id) ? next.delete(id) : next.add(id);
    setRevealed(next);
  };
  const setMode = (on: boolean) => { setRecall(on); setRevealed(new Set<string>()); };

  return (
    <>
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p class="max-w-[62ch] text-[.85rem] text-muted">Erst die Merksätze lernen, dann eine Gruppe öffnen. Im <b class="text-ink">Abfrage-Modus</b> sind die Antworten verdeckt: erst selbst antworten, dann antippen.</p>
        <button type="button" class="cursor-pointer rounded-full border-2 border-line bg-ink px-4 py-2 text-[.88rem] font-bold text-bg print:hidden" aria-pressed={recall()} onClick={() => setMode(!recall())}>
          {recall() ? '👀 Antworten zeigen' : '🙈 Antworten verdecken'}
        </button>
      </div>
      <div class="grid items-start gap-2.5 md:grid-cols-2">
        <For each={props.groups}>{(g, gi) => (
          <details class={`fold ${fold.root}`}>
            <summary class={fold.summary}>
              <span class={fold.icon} aria-hidden="true">{g.i}</span>
              <span class={fold.title}>{g.h}<small class={fold.hook}>{g.hook}</small></span>
              <span class={fold.count}>{g.rows.length}</span>
              <span class={fold.chevron} aria-hidden="true" />
            </summary>
            <div class={`${fold.body} grid gap-2`}>
              <For each={g.rows}>{(r, ri) => {
                const id = `${gi()}-${ri()}`;
                const open = () => revealed().has(id);
                return (
                  <div class="flex items-baseline justify-between gap-3 rounded-box border border-soft bg-surface px-3 py-2 text-[.86rem] leading-snug">
                    <span><span innerHTML={r.q} /><small class="mt-0.5 block text-[.68rem] text-muted">{r.n}</small></span>
                    <Show when={recall()} fallback={<b class="max-w-[45%] flex-none text-right font-display text-[.95rem] text-accent-text" innerHTML={r.a} />}>
                      <button type="button" aria-expanded={open()} onClick={() => toggle(id)}
                        class={`max-w-[45%] flex-none cursor-pointer rounded px-2.5 py-0.5 text-right font-display text-[.95rem] ${open() ? 'text-accent-text' : 'border border-dashed border-muted bg-soft text-muted'}`}>
                        <Show when={open()} fallback="Antwort?"><span innerHTML={r.a} /></Show>
                      </button>
                    </Show>
                  </div>
                );
              }}</For>
            </div>
          </details>
        )}</For>
      </div>
    </>
  );
}
