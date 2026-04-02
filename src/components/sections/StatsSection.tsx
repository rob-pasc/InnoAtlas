import StatItem from '../ui/StatItem'

const stats = [
  { value: '4',   label: 'Länder' },
  { value: '52',  label: 'abgeschlossene Projekte' },
  { value: '107', label: 'Projektbeteiligte' },
  { value: '000', label: 'Lorem ipsum' },
  { value: '000', label: 'Lorem ipsum' },
  { value: '000', label: 'Lorem ipsum' },
  { value: '000', label: 'Lorem ipsum' },
  { value: '000', label: 'Lorem ipsum' },
]

export default function StatsSection() {
  return (
    <section className="bg-fhv-zine-yellow px-16 py-12">
      <h2 className="text-fhv-black type-h3 mb-8">
        Der InnoAtlas in Zahlen
      </h2>
      <div className="flex flex-wrap gap-x-12 gap-y-8">
        {stats.map((stat, i) => (
          <StatItem key={i} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  )
}
