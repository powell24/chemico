import { openai } from "@/lib/openai/client"

export const maxDuration = 300
import { buildMessages } from "@/lib/openai/build-messages"
import { retrieveChunks } from "@/lib/supabase/queries/rag"
import { getDocumentList } from "@/lib/supabase/queries/documents"
import type { ChatMessage } from "@/lib/openai/build-messages"

export async function POST(request: Request) {
  const { messages, userInput } = (await request.json()) as {
    messages: ChatMessage[]
    userInput: string
  }

  const documentList = await getDocumentList().catch(() => [])

  let ragChunks: string[] = []

  if (process.env.RAG_ENABLED === "true") {
    try {
      const embeddingRes = await openai.embeddings.create({
        model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
        input: userInput,
      })
      const queryEmbedding = embeddingRes.data[0].embedding
      const chunks = await retrieveChunks(queryEmbedding, 5)
      ragChunks = chunks.map((c) => c.content)
    } catch {
      // RAG failure is non-fatal — proceed without context
    }
  }

  const builtMessages = buildMessages({ history: messages ?? [], userInput, ragChunks, documentList })

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
