/**
 * One-shot embedding script for seeded documents.
 * Run with: pnpm embed
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local — used only here,
 * never imported into the browser app.
 */

import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small"
const CHUNK_SIZE = 500

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error("Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

function chunkText(text: string, size: number): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(" "))
  }
  return chunks
}

async function embedChunk(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: text })
  return res.data[0].embedding
}

async function main() {
  console.log("Fetching documents without embeddings…")

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, filename, doc_type, site_id, sites(name)")

  if (error) {
    console.error("Failed to fetch documents:", error.message)
    process.exit(1)
  }

  if (!documents || documents.length === 0) {
    console.log("No documents found.")
    return
  }

  console.log(`Found ${documents.length} documents. Generating embeddings…\n`)

  let totalChunks = 0

  for (const doc of documents) {
    const siteName = Array.isArray(doc.sites)
      ? (doc.sites[0] as any)?.name
      : (doc.sites as any)?.name ?? null

    const rawText = [
      `Document: ${doc.filename}`,
      `Type: ${doc.doc_type}`,
      siteName ? `Site: ${siteName}` : "",
    ].filter(Boolean).join("\n").trim()

    if (!rawText) {
      console.log(`  Skipping "${doc.filename}" — no text content`)
      continue
    }

    const chunks = chunkText(rawText, CHUNK_SIZE)
    console.log(`Processing "${doc.filename}" → ${chunks.length} chunk(s)`)

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i]
      const embedding = await embedChunk(content)

      const { error: insertError } = await supabase
        .from("document_chunks")
        .upsert(
          { document_id: doc.id, content, embedding, chunk_index: i },
          { onConflict: "document_id,chunk_index" }
        )

      if (insertError) {
        console.error(`  Error on chunk ${i}:`, insertError.message)
      } else {
        totalChunks++
        process.stdout.write(`  chunk ${i + 1}/${chunks.length} ✓\r`)
      }
    }
    console.log(`  Done — ${chunks.length} chunk(s) saved`)
  }

  console.log(`\nEmbedding complete. ${totalChunks} total chunks stored.`)
  console.log("Set RAG_ENABLED=true in .env.local to activate retrieval.")
}

main()
