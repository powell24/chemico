"use client"

import { useState } from "react"
import { SitesMapDynamic } from "./sites-map-dynamic"
import { SitesTable } from "./sites-table"
import { SiteDetailSheet } from "./site-detail-sheet"
import type { Site } from "@/lib/supabase/queries/sites"

interface Props {
  sites: Site[]
}

export function SitesShell({ sites }: Props) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)

  return (
    <>
      <div className="h-[480px] rounded-lg overflow-hidden border" style={{ isolation: "isolate" }}>
        <SitesMapDynamic sites={sites} onSiteSelect={setSelectedSite} />
      </div>

      <SitesTable sites={sites} onSiteSelect={setSelectedSite} />

      <SiteDetailSheet site={selectedSite} onClose={() => setSelectedSite(null)} />
    </>
  )
}
