// Tailwind classes for the collapsible "fold" chunk, shared by Fold.astro and the Solid ZahlenFolds island.
export const fold = {
  root: 'group rounded-box border-2 border-line bg-surface open:shadow-hard',
  summary: 'grid cursor-pointer list-none grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-3.5 py-3 [&::-webkit-details-marker]:hidden',
  icon: 'text-[1.4rem] leading-none',
  title: 'text-[.95rem] leading-snug font-extrabold',
  hook: "mt-0.5 block text-[.84rem] font-medium text-muted before:content-['💡_']",
  count: 'grid h-7 min-w-7 place-items-center rounded-full bg-bg2 text-[.78rem] font-extrabold',
  chevron: 'mr-1 mb-1 size-[9px] rotate-45 border-r-[2.5px] border-b-[2.5px] border-ink transition-transform group-open:mt-1 group-open:mb-0 group-open:-rotate-[135deg] print:hidden',
  body: 'px-3.5 pt-1 pb-3.5',
};
