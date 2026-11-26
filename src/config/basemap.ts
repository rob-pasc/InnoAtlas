// CARTO "Positron" raster basemap. Since 2026 CARTO serves a watermark
// ("API KEY REQUIRED") unless a key is appended. The key is read from
// VITE_CARTO_KEY at build time: set it in the hosting environment (Render)
// or a git-ignored .env.local – never commit it. The deployed key is
// Referer-restricted to the production host, so it is safe to ship to the
// browser but will not work on localhost.

const CARTO_KEY = import.meta.env.VITE_CARTO_KEY ?? ''
const KEY_QUERY = CARTO_KEY ? `?key=${encodeURIComponent(CARTO_KEY)}` : ''

export const BASEMAP_SUBDOMAINS = ['a', 'b', 'c', 'd'] as const

/** Leaflet URL template ({s}, {z}, {x}, {y}, {r} are filled in by Leaflet). */
export const BASEMAP_URL_TEMPLATE =
  `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${KEY_QUERY}`

/** Concrete tile URL, for code that requests tiles outside Leaflet. */
export function basemapTileUrl(s: string, z: number, x: number, y: number, r: '' | '@2x') {
  return `https://${s}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}${r}.png${KEY_QUERY}`
}

export const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
