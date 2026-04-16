import { getDashboardMetrics, getRecentAlerts, getSitesSummary } from "@/lib/supabase/queries/dashboard"
import { KPICards } from "./_components/kpi-cards"
import { RecentAlertsTable } from "./_components/recent-alerts-table"
import { SiteComplianceList } from "./_components/site-compliance-list"
import { ComplianceTrendChart } from "./_components/compliance-trend-chart"

interface Props {
  searchParams: Promise<{ alerts_page?: string; sites_page?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams
  const alertsPage = Math.max(1, Number(params.alerts_page) || 1)
  const sitesPage  = Math.max(1, Number(params.sites_page)  || 1)

  const [metrics, alertsResult, sitesResult] = await Promise.all([
    getDashboardMetrics(),
    getRecentAlerts(alertsPage, 8),
    getSitesSummary(sitesPage, 10),
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

      <RecentAlertsTable result={alertsResult} />

      <SiteComplianceList result={sitesResult} />
    </div>
  )
}
