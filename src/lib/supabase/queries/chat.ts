import { createClient } from "@/lib/supabase/client"
import type { ChatMessage } from "@/lib/openai/build-messages"

export type ChatSession = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export type ChatMessageRow = {
  id: string
  session_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export async function createSession(title: string): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ title })
    .select("id")
    .single()
  if (error) throw new Error(error.message)
  return data.id
}

export async function getSessions(): Promise<ChatSession[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, updated_at")
    .order("updated_at", { ascending: false })
  return data ?? []
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
  return (data ?? []) as ChatMessage[]
}

export async function updateSessionTitle(sessionId: string, title: string): Promise<void> {
  const supabase = createClient()
  await supabase.from("chat_sessions").update({ title }).eq("id", sessionId)
}

export async function saveMessage({
  sessionId,
  role,
  content,
}: {
  sessionId: string
  role: "user" | "assistant"
  content: string
}): Promise<void> {
  const supabase = createClient()
  await supabase.from("chat_messages").insert({ session_id: sessionId, role, content })
  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId)
}
