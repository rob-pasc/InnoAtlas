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
      ? 'border-fhv-black text-fhv-black'
      : 'bg-fhv-black border-fhv-black text-fhv-white'
    : colorConfig
      ? 'bg-fhv-white border-fhv-black text-fhv-black'
      : 'bg-fhv-white border-fhv-black text-fhv-black hover:bg-fhv-black hover:text-fhv-white'

  return (
    <button
      onClick={onToggle}
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
