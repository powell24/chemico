"use client"

import { useState, useCallback } from "react"
import type { ChatMessage } from "@/lib/openai/build-messages"
import { createSession, saveMessage, updateSessionTitle } from "@/lib/supabase/queries/chat"

export function useChat(initialSessionId: string | null = null) {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSession = useCallback((id: string, history: ChatMessage[]) => {
    setSessionId(id)
    setMessages(history)
    setStreamingContent(null)
    setError(null)
  }, [])

  const resetSession = useCallback(() => {
    setSessionId(null)
    setMessages([])
    setStreamingContent(null)
    setError(null)
  }, [])

  const sendMessage = useCallback(async (userInput: string) => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    const userMessage: ChatMessage = { role: "user", content: userInput }
    const updatedHistory = [...messages, userMessage]
    setMessages(updatedHistory)

    let activeSessionId = sessionId

    try {
      if (!activeSessionId) {
        const title = userInput.slice(0, 60) + (userInput.length > 60 ? "…" : "")
        activeSessionId = await createSession(title)
        setSessionId(activeSessionId)
      }

      await saveMessage({ sessionId: activeSessionId, role: "user", content: userInput })

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedHistory.slice(0, -1), userInput }),
      })

      if (!res.ok || !res.body) throw new Error("Failed to get response")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""
      setStreamingContent("")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value, { stream: true })
        setStreamingContent(assistantContent)
      }

      const assistantMessage: ChatMessage = { role: "assistant", content: assistantContent }
      setMessages((prev) => [...prev, assistantMessage])
      setStreamingContent(null)

      await saveMessage({ sessionId: activeSessionId, role: "assistant", content: assistantContent })

      // Generate a summary title after the first exchange
      if (!sessionId) {
        fetch("/api/chat/title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInput, assistantResponse: assistantContent }),
        })
          .then((r) => r.json())
          .then(({ title }) => updateSessionTitle(activeSessionId!, title))
          .catch(() => {})
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setStreamingContent(null)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages, sessionId])

  return { sessionId, messages, streamingContent, isLoading, error, sendMessage, loadSession, resetSession }
}
