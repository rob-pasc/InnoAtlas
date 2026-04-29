import StatItem from '../ui/StatItem'
import { useT } from '../../i18n/translations'

export default function StatsSection() {
  const t = useT()

  return (
    <section className="bg-fhv-zine-yellow">
      <div className="max-w-screen-3xl mx-auto px-4 py-8 md:px-16 md:py-12">
        <h2 className="text-fhv-black type-h3 mb-8">
          {t.statsHeading}
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-8 md:gap-x-12">
          {t.stats.map((stat, i) => (
            <StatItem key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
