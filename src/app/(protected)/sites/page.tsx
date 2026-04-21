import { getSites } from "@/lib/supabase/queries/sites"
import { SitesShell } from "./_components/sites-shell"

export default async function SitesPage() {
  const sites = await getSites()

  const compliant = sites.filter((s) => s.status === "compliant").length
  const atRisk = sites.filter((s) => s.status === "at_risk").length
  const nonCompliant = sites.filter((s) => s.status === "non_compliant").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Sites</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compliance status across {sites.length} managed locations
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Compliant</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{compliant}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">At Risk</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">{atRisk}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Non-Compliant</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{nonCompliant}</p>
        </div>
      </div>

      <SitesShell sites={sites} />
    </div>
  )
}
