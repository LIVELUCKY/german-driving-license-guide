import { createSignal, For, onCleanup, onMount } from 'solid-js';

type Link = { href: string; label: string };
type Group = { label: string; links: Link[] };

// Sticky section bar. The active chip is the last section whose top has passed the reading line,
// so a chip that stands for a group of sections stays active across the whole group.
const READING_LINE = 200;

export default function JumpNav(props: { groups: Group[] }) {
  const links = props.groups.flatMap(g => g.links);
  const [active, setActive] = createSignal<string | null>(null);
  let row!: HTMLDivElement;

  onMount(() => {
    const targets = links.map(l => document.getElementById(l.href.slice(1)));
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= READING_LINE) current = links[i]!.href; });
      if (current === active()) return;
      setActive(current);
      const chip = row.querySelector<HTMLAnchorElement>(`a[href="${current}"]`);
      if (chip) row.scrollLeft = chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', onScroll, { passive: true });
    update();
    onCleanup(() => removeEventListener('scroll', onScroll));
  });

  return (
    <nav class="jump" aria-label="Abschnitte">
      <div class="wrap jump-row" ref={row}>
        <For each={props.groups}>{g => (
          <>
            <b>{g.label}</b>
            <For each={g.links}>{l => (
              <a href={l.href} classList={{ on: active() === l.href }} aria-current={active() === l.href ? 'location' : undefined}>{l.label}</a>
            )}</For>
          </>
        )}</For>
      </div>
    </nav>
  );
}
