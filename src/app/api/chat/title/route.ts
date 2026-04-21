import { openai } from "@/lib/openai/client"

export const maxDuration = 300

export async function POST(request: Request) {
  const { userInput, assistantResponse } = (await request.json()) as {
    userInput: string
    assistantResponse: string
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You generate short thread titles for a compliance chat assistant. Given a user question and assistant answer, respond with a concise title of 6 words or fewer that summarizes the topic. No punctuation at the end. No quotes.",
      },
      {
        role: "user",
        content: `Question: ${userInput.slice(0, 300)}\n\nAnswer: ${assistantResponse.slice(0, 500)}`,
      },
    ],
    max_tokens: 20,
    temperature: 0.3,
  })

  const title = completion.choices[0]?.message?.content?.trim() ?? userInput.slice(0, 60)
  return Response.json({ title })
}
