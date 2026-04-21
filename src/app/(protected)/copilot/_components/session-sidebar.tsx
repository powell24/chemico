"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { MessageSquarePlus, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react"
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
  onDeleteSession: (id: string) => void
}

export function SessionSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SessionSidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [confirmSession, setConfirmSession] = useState<ChatSession | null>(null)

  useEffect(() => {
    if (!openMenuId) return
    function handleClick() { setOpenMenuId(null) }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [openMenuId])

  return (
    <>
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
              <div
                key={session.id}
                className={`relative flex items-center rounded-md text-sm transition-colors group ${
                  activeSessionId === session.id
                    ? "bg-background border border-border shadow-sm font-medium"
                    : "hover:bg-muted"
                }`}
              >
                <button
                  onClick={() => onSelectSession(session.id)}
                  className="flex items-start gap-2 min-w-0 flex-1 px-3 py-2 text-left cursor-pointer"
                >
                  <MessageSquare className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${activeSessionId === session.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="min-w-0 flex-1 pr-4">
                    <p className={`truncate text-xs leading-relaxed ${activeSessionId === session.id ? "text-foreground" : ""}`}>{session.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {relativeDate(session.updated_at)}
                    </p>
                  </div>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === session.id ? null : session.id) }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/10 text-muted-foreground transition-all cursor-pointer"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>

                {openMenuId === session.id && (
                  <div className="absolute right-0 top-full mt-0.5 z-50 bg-popover border border-border rounded-md shadow-md w-36 py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmSession(session); setOpenMenuId(null) }}
                      className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!confirmSession} onOpenChange={(open) => !open && setConfirmSession(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this thread?</DialogTitle>
            <DialogDescription>
              This will delete &ldquo;{confirmSession?.title}&rdquo; and all its messages. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 pt-2">
            <DialogClose render={<Button variant="outline" className="flex-1" />}>
              Cancel
            </DialogClose>
            <DialogClose
              render={<Button variant="destructive" className="flex-1 gap-2" />}
              onClick={() => {
                if (confirmSession) onDeleteSession(confirmSession.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
