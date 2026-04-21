import { createClient } from "@/lib/supabase/server"

export type RagChunk = {
  content: string
  document_id: string
  filename: string
  similarity: number
}

export async function retrieveChunks(
  queryEmbedding: number[],
  limit = 5
): Promise<RagChunk[]> {
  if (process.env.RAG_ENABLED !== "true") return []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc("match_document_chunks", {
      query_embedding: queryEmbedding,
      match_count: limit,
    })

    if (error) {
      console.error("RAG retrieval error:", error.message)
      return []
    }

    const chunks = (data ?? []) as { content: string; document_id: string; similarity: number }[]
    if (chunks.length === 0) return []

    const docIds = [...new Set(chunks.map((c) => c.document_id))]
    const { data: docs } = await supabase
      .from("documents")
      .select("id, filename")
      .in("id", docIds)

    const filenameMap = Object.fromEntries((docs ?? []).map((d) => [d.id, d.filename as string]))

    return chunks.map((c) => ({
      ...c,
      filename: filenameMap[c.document_id] ?? "Unknown document",
    }))
  } catch {
    return []
  }
}
