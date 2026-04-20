import { Skeleton } from "@/components/ui/skeleton"

export default function SitesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-56 mt-2" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
      </div>
      <Skeleton className="h-[480px] rounded-lg" />
      <Skeleton className="h-[600px] rounded-lg" />
    </div>
  )
}
