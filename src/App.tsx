import { useProjects } from './hooks/useProjects'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'
import StatsSection from './components/sections/StatsSection'
import FilterMapSection from './components/sections/FilterMapSection'

const LOREM =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd, no sea takimata sanctus est Lorem ipsum dolor sit amet.'

export default function App() {
  const { projects, loading, error } = useProjects()

  // debug
  console.log('[useProjects]', { loading, error, count: projects.length, projects })

  return (
    <div className="min-h-screen font-arial flex">
      <div className="bg-fhv-periwinkle-lilac w-20" />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main>
          <HeroSection
            heading="Lorem ipsum sit dolor amet"
            subheading="Stet clita kasd gubergren"
            body={LOREM}
          />
          <StatsSection />
          <FilterMapSection projects={projects} />
          <HeroSection
            heading="Lorem ipsum sit dolor amet"
            subheading="Stet clita kasd gubergren"
            body={LOREM}
          />
        </main>
        <Footer />
      </div>
    </div>
  )
}
