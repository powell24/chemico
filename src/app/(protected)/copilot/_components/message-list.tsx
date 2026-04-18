"use client"

import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import type { ChatMessage } from "@/lib/openai/build-messages"

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}

function AssistantBubble({ content, streaming }: { content: string; streaming?: boolean }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white border border-border px-4 py-3 text-sm">
        <div className="prose prose-sm max-w-none dark:prose-invert
          prose-p:my-1 prose-p:leading-relaxed
          prose-headings:font-semibold prose-headings:my-2
          prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
          prose-strong:font-semibold
          prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5
          prose-ol:my-1 prose-ol:pl-4
          prose-code:text-xs prose-code:bg-background/60 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-background/60 prose-pre:text-xs prose-pre:p-3 prose-pre:rounded-lg
          prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:pl-3 prose-blockquote:italic
          [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {streaming && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-foreground/50 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-tl-sm bg-white border border-border px-4 py-3">
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

interface MessageListProps {
  messages: ChatMessage[]
  streamingContent: string | null
  isLoading: boolean
}

export function MessageList({ messages, streamingContent, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl">⚗️</span>
        </div>
        <div>
          <p className="font-medium text-sm">Chemico Compliance Copilot</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ask me about SDS sheets, compliance regulations, site audits, or chemical handling requirements.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <UserBubble key={i} content={msg.content} />
        ) : (
          <AssistantBubble key={i} content={msg.content} />
        )
      )}
      {streamingContent !== null && (
        <AssistantBubble content={streamingContent} streaming />
      )}
      {isLoading && streamingContent === null && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
