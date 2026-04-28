import { useEffect, useRef, useState } from 'react'
import ArrowNext from '../../assets/icons/arrow-next.svg?react'
import ArrowPrev from '../../assets/icons/arrow-prev.svg?react'
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

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const [canScrollUp,   setCanScrollUp]   = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  function updateScrollButtons() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollPrev(el.scrollLeft > 0)
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    setCanScrollUp(el.scrollTop > 0)
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 1)
  }

  function scrollPrev() {
    scrollRef.current?.scrollBy({ left: -(scrollRef.current.clientWidth), behavior: 'smooth' })
  }

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' })
  }

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

  useEffect(() => { updateScrollButtons() }, [filteredProjects])

  // Deselect and reset mobile scroll whenever filters change
  useEffect(() => {
    setSelectedProjectId(null)
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
    }
    updateScrollButtons()
  }, [activeTopic, activeIndustry, activeStatus, searchQuery])

  const selectedProject = filteredProjects.find((p) => p.id === selectedProjectId)
  const panelOpen = selectedProject !== undefined

  return (
    <section className="bg-fhv-white px-4 py-8 md:px-16 md:py-12" onClick={() => setSelectedProjectId(null)}>

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
      {/* <lg: flex-col stacked. lg+: flex-row fixed height */}
      <div className="flex flex-col lg:flex-row lg:h-120">

        {/* Scrollable project list */}
        {/* <lg: carousel with arrows. lg+: slide-out width transition */}
        <div className={`lg:shrink-0 lg:overflow-hidden lg:transition-all lg:duration-300 lg:ease-in-out ${panelOpen ? 'hidden lg:block lg:w-0' : 'w-full lg:w-110'}`} onClick={e => e.stopPropagation()}>
          {/* <lg: flex row so arrows sit outside the card. lg+: block (arrows hidden) */}
          <div className="flex items-center gap-2 lg:block lg:h-full">
            {filteredProjects.length > 1 && (
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="shrink-0 p-1 transition-opacity disabled:opacity-20 lg:hidden"
                aria-label="Previous project"
              >
                <ArrowPrev className="w-6 h-6" />
              </button>
            )}
            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex-1 flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:h-full lg:w-110 lg:pr-4 lg:[scrollbar-gutter:stable]"
              style={{ maskImage: `linear-gradient(to bottom, ${canScrollUp ? 'transparent' : 'black'} 0%, black ${canScrollUp ? '80px' : '0px'}, black calc(100% - ${canScrollDown ? '80px' : '0px'}), ${canScrollDown ? 'transparent' : 'black'} 100%)` }}
            >
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
            {filteredProjects.length > 1 && (
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="shrink-0 p-1 transition-opacity disabled:opacity-20 lg:hidden"
                aria-label="Next project"
              >
                <ArrowNext className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="h-4 lg:hidden" />
        </div>

        {/* Map — <md: 300px, md–lg: 384px full-width, lg+: flex-1 */}
        {/* isolate creates a new stacking context so Leaflet's internal z-indexes (up to 1000) don't leak above the sidebar */}
        <div className="isolate h-75 md:h-96 shrink-0 lg:h-auto lg:shrink lg:flex-1 border border-fhv-black" onClick={e => e.stopPropagation()}>
          <LeafletMap
            projects={filteredProjects}
            onSelectProject={setSelectedProjectId}
            selectedId={selectedProjectId}
          />
        </div>

        {/* Detail panel */}
        {/* <lg: full-width show/hide. lg+: slide-in width transition */}
        <div className={`lg:shrink-0 lg:overflow-hidden lg:transition-all lg:duration-300 lg:ease-in-out ${panelOpen ? 'block w-full lg:w-110' : 'hidden lg:block lg:w-0'}`} onClick={e => e.stopPropagation()}>
          {selectedProject && (
            <div className="lg:w-110 lg:h-full lg:pl-4">
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
