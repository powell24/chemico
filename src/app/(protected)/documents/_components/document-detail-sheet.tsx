"use client"

import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageSquare } from "lucide-react"
import type { Document } from "@/lib/supabase/queries/documents"

const TYPE_LABELS: Record<string, string> = {
  sds: "SDS", msds: "MSDS", sop: "SOP", regulation: "Regulation", regulatory: "Regulatory", audit: "Audit", training: "Training",
}

const STATUS_LABELS: Record<string, string> = {
  ready: "Ready", processing: "Processing", archived: "Archived",
}

const STATUS_STYLES: Record<string, string> = {
  ready:      "bg-green-100 text-green-700 border-green-200",
  processing: "bg-amber-100 text-amber-700 border-amber-200",
  archived:   "bg-gray-100 text-gray-600 border-gray-200",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

interface DocumentDetailSheetProps {
  document: Document | null
  onClose: () => void
}

export function DocumentDetailSheet({ document, onClose }: DocumentDetailSheetProps) {
  const router = useRouter()

  function askCopilot() {
    if (!document) return
    router.push(`/copilot`)
  }

  return (
    <Sheet open={!!document} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        {document && (
          <div className="px-6 py-6 flex flex-col gap-5">
            <SheetHeader className="gap-2 p-0">
              <SheetTitle className="text-base leading-snug pr-6">{document.filename}</SheetTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{TYPE_LABELS[document.doc_type] ?? document.doc_type}</Badge>
                <Badge variant="outline" className={`text-xs ${STATUS_STYLES[document.status]}`}>
                  {STATUS_LABELS[document.status] ?? document.status}
                </Badge>
              </div>
            </SheetHeader>

            <Separator />

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Site</p>
                <p className="font-medium">
                  {document.site ? document.site.name : <span className="text-muted-foreground italic">Company-wide</span>}
                </p>
                {document.site && (
                  <p className="text-xs text-muted-foreground mt-0.5">{document.site.city}, {document.site.state}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pages</p>
                <p className="font-medium">{document.page_count ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">{formatDate(document.updated_at)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Added</p>
                <p className="font-medium">{formatDate(document.created_at)}</p>
              </div>
            </div>

            <Separator />

            <Button onClick={askCopilot} variant="outline" className="w-full gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              Ask Copilot about this document
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
