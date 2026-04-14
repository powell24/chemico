import { Skeleton } from "@/components/ui/skeleton"

export default function SitesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Sites</h1>
        <p className="text-sm text-muted-foreground mt-1">Compliance status across all 50 Chemico locations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-lg" />
    </div>
  )
}
