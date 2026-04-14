import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">SARA threshold, VOC, audit history, and site compliance reports</p>
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
