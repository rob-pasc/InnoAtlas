import LogoS from '../../assets/icons/fhv-logo-s.svg?react'
import { useLanguage } from '../../i18n/LanguageContext'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { lang, setLang } = useLanguage()

  return (
    <>
      {/* Backdrop — mobile only, shown when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen z-20
        flex flex-col justify-between items-center
        pt-5 gap-6 overflow-visible
        bg-fhv-periwinkle-lilac
        transition-transform duration-300
        w-32 md:w-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>

        {/* FHV icon */}
        <LogoS
          className="w-auto text-fhv-black md:translate-x-5 shrink-0"
          style={{ fontSize: '3rem', height: 'calc(2 * 1cap + 0.375rem)', aspectRatio: '1' }}
        />

        {/* Language switcher */}
        <div className="flex items-center gap-1 type-copy-em text-fhv-black mb-3">
          {(['en', 'de'] as const).map((l, i) => (
            <>
              {i > 0 && <span key="sep" aria-hidden>|</span>}
              <button
                key={l}
                onClick={() => { setLang(l); onClose() }}
                className={`cursor-pointer transition-colors hover:opacity-60
                  ${lang === l ? 'underline' : ''}`}
              >
                {l.toUpperCase()}
              </button>
            </>
          ))}
        </div>

      </div>
    </>
  )
}
