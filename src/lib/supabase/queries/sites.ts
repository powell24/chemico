import { createClient } from "@/lib/supabase/server"

export type Site = {
  id: string
  name: string
  city: string
  state: string
  country: string
  industry: string
  compliance_score: number
  status: "compliant" | "at_risk" | "non_compliant"
  lat: number | null
  lng: number | null
  open_alerts: number
}

export async function getSites(): Promise<Site[]> {
  const supabase = await createClient()

  const [{ data: sitesData }, { data: alertsData }] = await Promise.all([
    supabase
      .from("sites")
      .select("id, name, city, state, country, industry, compliance_score, status, lat, lng")
      .order("name", { ascending: true }),
    supabase
      .from("compliance_alerts")
      .select("site_id")
      .eq("status", "open"),
  ])

  const alertCountBySite = (alertsData ?? []).reduce<Record<string, number>>((acc, a) => {
    if (a.site_id) acc[a.site_id] = (acc[a.site_id] ?? 0) + 1
    return acc
  }, {})

  return (sitesData ?? []).map((s) => ({
    ...s,
    compliance_score: s.compliance_score ?? 0,
    status: s.status as Site["status"],
    open_alerts: alertCountBySite[s.id] ?? 0,
  }))
}
