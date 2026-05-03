import { useEffect, useRef, useState } from 'react'
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
  const [filtersOpen,       setFiltersOpen]       = useState(false)
  const [currentCardIndex,  setCurrentCardIndex]  = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollUp,   setCanScrollUp]   = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const activeFilterCount = activeTopic.length + activeIndustry.length + activeStatus.length + (searchQuery ? 1 : 0)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollUp(el.scrollTop > 0)
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 1)
    if (el.clientWidth > 0) {
      setCurrentCardIndex(Math.round(el.scrollLeft / (el.clientWidth + 16)))
    }
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

  useEffect(() => { updateScrollState() }, [filteredProjects])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(() => updateScrollState())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Deselect and reset carousel scroll whenever filters change
  useEffect(() => {
    setSelectedProjectId(null)
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
    }
    updateScrollState()
  }, [activeTopic, activeIndustry, activeStatus, searchQuery])

  const selectedProject = filteredProjects.find((p) => p.id === selectedProjectId)
  const panelOpen = selectedProject !== undefined

  // Close panel on outside click (desktop sidebar behaviour)
  useEffect(() => {
    if (!panelOpen) return
    function handleDocClick() { setSelectedProjectId(null) }
    const id = setTimeout(() => document.addEventListener('click', handleDocClick), 0)
    return () => { clearTimeout(id); document.removeEventListener('click', handleDocClick) }
  }, [panelOpen])

  // Lock body scroll when bottom sheet is open — mobile only (below tablet breakpoint)
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1159px)').matches) return
    document.body.style.overflow = panelOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [panelOpen])

  const filterChipProps = {
    activeFilters: { topic: activeTopic, industry: activeIndustry, status: activeStatus },
    onFilterChipClick: (type: 'topic' | 'industry' | 'status', value: string) => {
      if (type === 'topic')    setActiveTopic((prev)    => toggle(prev, value))
      if (type === 'industry') setActiveIndustry((prev) => toggle(prev, value))
      if (type === 'status')   setActiveStatus((prev)   => toggle(prev, value))
    },
  }

  return (
    <section className="bg-fhv-white px-4 pt-8 md:px-16 md:py-12">

      {/* ── Mobile filter toggle ── hidden on desktop */}
      <div className="tablet:hidden mb-4">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex items-center justify-between w-full type-copy-em text-fhv-black border border-fhv-black px-4 py-3 transition-colors hover:bg-fhv-black hover:text-fhv-white group"
        >
          <span className="flex items-center gap-2.5">
            {t.filtersLabel}
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-fhv-black text-fhv-white type-small group-hover:bg-fhv-white group-hover:text-fhv-black transition-colors">
                {activeFilterCount}
              </span>
            )}
          </span>
          {/* Chevron */}
          <svg
            className={`w-4 h-4 transition-transform duration-300 ease-in-out ${filtersOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16" fill="none" aria-hidden="true"
          >
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Filter panel — collapsible on mobile, always open on desktop ── */}
      {/* grid-rows trick: 0fr → 1fr animates height without fixed px values  */}
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out tablet:grid-rows-[1fr] ${filtersOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">

          {/* Filter row 1: chip filters */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 mb-4 md:mb-6 tablet:mt-0 pt-0">
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

        </div>
      </div>

      {/* ── Project list + Map + Desktop detail panel ── */}
      <div className="flex flex-col tablet:flex-row tablet:h-135 2xl:h-150">

        {/* Scrollable project list */}
        <div
          className={`order-2 tablet:order-1 mt-4 tablet:mt-0 tablet:shrink-0 tablet:overflow-hidden tablet:transition-all tablet:duration-300 tablet:ease-in-out ${panelOpen ? 'w-full tablet:w-0' : 'w-full tablet:w-110'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col tablet:block tablet:h-full">

            {/* Scroll container — horizontal snap on mobile, vertical on desktop */}
            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 max-tablet:[scrollbar-width:none] max-tablet:[&::-webkit-scrollbar]:hidden tablet:flex-col tablet:overflow-x-hidden tablet:overflow-y-auto tablet:h-full tablet:w-110 tablet:pr-4 tablet:[scrollbar-gutter:stable]"
              style={{ maskImage: `linear-gradient(to bottom, ${canScrollUp ? 'transparent' : 'black'} 0%, black ${canScrollUp ? '24px' : '0px'}, black calc(100% - ${canScrollDown ? '24px' : '0px'}), ${canScrollDown ? 'transparent' : 'black'} 100%)` }}
            >
              {filteredProjects.length === 0 ? (
                <p className="type-copy text-fhv-black/50 pt-2">{t.noProjectsFound}</p>
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

            {/* Dot / count indicator — mobile only */}
            {filteredProjects.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-3 tablet:hidden">
                {filteredProjects.length <= 8 ? (
                  filteredProjects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollRef.current?.scrollTo({ left: i * (scrollRef.current.clientWidth + 16), behavior: 'smooth' })}
                      aria-label={`Project ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentCardIndex ? 'w-6 bg-fhv-black' : 'w-1.5 bg-fhv-black/25 hover:bg-fhv-black/50'}`}
                    />
                  ))
                ) : (
                  <p className="type-small text-fhv-black/40">{currentCardIndex + 1} / {filteredProjects.length}</p>
                )}
              </div>
            )}

          </div>
          <div className="h-4 tablet:hidden" />
        </div>

        {/* Map */}
        <div
          className="order-1 tablet:order-2 isolate map-height shrink-0 tablet:shrink tablet:flex-1 border border-fhv-black"
          onClick={e => e.stopPropagation()}
        >
          <LeafletMap
            projects={filteredProjects}
            onSelectProject={setSelectedProjectId}
            selectedId={selectedProjectId}
          />
        </div>

        {/* Desktop detail panel — tablet+ only */}
        <div
          className={`hidden tablet:block tablet:order-3 tablet:shrink-0 tablet:overflow-hidden tablet:transition-all tablet:duration-300 tablet:ease-in-out ${panelOpen ? 'tablet:w-110' : 'tablet:w-0'}`}
          onClick={e => e.stopPropagation()}
        >
          {selectedProject && (
            <div className="tablet:w-110 tablet:h-full tablet:pl-4">
              <ProjectDetailPanel
                project={selectedProject}
                onClose={() => setSelectedProjectId(null)}
                {...filterChipProps}
              />
            </div>
          )}
        </div>

      </div>

      {/* ── Mobile bottom sheet ── tablet+ never renders these */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 tablet:hidden bg-fhv-black/40 transition-opacity duration-300 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSelectedProjectId(null)}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 tablet:hidden transition-transform duration-300 ease-in-out ${panelOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle bar */}
        <div className="flex justify-center pt-3 pb-2.5 bg-fhv-white border-t border-fhv-black">
          <div className="w-10 h-1 bg-fhv-black/20" />
        </div>
        {/* Panel */}
        <div className="h-dvh">
          {selectedProject && (
            <ProjectDetailPanel
              project={selectedProject}
              onClose={() => setSelectedProjectId(null)}
              className="border-t-0 border-x-0"
              {...filterChipProps}
            />
          )}
        </div>
      </div>

    </section>
  )
}
