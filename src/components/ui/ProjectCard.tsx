import type { Project } from '../../types/project'
import { TOPIC_COLORS } from '../../config/topicColors'
import { prefetchTilesForLocation } from '../../utils/prefetchTiles'
import { useT } from '../../i18n/translations'

type ProjectCardProps = {
  project: Project
  onClick?: (id: number) => void
  selected?: boolean
}

export default function ProjectCard({ project, onClick, selected = false }: ProjectCardProps) {
  const firstTopic  = project.filters.topic[0]
  const colorConfig = firstTopic ? TOPIC_COLORS[firstTopic] : undefined
  const stripeClass = colorConfig ? colorConfig.bg : 'bg-ink'

  const t = useT()
  const tags = [
    ...project.filters.topic.slice(1).map(v => t.topicLabels[v] ?? v),
    ...project.filters.fokus.map(v => t.fokusLabels[v] ?? v),
  ].join(' • ')

  return (
    <button
      type="button"
      onClick={() => onClick?.(project.id)}
      onMouseEnter={() => prefetchTilesForLocation(project.location.latitude, project.location.longitude)}
      aria-pressed={selected}
      className={`flex w-full text-left cursor-pointer transition-colors ${selected ? 'border-2 border-ink' : 'border border-ink hover:bg-ink/5'}`}
    >
      <div className={`w-1.5 shrink-0 ${stripeClass}`} aria-hidden="true" />
      <div className="flex-1 px-4 py-4 flex flex-col gap-2">
        <h3 className="type-h4 text-ink">{project.title}</h3>
        {project.subtitle && (
          <p className="type-copy text-ink">{project.subtitle}</p>
        )}
        {tags && (
          <span className="type-copy-em text-ink mt-auto">{tags}</span>
        )}
      </div>
    </button>
  )
}
