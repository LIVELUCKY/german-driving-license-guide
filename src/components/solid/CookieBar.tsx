import { createSignal, onMount, Show } from 'solid-js';

declare global { interface Window { __gaConsent?: (choice: 'granted' | 'denied') => void } }

// Non-blocking consent bar. Analytics.astro only loads gtag after "granted".
export default function CookieBar(props: { privacyUrl: string }) {
  const [open, setOpen] = createSignal(false);
  onMount(() => {
    let decided = true;
    try { decided = !!localStorage.getItem('fs_consent'); } catch { /* storage blocked: do not nag */ }
    if (!decided) setTimeout(() => setOpen(true), 700);
  });
  const choose = (choice: 'granted' | 'denied') => {
    if (window.__gaConsent) window.__gaConsent(choice);
    else try { localStorage.setItem('fs_consent', choice); } catch { /* ignore */ }
    setOpen(false);
  };
  const btn = 'cursor-pointer rounded-box border-2 border-line px-4 py-1.5 text-[.82rem] font-bold';
  return (
    <Show when={open()}>
      <div role="region" aria-label="Cookie-Einwilligung" onKeyDown={e => { if (e.key === 'Escape') choose('denied'); }}
        class="cookie-bar fixed inset-x-0 bottom-0 max-lg:bottom-[58px] z-60 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t-[3px] border-ink bg-surface px-[clamp(16px,4vw,40px)] py-2.5 text-[.84rem] shadow-[0_-4px_16px_rgba(0,0,0,.12)] print:hidden">
        <p class="max-w-[70ch]"><b>Analyse &amp; Datenschutz.</b> Wir nutzen Google Analytics, um zu sehen, welche Teile nützlich sind. Keine Werbung. <a class="text-accent-text underline underline-offset-3" href={props.privacyUrl}>Datenschutz</a></p>
        <div class="flex gap-2">
          <button type="button" class={`cookie-yes ${btn} bg-ink text-bg`} onClick={() => choose('granted')}>Analyse akzeptieren</button>
          <button type="button" class={`cookie-no ${btn} bg-transparent text-ink`} onClick={() => choose('denied')}>Nein danke</button>
        </div>
      </div>
    </Show>
  );
}
