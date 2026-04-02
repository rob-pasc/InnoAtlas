import FilterButton from '../ui/FilterButton'
import SearchInput from '../ui/SearchInput'
import LeafletMap from '../ui/LeafletMap'

const themeFilters = ['Wirtschaft', 'Umwelt', 'Soziales', 'Sonstiges']
const industryFilters = ['Bildung', 'Logistik', 'Öffentlicher Verkehr']

export default function FilterMapSection() {
  return (
    <section className="bg-fhv-white px-16 py-12">

      {/* Filter row */}
      <div className="grid grid-cols-3 gap-8 mb-8">

        <div>
          <p className="type-copy-em text-fhv-black mb-3">Nach Thema filtern</p>
          <div className="flex flex-wrap gap-2">
            {themeFilters.map((label) => (
              <FilterButton key={label} label={label} />
            ))}
          </div>
        </div>

        <div>
          <p className="type-copy-em text-fhv-black mb-3">Nach Industrie filtern</p>
          <div className="flex flex-wrap gap-2">
            {industryFilters.map((label) => (
              <FilterButton key={label} label={label} />
            ))}
          </div>
        </div>

        <div>
          <p className="type-copy-em text-fhv-black mb-3">Projekt suchen</p>
          <SearchInput />
        </div>

      </div>

      {/* Map */}
      <div className="w-full h-[480px] border border-fhv-black">
        <LeafletMap />
      </div>

    </section>
  )
}
