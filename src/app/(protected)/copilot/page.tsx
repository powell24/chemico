import { Skeleton } from "@/components/ui/skeleton"

export default function CopilotPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">AI Copilot</h1>
        <p className="text-sm text-muted-foreground mt-1">Ask plain-English questions about compliance, SDS, and regulations</p>
      </div>
      <Skeleton className="h-[600px] rounded-lg" />
    </div>
  )
}
