import { useT } from '../../i18n/translations'
import type { Translations } from '../../i18n/translations'
import MailIcon from '../../assets/icons/mail.svg?react'

type ContactPerson = {
  name: string
  email: string
}

type OrgContact = {
  id: string
  name: string
  subtitle: string
  /** WCAG 3.1.2 – the subtitle is a fixed proper name that stays in its own
   *  language whichever UI language is active, so it must declare it. */
  subtitleLang: 'de' | 'en'
  persons?: ContactPerson[]
  phone?: string
  website?: string
  /** Postal lines, always German (street/city are not translated). */
  address: string[]
  /** Translated – rendered in the page language, so it carries no `lang`. */
  country: string
}

function buildOrgs(t: Translations): OrgContact[] {
  return [
    {
      id: 'fhv',
      name: t.contactFhvOrgName,
      subtitle: 'Vorarlberg University of Applied Sciences',
      subtitleLang: 'en',
      persons: [
        { name: 'Thomas Absmayr', email: 'thomas.absmayr@fhv.at' },
        { name: 'Martin Dobler',  email: 'martin.dobler@fhv.at' },
      ],
      phone: '+43 5572 792',
      website: 'www.fhv.at',
      address: ['CAMPUS V, Hochschulstraße 1', '6850 Dornbirn'],
      country: t.contactFhvCountry,
    },
    {
      id: 'w4',
      name: 'W4',
      subtitle: 'Wissenschaftsverbund Vierländerregion Bodensee',
      subtitleLang: 'de',
      persons: [
        { name: 'Isabel Oostvogel', email: 'oostvogel@wissenschaftsverbund.org' },
        { name: 'Markus Rhomberg',  email: 'rhomberg@wissenschaftsverbund.org' },
      ],
      phone: '+41 71 6770520',
      website: 'www.wissenschaftsverbund.org',
      address: ['c/o Universität Konstanz, Postfach 207', '78457 Konstanz'],
      country: t.contactW4Country,
    },
  ]
}

function OrgCard({ org }: { org: OrgContact }) {
  return (
    <div className="flex flex-col gap-5 border-t-2 border-ink pt-5 md:row-span-3 md:grid md:grid-rows-subgrid">
      <div className="flex flex-col gap-0.5">
        <h3 className="type-h3 text-ink">{org.name}</h3>
        <p className="type-h4 text-ink opacity-60" lang={org.subtitleLang}>{org.subtitle}</p>
      </div>

      {org.persons && org.persons.length > 0 && (
        <div className="flex flex-col gap-2">
          {org.persons.map((p) => (
            <div key={p.name} className="flex flex-col gap-0.5">
              <span className="type-copy-em text-ink">{p.name}</span>
              <a
                href={`mailto:${p.email}`}
                className="type-small text-ink opacity-60 underline underline-offset-2 self-start inline-flex items-center gap-1"
              >
                <MailIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
                {p.email}
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1 mt-auto">
        {org.phone && (
          <a href={`tel:${org.phone.replace(/\s/g, '')}`} className="type-link text-ink underline underline-offset-2 self-start">
            {org.phone}
          </a>
        )}
        {org.website && (
          <a href={`https://${org.website}`} target="_blank" rel="noopener noreferrer" className="type-link text-ink underline underline-offset-2 self-start">
            {org.website}
          </a>
        )}
        <address className="type-small text-ink opacity-60 not-italic mt-1">
          {org.address.map((line) => (
            <span key={line} className="block" lang="de">{line}</span>
          ))}
          <span className="block">{org.country}</span>
        </address>
      </div>
    </div>
  )
}

export default function ContactSection() {
  const t = useT()
  const orgs = buildOrgs(t)

  return (
    <section className="bg-paper px-4 py-8 md:px-16 md:py-16">
      <div className="flex">
        <div className="w-0 md:w-1.5 shrink-0 self-stretch bg-cat-1" aria-hidden="true" />

        <div className="flex-1 md:pl-5">
          <h2 className="type-hero text-ink text-center md:text-left mb-5">{t.contactHeading}</h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-5">
            {orgs.map((org) => (
              <OrgCard key={org.id} org={org} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
