import { createClient } from "@/lib/supabase/server"

export type RagChunk = {
  content: string
  document_id: string
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

    return (data ?? []) as RagChunk[]
  } catch {
    return []
  }
}
