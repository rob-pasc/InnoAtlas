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
      ? `${colorConfig.bg} border-fhv-black text-fhv-black`
      : 'bg-fhv-black border-fhv-black text-fhv-white'
    : 'bg-fhv-white border-fhv-black text-fhv-black hover:bg-fhv-black hover:text-fhv-white'

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-2 type-small border px-4 py-1 transition-colors ${stateClass}`}
    >
      {colorConfig && !active && (
        <span className={`inline-block w-3 h-3 shrink-0 ${colorConfig.bg}`} />
      )}
      {label}
    </button>
  )
}
