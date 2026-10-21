import { createMemo, createSignal, For, onMount, Show } from 'solid-js';

// Personal error list: questions you got wrong in the official app, with your own reason.
// Spaced repetition: each correct recall pushes the next review further out; a miss resets it.
type Entry = { id: string; n: string; q: string; a: string; why: string; box: number; due: number };
const STORE = 'fs_fehler_v1';
const DAYS = [0, 1, 3, 7, 14, 30]; // wait time per box, in days
const DAY = 86_400_000;

function load(): Entry[] {
  try { return JSON.parse(localStorage.getItem(STORE) ?? '[]') as Entry[]; } catch { return []; }
}

export default function Fehlerliste() {
  const [list, setList] = createSignal<Entry[]>([]);
  const [now, setNow] = createSignal(0);
  const [form, setForm] = createSignal({ n: '', q: '', a: '', why: '' });
  const [shown, setShown] = createSignal(false);
  const [msg, setMsg] = createSignal('');

  const save = (l: Entry[]) => { setList(l); try { localStorage.setItem(STORE, JSON.stringify(l)); } catch { setMsg('Speichern nicht möglich (privates Fenster?).'); } };
  const due = createMemo(() => list().filter(e => e.due <= now()).sort((a, b) => a.box - b.box || a.due - b.due));
  const current = () => due()[0];

  onMount(() => { setList(load()); setNow(Date.now()); });

  const add = (e: Event) => {
    e.preventDefault();
    const f = form();
    if (!f.q.trim() || !f.a.trim()) { setMsg('Bitte Frage und richtige Antwort eintragen.'); return; }
    save([...list(), { id: crypto.randomUUID(), n: f.n.trim(), q: f.q.trim(), a: f.a.trim(), why: f.why.trim(), box: 0, due: Date.now() }]);
    setForm({ n: '', q: '', a: '', why: '' }); setMsg('Gespeichert. Die Frage kommt gleich in der Wiederholung.'); setNow(Date.now());
  };
  const grade = (knew: boolean) => {
    const c = current(); if (!c) return;
    const box = knew ? Math.min(c.box + 1, DAYS.length - 1) : 0;
    // A miss stays due in this session (queued behind older misses); a hit waits DAYS[box] days.
    save(list().map(e => e.id === c.id ? { ...e, box, due: knew ? Date.now() + DAYS[box]! * DAY : now() } : e));
    setShown(false);
  };
  const remove = (id: string) => save(list().filter(e => e.id !== id));
  const exportFile = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(list(), null, 1)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'meine-fehler.json'; a.click(); URL.revokeObjectURL(url);
  };
  const importFile = async (e: Event) => {
    const file = (e.currentTarget as HTMLInputElement).files?.[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as Entry[];
      if (!Array.isArray(data)) throw new Error('kein Array');
      const ids = new Set(list().map(x => x.id));
      save([...list(), ...data.filter(x => x && x.q && x.a && !ids.has(x.id))]); setMsg(`${data.length} Einträge geladen.`); setNow(Date.now());
    } catch { setMsg('Diese Datei passt nicht.'); }
  };

  const input = 'w-full rounded-box border-2 border-line bg-bg px-3 py-2 text-[.9rem] text-ink outline-none focus:border-accent-text';
  const btn = 'cursor-pointer rounded-box border-2 border-line px-4 py-2 font-bold';
  const when = (e: Entry) => e.due <= now() ? 'jetzt' : `in ${Math.ceil((e.due - now()) / DAY)} Tag(en)`;

  return (
    <div id="fehlerliste" class="grid gap-4 print:hidden md:grid-cols-2 md:items-start">
      <div class="rounded-box border-2 border-line bg-surface p-4 shadow-hard">
        <h3 class="mb-2 font-bold uppercase tracking-[.03em]">🔁 Wiederholen <span class="text-muted">({due().length} fällig)</span></h3>
        <Show when={current()} fallback={<p class="text-[.9rem] text-muted">{list().length ? 'Gerade nichts fällig. Komm morgen wieder.' : 'Noch keine Fehler eingetragen. Trag rechts die Fragen ein, die du in der App falsch hattest.'}</p>}>{c => (
          <div class="grid gap-3">
            <p class="text-[.75rem] font-bold text-muted uppercase">{c().n ? `Frage ${c().n} · ` : ''}Stufe {c().box} von {DAYS.length - 1}</p>
            <p class="fehler-q text-[1.05rem] font-medium">{c().q}</p>
            <Show when={shown()} fallback={<button type="button" class={`fehler-show ${btn} bg-ink text-bg`} onClick={() => setShown(true)}>Antwort zeigen</button>}>
              <div class="rounded-box bg-sun px-3.5 py-2.5 text-fixed-ink"><b>{c().a}</b>{c().why && <span class="mt-1 block text-[.86rem]">Warum: {c().why}</span>}</div>
              <div class="flex gap-2">
                <button type="button" class={`fehler-ok ${btn} border-go bg-surface`} onClick={() => grade(true)}>✓ Gewusst</button>
                <button type="button" class={`fehler-no ${btn} border-warn bg-surface`} onClick={() => grade(false)}>✗ Nicht gewusst</button>
              </div>
            </Show>
          </div>
        )}</Show>
      </div>

      <form class="grid gap-2.5 rounded-box border-2 border-line bg-surface p-4" onSubmit={add}>
        <h3 class="font-bold uppercase tracking-[.03em]">➕ Fehler eintragen</h3>
        <label class="grid gap-1 text-[.8rem] font-bold">Fragenummer (optional)<input class={input} value={form().n} onInput={e => setForm({ ...form(), n: e.currentTarget.value })} placeholder="z. B. 1.2.09-101" /></label>
        <label class="grid gap-1 text-[.8rem] font-bold">Frage in deinen Worten<textarea class={input} rows="2" value={form().q} onInput={e => setForm({ ...form(), q: e.currentTarget.value })} /></label>
        <label class="grid gap-1 text-[.8rem] font-bold">Richtige Antwort<textarea class={input} rows="2" value={form().a} onInput={e => setForm({ ...form(), a: e.currentTarget.value })} /></label>
        <label class="grid gap-1 text-[.8rem] font-bold">Warum? (dein Grund, ein Satz)<input class={input} value={form().why} onInput={e => setForm({ ...form(), why: e.currentTarget.value })} /></label>
        <button type="submit" class={`fehler-add ${btn} bg-ink text-bg`}>Speichern</button>
        <Show when={msg()}><p class="text-[.82rem] text-muted" aria-live="polite">{msg()}</p></Show>
      </form>

      <Show when={list().length}>
        <div class="md:col-span-2">
          <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-bold uppercase tracking-[.03em]">📋 Alle Einträge ({list().length})</h3>
            <div class="flex flex-wrap gap-2 text-[.82rem]">
              <button type="button" class="cursor-pointer underline underline-offset-2" onClick={exportFile}>Als Datei sichern</button>
              <label class="cursor-pointer underline underline-offset-2">Datei laden<input type="file" accept="application/json" class="sr-only" onChange={importFile} /></label>
            </div>
          </div>
          <ul class="grid gap-2">
            <For each={list()}>{e => (
              <li class="flex items-start justify-between gap-3 rounded-box border border-soft bg-surface px-3 py-2 text-[.86rem]">
                <span><b>{e.q}</b> → {e.a}<small class="block text-muted">{e.n && `${e.n} · `}Stufe {e.box} · wieder {when(e)}</small></span>
                <button type="button" class="cursor-pointer text-muted hover:text-warn" aria-label={`Eintrag löschen: ${e.q}`} onClick={() => remove(e.id)}>✕</button>
              </li>
            )}</For>
          </ul>
        </div>
      </Show>
    </div>
  );
}
