import { useState } from 'react'
import type { Project } from '../../types/project'
import FilterButton from '../ui/FilterButton'
import SearchInput from '../ui/SearchInput'
import LeafletMap from '../ui/LeafletMap'
import ProjectCard from '../ui/ProjectCard'
import { TOPIC_COLORS } from '../../config/topicColors'

const themeFilters = ['Wirtschaft', 'Umwelt', 'Soziales', 'Sonstiges']
const industryFilters = ['Bildung', 'Logistik', 'Öffentlicher Verkehr']

const MAP_HEIGHT = 'h-[480px]'

function toggle(set: string[], value: string): string[] {
  return set.includes(value) ? set.filter((v) => v !== value) : [...set, value]
}

export default function FilterMapSection({ projects }: { projects: Project[] }) {
  const [activeTopic,    setActiveTopic]    = useState<string[]>([])
  const [activeIndustry, setActiveIndustry] = useState<string[]>([])
  const [searchQuery,    setSearchQuery]    = useState('')

  const filteredProjects = projects.filter((p) => {
    const topicOk    = activeTopic.length    === 0 || p.filters.topic.some((t)    => activeTopic.includes(t))
    const industryOk = activeIndustry.length === 0 || p.filters.industry.some((i) => activeIndustry.includes(i))
    const q = searchQuery.toLowerCase()
    const searchOk   = !searchQuery || [
      p.title,
      p.subtitle,
      p.description,
      p.partners.lead.name,
      ...p.partners.others.map((o) => o.name),
    ].some((field) => field?.toLowerCase().includes(q))
    return topicOk && industryOk && searchOk
  })

  return (
    <section className="bg-fhv-white px-16 py-12">

      {/* Filter row */}
      <div className="grid grid-cols-3 gap-8 mb-8">

        <div>
          <p className="type-copy-em text-fhv-black mb-3">Nach Thema filtern</p>
          <div className="flex flex-wrap gap-2">
            {themeFilters.map((label) => (
              <FilterButton
                key={label}
                label={label}
                colorConfig={TOPIC_COLORS[label]}
                active={activeTopic.includes(label)}
                onToggle={() => setActiveTopic((prev) => toggle(prev, label))}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="type-copy-em text-fhv-black mb-3">Nach Industrie filtern</p>
          <div className="flex flex-wrap gap-2">
            {industryFilters.map((label) => (
              <FilterButton
                key={label}
                label={label}
                active={activeIndustry.includes(label)}
                onToggle={() => setActiveIndustry((prev) => toggle(prev, label))}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="type-copy-em text-fhv-black mb-3">Projekt suchen</p>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

      </div>

      {/* Project list + Map */}
      <div className={`flex gap-0 ${MAP_HEIGHT}`}>

        {/* Scrollable project list */}
        <div className="w-110 shrink-0 overflow-y-auto flex flex-col gap-4 pr-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Map */}
        <div className="flex-1 border border-fhv-black">
          <LeafletMap projects={filteredProjects} />
        </div>

      </div>

    </section>
  )
}
