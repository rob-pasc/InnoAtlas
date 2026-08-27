import { useT } from '../../i18n/translations'

type NavbarProps = {
  onMenuToggle: () => void
  menuOpen: boolean
}

export default function Navbar({ onMenuToggle, menuOpen }: NavbarProps) {
  const t = useT()
  return (
    <nav aria-label={t.mainNavLabel} className="bg-paper">
      <div className="max-w-screen-3xl mx-auto grid grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-4 px-4 pt-5 md:flex md:px-16">
        <button
          className="md:hidden text-ink flex flex-col gap-1 shrink-0"
          onClick={onMenuToggle}
          aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
        >
          <span className="block w-6 h-0.5 bg-ink" />
          <span className="block w-6 h-0.5 bg-ink" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
        <div className="flex min-w-0 flex-col gap-1 text-center md:text-left max-w-300">
          <h1 className="type-title text-ink">{t.navTitle}</h1>
          <p className="type-h2 text-ink/55 tracking-wide">{t.navSubtitle}</p>
        </div>
      </div>
    </nav>
  )
}
