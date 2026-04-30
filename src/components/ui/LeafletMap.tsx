import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'

import type { Project } from '../../types/project'
import { TOPIC_COLORS } from '../../config/topicColors'
import mapPinSvg from '../../assets/icons/map-pin.svg?raw'
import { prefetchTilesForLocation } from '../../utils/prefetchTiles'

// Fix Leaflet's default marker icon in Vite — Leaflet tries to resolve PNG
// assets via webpack's require() at runtime, which doesn't exist in Vite.
// Replacing with empty strings prevents broken-image errors in the console.
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: '', iconRetinaUrl: '', shadowUrl: '' })

const FALLBACK_HEX = '#000000'

function createPinIcon(hex: string): L.DivIcon {
  const html = mapPinSvg.replace('fill="currentColor"', `fill="${hex}"`)
  return L.divIcon({
    html,
    className: '',         // removes Leaflet's default white-box styling
    iconSize: [18, 24],    // matches SVG viewBox
    iconAnchor: [9, 24],   // tip of the pin = bottom-center
    popupAnchor: [0, -24],
  })
}

function BoundsFitter({ projects }: { projects: Project[] }) {
  const map = useMap()

  useEffect(() => {
    if (projects.length === 0) return

    // When the map container is hidden (display:none) its size is 0×0.
    // Calling flyToBounds on a zero-size map makes Leaflet attempt an
    // unproject() that produces NaN coordinates → crash. Skip the call
    // and let the next visibility change re-trigger it naturally.
    const { x, y } = map.getSize()
    if (x === 0 || y === 0) return

    const bounds = L.latLngBounds(
      projects.map((p) => [p.location.latitude, p.location.longitude])
    )

    map.flyToBounds(bounds, {
      padding: [32, 32], // px buffer on all sides
      maxZoom: 10,       // prevent over-zooming on a single project
      duration: 1,       // animation duration in seconds
    })
  }, [projects]) // map is a stable instance — intentionally omitted from deps

  return null
}

// Tells Leaflet the container resized — covers both CSS transitions (panel open/close)
// and arbitrary container size changes (window resize, sidebar toggle, etc.).
function MapResizer({ selectedId }: { selectedId: number | null }) {
  const map = useMap()

  // Panel slide animation: wait for the 300ms CSS transition to finish.
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 320)
    return () => clearTimeout(t)
  }, [selectedId, map])

  // Any other container resize (window resize, viewport change, etc.).
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])

  return null
}

type LeafletMapProps = {
  projects:        Project[]
  onSelectProject: (id: number) => void
  selectedId:      number | null
}

export default function LeafletMap({ projects, onSelectProject, selectedId }: LeafletMapProps) {
  const visibleProjects = selectedId !== null ? projects.filter(p => p.id === selectedId) : projects
  return (
    <MapContainer
      center={[47.5, 13.5]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      zoomControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
      />
      <BoundsFitter projects={visibleProjects} />
      <MapResizer selectedId={selectedId} />
      {visibleProjects.map((project) => {
        const firstTopic = project.filters.topic[0]
        const hex = firstTopic ? (TOPIC_COLORS[firstTopic]?.hex ?? FALLBACK_HEX) : FALLBACK_HEX
        const icon = createPinIcon(hex)
        return (
          <Marker
            key={project.id}
            position={[project.location.latitude, project.location.longitude]}
            icon={icon}
            eventHandlers={{
              click:     () => onSelectProject(project.id),
              mouseover: () => prefetchTilesForLocation(project.location.latitude, project.location.longitude),
            }}
          >
            <Tooltip direction="top" offset={[0, -26]} className="map-pin-tooltip">
              <p className="type-copy-em">{project.title}</p>
              {project.subtitle && <p className="type-small">{project.subtitle}</p>}
            </Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
