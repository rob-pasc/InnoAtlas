import { useEffect } from 'react'
import type { Project } from '../types/project'

// Zoom levels a single-project flyToBounds will land at
const ZOOM_LEVELS = [9, 10]
// Pre-fetch a 3×3 grid around each project's centre tile
const GRID_RADIUS = 2          // 5×5 grid around each project tile
// CartoDB subdomains — distributed across all four for parallel loading
const SUBDOMAINS = ['a', 'b', 'c', 'd'] as const

/** Standard Web Mercator (Slippy Map) tile coordinate formula */
function toTileXY(lat: number, lng: number, z: number) {
  const n      = 2 ** z
  const x      = Math.floor((lng + 180) / 360 * n)
  const latRad = (lat * Math.PI) / 180
  const y      = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
  return { x, y }
}

/**
 * Silently pre-fetches CartoDB tile images for every project location so they
 * are already in the browser's HTTP/image cache when a pin is clicked.
 * Leaflet renders TileLayer tiles as <img> elements, so any URL pre-fetched
 * with new Image() is served from cache by the time Leaflet requests it.
 */
export function usePrefetchMapTiles(projects: Project[]) {
  useEffect(() => {
    if (projects.length === 0) return

    // Match the retina suffix Leaflet will use for this screen
    const r = window.devicePixelRatio > 1 ? '@2x' : ''

    for (const { location: { latitude, longitude } } of projects) {
      for (const z of ZOOM_LEVELS) {
        const { x: cx, y: cy } = toTileXY(latitude, longitude, z)
        for (let dx = -GRID_RADIUS; dx <= GRID_RADIUS; dx++) {
          for (let dy = -GRID_RADIUS; dy <= GRID_RADIUS; dy++) {
            const s   = SUBDOMAINS[(Math.abs(cx + dx + cy + dy)) % SUBDOMAINS.length]
            const img = new Image()
            img.src   = `https://${s}.basemaps.cartocdn.com/light_all/${z}/${cx + dx}/${cy + dy}${r}.png`
          }
        }
      }
    }
  }, [projects])
}
