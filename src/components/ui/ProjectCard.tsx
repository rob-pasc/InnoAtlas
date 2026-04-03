import type { Project } from '../../types/project'
import { TOPIC_COLORS } from '../../config/topicColors'

export default function ProjectCard({ project }: { project: Project }) {
  const firstTopic = project.filters.topic[0]
  const colorConfig = firstTopic ? TOPIC_COLORS[firstTopic] : undefined
  const stripeClass = colorConfig ? colorConfig.bg : 'bg-fhv-black'

  const industry = project.filters.industry.join(', ')

  return (
    <div className="flex border border-fhv-black">
      <div className={`w-1.5 shrink-0 ${stripeClass}`} aria-hidden="true" />
      <div className="flex-1 px-4 py-4 flex flex-col gap-2">
        <h3 className="type-h4 text-fhv-black">{project.title}</h3>
        {project.subtitle && (
          <p className="type-copy text-fhv-black">{project.subtitle}</p>
        )}
        {industry && (
          <span className="type-copy-em text-fhv-black mt-auto">{industry}</span>
        )}
      </div>
    </div>
  )
}
