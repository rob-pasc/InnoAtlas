import { useState } from 'react'
import { useProjects } from './hooks/useProjects'
import { LanguageProvider } from './i18n/LanguageContext'
import { useT } from './i18n/translations'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'
import StatsSection from './components/sections/StatsSection'
import FilterMapSection from './components/sections/FilterMapSection'
import ContactSection from './components/sections/ContactSection'

function AppContent() {
  const { projects, loading, error } = useProjects()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const t = useT()

  // debug
  console.log('[useProjects]', { loading, error, count: projects.length, projects })

  return (
    <div className="min-h-screen font-sans flex bg-paper">
      {/* Bypass block – first tab stop, revealed only while focused */}
      <a
        href="#main"
        className="sr-only type-copy-em focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:text-paper focus:px-4 focus:py-2"
      >
        {t.skipToContent}
      </a>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-20 flex-1 flex flex-col min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} menuOpen={sidebarOpen} />
        {/* Exactly one <main>. The stats band spans the full viewport width, so
            the content max-width sits on the wrappers rather than on <main>. */}
        <main id="main" tabIndex={-1}>
          <div className="max-w-screen-3xl mx-auto w-full">
            <HeroSection
              heading={t.heroHeading}
              subheading={t.heroSubheading}
              body={t.heroBody}
            />
          </div>
          <StatsSection projects={projects} />
          <div className="max-w-screen-3xl mx-auto w-full">
            <FilterMapSection projects={projects} />
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
