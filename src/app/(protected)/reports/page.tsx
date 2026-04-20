import { getReports, getBottomSites } from "@/lib/supabase/queries/reports"
import { SaraChart } from "./_components/sara-chart"
import { VocChart } from "./_components/voc-chart"
import { AuditHistoryChart } from "./_components/audit-history-chart"
import { SiteComplianceChart } from "./_components/site-compliance-chart"
import { ReportsList } from "./_components/reports-list"

export default async function ReportsPage() {
  const [reports, bottomSites] = await Promise.all([
    getReports(),
    getBottomSites(8),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          SARA threshold, VOC emissions, audit history, and site compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SaraChart />
        <VocChart />
        <AuditHistoryChart />
        <SiteComplianceChart sites={bottomSites} />
      </div>

      <ReportsList reports={reports} />
    </div>
  )
}
