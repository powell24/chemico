"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import type { ChatMessage } from "@/lib/openai/build-messages"
import { SourceDetailSheet } from "./source-detail-sheet"

function parseMessage(content: string): { text: string; sources: string[] } {
  let text = content
  const sources: string[] = []

  // Strip follow-ups tag (rendered by chat-shell)
  text = text.replace(/<followups>[\s\S]*?<\/followups>/, "").trim()

  const sourcesMatch = text.match(/<sources>([^<]*)<\/sources>/)
  if (sourcesMatch) {
    sources.push(...sourcesMatch[1].split("|").map((s) => s.trim()).filter(Boolean))
    text = text.replace(/<sources>[^<]*<\/sources>/, "").trim()
  }

  return { text, sources }
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}

function AssistantBubble({
  content,
  streaming,
  onSourceClick,
}: {
  content: string
  streaming?: boolean
  onSourceClick?: (sources: string[], index: number) => void
}) {
  const { text, sources } = parseMessage(content)

  return (
    <div className="flex justify-start flex-col gap-2">
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
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
        {streaming && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-foreground/50 animate-pulse rounded-sm align-middle" />
        )}
        {!streaming && sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground font-medium mb-1.5">Referenced documents</p>
            <div className="flex flex-wrap gap-1">
              {sources.slice(0, 2).map((src, i) => (
                <button
                  key={src}
                  onClick={() => onSourceClick?.(sources, i)}
                  className="text-[10px] text-primary bg-primary/8 hover:bg-primary/15 border border-primary/20 rounded px-1.5 py-0.5 transition-colors cursor-pointer underline-offset-2 hover:underline"
                >
                  {src}
                </button>
              ))}
              {sources.length > 2 && (
                <button
                  onClick={() => onSourceClick?.(sources, 2)}
                  className="text-[10px] text-muted-foreground bg-muted hover:bg-muted/80 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                >
                  +{sources.length - 2} more
                </button>
              )}
            </div>
          </div>
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
  const [sheetSources, setSheetSources] = useState<string[]>([])
  const [sheetIndex, setSheetIndex] = useState(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent, isLoading])

  function handleSourceClick(sources: string[], index: number) {
    setSheetSources(sources)
    setSheetIndex(index)
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl">⚗️</span>
        </div>
        <div>
          <p className="font-medium text-sm">Aria</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ask me about SDS sheets, compliance regulations, site audits, or chemical handling requirements.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <UserBubble key={i} content={msg.content} />
          ) : (
            <AssistantBubble
              key={i}
              content={msg.content}
              onSourceClick={handleSourceClick}
            />
          )
        )}
        {streamingContent !== null && (
          <AssistantBubble content={streamingContent} streaming />
        )}
        {isLoading && streamingContent === null && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <SourceDetailSheet
        sources={sheetSources}
        activeIndex={sheetIndex}
        onNavigate={setSheetIndex}
        onClose={() => setSheetSources([])}
      />
    </>
  )
}
