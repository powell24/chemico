import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentsLoading() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-9 w-36 rounded-lg" />)}
      </div>
      <Skeleton className="h-[500px] rounded-lg" />
    </div>
  )
}
