import type { Project, Partner } from '../../types/project'
import { TOPIC_COLORS } from '../../config/topicColors'
import placeholderImg from '../../assets/images/default-image-missing-placeholder.jpg'
import ArrowTopRightIcon from '../../assets/icons/fhv-arrow-top-right.svg?react'

// ---------------------------------------------------------------------------
// Sub-components (private)
// ---------------------------------------------------------------------------

function Chip({ label }: { label: string }) {
  return (
    <span className="type-small border border-fhv-black px-3 py-0.5 text-fhv-black">
      {label}
    </span>
  )
}

function LabeledSection({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="type-copy-em text-fhv-black">{label}</p>
      <p className="type-copy text-fhv-black">{body}</p>
    </div>
  )
}

function PartnerLink({ partner, isLead }: { partner: Partner; isLead?: boolean }) {
  const label = isLead ? `${partner.name} (Lead)` : partner.name
  if (partner.link) {
    return (
      <a
        href={partner.link}
        target="_blank"
        rel="noreferrer"
        className="type-link text-fhv-black inline-flex items-center gap-1"
      >
        <ArrowTopRightIcon className="w-3 h-3 shrink-0" />
        {label}
      </a>
    )
  }
  return <p className="type-copy text-fhv-black">{label}</p>
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type Props = {
  project: Project
  onClose: () => void
}

export default function ProjectDetailPanel({ project, onClose }: Props) {
  const firstTopic  = project.filters.topic[0]
  const colorConfig = firstTopic ? TOPIC_COLORS[firstTopic] : undefined
  const stripeClass = colorConfig ? colorConfig.bg : 'bg-fhv-black'

  const hasTextContent  = project.description    || project.objective             || project.results
  const hasDuration     = project.duration.start || project.duration.end          || project.duration.time
  const hasContact      = project.contact.name   || project.contact.organisation  || project.contact.email  || project.contact.phone

  return (
    <div className="h-full flex flex-col bg-fhv-white overflow-hidden border border-fhv-black">

      {/* Header image */}
      <div className="relative h-40 shrink-0 overflow-hidden">
        <img
          src={project.image.link ?? placeholderImg}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderImg }}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        {project.image.credits && (
          <p className="absolute bottom-1 right-2 type-small text-fhv-white bg-fhv-black/50 px-1">
            {project.image.credits}
          </p>
        )}
      </div>

      {/* Topic accent stripe */}
      <div className={`h-1.5 w-full shrink-0 ${stripeClass}`} aria-hidden="true" />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

        {/* Back button */}
        <button
          onClick={onClose}
          className="self-start type-small text-fhv-black underline cursor-pointer hover:no-underline"
        >
          ← Zurück
        </button>

        {/* Title + subtitle */}
        <div className="flex flex-col gap-1">
          <h3 className="type-h3 text-fhv-black">{project.title}</h3>
          {project.subtitle && (
            <p className="type-copy text-fhv-black">{project.subtitle}</p>
          )}
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2">
          {project.filters.topic.map((t)    => <Chip key={t} label={t} />)}
          {project.filters.industry.map((i) => <Chip key={i} label={i} />)}
          {project.filters.status.map((s)   => <Chip key={s} label={s} />)}
        </div>

        {/* Website */}
        <a
          href={project.website}
          target="_blank"
          rel="noreferrer"
          className="type-link text-fhv-black inline-flex items-center gap-1"
        >
          <ArrowTopRightIcon className="w-4 h-4 shrink-0" />
          Projektwebsite
        </a>

        {/* Description / Objective / Results */}
        {hasTextContent && (
          <div className="flex flex-col gap-4">
            {project.description && (
              <LabeledSection label="Beschreibung" body={project.description} />
            )}
            {project.objective && (
              <LabeledSection label="Zielsetzung" body={project.objective} />
            )}
            {project.results && (
              <LabeledSection label="Ergebnisse" body={project.results} />
            )}
          </div>
        )}

        {/* Duration */}
        {hasDuration && (
          <div className="flex flex-col gap-1">
            <p className="type-copy-em text-fhv-black">Laufzeit</p>
            <p className="type-copy text-fhv-black">
              {[project.duration.start, project.duration.end].filter(Boolean).join(' – ')}
              {project.duration.time && (
                <span className="type-small text-fhv-black"> ({project.duration.time})</span>
              )}
            </p>
          </div>
        )}

        {/* Location */}
        <div className="flex flex-col gap-1">
          <p className="type-copy-em text-fhv-black">Standort</p>
          <p className="type-copy text-fhv-black">
            {project.location.city}
            {project.filters.country[0] ? `, ${project.filters.country[0]}` : ''}
          </p>
        </div>

        {/* Partners */}
        <div className="flex flex-col gap-1">
          <p className="type-copy-em text-fhv-black">Projektpartner</p>
          <PartnerLink partner={project.partners.lead} isLead />
          {project.partners.others.map((p, i) => (
            <PartnerLink key={i} partner={p} />
          ))}
        </div>

        {/* Contact */}
        {hasContact && (
          <div className="flex flex-col gap-1">
            <p className="type-copy-em text-fhv-black">Kontakt</p>
            {project.contact.name         && <p className="type-copy text-fhv-black">{project.contact.name}</p>}
            {project.contact.organisation && <p className="type-copy text-fhv-black">{project.contact.organisation}</p>}
            {project.contact.email && (
              <a href={`mailto:${project.contact.email}`} className="type-link text-fhv-black">
                {project.contact.email}
              </a>
            )}
            {project.contact.phone && <p className="type-copy text-fhv-black">{project.contact.phone}</p>}
          </div>
        )}

      </div>
    </div>
  )
}
