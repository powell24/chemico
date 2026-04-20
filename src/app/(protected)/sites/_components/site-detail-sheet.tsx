"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Site } from "@/lib/supabase/queries/sites"

const STATUS_LABEL: Record<Site["status"], string> = {
  compliant: "Compliant",
  at_risk: "At Risk",
  non_compliant: "Non-Compliant",
}

const STATUS_STYLES: Record<Site["status"], string> = {
  compliant:     "bg-green-100 text-green-700 border-green-200",
  at_risk:       "bg-amber-100 text-amber-700 border-amber-200",
  non_compliant: "bg-red-100 text-red-700 border-red-200",
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  warning:  "bg-amber-100 text-amber-700 border-amber-200",
  info:     "bg-blue-100 text-blue-700 border-blue-200",
}

type Alert = {
  id: string
  title: string
  severity: "critical" | "warning" | "info"
  category: string
}

type Document = {
  id: string
  filename: string
  doc_type: string
  status: string
}

interface Props {
  site: Site | null
  onClose: () => void
}

export function SiteDetailSheet({ site, onClose }: Props) {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!site) {
      setAlerts([])
      setDocuments([])
      return
    }

    setLoading(true)
    const supabase = createClient()

    Promise.all([
      supabase
        .from("compliance_alerts")
        .select("id, title, severity, category")
        .eq("site_id", site.id)
        .eq("status", "open")
        .order("severity", { ascending: true })
        .limit(5),
      supabase
        .from("documents")
        .select("id, filename, doc_type, status")
        .eq("site_id", site.id)
        .order("updated_at", { ascending: false })
        .limit(5),
    ]).then(([alertsRes, docsRes]) => {
      setAlerts((alertsRes.data ?? []) as Alert[])
      setDocuments((docsRes.data ?? []) as Document[])
      setLoading(false)
    })
  }, [site?.id])

  return (
    <Sheet open={!!site} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        {site && (
          <div className="px-6 py-6 flex flex-col gap-5">
            <SheetHeader className="gap-2 p-0">
              <SheetTitle className="text-base leading-snug pr-6">{site.name}</SheetTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{site.industry}</Badge>
                <Badge variant="outline" className={`text-xs ${STATUS_STYLES[site.status]}`}>
                  {STATUS_LABEL[site.status]}
                </Badge>
              </div>
            </SheetHeader>

            <Separator />

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="font-medium">{site.city}, {site.state}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{site.country}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Compliance Score</p>
                <p className="font-medium">{site.compliance_score}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Open Alerts</p>
                <p className="font-medium">{site.open_alerts}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="font-medium">{STATUS_LABEL[site.status]}</p>
              </div>
            </div>

            <Separator />

            {/* Alerts */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Open Alerts</p>
              {loading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : alerts.length === 0 ? (
                <p className="text-xs text-muted-foreground">No open alerts for this site.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-2 rounded-lg border p-3">
                      <Badge variant="outline" className={`text-xs shrink-0 mt-0.5 ${SEVERITY_STYLES[alert.severity]}`}>
                        {alert.severity}
                      </Badge>
                      <div>
                        <p className="text-xs font-medium leading-snug">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Documents */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Documents</p>
              {loading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : documents.length === 0 ? (
                <p className="text-xs text-muted-foreground">No documents linked to this site.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-xs font-medium">{doc.filename}</p>
                        <p className="text-xs text-muted-foreground uppercase">{doc.doc_type}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{doc.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full gap-2 text-sm"
              onClick={() => {
                router.push(
                  `/copilot?q=${encodeURIComponent(`Tell me about the compliance status of ${site.name} in ${site.city}, ${site.state}`)}`
                )
                onClose()
              }}
            >
              <MessageSquare className="h-4 w-4" />
              Ask Copilot about this site
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
