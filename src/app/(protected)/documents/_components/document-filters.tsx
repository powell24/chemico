"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DocumentCounts } from "@/lib/supabase/queries/documents"

const TYPES = [
  { value: "sds", label: "SDS — Safety Data Sheet" },
  { value: "msds", label: "MSDS — Material Safety Data Sheet" },
  { value: "sop", label: "SOP — Standard Operating Procedure" },
  { value: "regulation", label: "Regulation" },
  { value: "regulatory", label: "Regulatory" },
  { value: "audit", label: "Audit" },
  { value: "training", label: "Training" },
]

const STATUSES = [
  { value: "ready", label: "Ready" },
  { value: "processing", label: "Processing" },
  { value: "archived", label: "Archived" },
]

interface DocumentFiltersProps {
  sites: { id: string; name: string }[]
  counts: DocumentCounts
  currentType: string
  currentSiteId: string
  currentStatus: string
}

export function DocumentFilters({ sites, counts, currentType, currentSiteId, currentStatus }: DocumentFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const typeLabel = TYPES.find((t) => t.value === currentType)?.label ?? "All Document Types"
  const siteLabel = sites.find((s) => s.id === currentSiteId)?.name ?? "All Sites"
  const statusLabel = STATUSES.find((s) => s.value === currentStatus)?.label ?? "All Statuses"

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Document Type</span>
        <Select value={currentType || "all"} onValueChange={(v) => update("doc_type", v ?? "all")}>
          <SelectTrigger className="w-72 h-9 text-sm">
            <SelectValue>{typeLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Document Types</SelectItem>
            {TYPES.filter((t) => counts.byType[t.value]).map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label} ({counts.byType[t.value]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Site Name</span>
        <Select value={currentSiteId || "all"} onValueChange={(v) => update("site_id", v ?? "all")}>
          <SelectTrigger className="w-64 h-9 text-sm">
            <SelectValue>{siteLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {(() => {
              const withDocs = sites.filter((s) => counts.bySite[s.id])
              const withoutDocs = sites.filter((s) => !counts.bySite[s.id])
              return (
                <>
                  {withDocs.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({counts.bySite[s.id]})
                    </SelectItem>
                  ))}
                  {withDocs.length > 0 && withoutDocs.length > 0 && <SelectSeparator />}
                  {withoutDocs.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </>
              )
            })()}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Status</span>
        <Select value={currentStatus || "all"} onValueChange={(v) => update("status", v ?? "all")}>
          <SelectTrigger className="w-48 h-9 text-sm">
            <SelectValue>{statusLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}{counts.byStatus[s.value] ? ` (${counts.byStatus[s.value]})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
