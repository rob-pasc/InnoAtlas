import { useT } from '../../i18n/translations'
import type { Translations } from '../../i18n/translations'

type ContactPerson = {
  name: string
  role: string
}

type OrgContact = {
  id: string
  name: string
  subtitle: string
  persons?: ContactPerson[]
  email: string
  phone?: string
  address: string[]
}

function buildOrgs(t: Translations): OrgContact[] {
  return [
    {
      id: 'fhv',
      name: t.contactFhvOrgName,
      subtitle: 'Vorarlberg University of Applied Sciences',
      email: 'info@fhv.at',
      phone: '+43 5572 792',
      address: ['CAMPUS V, Hochschulstraße 1', '6850 Dornbirn', t.contactFhvCountry],
    },
    {
      id: 'w4',
      name: 'W4',
      subtitle: 'Wissenschaftsverbund Vierländerregion Bodensee',
      persons: [
        { name: 'Isabel Oostvogel',  role: 'Labs-Koordinatorin' },
        { name: 'Felix Girke',       role: 'Innovation & Transfer Manager' },
        { name: 'Alexandra Hassler', role: 'Co-Geschäftsführerin' },
        { name: 'Markus Rhomberg',   role: 'Co-Geschäftsführer' },
      ],
      email: 'post@wissenschaftsverbund.org',
      address: ['c/o Universität Konstanz', 'Postfach 207', `78457 Konstanz, ${t.contactW4Country}`],
    },
  ]
}

function OrgCard({ org, roles }: { org: OrgContact; roles: Record<string, string> }) {
  return (
    <div className="flex flex-col gap-6 border-t-2 border-fhv-black pt-6">
      <div className="flex flex-col gap-1">
        <span className="type-h3 text-fhv-black">{org.name}</span>
        <span className="type-small text-fhv-black opacity-60">{org.subtitle}</span>
      </div>

      {org.persons && org.persons.length > 0 && (
        <div className="flex flex-col gap-4">
          {org.persons.map((p) => (
            <div key={p.name} className="flex flex-col gap-0.5">
              <span className="type-copy-em text-fhv-black">{p.name}</span>
              <span className="type-small text-fhv-black opacity-60">{roles[p.role] ?? p.role}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1 mt-auto">
        {org.phone && (
          <a href={`tel:${org.phone.replace(/\s/g, '')}`} className="type-link text-fhv-black underline underline-offset-2">
            {org.phone}
          </a>
        )}
        <a href={`mailto:${org.email}`} className="type-link text-fhv-black underline underline-offset-2">
          {org.email}
        </a>
        <address className="type-small text-fhv-black opacity-60 not-italic mt-1">
          {org.address.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </address>
      </div>
    </div>
  )
}

export default function ContactSection() {
  const t = useT()
  const orgs = buildOrgs(t)

  return (
    <section className="bg-fhv-white px-4 py-8 md:px-16 md:py-16">
      <div className="flex">
        <div className="w-0 md:w-1.5 shrink-0 self-stretch bg-fhv-sky-blue" aria-hidden="true" />

        <div className="flex-1 md:pl-5">
          <h2 className="type-hero text-fhv-black mb-5">{t.contactHeading}</h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            {orgs.map((org) => (
              <OrgCard key={org.id} org={org} roles={t.contactRoles} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
