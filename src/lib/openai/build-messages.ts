import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"

const SYSTEM_PROMPT = `You are the Chemico Compliance Copilot, an AI desk assistant for The Chemico Group — a chemical lifecycle management company operating 50+ locations across the United States.

You help users with anything related to this platform and their work at Chemico, including:
- Navigating and understanding the document library (SDS, MSDS, SOP, regulatory, audit, training docs)
- Answering questions about documents that have been uploaded and their contents
- Compliance topics: OSHA HazCom, EPA SARA, RCRA, VOC thresholds, and other regulations
- Site operations, compliance status, alerts, and audit preparation
- Chemical handling, storage, disposal, and EH&S training requirements
- General questions about how the app works or what data is available

Only refuse if a question is completely unrelated to Chemico, its operations, or this platform (e.g. politics, entertainment, personal advice, coding help unrelated to Chemico).

Guidelines:
- Be concise and specific. Reference regulations by name when relevant.
- When you don't have specific document data, say so clearly rather than guessing.
- Prioritize actionable guidance over general information.
- Format responses with clear structure when answering multi-part questions.`

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export type DocumentListItem = { filename: string; doc_type: string; status: string; site: string | null }

export type BuildMessagesInput = {
  history: ChatMessage[]
  userInput: string
  ragChunks?: string[]
  documentList?: DocumentListItem[]
}

export function buildMessages({ history, userInput, ragChunks, documentList }: BuildMessagesInput): ChatCompletionMessageParam[] {
  let systemContent = SYSTEM_PROMPT

  if (documentList && documentList.length > 0) {
    const lines = documentList.map((d) =>
      `- ${d.filename} [${d.doc_type.toUpperCase()}] — ${d.status}${d.site ? ` — ${d.site}` : ""}`
    )
    systemContent += `\n\nDocument library (${documentList.length} total):\n${lines.join("\n")}`
  }

  if (ragChunks && ragChunks.length > 0) {
    systemContent += `\n\nRelevant document excerpts:\n${ragChunks.join("\n\n")}\n\nAnswer using these excerpts where relevant. Cite the source document name when referencing specific information.`
  }

  return [
    { role: "system", content: systemContent },
    ...history,
    { role: "user", content: userInput },
  ]
}
