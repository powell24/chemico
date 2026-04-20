"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { Site } from "@/lib/supabase/queries/sites"

const SitesMap = dynamic(
  () => import("./sites-map").then((m) => ({ default: m.SitesMap })),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> }
)

interface Props {
  sites: Site[]
  onSiteSelect: (site: Site) => void
}

export function SitesMapDynamic({ sites, onSiteSelect }: Props) {
  return <SitesMap sites={sites} onSiteSelect={onSiteSelect} />
}
