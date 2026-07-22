import type { TopicColorConfig } from '../../config/topicColors'

type FilterButtonProps = {
  label: string
  colorConfig?: TopicColorConfig
  active?: boolean
  onToggle?: () => void
}

export default function FilterButton({ label, colorConfig, active = false, onToggle }: FilterButtonProps) {
  const stateClass = active
    ? colorConfig
      ? 'border-ink text-ink'
      : 'bg-ink border-ink text-paper'
    : colorConfig
      ? 'bg-paper border-ink text-ink'
      : 'bg-paper border-ink text-ink hover:bg-ink hover:text-paper'

  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className={`group cursor-pointer relative overflow-hidden inline-flex items-center type-small border px-4 py-1 transition-colors ${stateClass}`}
    >
      {colorConfig && (
        <span
          className={`absolute inset-y-0 left-0 transition-[width] duration-300 ease-in-out group-hover:w-full ${active ? 'w-full' : 'w-1'} ${colorConfig.bg}`}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  )
}
