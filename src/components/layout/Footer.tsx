import LogoS from '../../assets/icons/fhv-logo-s.svg?react'
import { useT } from '../../i18n/translations'

// Social links are proper nouns — no translation needed
const socialLinks = ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube']

export default function Footer() {
  const t = useT()

  return (
    <footer className="bg-fhv-sunrise-red px-16 py-12">

      <div className="grid grid-cols-3 gap-16">

        {/* Column 1 — Legal */}
        <div className="flex flex-col gap-6">
          <p className="type-copy-em text-fhv-black">© FHV 2025</p>
          <nav className="flex flex-col gap-3">
            {t.legalLinks.map((link) => (
              <a key={link} href="#" className="type-link text-fhv-black border-b border-fhv-black pb-3">
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Column 2 — Contact */}
        <div className="flex flex-col gap-6">
          <p className="type-h4 text-fhv-black">{t.footerContact}</p>
          <div className="flex flex-col gap-1 type-copy text-fhv-black">
            <p className="type-copy-em">FHV – Vorarlberg University of Applied Sciences</p>
            <p>CAMPUS V, Hochschulstraße 1</p>
            <p>6850 Dornbirn</p>
            <p>{t.footerCountry}</p>
          </div>
          <div className="flex flex-col gap-1 type-copy text-fhv-black">
            <p>+43 5572 792</p>
            <a href="mailto:info@fhv.at" className="type-link text-fhv-black">info@fhv.at</a>
          </div>
          <p className="type-small text-fhv-black">{t.footerSponsor}</p>
          <a href="#" className="type-link text-fhv-black self-start">{t.footerNewsletter}</a>
          <div className="flex gap-3 mt-2">
            {socialLinks.map((name) => (
              <a
                key={name}
                href="#"
                aria-label={name}
                className="type-small text-fhv-black border border-fhv-black w-8 h-8 flex items-center justify-center"
                title={name}
              >
                {name[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 — Quicklinks */}
        <div className="flex flex-col gap-6">
          <p className="type-h4 text-fhv-black">{t.footerQuicklinksHeading}</p>
          <nav className="flex flex-col gap-3">
            {t.quickLinks.map((link) => (
              <a key={link} href="#" className="type-link text-fhv-black border-b border-fhv-black pb-3">
                {link}
              </a>
            ))}
          </nav>
        </div>

      </div>

      {/* Bottom row — logo mark */}
      <div className="flex justify-end mt-12">
        <LogoS className="h-[46px] w-auto text-fhv-black" />
      </div>

    </footer>
  )
}
