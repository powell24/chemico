import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Document Library</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and manage SDS sheets, SOPs, regulatory docs, and audits</p>
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="h-96 rounded-lg" />
    </div>
  )
}
