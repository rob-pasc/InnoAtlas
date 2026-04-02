// import * as XLSX from 'xlsx'
const XLSX = await import('xlsx') //lazy-load the XLSX library to avoid bundling it in the initial load

import xlsxUrl from './InnoAtlasExampleDataSet.xlsx?url'
import type { Partner, Project } from '../types/project'


// ---------------------------------------------------------------------------
// Normalisation helpers
// ---------------------------------------------------------------------------

type RawRow = Record<string, unknown>

/**
 * Trim whitespace, strip a trailing `#`, and return null if the result is
 * empty or contains the word "MISSING" (case-insensitive).
 */
function clean(value: unknown): string | null {
  if (value === undefined || value === null) return null
  const str = String(value).trim().replace(/#$/, '').trim()
  if (!str || str.toUpperCase().includes('MISSING')) return null
  return str
}

/**
 * Parse a coordinate string to a number.
 * Handles leading/trailing whitespace (seen in the source data).
 * Returns null for missing or unparseable values.
 */
function parseCoord(value: unknown): number | null {
  const str = clean(value)
  if (str === null) return null
  const n = parseFloat(str)
  return isNaN(n) ? null : n
}

/**
 * Split a filter value on commas and trim each entry.
 * Returns an empty array for missing values.
 * Supports future multi-value entries such as "Logistics, Aviation".
 */
function parseFilter(value: unknown): string[] {
  const str = clean(value)
  if (!str) return []
  return str.split(',').map((s) => s.trim()).filter(Boolean)
}

// ---------------------------------------------------------------------------
// Row → Project mapping
// ---------------------------------------------------------------------------

function mapRowToProject(row: RawRow): Project {
  // Collect all six partner slots (lead first, then 1–5) and normalise them.
  // Slots where the name is missing/null are discarded.
  const partnerSlots = [
    { name: row['PartnerLeadName'], link: row['PartnerLeadLink'] },
    { name: row['Partner1Name'],    link: row['Partner1Link'] },
    { name: row['Partner2Name'],    link: row['Partner2Link'] },
    { name: row['Partner3Name'],    link: row['Partner3Link'] },
    { name: row['Partner4Name'],    link: row['Partner4Link'] },
    { name: row['Partner5Name'],    link: row['Partner5Link'] },
  ].map(({ name, link }): Partner | null => {
    const cleanName = clean(name)
    return cleanName ? { name: cleanName, link: clean(link) } : null
  })

  const [lead, ...otherSlots] = partnerSlots

  return {
    id: Number(row['ID']),
    title: clean(row['ProjectTitle']) ?? '',
    subtitle: clean(row['ProjectSubtitle']),
    description: clean(row['ProjectDescription']),
    objective: clean(row['ProjectObjective']),
    results: clean(row['ProjectResults']),

    location: {
      city: clean(row['LocationCity']),
      longitude: parseCoord(row['LocationLongitude']),
      latitude: parseCoord(row['LocationLatitude']),
    },

    contact: {
      name: clean(row['ContactPersonName']),
      organisation: clean(row['ContactPersonOrganisation']),
      email: clean(row['ContactPersonEmail']),
      phone: clean(row['ContactPersonPhone']),
    },

    duration: {
      start: clean(row['ProjectDurationStart']),
      end: clean(row['ProjectDurationEnd']),
      time: clean(row['ProjectDurationTime']),
    },

    partners: {
      lead: lead ?? null,
      others: otherSlots.filter((p): p is Partner => p !== null),
    },

    filters: {
      country:  parseFilter(row['FilterCountry']),
      topic:    parseFilter(row['FilterTopic']),
      industry: parseFilter(row['FilterIndustry']),
      status:   parseFilter(row['FilterStatus']),
      lab:      parseFilter(row['FilterLab']),
    },

    image: {
      link:    clean(row['ImageLink']),
      credits: clean(row['ImageCredits']),
    },
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch and parse the InnoAtlas Excel dataset.
 * The file is served as a static asset by Vite and fetched at runtime.
 */
export async function loadProjects(): Promise<Project[]> {
  const response = await fetch(xlsxUrl)
  const buffer = await response.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets['Tabelle1']
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet)
  return rows.map(mapRowToProject)
}
