import { useEffect, useState } from 'react'
import type { Project } from '../../types/project'
import FilterButton from '../ui/FilterButton'
import SearchInput from '../ui/SearchInput'
import LeafletMap from '../ui/LeafletMap'
import ProjectCard from '../ui/ProjectCard'
import ProjectDetailPanel from '../ui/ProjectDetailPanel'
import { TOPIC_COLORS } from '../../config/topicColors'
import { useT } from '../../i18n/translations'

const themeFilters    = ['Wirtschaft', 'Umwelt', 'Soziales', 'Sonstiges']
const industryFilters = ['Bildung', 'Logistik', 'Öffentlicher Verkehr']
const statusFilters   = ['Abgeschlossen', 'Laufend', 'Geplant']


function toggle(set: string[], value: string): string[] {
  return set.includes(value) ? set.filter((v) => v !== value) : [...set, value]
}

export default function FilterMapSection({ projects }: { projects: Project[] }) {
  const t = useT()
  const [activeTopic,       setActiveTopic]       = useState<string[]>([])
  const [activeIndustry,    setActiveIndustry]    = useState<string[]>([])
  const [activeStatus,      setActiveStatus]      = useState<string[]>([])
  const [searchQuery,       setSearchQuery]       = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const filteredProjects = projects.filter((p) => {
    const topicOk    = activeTopic.length    === 0 || p.filters.topic.some((t)    => activeTopic.includes(t))
    const industryOk = activeIndustry.length === 0 || p.filters.industry.some((i) => activeIndustry.includes(i))
    const statusOk   = activeStatus.length   === 0 || p.filters.status.some((s)   => activeStatus.includes(s))
    const q = searchQuery.toLowerCase()
    const searchOk   = !searchQuery || [
      p.title,
      p.subtitle,
      p.description,
      p.partners.lead.name,
      ...p.partners.others.map((o) => o.name),
    ].some((field) => field?.toLowerCase().includes(q))
    return topicOk && industryOk && statusOk && searchOk
  })

  // Deselect whenever filters change
  useEffect(() => {
    setSelectedProjectId(null)
  }, [activeTopic, activeIndustry, activeStatus, searchQuery])

  const selectedProject = filteredProjects.find((p) => p.id === selectedProjectId)
  const panelOpen = selectedProject !== undefined

  return (
    <section className="bg-fhv-white px-4 py-8 md:px-16 md:py-12">

      {/* Filter row 1: chip filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 mb-4 md:mb-6">

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
          <p className="type-copy-em text-fhv-black mb-3">{t.filterByStatus}</p>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((key) => (
              <FilterButton
                key={key}
                label={t.statusLabels[key] ?? key}
                active={activeStatus.includes(key)}
                onToggle={() => setActiveStatus((prev) => toggle(prev, key))}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Filter row 2: search */}
      <div className="mb-4 md:mb-8">
        <p className="type-copy-em text-fhv-black mb-3">{t.searchProjects}</p>
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={t.searchPlaceholder} />
      </div>

      {/* Project list + Map + Detail panel */}
      {/* Mobile: flex-col (map top, content below). Desktop: flex-row fixed height */}
      <div className="flex flex-col md:flex-row md:h-120">

        {/* Scrollable project list */}
        {/* Mobile: show/hide swap. Desktop: slide-out width transition */}
        <div className={`md:shrink-0 md:overflow-hidden md:transition-all md:duration-300 md:ease-in-out ${panelOpen ? 'hidden md:block md:w-0' : 'w-full md:w-110'}`}>
          <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:h-full md:w-110 md:pr-4 md:pb-0">
            {filteredProjects.length === 0 ? (
              <p className="type-copy text-fhv-black/50 pt-2">
                {t.noProjectsFound}
              </p>
            ) : filteredProjects.map((project) => (
              <div key={project.id} className="snap-center shrink-0 w-full">
                <ProjectCard
                  project={project}
                  onClick={setSelectedProjectId}
                  selected={project.id === selectedProjectId}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Map — mobile: fixed height full width. Desktop: flex-1 */}
        <div className="h-75 shrink-0 md:h-auto md:shrink md:flex-1 border border-fhv-black">
          <LeafletMap
            projects={filteredProjects}
            onSelectProject={setSelectedProjectId}
            selectedId={selectedProjectId}
          />
        </div>

        {/* Detail panel */}
        {/* Mobile: full-width show/hide. Desktop: slide-in width transition */}
        <div className={`md:shrink-0 md:overflow-hidden md:transition-all md:duration-300 md:ease-in-out ${panelOpen ? 'block w-full md:w-110' : 'hidden md:block md:w-0'}`}>
          {selectedProject && (
            <div className="md:w-110 md:h-full md:pl-4">
              <ProjectDetailPanel
                project={selectedProject}
                onClose={() => setSelectedProjectId(null)}
                activeFilters={{ topic: activeTopic, industry: activeIndustry, status: activeStatus }}
                onFilterChipClick={(type, value) => {
                  if (type === 'topic')    setActiveTopic((prev)    => toggle(prev, value))
                  if (type === 'industry') setActiveIndustry((prev) => toggle(prev, value))
                  if (type === 'status')   setActiveStatus((prev)   => toggle(prev, value))
                }}
              />
            </div>
          )}
        </div>

      </div>

    </section>
  )
}
