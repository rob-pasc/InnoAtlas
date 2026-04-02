import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'

// Fix Leaflet's default marker icon in Vite — Leaflet tries to resolve PNG
// assets via webpack's require() at runtime, which doesn't exist in Vite.
// Replacing with empty strings prevents broken-image errors in the console.
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: '', iconRetinaUrl: '', shadowUrl: '' })

export default function LeafletMap() {
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
    </MapContainer>
  )
}
