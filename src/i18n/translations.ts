import { useLanguage } from './LanguageContext'

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

export type Translations = {
  // Navbar
  navTitle:    string
  navSubtitle: string

  // HeroSection (intro)
  heroHeading:    string
  heroSubheading: string
  heroBody:       string

  // ContactSection
  contactHeading:    string
  contactFhvOrgName: string
  contactFhvCountry: string
  contactW4Country:  string
  /** Translated display label for each canonical (German) role string */
  contactRoles: Record<string, string>

  // FilterMapSection
  filtersLabel:      string
  filterByTopic:     string
  filterByFokus:     string
  filterByStatus:    string
  searchProjects:    string
  searchPlaceholder: string
  noProjectsFound:   string
  /** Display label for each canonical (German) topic key */
  topicLabels:    Record<string, string>
  /** Display label for each canonical (German) fokus key */
  fokusLabels: Record<string, string>
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
  statsHeading:       string
  statLabelCountries: string
  statLabelEntries:   string
  statLabelPartners:  string
  statLabelTopics:    string

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
  navTitle:    'Innovationsatlas Bodenseeregion',
  navSubtitle: 'Innovationsatlas der Labore des Wissenschaftsverbundes Vierländerregion Bodensee',

  heroHeading:    'Was ist der Innovationsatlas?',
  heroSubheading: 'Innovationen aus der Vierländerregion entdecken und vernetzen',
  heroBody:       'Der Innovationsatlas Bodenseeregion macht Innovationsprojekte aus Deutschland, Österreich, der Schweiz und Liechtenstein sichtbar. Er bündelt Aktivitäten aus Forschung, Wirtschaft, Kommunen und Zivilgesellschaft. Damit schafft er eine gemeinsame Übersicht über das Innovationsgeschehen in der gesamten Region. Die Plattform entsteht im Rahmen der Labore des Wissenschaftsverbundes Vierländerregion Bodensee (W4) in Zusammenarbeit mit der FHV – Vorarlberg University of Applied Sciences.',

  contactHeading:    'Ansprechpersonen',
  contactFhvOrgName: 'FHV Forschungszentrum Business Informatics',
  contactFhvCountry: 'Österreich',
  contactW4Country:  'Deutschland',
  contactRoles: {
    'Labs-Koordinatorin':         'Labs-Koordinatorin',
    'Innovation & Transfer Manager': 'Innovation & Transfer Manager',
    'Co-Geschäftsführerin':       'Co-Geschäftsführerin',
    'Co-Geschäftsführer':         'Co-Geschäftsführer',
  },

  filtersLabel:      'Filter',
  filterByTopic:     'Nach Thema filtern',
  filterByFokus:     'Nach Fokus filtern',
  filterByStatus:    'Nach Status filtern',
  searchProjects:    'Projekt suchen',
  searchPlaceholder: 'Suchbegriff eingeben',
  noProjectsFound:   'Keine Projekte entsprechen den gewählten Filtern.',

  topicLabels: {
    'Mobilität':           'Mobilität',
    'Energieeffizienz':    'Energieeffizienz',
    'Kreislaufwirtschaft': 'Kreislaufwirtschaft',
    'Technik':             'Technik',
  },
  fokusLabels: {
    'Forschung':                'Forschung',
    'Pilotprojekt':             'Pilotprojekt',
    'Unternehmen':              'Unternehmen',
    'Gemeinde & Städte':        'Gemeinde & Städte',
    'Bürger:innen-Beteiligung': 'Bürger:innen-Beteiligung',
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

  statsHeading:       'Innovationsatlas in Zahlen',
  statLabelCountries: 'Länder',
  statLabelEntries:   'Einträge',
  statLabelPartners:  'Projektbeteiligte',
  statLabelTopics:    'Themen',

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
  navTitle:    'Innovation Atlas Lake Constance Region',
  navSubtitle: 'Innovation Atlas of the W4 Labs – Wissenschaftsverbund Vierländerregion Bodensee',

  heroHeading:    'What is the Innovation Atlas?',
  heroSubheading: 'Discover and connect innovations from the four-country Lake Constance region',
  heroBody:       'The Innovation Atlas Bodenseeregion maps innovation projects from Germany, Austria, Switzerland, and Liechtenstein. It brings together activities from research, business, municipalities, and civil society. Therefore providing a shared overview of innovation across the entire region. The platform is developed within the framework of the W4 Labs (Wissenschaftsverbund Vierländerregion Bodensee) in collaboration with FHV – Vorarlberg University of Applied Sciences.',

  contactHeading:    'Contact Persons',
  contactFhvOrgName: 'FHV Research Centre for Business Informatics',
  contactFhvCountry: 'Austria',
  contactW4Country:  'Germany',
  contactRoles: {
    'Labs-Koordinatorin':            'Labs Coordinator',
    'Innovation & Transfer Manager': 'Innovation & Transfer Manager',
    'Co-Geschäftsführerin':          'Co-Executive Director',
    'Co-Geschäftsführer':            'Co-Executive Director',
  },

  filtersLabel:      'Filter',
  filterByTopic:     'Filter by topic',
  filterByFokus:     'Filter by focus',
  filterByStatus:    'Filter by status',
  searchProjects:    'Search projects',
  searchPlaceholder: 'Enter search term',
  noProjectsFound:   'No projects match the selected filters.',

  topicLabels: {
    'Mobilität':           'Mobility',
    'Energieeffizienz':    'Energy Efficiency',
    'Kreislaufwirtschaft': 'Circular Economy',
    'Technik':             'Technology',
  },
  fokusLabels: {
    'Forschung':                'Research',
    'Pilotprojekt':             'Pilot Project',
    'Unternehmen':              'Enterprise',
    'Gemeinde & Städte':        'Communities & Cities',
    'Bürger:innen-Beteiligung': 'Civic Participation',
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

  statsHeading:       'Innovation Atlas in Numbers',
  statLabelCountries: 'Countries',
  statLabelEntries:   'Entries',
  statLabelPartners:  'Project Participants',
  statLabelTopics:    'Topics',

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
