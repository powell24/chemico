import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaginationControl } from "./pagination-control"
import type { RecentAlert, PaginatedResult } from "@/lib/supabase/queries/dashboard"

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

export function RecentAlertsTable({ result }: { result: PaginatedResult<RecentAlert> }) {
  const { data: alerts, total, page, totalPages } = result
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          Recent Alerts
          <span className="text-xs font-normal text-muted-foreground">
            {total} open
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
            {alerts.map((alert) => (
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
            {alerts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                  No open alerts
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="px-6 pb-4">
          <PaginationControl page={page} totalPages={totalPages} paramKey="alerts_page" />
        </div>
      </CardContent>
    </Card>
  )
}
