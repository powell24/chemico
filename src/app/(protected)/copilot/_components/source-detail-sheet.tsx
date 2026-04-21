"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

function guessDocType(filename: string): string {
  const lower = filename.toLowerCase()
  if (lower.includes("sds")) return "SDS"
  if (lower.includes("msds")) return "MSDS"
  if (lower.includes("sop")) return "SOP"
  if (lower.includes("audit")) return "Audit"
  if (lower.includes("training")) return "Training"
  if (lower.includes("regulation") || lower.includes("regulatory")) return "Regulatory"
  return "Document"
}

interface SourceDetailSheetProps {
  sources: string[]
  activeIndex: number
  onNavigate: (index: number) => void
  onClose: () => void
}

export function SourceDetailSheet({ sources, activeIndex, onNavigate, onClose }: SourceDetailSheetProps) {
  const filename = sources[activeIndex]
  if (!filename) return null

  const docType = guessDocType(filename)

  return (
    <Sheet open={sources.length > 0} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-xs text-muted-foreground font-medium">
              {sources.length} document{sources.length !== 1 ? "s" : ""} referenced
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onNavigate(activeIndex - 1)}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-[2.5rem] text-center">
                {activeIndex + 1} / {sources.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onNavigate(activeIndex + 1)}
                disabled={activeIndex === sources.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <SheetHeader className="gap-2 p-0">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <SheetTitle className="text-base leading-snug pr-6">{filename}</SheetTitle>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{docType}</Badge>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">Active</Badge>
            </div>
          </SheetHeader>

          <Separator />

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Site</p>
              <p className="font-medium text-muted-foreground italic">Company-wide</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pages</p>
              <p className="font-medium">—</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="font-medium">{docType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="font-medium text-green-700">Active</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
