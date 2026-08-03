import { useMediaQuery } from './useMediaQuery'

/**
 * Whether the user has asked the OS to minimise non-essential motion.
 * Re-evaluates if the preference changes while the page is open.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
