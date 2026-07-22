import React from 'react'
// import LogoS from '../../assets/icons/fhv-logo-s.svg?react'
import { useLanguage } from '../../i18n/LanguageContext'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { lang, setLang } = useLanguage()

  return (
    <>
      {/* Backdrop – mobile only, shown when drawer is open */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label={lang === 'de' ? 'Menü schließen' : 'Close menu'}
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClose()
            }
          }}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen z-20
        flex flex-col justify-between items-center
        pt-5 gap-6 overflow-visible
        bg-cat-3
        transition-transform duration-300
        w-32 md:w-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
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
