"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import type { SiteSummary } from "@/lib/supabase/queries/dashboard"

const PAGE_SIZE = 10

const STATUS_STYLES = {
  compliant:     { badge: "bg-green-100 text-green-700 border-green-200", label: "Compliant" },
  at_risk:       { badge: "bg-amber-100 text-amber-700 border-amber-200", label: "At Risk" },
  non_compliant: { badge: "bg-red-100 text-red-700 border-red-200",       label: "Non-Compliant" },
}

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-amber-600"
  return "text-red-600"
}

function buildPages(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages: (number | "ellipsis")[] = [1]
  if (page > 3) pages.push("ellipsis")
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
  if (page < totalPages - 2) pages.push("ellipsis")
  pages.push(totalPages)
  return pages
}

export function SiteComplianceList({ sites }: { sites: SiteSummary[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(sites.length / PAGE_SIZE))
  const paginated = sites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const padRows = Math.max(0, PAGE_SIZE - paginated.length)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          Sites Needing Attention
          <span className="text-xs font-normal text-muted-foreground">
            {sites.length} sites total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paginated.map((site) => {
          const style = STATUS_STYLES[site.status]
          return (
            <div key={site.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{site.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {site.city}, {site.state} · {site.industry}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-bold ${scoreColor(site.compliance_score)}`}>
                      {site.compliance_score}
                    </span>
                    <Badge variant="outline" className={`text-xs ${style.badge}`}>
                      {style.label}
                    </Badge>
                  </div>
                </div>
                <Progress value={site.compliance_score} className="h-1.5" />
              </div>
            </div>
          )
        })}

        {paginated.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No sites found
          </p>
        )}
        {Array.from({ length: padRows }).map((_, i) => (
          <div key={`pad-${i}`} className="flex items-center gap-4" aria-hidden="true">
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium invisible">x</p>
                  <p className="text-xs invisible">x</p>
                </div>
              </div>
              <Progress value={0} className="h-1.5 invisible" />
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <Pagination className="mt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage((p) => p - 1)}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-50 cursor-default" : "cursor-pointer"}
                />
              </PaginationItem>
              {buildPages(page, totalPages).map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p as number)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage((p) => p + 1)}
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? "pointer-events-none opacity-50 cursor-default" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  )
}
