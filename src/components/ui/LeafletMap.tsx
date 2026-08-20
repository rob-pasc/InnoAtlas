import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'

import type { Project } from '../../types/project'
import { TOPIC_COLORS } from '../../config/topicColors'
import mapPinSvg from '../../assets/icons/map-pin.svg?raw'
import { prefetchTilesForLocation } from '../../utils/prefetchTiles'
import { formatProjectTags } from '../../utils/projectTags'
import { useT } from '../../i18n/translations'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// Fix Leaflet's default marker icon in Vite – Leaflet tries to resolve PNG
// assets via webpack's require() at runtime, which doesn't exist in Vite.
// Replacing with empty strings prevents broken-image errors in the console.
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: '', iconRetinaUrl: '', shadowUrl: '' })

const FALLBACK_COLOR = '#000000'

/** Resolve a CSS custom property (HSL channels, e.g. "203 76% 77%") to an
 *  `hsl()` colour string for SVG contexts that can't read CSS variables.
 *  Note: SVG `fill` presentation attributes do NOT parse the space-separated
 *  CSS Color 4 syntax `hsl(H S% L%)` – an invalid value there is ignored, and
 *  the path then inherits `fill="none"` from the parent <svg>, rendering the
 *  pin invisible. Emit the legacy comma-separated form, which SVG accepts. */
function resolveCssColor(token: string): string {
  const channels = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  return channels ? `hsl(${channels.split(/\s+/).join(', ')})` : FALLBACK_COLOR
}

/** SC 1.4.11: the pin's *outline* is what carries the required 3:1 contrast
 *  against the light CartoDB basemap. Three of the four topic fills sit at
 *  1.46–1.69:1 on their own, so relying on the fill would fail today and
 *  re-fail after any future palette swap. */
function createPinIcon(fill: string, stroke: string): L.DivIcon {
  const html = mapPinSvg
    .replace('fill="currentColor"', `fill="${fill}"`)
    .replace('stroke="#000000"', `stroke="${stroke}"`)
  return L.divIcon({
    html,
    className: '',          // removes Leaflet's default white-box styling
    iconSize: [20, 26],     // matches the outline-inset SVG viewBox
    iconAnchor: [10, 25],   // tip of the pin = bottom-center, +1px viewBox inset
    popupAnchor: [0, -25],
  })
}

function BoundsFitter({ projects, reducedMotion }: { projects: Project[]; reducedMotion: boolean }) {
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
      maxZoom: 12,       // prevent over-zooming on a single project - use 10 as a reasonable middle ground
      duration: 1,       // animation duration in seconds
      // prefers-reduced-motion: jump straight to the new bounds. Leaflet's
      // flyTo() falls back to setView() when animation is disabled.
      animate: !reducedMotion,
    })
  }, [projects, reducedMotion]) // map is a stable instance – intentionally omitted from deps

  return null
}

// Tells Leaflet the container resized – covers both CSS transitions (panel open/close)
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

/** Closes the open marker tooltip on Escape — WCAG 1.4.13 "Dismissible". */
function TooltipDismisser() {
  const map = useMap()

  useEffect(() => {
    let open: L.Tooltip | null = null
    const onOpen = (e: L.TooltipEvent) => { open = e.tooltip }
    const onClose = () => { open = null }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !open) return
      open.close()
      open = null
    }

    map.on('tooltipopen', onOpen)
    map.on('tooltipclose', onClose)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      map.off('tooltipopen', onOpen)
      map.off('tooltipclose', onClose)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [map])

  return null
}

/** Grace period before a tooltip closes, long enough for the pointer to travel
 *  from the pin onto the tooltip — WCAG 1.4.13 "Hoverable". */
const TOOLTIP_GRACE_MS = 320

type ProjectMarkerProps = {
  project:  Project
  color:    string
  stroke:   string
  onSelect: (id: number) => void
}

function ProjectMarker({ project, color, stroke, onSelect }: ProjectMarkerProps) {
  const markerRef  = useRef<L.Marker | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const icon = useMemo(() => createPinIcon(color, stroke), [color, stroke])

  // SC 1.4.1 — the pin's fill encodes topic[0]. Repeat the card's tag line here
  // so the topic behind the colour is also available as text. Leaflet opens the
  // tooltip on focus as well as hover and wires aria-describedby to it, so this
  // reaches keyboard and screen-reader users too.
  const t = useT()
  const tags = formatProjectTags(project, t)

  function cancelTooltipClose() {
    if (!closeTimer.current) return
    clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  function scheduleTooltipClose() {
    cancelTooltipClose()
    closeTimer.current = setTimeout(() => markerRef.current?.closeTooltip(), TOOLTIP_GRACE_MS)
  }

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    // Leaflet already makes marker icons focusable (Marker._initIcon sets
    // tabIndex=0 and role="button" when the `keyboard` option is on, which is
    // the default), but it only applies the `alt` option to <img> icons — a
    // DivIcon marker ends up as an unnamed button. Name it after the project.
    marker.getElement()?.setAttribute('aria-label', project.title)

    // Leaflet closes a non-permanent tooltip the instant the pointer leaves the
    // marker (Layer._initTooltipInteractions), so the pointer can never reach
    // the tooltip itself. Drop that handler; scheduleTooltipClose() replaces it
    // with a grace period that the tooltip's own mouseenter cancels.
    marker.off('mouseout', marker.closeTooltip)

    return cancelTooltipClose
  }, [project.title])

  return (
    <Marker
      ref={markerRef}
      position={[project.location.latitude, project.location.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(project.id),
        // Leaflet only wires Enter→activate for markers with a bound *popup*
        // (Layer._onKeyPress, registered inside bindPopup). This marker binds a
        // tooltip, so without this handler the role="button" pin is focusable
        // but inert.
        keydown: (e) => {
          const key = e.originalEvent.key
          if (key !== 'Enter' && key !== ' ') return
          e.originalEvent.preventDefault()
          onSelect(project.id)
        },
        mouseover: () => {
          cancelTooltipClose()
          prefetchTilesForLocation(project.location.latitude, project.location.longitude)
        },
        mouseout: scheduleTooltipClose,
        tooltipopen: (e) => {
          const el = e.tooltip.getElement()
          if (!el) return
          el.addEventListener('mouseenter', cancelTooltipClose)
          el.addEventListener('mouseleave', scheduleTooltipClose)
          // The tooltip is interactive, so it swallows clicks that would
          // otherwise reach the pin. Give it the pin's behaviour.
          el.addEventListener('click', () => onSelect(project.id))
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -27]} className="map-pin-tooltip" interactive>
        <p className="type-copy-em">{project.title}</p>
        {project.subtitle && <p className="type-small">{project.subtitle}</p>}
        {tags && <p className="type-tag mt-1">{tags}</p>}
      </Tooltip>
    </Marker>
  )
}

type LeafletMapProps = {
  projects:        Project[]
  onSelectProject: (id: number) => void
  selectedId:      number | null
}

export default function LeafletMap({ projects, onSelectProject, selectedId }: LeafletMapProps) {
  const visibleProjects = selectedId !== null ? projects.filter(p => p.id === selectedId) : projects
  const reducedMotion = usePrefersReducedMotion()

  // Resolve the pin colours once, rather than per marker per render.
  const { topicColors, pinStroke } = useMemo(() => {
    const resolved: Record<string, string> = {}
    for (const [topic, cfg] of Object.entries(TOPIC_COLORS)) {
      resolved[topic] = resolveCssColor(cfg.token)
    }
    return { topicColors: resolved, pinStroke: resolveCssColor('--ink') }
  }, [])

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
      <BoundsFitter projects={visibleProjects} reducedMotion={reducedMotion} />
      <MapResizer selectedId={selectedId} />
      <TooltipDismisser />
      {visibleProjects.map((project) => {
        const firstTopic = project.filters.topic[0]
        const color = firstTopic ? (topicColors[firstTopic] ?? FALLBACK_COLOR) : FALLBACK_COLOR
        return (
          <ProjectMarker
            key={project.id}
            project={project}
            color={color}
            stroke={pinStroke}
            onSelect={onSelectProject}
          />
        )
      })}
    </MapContainer>
  )
}
