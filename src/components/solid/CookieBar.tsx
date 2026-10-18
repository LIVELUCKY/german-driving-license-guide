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
  return (
    <Show when={open()}>
      <div class="cookie-bar" role="region" aria-label="Cookie-Einwilligung" onKeyDown={e => { if (e.key === 'Escape') choose('denied'); }}>
        <p><b>Analyse &amp; Datenschutz.</b> Wir nutzen Google Analytics, um zu sehen, welche Teile nützlich sind. Keine Werbung. <a href={props.privacyUrl}>Datenschutz</a></p>
        <div class="cookie-actions">
          <button type="button" class="cookie-yes" onClick={() => choose('granted')}>Analyse akzeptieren</button>
          <button type="button" class="cookie-no" onClick={() => choose('denied')}>Nein danke</button>
        </div>
      </div>
    </Show>
  );
}
