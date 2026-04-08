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

function mapRowToProject(row: RawRow): Project | null {
  // --- Required field validation ---
  const missing: string[] = []

  const id = Number(row['ID'])
  if (!row['ID'] || isNaN(id))           missing.push('ID')

  const title = clean(row['ProjectTitle'])
  if (!title)                            missing.push('ProjectTitle')

  const city = clean(row['LocationCity'])
  if (!city)                             missing.push('LocationCity')

  const lat = parseCoord(row['LocationLatitude'])
  if (lat === null)                      missing.push('LocationLatitude')

  const lon = parseCoord(row['LocationLongitude'])
  if (lon === null)                      missing.push('LocationLongitude')

  const website = clean(row['ProjectWebsite'])
  if (!website)                          missing.push('ProjectWebsite')

  const leadName = clean(row['PartnerLeadName'])
  if (!leadName)                         missing.push('PartnerLeadName')

  const leadLink = clean(row['PartnerLeadLink'])
  if (!leadLink)                         missing.push('PartnerLeadLink')

  const filterCountry = parseFilter(row['FilterCountry'])
  if (!filterCountry.length)             missing.push('FilterCountry')

  const filterTopic = parseFilter(row['FilterTopic'])
  if (!filterTopic.length)               missing.push('FilterTopic')

  const filterIndustry = parseFilter(row['FilterIndustry'])
  if (!filterIndustry.length)            missing.push('FilterIndustry')

  const filterStatus = parseFilter(row['FilterStatus'])
  if (!filterStatus.length)              missing.push('FilterStatus')

  if (missing.length > 0) {
    console.warn(
      `[parseProjects] Row skipped — missing required fields: ${missing.join(', ')}`,
      row,
    )
    return null
  }

  // --- Safe to build the Project (validated values reused below) ---

  // Collect all six partner slots (lead first, then 1–5) and normalise them.
  // Slots where the name is missing/null are discarded.
  const partnerSlots = [
    { name: leadName!,              link: leadLink! },
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
    id,
    title:       title!,
    subtitle:    clean(row['ProjectSubtitle']),
    description: clean(row['ProjectDescription']),
    objective:   clean(row['ProjectObjective']),
    results:     clean(row['ProjectResults']),

    location: {
      city:      city!,
      longitude: lon!,
      latitude:  lat!,
    },

    contact: {
      name:         clean(row['ContactPersonName']),
      organisation: clean(row['ContactPersonOrganisation']),
      email:        clean(row['ContactPersonEmail']),
      phone:        clean(row['ContactPersonPhone']),
    },

    duration: {
      start: clean(row['ProjectDurationStart']),
      end:   clean(row['ProjectDurationEnd']),
      time:  clean(row['ProjectDurationTime']),
    },

    partners: {
      lead:   lead!,
      others: otherSlots.filter((p): p is Partner => p !== null),
    },

    filters: {
      country:  filterCountry,
      topic:    filterTopic,
      industry: filterIndustry,
      status:   filterStatus,
      lab:      parseFilter(row['FilterLab']),
    },

    image: {
      link:    clean(row['ImageLink']),
      credits: clean(row['ImageCredits']),
    },

    website: website!,
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch and parse the InnoAtlas Excel dataset.
 * The file is served as a static asset by Vite and fetched at runtime.
 * @param sheet - Worksheet name to read (e.g. 'ger' or 'eng')
 */
export async function loadProjects(sheet: string): Promise<Project[]> {
  const response = await fetch(xlsxUrl)
  const buffer = await response.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const worksheet = workbook.Sheets[sheet]
  if (!worksheet) {
    console.warn(`[loadProjects] Sheet "${sheet}" not found in workbook.`)
    return []
  }
  const rows = XLSX.utils.sheet_to_json<RawRow>(worksheet)
  return rows
    .map((row) => mapRowToProject(row))
    .filter((p): p is Project => p !== null)
}
