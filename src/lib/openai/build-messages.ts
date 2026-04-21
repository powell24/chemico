import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"

const SYSTEM_PROMPT = `You are Aria, an AI compliance assistant for The Chemico Group — a chemical lifecycle management company operating 50+ locations across the United States.

You help users with anything related to this platform and their work at The Chemico Group, including:
- Navigating and understanding the document library (SDS, MSDS, SOP, regulatory, audit, training docs)
- Answering questions about documents that have been uploaded and their contents
- Compliance topics: OSHA HazCom, EPA SARA, RCRA, VOC thresholds, and other regulations
- Site operations, compliance status, alerts, and audit preparation
- Chemical handling, storage, disposal, and EH&S training requirements
- General questions about how the app works or what data is available

Only refuse if a question is completely unrelated to The Chemico Group, its operations, or this platform (e.g. politics, entertainment, personal advice, coding help unrelated to Chemico).

Guidelines:
- Be concise and specific. Reference regulations by name when relevant.
- When answering from retrieved documents, always cite the source document name.
- If no relevant documents exist for a question, clearly state that no documents in the library address this topic.
- Prioritize actionable guidance over general information.
- Format responses with clear structure when answering multi-part questions.

At the end of every response, suggest 2–3 concise follow-up questions written from the user's perspective — phrased as if the user is asking them, not as if you are offering them. Place them at the very end, formatted exactly like this:
<followups>
Which sites have the most overdue documents?
How do I file a Tier II report for Houston?
</followups>`

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export type DocumentListItem = { filename: string; doc_type: string; status: string; site: string | null }

export type AlertContext = {
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  site: string | null
}

export type SiteContext = {
  name: string
  city: string
  state: string
  compliance_score: number
  status: string
}

type RagChunkInput = { content: string; filename: string }

export type BuildMessagesInput = {
  history: ChatMessage[]
  userInput: string
  ragChunks?: RagChunkInput[]
  documentList?: DocumentListItem[]
  alerts?: AlertContext[]
  sites?: SiteContext[]
}

export function buildMessages({ history, userInput, ragChunks, documentList, alerts, sites }: BuildMessagesInput): ChatCompletionMessageParam[] {
  let systemContent = SYSTEM_PROMPT

  if (sites && sites.length > 0) {
    const lines = sites.map((s) =>
      `- ${s.name}, ${s.city}, ${s.state} — score: ${s.compliance_score}, status: ${s.status}`
    )
    systemContent += `\n\nSites (${sites.length} total):\n${lines.join("\n")}`
  }

  if (alerts && alerts.length > 0) {
    const lines = alerts.map((a) =>
      `- [${a.severity.toUpperCase()}]${a.site ? ` ${a.site}` : ""} — ${a.title}: ${a.description}`
    )
    systemContent += `\n\nOpen compliance alerts (${alerts.length} total):\n${lines.join("\n")}`
  } else if (alerts) {
    systemContent += `\n\nOpen compliance alerts: None currently open.`
  }

  if (documentList && documentList.length > 0) {
    const lines = documentList.map((d) =>
      `- ${d.filename} [${d.doc_type.toUpperCase()}] — ${d.status}${d.site ? ` — ${d.site}` : ""}`
    )
    systemContent += `\n\nDocument library (${documentList.length} total):\n${lines.join("\n")}`
  }

  if (ragChunks && ragChunks.length > 0) {
    const formatted = ragChunks.map((c) => `[Source: ${c.filename}]\n${c.content}`)
    systemContent += `\n\nRelevant document excerpts:\n${formatted.join("\n\n")}\n\nAnswer using these excerpts where relevant. Always cite the source document name when referencing specific information.`
  }

  return [
    { role: "system", content: systemContent },
    ...history,
    { role: "user", content: userInput },
  ]
}
