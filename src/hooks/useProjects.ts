import { useEffect, useState } from 'react'
import { loadProjects } from '../data/parseProjects'
import type { Project } from '../types/project'

type UseProjectsResult = {
  projects: Project[]
  loading: boolean
  error: Error | null
}

/**
 * Load and parse the InnoAtlas Excel dataset once on mount.
 * Returns the full project list together with loading and error states.
 */
export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadProjects()
      .then(setProjects)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => setLoading(false))
  }, [])

  return { projects, loading, error }
}
