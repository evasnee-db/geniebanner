"use client"

import * as React from "react"
import { ChevronDown, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SearchIcon } from "@/components/icons"

const MOCK_REPLY =
  "The 'Genie Code Product Integrations' dashboard seems focused on internal product quality/integrations, not customer usage. Let me look at the more relevant dashboards and tables. The knowledge snippets point to **main.data_product_features.customer_metrics** as the key table for customer-level Genie Code usage…"

function truncateTitle(s: string, max = 42) {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

export function GenieChatView({ initialQuery = "" }: { initialQuery?: string }) {
  const initialQ = initialQuery.trim()
  const [draft, setDraft] = React.useState("")

  const title = initialQ ? truncateTitle(initialQ) : "New chat"

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2">
        <h1 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{title}</h1>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Delete chat" type="button">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden gap-1 px-2 sm:flex" type="button">
            <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
            <span className="text-sm">Auto</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Chat settings" type="button">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6">
        {initialQ ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="flex justify-end">
              <div className="max-w-[min(100%,28rem)] rounded-2xl bg-secondary px-4 py-2.5 text-sm leading-relaxed text-foreground">
                {initialQ}
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
              <details open className="group rounded-md border border-border bg-muted/30">
                <summary className="cursor-pointer select-none px-3 py-2 text-sm font-semibold text-foreground marker:text-muted-foreground">
                  Thinking…
                </summary>
                <div className="border-t border-border px-3 py-2 text-hint text-muted-foreground">
                  Searching dashboards, tables, and knowledge snippets…
                </div>
              </details>
              <div className="space-y-3">
                <p className="whitespace-pre-wrap">{MOCK_REPLY}</p>
                <p className="flex items-center gap-2 text-hint text-muted-foreground">
                  <SearchIcon size={14} className="shrink-0" />
                  Found 20 results for &apos;Genie Code customer usage metrics&apos;
                </p>
                <Button
                  variant="secondary"
                  size="xs"
                  type="button"
                  className="h-auto max-w-full justify-start py-1 text-left font-normal"
                >
                  <span className="truncate text-hint">
                    databricks_assistant_message_chat_window › customer_metrics
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-sm text-muted-foreground">Start by typing a question below.</p>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-border bg-background px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          <div className="flex items-end gap-2 rounded-md border border-border bg-background p-2 shadow-xs">
            <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label="Add context" type="button">
              <span className="text-lg leading-none text-muted-foreground">+</span>
            </Button>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask a question…"
              rows={1}
              className="min-h-8 flex-1 resize-none border-0 bg-transparent p-1.5 shadow-none focus-visible:ring-0"
            />
            <Button variant="secondary" size="icon-sm" className="shrink-0" aria-label="Send" type="button">
              <span className="text-xs font-semibold">↑</span>
            </Button>
          </div>
          <p className="text-center text-hint text-muted-foreground">Always review the accuracy of responses.</p>
        </div>
      </footer>
    </div>
  )
}
