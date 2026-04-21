import { openai } from "@/lib/openai/client"

export const maxDuration = 300

import { buildMessages } from "@/lib/openai/build-messages"
import { retrieveChunks } from "@/lib/supabase/queries/rag"
import { getDocumentList } from "@/lib/supabase/queries/documents"
import { getRecentAlerts, getSitesSummary } from "@/lib/supabase/queries/dashboard"
import type { ChatMessage } from "@/lib/openai/build-messages"

export async function POST(request: Request) {
  const { messages, userInput } = (await request.json()) as {
    messages: ChatMessage[]
    userInput: string
  }

  const [documentList, alerts, sites] = await Promise.all([
    getDocumentList().catch(() => []),
    getRecentAlerts().catch(() => []),
    getSitesSummary().catch(() => []),
  ])

  let ragChunks: { content: string; filename: string }[] = []
  let sourceFilenames: string[] = []

  if (process.env.RAG_ENABLED === "true") {
    try {
      const embeddingRes = await openai.embeddings.create({
        model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
        input: userInput,
      })
      const queryEmbedding = embeddingRes.data[0].embedding
      const chunks = await retrieveChunks(queryEmbedding, 5)
      ragChunks = chunks.map((c) => ({ content: c.content, filename: c.filename }))
      sourceFilenames = [...new Set(chunks.map((c) => c.filename))]
    } catch {
      // RAG failure is non-fatal — proceed without context
    }
  }

  // Fallback for mockup: surface docs from the library when no chunks matched
  if (sourceFilenames.length === 0 && documentList.length > 0) {
    sourceFilenames = documentList.slice(0, 3).map((d) => d.filename)
  }

  const alertContext = alerts.map((a) => ({
    severity: a.severity,
    title: a.title,
    description: a.description,
    site: a.site ? `${a.site.name} (${a.site.city}, ${a.site.state})` : null,
  }))

  const siteContext = sites.map((s) => ({
    name: s.name,
    city: s.city,
    state: s.state,
    compliance_score: s.compliance_score,
    status: s.status,
  }))

  const builtMessages = buildMessages({
    history: messages ?? [],
    userInput,
    ragChunks,
    documentList,
    alerts: alertContext,
    sites: siteContext,
  })

  const stream = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: builtMessages,
    stream: true,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ""
        if (text) controller.enqueue(encoder.encode(text))
      }
      if (sourceFilenames.length > 0) {
        controller.enqueue(encoder.encode(`\n<sources>${sourceFilenames.join("|")}</sources>`))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  })
}
