"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import type { Site } from "@/lib/supabase/queries/sites"

function buildPages(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages: (number | "ellipsis")[] = [1]
  if (page > 3) pages.push("ellipsis")
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
  if (page < totalPages - 2) pages.push("ellipsis")
  pages.push(totalPages)
  return pages
}

const STATUS_LABEL: Record<Site["status"], string> = {
  compliant: "Compliant",
  at_risk: "At Risk",
  non_compliant: "Non-Compliant",
}

const STATUS_CLASS: Record<Site["status"], string> = {
  compliant: "bg-green-100 text-green-700",
  at_risk: "bg-amber-100 text-amber-700",
  non_compliant: "bg-red-100 text-red-700",
}

const PAGE_SIZE = 10

interface Props {
  sites: Site[]
  onSiteSelect: (site: Site) => void
}

export function SitesTable({ sites, onSiteSelect }: Props) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (statusFilter === "all") return sites
    return sites.filter((s) => s.status === statusFilter)
  }, [sites, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const padRows = Math.max(0, PAGE_SIZE - paginated.length)

  function handleStatusChange(val: string | null) {
    setStatusFilter(val ?? "all")
    setPage(1)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} site{filtered.length !== 1 ? "s" : ""}
        </p>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="non_compliant">Non-Compliant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Open Alerts</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((site) => (
              <TableRow
                key={site.id}
                className="cursor-pointer"
                onClick={() => onSiteSelect(site)}
              >
                <TableCell>
                  <p className="font-medium text-sm">{site.name}</p>
                  <p className="text-xs text-muted-foreground">{site.city}, {site.state}</p>
                </TableCell>
                <TableCell className="text-sm">{site.industry}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${site.compliance_score}%`,
                          backgroundColor:
                            site.compliance_score >= 80
                              ? "#22c55e"
                              : site.compliance_score >= 60
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{site.compliance_score}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CLASS[site.status]}`}>
                    {STATUS_LABEL[site.status]}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {site.open_alerts > 0 ? (
                    <Badge variant="destructive" className="text-xs">{site.open_alerts}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {Array.from({ length: padRows }).map((_, i) => (
              <TableRow key={`pad-${i}`} className="pointer-events-none" aria-hidden="true">
                <TableCell>
                  <p className="font-medium text-sm invisible">x</p>
                  <p className="text-xs invisible">x</p>
                </TableCell>
                <TableCell colSpan={5} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-1">
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
    </div>
  )
}
