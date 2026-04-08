import { useEffect, useState } from 'react'
import { loadProjects } from '../data/parseProjects'
import { useLanguage } from '../i18n/LanguageContext'
import type { Project } from '../types/project'

type UseProjectsResult = {
  projects: Project[]
  loading:  boolean
  error:    Error | null
}

/**
 * Load and parse the InnoAtlas Excel dataset for the current language.
 * Re-fetches automatically when the language changes.
 */
export function useProjects(): UseProjectsResult {
  const { lang } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<Error | null>(null)

  useEffect(() => {
    setProjects([])
    setLoading(true)
    setError(null)

    const sheet = lang === 'de' ? 'ger' : 'eng'
    loadProjects(sheet)
      .then(setProjects)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => setLoading(false))
  }, [lang])

  return { projects, loading, error }
}
