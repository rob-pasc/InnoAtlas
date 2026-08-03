import { useT } from '../../i18n/translations'
import ArrowTopRightIcon from '../../assets/icons/arrow-top-right.svg?react'

export default function Footer() {
  const t = useT()

  return (
    <footer className="bg-cat-4">
      <div className="max-w-screen-3xl mx-auto flex flex-col items-center gap-3 px-4 py-8 md:flex-row md:justify-between md:px-16">
        <a
          href={t.footerOrgHref}
          target="_blank"
          rel="noreferrer"
          className="type-copy-em text-ink"
        >
          © FH Vorarlberg 2026
        </a>
        <nav aria-label={t.footerLegalNavLabel} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {t.legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="type-link text-ink inline-flex items-center gap-0.5"
            >
              <ArrowTopRightIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
