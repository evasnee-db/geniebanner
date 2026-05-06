"use client"

import * as React from "react"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GenieOneChatEntryBanner({ className }: { className?: string }) {
  const [question, setQuestion] = React.useState("")

  const trimmed = question.trim()
  const canSubmit = trimmed.length > 0

  const goToGenie = React.useCallback(() => {
    if (!canSubmit) return
    const url = `/shell/onechat/chat?q=${encodeURIComponent(trimmed)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }, [canSubmit, trimmed])

  return (
    <section
      className={cn(
        "relative flex w-full max-w-4xl flex-col overflow-hidden rounded-md border border-border bg-[#FFF0D3] shadow-[var(--shadow-db-sm)]",
        className,
      )}
      aria-label="Ask Genie"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[#F9B132]/90 [clip-path:polygon(0%_100%,100%_100%,100%_0%,68%_0%)]"
        aria-hidden
      />

      <div className="relative z-[1] flex flex-col gap-5 p-8">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <img
              src="/genie-promo-icon.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 select-none"
              draggable={false}
            />
          </div>
          <h2 className="text-lg font-semibold leading-tight text-[#1B2733]">Ask Genie</h2>
        </div>
        <p className="text-sm leading-5 text-[#1B2733]">
          Genie answers questions from data across your workspace without writing SQL by hand. Type a
          question below to continue in the full Genie experience.
        </p>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            goToGenie()
          }}
        >
          <div
            className={cn(
              "flex flex-col gap-1 rounded-[1.35rem] bg-white p-4 pb-3",
              "shadow-[0_10px_40px_-8px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
              "ring-1 ring-[#E8ECF0]/90 dark:bg-card dark:ring-border",
            )}
          >
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              rows={3}
              className={cn(
                "min-h-[4.5rem] w-full resize-none border-0 bg-transparent p-1 text-sm leading-relaxed text-[#1B2733]",
                "outline-none placeholder:text-[#9AA7B2] focus-visible:ring-0",
                "dark:text-foreground dark:placeholder:text-muted-foreground",
              )}
              aria-label="Your question for Genie"
            />

            <div className="flex items-end justify-end gap-3 pt-1">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={!canSubmit}
                className="h-9 gap-2 rounded-full border-[#D8DEE6] bg-[#EEF0F3] px-4 font-semibold text-[#1B2733] shadow-sm hover:bg-[#E4E7EC] dark:border-border dark:bg-muted dark:hover:bg-muted/80"
              >
                Ask Genie
                <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
