// Three bar widths per skeleton — title, subtitle, tag line. Cycling through
// several sets stops a column of skeletons from reading as a rigid table.
const BAR_WIDTHS = [
  ['w-4/5',  'w-full',  'w-3/5'],
  ['w-3/5',  'w-11/12', 'w-2/5'],
  ['w-11/12','w-4/5',   'w-1/2'],
  ['w-2/3',  'w-full',  'w-3/5'],
]

/**
 * Placeholder shown in the project list while the dataset loads (SC 4.1.3).
 * Mirrors ProjectCard's geometry so the list doesn't jump when data arrives.
 *
 * Decorative only: the load state is announced from the live region in
 * App.tsx, so this is hidden from assistive tech rather than announced twice.
 * `animate-pulse` is neutralised by the global prefers-reduced-motion block in
 * index.css, so it needs no separate guard.
 */
export default function ProjectCardSkeleton({ index = 0 }: { index?: number }) {
  const [title, body, tag] = BAR_WIDTHS[index % BAR_WIDTHS.length]

  return (
    <div aria-hidden="true" className="flex w-full border border-ink/30 animate-pulse">
      <div className="w-1.5 shrink-0 bg-ink/30" />
      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
        <div className={`h-5 ${title} bg-ink/20`} />
        <div className={`h-4 ${body} bg-ink/10`} />
        <div className={`h-4 ${tag} bg-ink/10 mt-auto`} />
      </div>
    </div>
  )
}
