import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, MapPin, FileText, ShieldCheck } from "lucide-react"
import type { DashboardMetrics } from "@/lib/supabase/queries/dashboard"

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-amber-600"
  return "text-red-600"
}

function scoreLabel(score: number) {
  if (score >= 80) return "Compliant"
  if (score >= 60) return "At Risk"
  return "Non-Compliant"
}

export function KPICards({ metrics }: { metrics: DashboardMetrics }) {
  const { overallScore, alerts, sitesAtRisk, docsPendingReview, totalSites, totalDocuments } = metrics

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Compliance Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-1">
            <span className={`text-4xl font-bold ${scoreColor(overallScore)}`}>
              {overallScore}
            </span>
            <span className="text-sm text-muted-foreground mb-1">/100</span>
          </div>
          <Progress value={overallScore} className="h-1.5" />
          <p className={`text-xs font-medium ${scoreColor(overallScore)}`}>
            {scoreLabel(overallScore)}
          </p>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card className={alerts.critical > 0 ? "border-red-200 bg-red-50/30" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <span className={`text-4xl font-bold ${alerts.critical > 0 ? "text-red-600" : "text-foreground"}`}>
            {alerts.critical}
          </span>
          <p className="text-xs text-muted-foreground">
            {alerts.warning} warning &middot; {alerts.info} info open
          </p>
        </CardContent>
      </Card>

      {/* Sites At Risk */}
      <Card className={sitesAtRisk > 0 ? "border-amber-200 bg-amber-50/30" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Sites At Risk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <span className={`text-4xl font-bold ${sitesAtRisk > 5 ? "text-amber-600" : "text-foreground"}`}>
            {sitesAtRisk}
          </span>
          <p className="text-xs text-muted-foreground">
            of {totalSites} total sites
          </p>
        </CardContent>
      </Card>

      {/* SDS Pending Review */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SDS Pending Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <span className="text-4xl font-bold text-foreground">
            {docsPendingReview}
          </span>
          <p className="text-xs text-muted-foreground">
            of {totalDocuments} total documents
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
