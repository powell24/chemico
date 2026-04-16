import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PaginationControl } from "./pagination-control"
import type { SiteSummary, PaginatedResult } from "@/lib/supabase/queries/dashboard"

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

export function SiteComplianceList({ result }: { result: PaginatedResult<SiteSummary> }) {
  const { data: sites, total, page, totalPages } = result
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          Sites Needing Attention
          <span className="text-xs font-normal text-muted-foreground">
            {total} sites total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sites.map((site) => {
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

        {sites.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No sites found
          </p>
        )}

        <PaginationControl page={page} totalPages={totalPages} paramKey="sites_page" />
      </CardContent>
    </Card>
  )
}
