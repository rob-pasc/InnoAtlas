import { useT } from '../../i18n/translations'

type NavbarProps = {
  onMenuToggle: () => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const t = useT()
  return (
    <nav className="bg-paper">
      <div className="max-w-screen-3xl mx-auto flex items-center px-4 md:px-16 pt-5">
        <button
          className="md:hidden mr-4 text-ink flex flex-col gap-1 shrink-0"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-ink" />
          <span className="block w-6 h-0.5 bg-ink" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
        <div className="flex flex-col gap-1 max-w-300">
          <h1 className="type-title text-ink">{t.navTitle}</h1>
          <p className="type-h2 text-ink/55 tracking-wide">{t.navSubtitle}</p>
        </div>
      </div>
    </nav>
  )
}
