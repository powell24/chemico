import { getDashboardMetrics, getRecentAlerts, getSitesSummary } from "@/lib/supabase/queries/dashboard"
import { KPICards } from "./_components/kpi-cards"
import { RecentAlertsTable } from "./_components/recent-alerts-table"
import { SiteComplianceList } from "./_components/site-compliance-list"
import { ComplianceTrendChart } from "./_components/compliance-trend-chart"

export default async function DashboardPage() {
  const [metrics, alerts, sites] = await Promise.all([
    getDashboardMetrics(),
    getRecentAlerts(),
    getSitesSummary(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compliance health overview across all {metrics.totalSites} sites
        </p>
      </div>

      <KPICards metrics={metrics} />

      <ComplianceTrendChart />

      <RecentAlertsTable alerts={alerts} />

      <SiteComplianceList sites={sites} />
    </div>
  )
}
