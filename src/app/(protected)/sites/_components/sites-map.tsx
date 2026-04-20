"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import type { Site } from "@/lib/supabase/queries/sites"

const STATUS_COLOR: Record<Site["status"], string> = {
  compliant: "#22c55e",
  at_risk: "#f59e0b",
  non_compliant: "#ef4444",
}

interface Props {
  sites: Site[]
  onSiteSelect: (site: Site) => void
}

export function SitesMap({ sites, onSiteSelect }: Props) {
  const mappable = sites.filter((s) => s.lat !== null && s.lng !== null)

  return (
    <MapContainer
      center={[38, -96]}
      zoom={4}
      minZoom={3}
      maxZoom={12}
      maxBounds={[[14, -130], [52, -60]]}
      maxBoundsViscosity={1.0}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mappable.map((site) => (
        <CircleMarker
          key={site.id}
          center={[site.lat!, site.lng!]}
          radius={10}
          pathOptions={{
            color: STATUS_COLOR[site.status],
            fillColor: STATUS_COLOR[site.status],
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ minWidth: 200 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{site.name}</p>
              <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{site.city}, {site.state}</p>
              <p style={{ fontSize: 11, marginBottom: 2 }}>Industry: {site.industry}</p>
              <p style={{ fontSize: 11, marginBottom: 2 }}>
                Score: <strong>{site.compliance_score}%</strong>
              </p>
              <p style={{ fontSize: 11, marginBottom: 8 }}>
                Open Alerts: <strong>{site.open_alerts}</strong>
              </p>
              <button
                onClick={() => onSiteSelect(site)}
                style={{
                  fontSize: 11,
                  background: "#1a3a2a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 10px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                View Details →
              </button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
