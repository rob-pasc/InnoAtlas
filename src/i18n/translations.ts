import { useLanguage } from './LanguageContext'

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

export type Translations = {
  // FilterMapSection
  filtersLabel:      string
  filterByTopic:     string
  filterByIndustry:  string
  filterByStatus:    string
  searchProjects:    string
  searchPlaceholder: string
  noProjectsFound:   string
  /** Display label for each canonical (German) topic key */
  topicLabels:    Record<string, string>
  /** Display label for each canonical (German) industry key */
  industryLabels: Record<string, string>
  /** Display label for each canonical (German) status key */
  statusLabels:   Record<string, string>

  // ProjectDetailPanel
  back:            string
  projectWebsite:  string
  description:     string
  objective:       string
  results:         string
  duration:        string
  location:        string
  projectPartners: string
  contact:         string
  lead:            string   // suffix for the lead partner, e.g. "(Lead)"

  // StatsSection
  statsHeading: string
  stats: Array<{ value: string; label: string }>

  // Footer
  footerContact:           string
  footerCountry:           string
  footerSponsor:           string
  footerNewsletter:        string
  footerQuicklinksHeading: string
  legalLinks:              string[]
  quickLinks:              string[]
}

// ---------------------------------------------------------------------------
// German
// ---------------------------------------------------------------------------

const de: Translations = {
  filtersLabel:      'Filter',
  filterByTopic:     'Nach Thema filtern',
  filterByIndustry:  'Nach Industrie filtern',
  filterByStatus:    'Nach Status filtern',
  searchProjects:    'Projekt suchen',
  searchPlaceholder: 'Suchbegriff eingeben',
  noProjectsFound:   'Keine Projekte entsprechen den gewählten Filtern.',

  topicLabels: {
    'Wirtschaft': 'Wirtschaft',
    'Umwelt':     'Umwelt',
    'Soziales':   'Soziales',
    'Sonstiges':  'Sonstiges',
  },
  industryLabels: {
    'Bildung':              'Bildung',
    'Logistik':             'Logistik',
    'Öffentlicher Verkehr': 'Öffentlicher Verkehr',
  },
  statusLabels: {
    'Abgeschlossen': 'Abgeschlossen',
    'Laufend':       'Laufend',
    'Geplant':       'Geplant',
  },

  back:            '← Zurück',
  projectWebsite:  'Projektwebsite',
  description:     'Beschreibung',
  objective:       'Zielsetzung',
  results:         'Ergebnisse',
  duration:        'Laufzeit',
  location:        'Standort',
  projectPartners: 'Projektpartner',
  contact:         'Kontakt',
  lead:            'Lead',

  statsHeading: 'Der InnoAtlas in Zahlen',
  stats: [
    { value: '4',   label: 'Länder' },
    { value: '52',  label: 'abgeschlossene Projekte' },
    { value: '107', label: 'Projektbeteiligte' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
  ],

  footerContact:           'Kontakt',
  footerCountry:           'Österreich',
  footerSponsor:           'Sponsor: illwerke vkw',
  footerNewsletter:        'Newsletter abonnieren',
  footerQuicklinksHeading: 'Quicklinks',
  legalLinks: [
    'Impressum',
    'Allgemeine Geschäftsbedingungen',
    'Datenschutz',
    'Barrierefreiheitserklärung',
    'Hinweisgebersystem (Whistleblower-System)',
    'Amtssignatur, elektronische Signatur',
  ],
  quickLinks: [
    'Über die FHV',
    'Karriere',
    'Bibliothek',
    'Mensa & Café Campus',
    'Presse',
    'Alumni',
    'Events',
    'ÖH Studierendenvertretung',
    'Member of RUN-EU',
  ],
}

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

const en: Translations = {
  filtersLabel:      'Filter',
  filterByTopic:     'Filter by topic',
  filterByIndustry:  'Filter by industry',
  filterByStatus:    'Filter by status',
  searchProjects:    'Search projects',
  searchPlaceholder: 'Enter search term',
  noProjectsFound:   'No projects match the selected filters.',

  topicLabels: {
    'Wirtschaft': 'Economy',
    'Umwelt':     'Environment',
    'Soziales':   'Social',
    'Sonstiges':  'Other',
  },
  industryLabels: {
    'Bildung':              'Education',
    'Logistik':             'Logistics',
    'Öffentlicher Verkehr': 'Public Transport',
  },
  statusLabels: {
    'Abgeschlossen': 'Completed',
    'Laufend':       'Ongoing',
    'Geplant':       'Planned',
  },

  back:            '← Back',
  projectWebsite:  'Project website',
  description:     'Description',
  objective:       'Objective',
  results:         'Results',
  duration:        'Duration',
  location:        'Location',
  projectPartners: 'Project partners',
  contact:         'Contact',
  lead:            'Lead',

  statsHeading: 'InnoAtlas in Numbers',
  stats: [
    { value: '4',   label: 'Countries' },
    { value: '52',  label: 'Completed projects' },
    { value: '107', label: 'Project participants' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
    { value: '000', label: 'Lorem ipsum' },
  ],

  footerContact:           'Contact',
  footerCountry:           'Austria',
  footerSponsor:           'Sponsor: illwerke vkw',
  footerNewsletter:        'Subscribe to newsletter',
  footerQuicklinksHeading: 'Quick links',
  legalLinks: [
    'Legal Notice',
    'Terms and Conditions',
    'Privacy Policy',
    'Accessibility Statement',
    'Whistleblower System',
    'Official Signature, Electronic Signature',
  ],
  quickLinks: [
    'About FHV',
    'Careers',
    'Library',
    'Cafeteria & Café Campus',
    'Press',
    'Alumni',
    'Events',
    'Student Union',
    'Member of RUN-EU',
  ],
}

// ---------------------------------------------------------------------------
// Translations map + hook
// ---------------------------------------------------------------------------

const translations: Record<string, Translations> = { de, en }

export function useT(): Translations {
  const { lang } = useLanguage()
  return translations[lang]
}
