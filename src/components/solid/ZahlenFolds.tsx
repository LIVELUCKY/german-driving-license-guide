import { createSignal, For, Show } from 'solid-js';

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
      <div class="fold-bar">
        <p class="note">Erst die Merksätze lernen, dann eine Gruppe öffnen. Im <b>Abfrage-Modus</b> sind die Antworten verdeckt: erst selbst antworten, dann antippen.</p>
        <button type="button" class="recall-btn" aria-pressed={recall()} onClick={() => setMode(!recall())}>
          {recall() ? '👀 Antworten zeigen' : '🙈 Antworten verdecken'}
        </button>
      </div>
      <div class="folds" classList={{ recall: recall() }}>
        <For each={props.groups}>{(g, gi) => (
          <details class="fold">
            <summary><span class="fi">{g.i}</span><span class="ft">{g.h}<small>{g.hook}</small></span><span class="fc">{g.rows.length}</span></summary>
            <div class="qa">
              <For each={g.rows}>{(r, ri) => {
                const id = `${gi()}-${ri()}`;
                return (
                  <div>
                    <span><span innerHTML={r.q} /><small>{r.n}</small></span>
                    <Show when={recall()} fallback={<b innerHTML={r.a} />}>
                      <button type="button" class="qa-reveal" classList={{ shown: revealed().has(id) }} aria-expanded={revealed().has(id)} onClick={() => toggle(id)}>
                        <Show when={revealed().has(id)} fallback="Antwort?"><span innerHTML={r.a} /></Show>
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
