import React, { useRef } from 'react'
// import LogoS from '../../assets/icons/fhv-logo-s.svg?react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useT } from '../../i18n/translations'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useModalOverlay } from '../../hooks/useModalOverlay'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { lang, setLang } = useLanguage()
  const t = useT()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Below `md` this is an overlay drawer; from `md` up it is a permanent rail,
  // so neither the dialog semantics nor the focus trap may apply there.
  const isDrawer = useMediaQuery('(max-width: 767px)')
  const isModal  = isDrawer && isOpen

  useModalOverlay({ open: isOpen, active: isDrawer, containerRef: drawerRef, onClose })

  return (
    <>
      {/* Backdrop – mobile only, shown when drawer is open. Not a focus stop:
          the drawer traps focus and Escape closes it. */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        ref={drawerRef}
        id="sidebar"
        role={isModal ? 'dialog' : undefined}
        aria-modal={isModal || undefined}
        aria-label={isModal ? t.menuLabel : undefined}
        className={`
        fixed left-0 top-0 h-screen z-20
        flex flex-col justify-between items-center
        pt-5 gap-6 overflow-visible
        bg-cat-3
        transition-[transform,visibility] duration-300
        w-32 md:w-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full invisible md:visible'}
        md:translate-x-0
      `}>

        {/* FHV icon */}
        {/* <LogoS
          className="w-auto text-ink md:translate-x-5 shrink-0"
          style={{ fontSize: '3rem', height: 'calc(2 * 1cap + 0.375rem)', aspectRatio: '1' }}
        /> */}
        <div/>  {/* Placeholder to keep spacing when logo is not being used */}

        {/* Language switcher */}
        <div className="flex items-center gap-1 type-copy-em text-ink mb-3">
          {(['en', 'de'] as const).map((l, i) => (
            <React.Fragment key={l}>
              {i > 0 && <span aria-hidden>|</span>}
              <button
                onClick={() => { setLang(l); onClose() }}
                lang={l}   /* WCAG 3.1.2 – "EN"/"DE" must be spoken in their own language */
                aria-pressed={lang === l}   /* WCAG 4.1.2 – the underline alone is not programmatic */
                className={`cursor-pointer transition-colors hover:opacity-60
                  ${lang === l ? 'underline' : ''}`}
              >
                {l.toUpperCase()}
              </button>
            </React.Fragment>
          ))}
        </div>

      </div>
    </>
  )
}
