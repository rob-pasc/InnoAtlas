import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'

import type { Project } from '../../types/project'
import { TOPIC_COLORS } from '../../config/topicColors'
import mapPinSvg from '../../assets/icons/map-pin.svg?raw'

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

    const bounds = L.latLngBounds(
      projects.map((p) => [p.location.latitude, p.location.longitude])
    )

    map.flyToBounds(bounds, {
      padding: [32, 32], // px buffer on all sides
      maxZoom: 10,       // prevent over-zooming on a single project
      duration: 0.6,     // animation duration in seconds
    })
  }, [projects]) // map is a stable instance — intentionally omitted from deps

  return null
}

// Tells Leaflet the container resized after the panel slide animation completes.
function MapResizer({ selectedId }: { selectedId: number | null }) {
  const map = useMap()

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 320) // after 300ms CSS transition
    return () => clearTimeout(t)
  }, [selectedId, map])

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
            eventHandlers={{ click: () => onSelectProject(project.id) }}
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
