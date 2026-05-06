"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronsLeft, Maximize2, Bug, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DbIcon } from "@/components/ui/db-icon"
import { SuggestionPill } from "@/components/ui/suggestion-pill"
import { cn } from "@/lib/utils"
import { GenieCodeIcon, GearIcon, PlusIcon, OverflowIcon, CloseIcon } from "@/components/icons"
import { GeniePrompt, type GenieTag } from "@/components/ai-elements/genie-prompt"
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageToolbar,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought"
import { ThumbsUpIcon, ThumbsDownIcon, CopyIcon } from "lucide-react"

interface GenieCodePanelProps {
  open: boolean
  onClose: () => void
  className?: string
  /** Richer chrome + markdown assistant replies (GC-pane prototype). */
  appearance?: "default" | "gc-pane"
  /** When set after open, submitted once as a user turn (e.g. Build from workspace hero). */
  pendingUserMessage?: string | null
  onPendingUserMessageConsumed?: () => void
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  thinking?: string
}

const SUGGESTION_CHIPS = [
  "Create automation",
  "What automation is best for my data?",
  "View latest automation",
]

const MOCK_RESPONSES: Record<string, { thinking: string; answer: string }> = {
  default: {
    thinking: "Analyzing the request and checking available data pipelines...",
    answer:
      "I can help with that. Based on your current workspace, you have 3 active pipelines and 2 scheduled workflows. Would you like me to walk you through the options or create a new automation?",
  },
  gcPane: {
    thinking: "Reading notebook metadata and summarizing ownership for this workspace…",
    answer: [
      "```",
      "Current notebook path: /Repos/production/logfood-master",
      "Created at: 2026-03-06T15:54:52.738Z",
      "Object ID: 0123456789abcdef",
      "Object type: NOTEBOOK",
      "```",
      "",
      "The notebook **logfood-analysis** was **created by** `data.analytics@databricks.com`, is **actively maintained**, and reflects key governance milestones for this repository.",
      "",
      "- **Ownership transfer** on **Feb 29, 2024** — primary maintainer updated to the analytics platform team.",
      "- **Last substantive edit** on **Oct 8, 2025** — refresh of lakehouse ingestion steps.",
      "",
      "The notebook analyzes **Databricks One dashboard usage patterns** and related lakehouse metrics so teams can track adoption and tune capacity. Ask for a diff against `main`, owners by domain, or recent job failures tied to this path.",
    ].join("\n"),
  },
}

let msgCounter = 0
function uid() {
  return `msg-${++msgCounter}`
}

export function GenieCodePanel({
  open,
  onClose,
  className,
  appearance = "default",
  pendingUserMessage = null,
  onPendingUserMessageConsumed,
}: GenieCodePanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [tags, setTags] = useState<GenieTag[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastAutoSubmittedKey = useRef<string | null>(null)

  const handleSubmit = useCallback(
    (value: string, _tags?: GenieTag[]) => {
      const text = value.trim()
      if (!text) return

      const userMsg: ChatMessage = { id: uid(), role: "user", content: text }
      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setTags([])
      setIsThinking(true)

      const response =
        appearance === "gc-pane" ? MOCK_RESPONSES.gcPane : MOCK_RESPONSES.default
      setTimeout(() => {
        setIsThinking(false)
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: response.answer,
            thinking: response.thinking,
          },
        ])
      }, appearance === "gc-pane" ? 1100 : 1800)
    },
    [appearance],
  )

  useEffect(() => {
    if (!open) {
      lastAutoSubmittedKey.current = null
    }
  }, [open])

  useEffect(() => {
    if (!open || !pendingUserMessage?.trim()) return
    const key = pendingUserMessage.trim()
    if (lastAutoSubmittedKey.current === key) return
    lastAutoSubmittedKey.current = key
    handleSubmit(key)
    onPendingUserMessageConsumed?.()
  }, [open, pendingUserMessage, handleSubmit, onPendingUserMessageConsumed])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const handleSuggestion = (label: string) => {
    handleSubmit(label)
  }

  const handleNewConversation = () => {
    setMessages([])
    setInput("")
    setTags([])
    setIsThinking(false)
  }

  const isEmpty = messages.length === 0 && !isThinking
  const isGcPane = appearance === "gc-pane"

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col overflow-hidden bg-background",
        open ? (isGcPane ? "min-w-[18rem] w-[min(100vw-4rem,28rem)]" : "w-[360px]") : "w-0",
        className,
      )}
    >
      {open && (
        <>
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              {isGcPane ? (
                <Maximize2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              ) : (
                <ChevronsLeft className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span className="text-[13px] font-semibold leading-5 text-foreground truncate">
                Genie Code
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon-xs" aria-label="New conversation" onClick={handleNewConversation}>
                <PlusIcon className="h-4 w-4" />
              </Button>
              {isGcPane && (
                <Button variant="ghost" size="icon-xs" aria-label="Settings">
                  <GearIcon className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon-xs" aria-label="More options">
                <OverflowIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-xs" aria-label="Close Genie Code" onClick={onClose}>
                <CloseIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto px-3 pt-3">
            {isEmpty ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <div className="flex w-full flex-col items-center gap-4 px-6">
                  <DbIcon icon={GenieCodeIcon} color="ai" size={48} />
                  <div className="flex w-full flex-col items-center gap-2 text-center">
                    <p className="text-xl font-semibold leading-7 text-foreground">Genie Code</p>
                    <p className="text-[13px] leading-5 text-muted-foreground">Run multi-step data and AI tasks</p>
                  </div>
                  <div className="flex w-full flex-wrap justify-center gap-2">
                    {SUGGESTION_CHIPS.map((label) => (
                      <SuggestionPill key={label} onClick={() => handleSuggestion(label)}>
                        {label}
                      </SuggestionPill>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full flex-col gap-4 pb-3">
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <Message key={msg.id} from="user">
                      <MessageContent>{msg.content}</MessageContent>
                    </Message>
                  ) : (
                    <Message key={msg.id} from="assistant">
                      {msg.thinking && (
                        <ChainOfThought>
                          <ChainOfThoughtHeader isStreaming={false}>Thought for a moment</ChainOfThoughtHeader>
                          <ChainOfThoughtContent>
                            <ChainOfThoughtStep label={msg.thinking} />
                          </ChainOfThoughtContent>
                        </ChainOfThought>
                      )}
                      <MessageContent className="pl-3 min-w-0">
                        {isGcPane ? (
                          <MessageResponse className="text-sm">{msg.content}</MessageResponse>
                        ) : (
                          msg.content
                        )}
                      </MessageContent>
                      <MessageToolbar className="pl-3">
                        <MessageActions>
                          <MessageAction tooltip="Copy">
                            <CopyIcon className="h-4 w-4" />
                          </MessageAction>
                          <MessageAction tooltip="Helpful">
                            <ThumbsUpIcon className="h-4 w-4" />
                          </MessageAction>
                          <MessageAction tooltip="Not helpful">
                            <ThumbsDownIcon className="h-4 w-4" />
                          </MessageAction>
                          {isGcPane && (
                            <>
                              <MessageAction tooltip="Regenerate">
                                <RefreshCw className="h-4 w-4" />
                              </MessageAction>
                              <MessageAction tooltip="Report issue">
                                <Bug className="h-4 w-4" />
                              </MessageAction>
                            </>
                          )}
                        </MessageActions>
                      </MessageToolbar>
                    </Message>
                  ),
                )}

                {isThinking && (
                  <Message from="assistant">
                    <ChainOfThought>
                      <ChainOfThoughtHeader isStreaming={true}>Thinking</ChainOfThoughtHeader>
                    </ChainOfThought>
                  </Message>
                )}
              </div>
            )}
          </div>

          <div className="shrink-0 p-3">
            <GeniePrompt
              variant="chat"
              size="small"
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              tags={tags}
              onTagRemove={(id) => setTags((prev) => prev.filter((t) => t.id !== id))}
              modelName={isGcPane ? "Agent" : undefined}
              placeholder={
                isGcPane
                  ? "@ for objects, / for commands, ↑↓ for history"
                  : "Ask Genie Code..."
              }
            />
            <p className="mt-2 text-center text-[12px] leading-4 text-muted-foreground">
              {isGcPane
                ? "Always review the accuracy of responses."
                : "Only use the agent with code and data you trust"}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
