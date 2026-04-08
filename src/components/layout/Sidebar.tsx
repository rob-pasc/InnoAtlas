import LogoS from '../../assets/icons/fhv-logo-s.svg?react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function Sidebar() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-fhv-periwinkle-lilac z-20 flex flex-col justify-between items-center pt-5 gap-6 overflow-visible">

      {/* FHV icon */}
      <LogoS className="h-15 w-auto text-fhv-black translate-x-6 shrink-0" />

      {/* Language switcher */}
      <div className="flex items-center gap-1 type-copy-em text-fhv-black mb-3">
        {(['en', 'de'] as const).map((l, i) => (
          <>
            {i > 0 && <span key="sep" aria-hidden>|</span>}
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`cursor-pointer transition-colors hover:opacity-60
                ${lang === l ? 'underline' : ''}`}
            >
              {l.toUpperCase()}
            </button>
          </>
        ))}
      </div>

    </div>
  )
}
