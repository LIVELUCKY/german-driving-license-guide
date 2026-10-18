import { createSignal, onMount, Show } from 'solid-js';

// The initial theme is set by a tiny inline script in <head> (no flash); this only switches it.
export default function ThemeToggle() {
  const [dark, setDark] = createSignal(false);
  onMount(() => setDark(document.documentElement.dataset.theme === 'dark'));
  const flip = () => {
    const next = dark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('fs_theme', next); } catch { /* private mode: theme just won't persist */ }
    setDark(!dark());
  };
  return (
    <button type="button" class="iconbtn" aria-label={dark() ? 'Helles Design' : 'Dunkles Design'} onClick={flip}>
      <Show when={dark()} fallback={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      }>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
      </Show>
    </button>
  );
}
