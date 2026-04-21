"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { CornerDownRight } from "lucide-react"
import { SessionSidebar } from "./session-sidebar"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { useChat } from "@/hooks/use-chat"
import { getSessions, getSessionMessages, deleteSession } from "@/lib/supabase/queries/chat"
import type { ChatSession } from "@/lib/supabase/queries/chat"

const PROMPT_SUGGESTIONS = [
  "Which sites have open critical compliance alerts?",
  "Summarize the SDS requirements for our chemical inventory.",
  "What VOC thresholds apply under the Clean Air Act?",
  "Which sites are due for an audit in the next 30 days?",
]

const STORAGE_KEY = "copilot_session_id"
let hasInitialized = false

function parseFollowUps(content: string): string[] {
  const match = content.match(/<followups>([\s\S]*?)<\/followups>/)
  if (!match) return []
  return match[1].trim().split("\n").map((s) => s.trim()).filter(Boolean)
}

export function ChatShell() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loadingSession, setLoadingSession] = useState(false)

  const { sessionId, messages, streamingContent, isLoading, error, sendMessage, loadSession, resetSession } =
    useChat()

  const refreshSessions = useCallback(() => {
    getSessions().then(setSessions)
  }, [])

  useEffect(() => {
    refreshSessions()
    if (!hasInitialized) {
      hasInitialized = true
      sessionStorage.removeItem(STORAGE_KEY)
      return
    }
    const savedId = sessionStorage.getItem(STORAGE_KEY)
    if (savedId) {
      setLoadingSession(true)
      getSessionMessages(savedId)
        .then((history) => loadSession(savedId, history))
        .catch(() => sessionStorage.removeItem(STORAGE_KEY))
        .finally(() => setLoadingSession(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (sessionId) {
      sessionStorage.setItem(STORAGE_KEY, sessionId)
    }
  }, [sessionId])

  const handleSelectSession = useCallback(async (id: string) => {
    if (id === sessionId) return
    setLoadingSession(true)
    try {
      const history = await getSessionMessages(id)
      loadSession(id, history)
    } finally {
      setLoadingSession(false)
    }
  }, [sessionId, loadSession])

  const handleNewChat = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    resetSession()
  }, [resetSession])

  const handleSend = useCallback(async (input: string) => {
    await sendMessage(input)
    refreshSessions()
  }, [sendMessage, refreshSessions])

  const handleDeleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (id === sessionId) {
      sessionStorage.removeItem(STORAGE_KEY)
      resetSession()
    }
    deleteSession(id).catch(() => refreshSessions())
  }, [sessionId, resetSession, refreshSessions])

  const followUps = useMemo(() => {
    if (isLoading || loadingSession || streamingContent !== null) return []
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
    if (!lastAssistant) return []
    return parseFollowUps(lastAssistant.content)
  }, [messages, isLoading, loadingSession, streamingContent])

  const busy = isLoading || loadingSession

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6">
      <div className="w-60 shrink-0">
        <SessionSidebar
          sessions={sessions}
          activeSessionId={sessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="border-b px-6 py-3 shrink-0">
          <h1 className="text-sm font-semibold text-primary">Compliance Copilot</h1>
        </div>

        <MessageList
          messages={messages}
          streamingContent={streamingContent}
          isLoading={busy}
        />

        {error && (
          <p className="text-xs text-red-500 text-center px-4 pb-1">{error}</p>
        )}

        {messages.length === 0 && !busy && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 justify-center max-w-4xl mx-auto w-full">
            {PROMPT_SUGGESTIONS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-xs border border-border rounded-full px-3 py-1.5 bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {followUps.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 max-w-4xl mx-auto w-full">
            {followUps.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="flex items-center gap-1.5 text-xs border border-primary/30 rounded-full px-3 py-1.5 bg-background hover:bg-primary/5 hover:border-primary/60 transition-colors text-primary/80 hover:text-primary cursor-pointer text-left"
              >
                <CornerDownRight className="h-3 w-3 shrink-0" />
                {q}
              </button>
            ))}
          </div>
        )}

        <MessageInput onSend={handleSend} disabled={busy} />
      </div>
    </div>
  )
}
