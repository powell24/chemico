import { Skeleton } from "@/components/ui/skeleton"

export default function CopilotLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <Skeleton className="w-64 rounded-lg shrink-0" />
      <Skeleton className="flex-1 rounded-lg" />
    </div>
  )
}
