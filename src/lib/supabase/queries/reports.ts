import { createClient } from "@/lib/supabase/server"
import { withCache, CACHE_KEYS, TTL } from "@/lib/cache/redis"

export type Report = {
  id: string
  report_type: "sara_threshold" | "voc" | "audit_history" | "site_compliance"
  title: string
  period_start: string | null
  period_end: string | null
  status: "generating" | "ready" | "failed"
  created_at: string
}

export async function getReports(): Promise<Report[]> {
  return withCache(CACHE_KEYS.reports, TTL.reports, async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from("reports")
      .select("id, report_type, title, period_start, period_end, status, created_at")
      .order("created_at", { ascending: false })

    return (data ?? []).map((r) => ({
      ...r,
      report_type: r.report_type as Report["report_type"],
      status:      r.status as Report["status"],
    }))
  })
}

export type SiteScoreSample = {
  name: string
  score: number
}

export async function getBottomSites(limit = 10): Promise<SiteScoreSample[]> {
  return withCache(CACHE_KEYS.bottomSites(limit), TTL.sites, async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from("sites")
      .select("name, compliance_score")
      .order("compliance_score", { ascending: true })
      .limit(limit)

    return (data ?? []).map((s) => ({
      name: s.name.replace(/ (Automotive|Aerospace|Electronics|Biopharma|Defense|Manufacturing|Distribution|Industrial|Chemical|Government|Research|Operations|Campus|Center|Hub|Plant|Lab|Works|Depot|Base|Facility|Complex|Park|Division|Services|Institute).*/, ""),
      score: s.compliance_score ?? 0,
    }))
  })
}
