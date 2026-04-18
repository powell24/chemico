"use client"

import { useRef, KeyboardEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SendHorizontal } from "lucide-react"

interface MessageInputProps {
  onSend: (input: string) => void
  disabled: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const value = ref.current?.value.trim()
    if (!value || disabled) return
    ref.current!.value = ""
    ref.current!.style.height = "auto"
    onSend(value)
  }

  return (
    <div className="border-t px-4 py-3 bg-background">
      <div className="flex gap-2 items-end max-w-4xl mx-auto">
        <Textarea
          ref={ref}
          placeholder="Ask about compliance, SDS sheets, regulations…"
          className="min-h-[44px] max-h-36 resize-none text-sm"
          rows={1}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = "auto"
            el.style.height = `${el.scrollHeight}px`
          }}
        />
        <Button
          size="icon"
          onClick={submit}
          disabled={disabled}
          className="shrink-0 h-[44px] w-[44px]"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-1.5">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
