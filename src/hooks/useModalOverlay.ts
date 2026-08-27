import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

type ModalOverlayOptions = {
  /** Whether the overlay is currently shown. */
  open: boolean
  /** Whether the overlay behaves as a modal at the current viewport size.
   *  Both surfaces using this hook are permanent/inline layout above their
   *  breakpoint, where none of this should apply. */
  active: boolean
  containerRef: RefObject<HTMLElement | null>
  onClose: () => void
}

/**
 * Modal plumbing shared by the mobile drawer and the mobile detail sheet
 * (WCAG 2.4.3): moves focus into the overlay on open, keeps Tab cycling inside
 * it while open, closes on Escape, and restores focus to whatever was focused
 * before on close.
 */
export function useModalOverlay({ open, active, containerRef, onClose }: ModalOverlayOptions) {
  // Held in a ref so an inline `onClose` arrow doesn't re-run the effect on
  // every render — which would re-steal focus and fight the restore below.
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

  useEffect(() => {
    if (!open || !active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    // `offsetParent` cannot be used as a visibility test here: descendants of
    // the fixed-position sidebar legitimately have no offset parent. Rects and
    // computed visibility still exclude display:none/breakpoint-hidden nodes
    // without dropping those valid drawer controls.
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => {
          const style = window.getComputedStyle(el)
          return el.getClientRects().length > 0
            && style.visibility !== 'hidden'
            && style.display !== 'none'
        })

    function focusFirst(): boolean {
      const first = focusables()[0]
      if (!first) return false
      first.focus()
      return true
    }

    function transitionTimeMs(element: HTMLElement): number {
      const style = window.getComputedStyle(element)
      const durations = style.transitionDuration.split(',').map((value) => Number.parseFloat(value) * (value.includes('ms') ? 1 : 1000))
      const delays = style.transitionDelay.split(',').map((value) => Number.parseFloat(value) * (value.includes('ms') ? 1 : 1000))
      return Math.max(0, ...durations.map((duration, index) => duration + (delays[index] ?? delays[0] ?? 0)))
    }

    let focusTimer: number | undefined

    // Opening the drawer also transitions `visibility`. Try on the next paint;
    // if its controls are still hidden, retry as soon as that transition ends.
    // Reduced-motion styles reduce this wait to effectively zero.
    const focusFrame = requestAnimationFrame(() => {
      if (focusFirst()) return
      focusTimer = window.setTimeout(() => {
        if (focusFirst()) return
        container.tabIndex = -1
        container.focus()
      }, transitionTimeMs(container) + 20)
    })

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !container) return

      const items = focusables()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem  = items[items.length - 1]
      const current   = document.activeElement
      const outside   = !container.contains(current)

      if (e.shiftKey && (current === firstItem || outside)) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && (current === lastItem || outside)) {
        e.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(focusFrame)
      if (focusTimer !== undefined) window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, active, containerRef])
}
