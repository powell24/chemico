import { createClient } from "@/lib/supabase/server"

export type DashboardMetrics = {
  overallScore: number
  alerts: { critical: number; warning: number; info: number }
  sitesAtRisk: number
  docsPendingReview: number
  totalSites: number
  totalDocuments: number
}

export type RecentAlert = {
  id: string
  severity: "critical" | "warning" | "info"
  category: string
  title: string
  description: string
  status: string
  created_at: string
  site: { name: string; city: string; state: string } | null
}

export type SiteSummary = {
  id: string
  name: string
  city: string
  state: string
  country: string
  industry: string
  compliance_score: number
  status: "compliant" | "at_risk" | "non_compliant"
}

const SEVERITY_WEIGHT = { critical: 0, warning: 1, info: 2 } as const

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()

  const [
    { data: sites },
    { data: openAlerts },
    { count: sitesAtRisk },
    { count: docsPending },
    { count: totalSites },
    { count: totalDocuments },
  ] = await Promise.all([
    supabase.from("sites").select("compliance_score"),
    supabase.from("compliance_alerts").select("severity").eq("status", "open"),
    supabase
      .from("sites")
      .select("*", { count: "exact", head: true })
      .in("status", ["at_risk", "non_compliant"]),
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "processing"),
    supabase.from("sites").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
  ])

  const scores = sites?.map((s) => s.compliance_score ?? 100) ?? []
  const overallScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0

  return {
    overallScore,
    alerts: {
      critical: openAlerts?.filter((a) => a.severity === "critical").length ?? 0,
      warning: openAlerts?.filter((a) => a.severity === "warning").length ?? 0,
      info: openAlerts?.filter((a) => a.severity === "info").length ?? 0,
    },
    sitesAtRisk: sitesAtRisk ?? 0,
    docsPendingReview: docsPending ?? 0,
    totalSites: totalSites ?? 0,
    totalDocuments: totalDocuments ?? 0,
  }
}


export async function getRecentAlerts(): Promise<RecentAlert[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("compliance_alerts")
    .select("id, severity, category, title, description, status, created_at, sites(name, city, state)")
    .eq("status", "open")
    .order("severity", { ascending: true })
    .order("created_at", { ascending: false })

  return (data ?? []).map((alert) => ({
    ...alert,
    severity: alert.severity as RecentAlert["severity"],
    site: Array.isArray(alert.sites)
      ? (alert.sites[0] as { name: string; city: string; state: string } | undefined) ?? null
      : (alert.sites as unknown as { name: string; city: string; state: string } | null) ?? null,
  }))
}

export async function getSitesSummary(): Promise<SiteSummary[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("sites")
    .select("id, name, city, state, country, industry, compliance_score, status")
    .order("compliance_score", { ascending: true })

  return (data ?? []).map((s) => ({
    ...s,
    compliance_score: s.compliance_score ?? 0,
    status: s.status as SiteSummary["status"],
  }))
}
