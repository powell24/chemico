"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Report } from "@/lib/supabase/queries/reports"

const TYPE_LABELS: Record<Report["report_type"], string> = {
  sara_threshold:  "SARA Threshold",
  voc:             "VOC Emissions",
  audit_history:   "Audit History",
  site_compliance: "Site Compliance",
}

const STATUS_STYLES: Record<Report["status"], string> = {
  ready:      "bg-green-100 text-green-700 border-green-200",
  generating: "bg-amber-100 text-amber-700 border-amber-200",
  failed:     "bg-red-100 text-red-700 border-red-200",
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function formatPeriod(start: string | null, end: string | null) {
  if (!start || !end) return "—"
  return `${formatDate(start)} – ${formatDate(end)}`
}

interface Props {
  reports: Report[]
}

export function ReportsList({ reports }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Report History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Generated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium text-sm">{r.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{TYPE_LABELS[r.report_type]}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatPeriod(r.period_start, r.period_end)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${STATUS_STYLES[r.status]}`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(r.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
