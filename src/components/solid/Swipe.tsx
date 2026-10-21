import { createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { buildCards, loadBoxes, nextBox, SAFE, saveBoxes, shuffle, type Card, type Group } from './cards';

// Full-screen "stimmt / stimmt nicht" cards. Each card shows an official catalogue question with
// either its official answer or the official answer of another question with the same unit.
type Statement = { card: Card; shown: string; truth: boolean };
const THRESHOLD = 90; // px to drag before a swipe counts

const makeStatement = (card: Card): Statement => {
  // Only real look-alikes (same unit) may be shown as a wrong answer, so no false card is absurd.
  const truth = card.sameUnit.length === 0 || Math.random() < 0.5;
  return { card, truth, shown: truth ? card.a : card.sameUnit[Math.floor(Math.random() * card.sameUnit.length)]! };
};

export default function Swipe(props: { groups: Group[] }) {
  const cards = buildCards(props.groups);
  const [open, setOpen] = createSignal(false);
  const [deck, setDeck] = createSignal<Statement[]>([]);
  const [result, setResult] = createSignal<null | { right: boolean; said: boolean }>(null);
  const [dx, setDx] = createSignal(0);
  const [ok, setOk] = createSignal(0);
  const [no, setNo] = createSignal(0);
  const [boxes, setBoxes] = createSignal<Record<string, number>>({});
  const current = () => deck()[0];
  const safe = createMemo(() => cards.filter(c => (boxes()[c.n] ?? 0) >= SAFE).length);
  let start = 0; let dragging = false;

  // Weakest cards first (lowest Leitner box), shuffled inside each box.
  const begin = () => {
    const b = boxes();
    setDeck(shuffle(cards.slice()).sort((x, y) => (b[x.n] ?? 0) - (b[y.n] ?? 0)).map(makeStatement));
    setOk(0); setNo(0); setResult(null); setDx(0); setOpen(true);
    document.documentElement.style.overflow = 'hidden';
  };
  const close = () => { setOpen(false); document.documentElement.style.overflow = ''; };

  const decide = (said: boolean) => {
    const s = current(); if (!s || result()) return;
    const right = said === s.truth;
    right ? setOk(ok() + 1) : setNo(no() + 1);
    const b = { ...boxes() }; b[s.card.n] = nextBox(b[s.card.n], right); setBoxes(b); saveBoxes(b);
    // The card stays put and shows the verdict, so the answer can be read before moving on.
    setResult({ right, said }); setDx(0);
  };
  const next = () => {
    const [s, ...rest] = deck(); const r = result();
    // A miss comes back four cards later, as a fresh statement.
    if (s && r && !r.right) rest.splice(Math.min(4, rest.length), 0, makeStatement(s.card));
    setDeck(rest); setResult(null); setDx(0);
  };

  const onDown = (e: PointerEvent) => { if (result()) return; dragging = true; start = e.clientX; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => { if (dragging) setDx(e.clientX - start); };
  const onUp = () => {
    if (!dragging) return; dragging = false;
    if (dx() > THRESHOLD) decide(true); else if (dx() < -THRESHOLD) decide(false); else setDx(0);
  };

  onMount(() => {
    setBoxes(loadBoxes());
    const onKey = (e: KeyboardEvent) => {
      if (!open()) return;
      if (e.key === 'Escape') close();
      else if (!result() && e.key === 'ArrowRight') decide(true);
      else if (!result() && e.key === 'ArrowLeft') decide(false);
      else if (result() && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); next(); }
    };
    addEventListener('keydown', onKey);
    onCleanup(() => { removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; });
  });

  const tilt = () => `translateX(${dx()}px) rotate(${dx() / 18}deg)`;
  const hint = () => dx() > 30 ? 'stimmt' : dx() < -30 ? 'nicht' : '';

  return (
    <div id="swipe" class="print:hidden">
      <div class="flex flex-wrap items-center gap-3 rounded-box border-2 border-line bg-surface p-4 shadow-hard">
        <button type="button" class="swipe-start cursor-pointer rounded-box border-2 border-line bg-ink px-5 py-3 font-display text-lg text-bg uppercase" onClick={begin}>🃏 Karten starten</button>
        <span class="text-[.9rem] text-muted">{cards.length} amtliche Zahlenfragen · <b class="text-ink">{safe()}</b> sicher. Nach rechts wischen = stimmt, nach links = stimmt nicht.</span>
      </div>

      <Show when={open()}>
        <div class="fixed inset-0 z-[80] flex flex-col bg-bg" role="dialog" aria-modal="true" aria-label="Karten: stimmt oder stimmt nicht">
          <div class="flex items-center justify-between gap-3 border-b-2 border-line px-4 py-3">
            <span class="text-[.85rem] font-bold">✓ {ok()} · ✗ {no()} · noch {deck().length}</span>
            <button type="button" class="swipe-close cursor-pointer rounded-full border-2 border-line px-3 py-1 font-bold" onClick={close} aria-label="Karten schließen">✕</button>
          </div>

          <div class="flex flex-1 items-center justify-center overflow-hidden p-4">
            <Show when={current()} fallback={
              <div class="text-center">
                <p class="font-display text-2xl uppercase">Stapel geschafft</p>
                <p class="mt-2 text-muted">✓ {ok()} richtig · ✗ {no()} falsch · {safe()} von {cards.length} sicher</p>
                <div class="mt-5 flex justify-center gap-2">
                  <button type="button" class="cursor-pointer rounded-box border-2 border-line bg-ink px-5 py-3 font-bold text-bg" onClick={begin}>Nochmal</button>
                  <button type="button" class="cursor-pointer rounded-box border-2 border-line px-5 py-3 font-bold" onClick={close}>Fertig</button>
                </div>
              </div>
            }>{s => (
              <div class="swipe-card relative w-full max-w-[460px] touch-none select-none rounded-[14px] border-2 border-line bg-surface p-6 shadow-hard-lg"
                style={{ transform: tilt(), transition: dragging ? 'none' : 'transform .25s ease' }}
                onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
                <Show when={hint()}>
                  <span class={`absolute top-4 rounded-box border-[3px] px-3 py-1 font-display text-lg uppercase ${hint() === 'stimmt' ? 'left-4 -rotate-12 border-go text-go' : 'right-4 rotate-12 border-warn text-warn'}`}>{hint() === 'stimmt' ? 'stimmt' : 'stimmt nicht'}</span>
                </Show>
                <p class="mt-6 text-[.72rem] font-bold tracking-wide text-muted uppercase">{s().card.topic} · {s().card.n}</p>
                <p class="swipe-q mt-2 text-[clamp(1.15rem,4.5vw,1.5rem)] leading-snug font-medium" innerHTML={s().card.q} />
                <p class="mt-5 text-[.8rem] font-bold text-muted uppercase">Antwort</p>
                <p class="swipe-a font-display text-[clamp(1.6rem,7vw,2.4rem)] leading-tight text-accent-text" innerHTML={s().shown} />
                <Show when={result()}>{r => (
                  <div class={`swipe-result mt-5 rounded-box border-2 px-4 py-3 ${r().right ? 'border-go bg-go/15' : 'border-warn bg-warn/10'}`} aria-live="polite">
                    <b>{r().right ? '✓ Richtig.' : '✗ Falsch.'}</b> {s().truth ? 'Das ist die amtliche Antwort.' : <>Richtig ist: <b innerHTML={s().card.a} /></>}
                  </div>
                )}</Show>
              </div>
            )}</Show>
          </div>

          <Show when={current()}>
            <div class="grid grid-cols-2 gap-3 border-t-2 border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Show when={!result()} fallback={<button type="button" class="swipe-next col-span-2 cursor-pointer rounded-box border-2 border-line bg-ink py-4 font-display text-lg text-bg uppercase" onClick={next}>Weiter →</button>}>
                <button type="button" class="swipe-no cursor-pointer rounded-box border-[3px] border-warn bg-surface py-4 font-display text-lg text-warn uppercase" onClick={() => decide(false)}>✗ Stimmt nicht</button>
                <button type="button" class="swipe-yes cursor-pointer rounded-box border-[3px] border-go bg-surface py-4 font-display text-lg text-go uppercase" onClick={() => decide(true)}>✓ Stimmt</button>
              </Show>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
