import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Lang = 'de' | 'en'

type LanguageContextValue = {
  lang:    Lang
  setLang: (lang: Lang) => void
}

function getLangFromUrl(): Lang {
  const p = new URLSearchParams(window.location.search).get('lang')
  return p === 'en' ? 'en' : 'de'  // unknown values fall back to 'de'
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getLangFromUrl)

  // Keep React state in sync when the user navigates back/forward
  useEffect(() => {
    const handler = () => setLangState(getLangFromUrl())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  function setLang(l: Lang) {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', l)
    window.history.pushState({}, '', url)
    setLangState(l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
