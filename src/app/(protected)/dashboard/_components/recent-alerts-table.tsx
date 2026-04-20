"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import type { RecentAlert } from "@/lib/supabase/queries/dashboard"

const PAGE_SIZE = 8

const CATEGORY_LABELS: Record<string, string> = {
  sds_missing:        "SDS Missing",
  regulation_change:  "Regulation Change",
  audit_due:          "Audit Due",
  threshold_exceeded: "Threshold Exceeded",
  training_due:       "Training Due",
}

function SeverityBadge({ severity }: { severity: RecentAlert["severity"] }) {
  const styles = {
    critical: "bg-red-100 text-red-700 border-red-200",
    warning:  "bg-amber-100 text-amber-700 border-amber-200",
    info:     "bg-blue-100 text-blue-700 border-blue-200",
  }
  return (
    <Badge variant="outline" className={`capitalize text-xs font-medium ${styles[severity]}`}>
      {severity}
    </Badge>
  )
}

function relativeDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
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

export function RecentAlertsTable({ alerts }: { alerts: RecentAlert[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(alerts.length / PAGE_SIZE))
  const paginated = alerts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const padRows = Math.max(0, PAGE_SIZE - paginated.length)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          Recent Alerts
          <span className="text-xs font-normal text-muted-foreground">
            {alerts.length} open
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="pl-6 w-28">Severity</TableHead>
              <TableHead>Alert</TableHead>
              <TableHead className="hidden md:table-cell">Site</TableHead>
              <TableHead className="hidden lg:table-cell">Category</TableHead>
              <TableHead className="pr-6 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((alert) => (
              <TableRow key={alert.id} className="text-sm">
                <TableCell className="pl-6">
                  <SeverityBadge severity={alert.severity} />
                </TableCell>
                <TableCell className="font-medium max-w-xs">
                  <p className="truncate">{alert.title}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {alert.site
                    ? alert.site.name
                    : <span className="italic">Company-wide</span>}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                  {CATEGORY_LABELS[alert.category] ?? alert.category}
                </TableCell>
                <TableCell className="pr-6 text-right text-xs text-muted-foreground whitespace-nowrap">
                  {relativeDate(alert.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                  No open alerts
                </TableCell>
              </TableRow>
            )}
            {Array.from({ length: padRows }).map((_, i) => (
              <TableRow key={`pad-${i}`} className="pointer-events-none" aria-hidden="true">
                <TableCell className="pl-6">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium invisible">x</span>
                </TableCell>
                <TableCell colSpan={4} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="px-6 pb-4">
            <Pagination className="mt-4">
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
