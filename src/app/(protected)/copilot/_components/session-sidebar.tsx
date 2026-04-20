"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageSquarePlus, MessageSquare } from "lucide-react"
import type { ChatSession } from "@/lib/supabase/queries/chat"

function relativeDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

interface SessionSidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onNewChat: () => void
  onSelectSession: (id: string) => void
}

export function SessionSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
}: SessionSidebarProps) {
  return (
    <div className="flex flex-col h-full border-r bg-muted/30">
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-2 text-sm"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-0.5">
          {sessions.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6 px-2">
              No conversations yet
            </p>
          )}
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors group ${
                activeSessionId === session.id
                  ? "bg-background border border-border shadow-sm font-medium"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <MessageSquare className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${activeSessionId === session.id ? "text-primary" : "text-muted-foreground"}`} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-xs leading-relaxed ${activeSessionId === session.id ? "text-foreground" : ""}`}>{session.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {relativeDate(session.updated_at)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
