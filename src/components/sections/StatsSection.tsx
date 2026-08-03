import type { Project } from '../../types/project'
import StatItem from '../ui/StatItem'
import { useT } from '../../i18n/translations'

export default function StatsSection({ projects }: { projects: Project[] }) {
  const t = useT()

  const countries = new Set(projects.flatMap(p => p.filters.country)).size
  const entries   = projects.length
  const partners  = projects.reduce((sum, p) => sum + 1 + p.partners.others.length, 0)
  const topics    = new Set(projects.flatMap(p => p.filters.topic)).size

  return (
    <section className="bg-cat-2">
      <div className="max-w-screen-3xl mx-auto px-4 py-8 md:px-16 md:py-12">
        <h2 className="text-ink type-h3 mb-8">
          {t.statsHeading}
        </h2>
        <dl className="flex flex-wrap gap-x-9 gap-y-8 md:gap-x-12">
          <StatItem value={String(countries)} label={t.statLabelCountries} />
          <StatItem value={String(entries)}   label={t.statLabelEntries} />
          <StatItem value={String(partners)}  label={t.statLabelPartners} />
          <StatItem value={String(topics)}    label={t.statLabelTopics} />
        </dl>
      </div>
    </section>
  )
}
