import { useEffect, useState } from 'react'
import type { Project } from '../../types/project'
import FilterButton from '../ui/FilterButton'
import SearchInput from '../ui/SearchInput'
import LeafletMap from '../ui/LeafletMap'
import ProjectCard from '../ui/ProjectCard'
import ProjectDetailPanel from '../ui/ProjectDetailPanel'
import { TOPIC_COLORS } from '../../config/topicColors'
import { useT } from '../../i18n/translations'

const themeFilters = ['Wirtschaft', 'Umwelt', 'Soziales', 'Sonstiges']
const industryFilters = ['Bildung', 'Logistik', 'Öffentlicher Verkehr']

const MAP_HEIGHT = 'h-[480px]'

function toggle(set: string[], value: string): string[] {
  return set.includes(value) ? set.filter((v) => v !== value) : [...set, value]
}

export default function FilterMapSection({ projects }: { projects: Project[] }) {
  const t = useT()
  const [activeTopic,       setActiveTopic]       = useState<string[]>([])
  const [activeIndustry,    setActiveIndustry]    = useState<string[]>([])
  const [searchQuery,       setSearchQuery]       = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

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

  // Deselect whenever filters change
  useEffect(() => {
    setSelectedProjectId(null)
  }, [activeTopic, activeIndustry, searchQuery])

  const selectedProject = filteredProjects.find((p) => p.id === selectedProjectId)
  const panelOpen = selectedProject !== undefined

  return (
    <section className="bg-fhv-white px-16 py-12">

      {/* Filter row */}
      <div className="grid grid-cols-3 gap-8 mb-8">

        <div>
          <p className="type-copy-em text-fhv-black mb-3">{t.filterByTopic}</p>
          <div className="flex flex-wrap gap-2">
            {themeFilters.map((key) => (
              <FilterButton
                key={key}
                label={t.topicLabels[key] ?? key}
                colorConfig={TOPIC_COLORS[key]}
                active={activeTopic.includes(key)}
                onToggle={() => setActiveTopic((prev) => toggle(prev, key))}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="type-copy-em text-fhv-black mb-3">{t.filterByIndustry}</p>
          <div className="flex flex-wrap gap-2">
            {industryFilters.map((key) => (
              <FilterButton
                key={key}
                label={t.industryLabels[key] ?? key}
                active={activeIndustry.includes(key)}
                onToggle={() => setActiveIndustry((prev) => toggle(prev, key))}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="type-copy-em text-fhv-black mb-3">{t.searchProjects}</p>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={t.searchPlaceholder} />
        </div>

      </div>

      {/* Project list + Map + Detail panel */}
      <div className={`flex gap-0 ${MAP_HEIGHT}`}>

        {/* Scrollable project list — slides out when a project is selected */}
        <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${panelOpen ? 'w-0' : 'w-[440px]'}`}>
          <div className="w-[440px] h-full overflow-y-auto flex flex-col gap-4 pr-4">
            {filteredProjects.length === 0 ? (
              <p className="type-copy text-fhv-black/50 pt-2">
                {t.noProjectsFound}
              </p>
            ) : filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={setSelectedProjectId}
                selected={project.id === selectedProjectId}
              />
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 border border-fhv-black">
          <LeafletMap
            projects={filteredProjects}
            onSelectProject={setSelectedProjectId}
            selectedId={selectedProjectId}
          />
        </div>

        {/* Detail panel — slides in when a project is selected */}
        <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${panelOpen ? 'w-[440px]' : 'w-0'}`}>
          {selectedProject && (
            <div className="w-[440px] h-full pl-4">
              <ProjectDetailPanel
                project={selectedProject}
                onClose={() => setSelectedProjectId(null)}
              />
            </div>
          )}
        </div>

      </div>

    </section>
  )
}
