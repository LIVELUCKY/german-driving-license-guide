import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

export type SignData = { id: string; nameDe: string; de: string; tipDe?: string; stvo?: string | null; kw: string; img: string | null; drawn?: string };

// Search over sign cards. mode 'hub': the static children show while the query is empty.
// mode 'list': the full list is always shown and simply filtered (category page).
export default function SignSearch(props: { signs: SignData[]; placeholder: string; mode: 'hub' | 'list'; children?: JSX.Element }) {
  const [q, setQ] = createSignal('');
  const hay = props.signs.map(s => `${s.kw} ${s.nameDe} ${s.stvo ?? ''} ${s.de}`.toLowerCase());
  const hits = createMemo(() => {
    const v = q().trim().toLowerCase();
    return v ? props.signs.filter((_, i) => hay[i]!.includes(v)) : props.signs;
  });
  const searching = () => q().trim() !== '';

  return (
    <>
      <label class="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <input type="search" placeholder={props.placeholder} aria-label={props.placeholder} value={q()} onInput={e => setQ(e.currentTarget.value)} />
      </label>
      <div hidden={searching()}>{props.children}</div>
      <Show when={props.mode === 'list' || searching()}>
        <Show when={hits().length} fallback={<p class="note">Nichts gefunden.</p>}>
          <p class="note note-mb" aria-live="polite">{searching() ? `${hits().length} Treffer` : `${hits().length} Zeichen`}</p>
          <div class="signgrid">
            <For each={hits()}>{s => (
              <div class="sign" tabindex="0" role="group" aria-label={s.nameDe}>
                <div class="sign-inner">
                  <div class="sign-front">
                    <Show when={s.img} fallback={<span innerHTML={s.drawn ?? ''} />}>
                      <img src={s.img!} alt={s.nameDe} width="72" height="72" loading="lazy" decoding="async" />
                    </Show>
                    <div class="nm">{s.nameDe}</div>
                    <Show when={s.stvo}><div class="no">Zeichen {s.stvo}</div></Show>
                  </div>
                  <div class="sign-back">
                    <div class="mn" innerHTML={s.de} />
                    <Show when={s.tipDe}><div class="tip" innerHTML={s.tipDe!} /></Show>
                  </div>
                </div>
              </div>
            )}</For>
          </div>
        </Show>
      </Show>
    </>
  );
}
