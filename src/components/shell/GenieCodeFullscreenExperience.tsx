"use client"

import { useMemo, useState, useCallback, useEffect, type FormEvent } from "react"
import { motion, useReducedMotion } from "motion/react"
import { AtSign, Check, ExternalLink, ImageIcon, LayoutDashboard, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  sessionAssetsForDemo,
  GenieAssetsAccordion,
  GeniePreviewPanel,
} from "@/components/shell/genie-assets-preview"
import {
  GENIE_CODE_LAUNCH_THREAD_ID,
  GENIE_THREAD_HEADER_TITLE,
  GENIE_THREAD_USER_PROMPT,
  buildLaunchNarrative,
  genieThreadHasArtifacts,
  genieThreadIsSkiDemo,
  titleFromGenieUserQuery,
} from "@/lib/genie-code-launch"
import { SparkleDoubleIcon, PlusIcon, CloseIcon, GenieCodeIcon } from "@/components/icons"
import { DbIcon } from "@/components/ui/db-icon"

type ThreadAppend = { id: string; role: "user" | "assistant"; content: string }

function LiveSessionBody({
  userDisplay,
  isSkiDemo,
  notebookLabel,
  assets,
  appends,
  setActiveAssetId,
}: {
  userDisplay: string
  isSkiDemo: boolean
  notebookLabel: string
  assets: ReturnType<typeof sessionAssetsForDemo>
  appends: ThreadAppend[]
  setActiveAssetId: (id: string | null | ((prev: string | null) => string | null)) => void
}) {
  return (
    <>
      <p className="text-[15px] leading-7 text-foreground">{userDisplay}</p>

      <div className="flex items-start gap-2 text-sm leading-6 text-foreground">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
          <Check className="size-3.5 stroke-[2.5]" aria-hidden />
        </span>
        <p>
          Created notebook <span className="font-semibold">{notebookLabel}</span>.
        </p>
      </div>

      <div className="flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <DbIcon icon={SparkleDoubleIcon} color="ai" size={18} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm leading-6 text-foreground">
            Now I need to make API calls to examine schema and sample the data.
          </p>
          <p className="text-xs text-muted-foreground">2:14 PM</p>
        </div>
      </div>

      <Card className="gap-3 rounded-lg border-border/80 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          {isSkiDemo ? "Key Booking Statistics for Ski Resorts" : "Key metrics from your workspace"}
        </h2>
        {isSkiDemo ? (
          <div className="space-y-3 text-sm leading-6 text-foreground">
            <div>
              <p className="font-medium">Overall Booking Status</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <span className="text-foreground">Pending</span> — $128k across 420 bookings
                </li>
                <li>
                  <span className="text-foreground">Confirmed</span> — $2.1M across 3,240 bookings
                </li>
                <li>
                  <span className="text-foreground">Cancelled</span> — $84k (312 bookings)
                </li>
                <li>
                  <span className="text-foreground">Completed</span> — $4.6M (5,902 bookings)
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Top Ski Resort Destinations</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Lake Tahoe — $1.2M revenue, 1,842 guests</li>
                <li>Aspen — $980k revenue, 1,102 guests</li>
                <li>Park City — $760k revenue, 944 guests</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Summary tables and distributions will appear here as the agent explores your data.
          </p>
        )}
      </Card>

      <Card className="gap-4 rounded-lg border-border/80 p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <PlusIcon className="size-4 text-primary" />
          </div>
          <p className="text-sm leading-6 text-foreground">
            {isSkiDemo
              ? "I’ve completed the EDA and built a Resort Performance Overview dashboard. I need your approval to publish it to the team folder."
              : "I’ve completed the analysis and built a performance overview. I need your approval to publish it to the team folder."}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-full justify-between gap-2 font-normal sm:w-auto"
          onClick={() => {
            const dash = assets.find((a) => a.kind === "dashboard")
            if (dash) setActiveAssetId(dash.id)
          }}
        >
          <span className="flex items-center gap-2">
            <LayoutDashboard className="size-4 shrink-0 text-muted-foreground" />
            {isSkiDemo ? "Resort Performance Overview" : "Performance overview"}
          </span>
          <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </Card>

      {appends.map((m) =>
        m.role === "user" ? (
          <p key={m.id} className="text-[15px] leading-7 text-foreground">
            {m.content}
          </p>
        ) : (
          <p key={m.id} className="text-sm leading-6 text-muted-foreground">
            {m.content}
          </p>
        ),
      )}
    </>
  )
}

export function GenieCodeFullscreenExperience({
  initialMessage,
  onClose,
  className,
  /** Set when opening from build-ask Code (`gcLaunch=threadFirst`). */
  activeThreadId: controlledThreadId,
  launchNarrative,
}: {
  initialMessage: string
  onClose: () => void
  className?: string
  activeThreadId?: string
  launchNarrative?: { thinking: string; answer: string }
}) {
  const [followUp, setFollowUp] = useState("")
  const [appends, setAppends] = useState<ThreadAppend[]>([])
  const threadMode = controlledThreadId != null

  const narrative = useMemo(() => {
    if (launchNarrative) return launchNarrative
    if (threadMode && initialMessage.trim())
      return buildLaunchNarrative(initialMessage)
    return null
  }, [launchNarrative, threadMode, initialMessage])

  const userDisplay = useMemo(() => {
    if (!threadMode) return initialMessage.trim()
    if (controlledThreadId === GENIE_CODE_LAUNCH_THREAD_ID) return initialMessage.trim()
    return (GENIE_THREAD_USER_PROMPT[controlledThreadId!] ?? initialMessage).trim()
  }, [threadMode, controlledThreadId, initialMessage])

  const sessionTitle = useMemo(() => {
    if (!threadMode) return titleFromGenieUserQuery(initialMessage)
    if (controlledThreadId === GENIE_CODE_LAUNCH_THREAD_ID)
      return titleFromGenieUserQuery(initialMessage)
    return GENIE_THREAD_HEADER_TITLE[controlledThreadId!] ?? titleFromGenieUserQuery(initialMessage)
  }, [threadMode, controlledThreadId, initialMessage])

  const hasQuery = threadMode ? userDisplay.length > 0 : initialMessage.trim().length > 0

  const isLaunchThread =
    threadMode &&
    controlledThreadId === GENIE_CODE_LAUNCH_THREAD_ID &&
    narrative != null

  const isSkiDemo = threadMode
    ? genieThreadIsSkiDemo(controlledThreadId!)
    : /ski|resort/i.test(initialMessage)

  const hasArtifacts = threadMode ? genieThreadHasArtifacts(controlledThreadId!) : hasQuery

  const notebookLabel = isSkiDemo ? "Ski Resort Analysis" : "Workspace analysis"

  const assets = useMemo(() => {
    if (!hasQuery) return []
    if (threadMode && !hasArtifacts) return []
    if (!threadMode && !hasQuery) return []
    return sessionAssetsForDemo(isSkiDemo)
  }, [hasQuery, hasArtifacts, isSkiDemo, threadMode])

  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)

  useEffect(() => {
    if (threadMode) {
      setAppends([])
    }
  }, [controlledThreadId, threadMode])

  useEffect(() => {
    if (!hasQuery || assets.length === 0) {
      setActiveAssetId(null)
      return
    }
    setActiveAssetId((cur) => {
      if (cur && assets.some((a) => a.id === cur)) return cur
      return assets[0]?.id ?? null
    })
  }, [hasQuery, assets, controlledThreadId])

  const createdCount = useMemo(
    () => assets.filter((a) => a.status === "created").length,
    [assets],
  )

  const prefersReducedMotion = useReducedMotion()

  const onFollowUp = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const t = followUp.trim()
      if (!t) return
      const id = `a-${Date.now()}`
      setAppends((prev) => [
        ...prev,
        { id, role: "user", content: t },
        {
          id: `${id}-r`,
          role: "assistant",
          content: "Got it — I will continue from here in this session.",
        },
      ])
      setFollowUp("")
    },
    [followUp],
  )

  const panelEnter = prefersReducedMotion
    ? {
        initial: { opacity: 1, x: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, x: 40 },
        transition: {
          type: "spring" as const,
          stiffness: 320,
          damping: 34,
          mass: 0.9,
        },
      }

  return (
    <motion.div
      className={cn(
        "flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-background",
        className,
      )}
      initial={panelEnter.initial}
      animate={{ opacity: 1, x: 0 }}
      transition={panelEnter.transition}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 md:px-6">
        <DbIcon icon={SparkleDoubleIcon} color="ai" size={20} className="shrink-0" />
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold leading-6 text-foreground">
          {sessionTitle}
        </h1>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseIcon className="h-4 w-4" />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:border-r md:border-border/60">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-5 pb-4">
              {!hasQuery ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
                  <DbIcon icon={GenieCodeIcon} color="ai" size={48} />
                  <div className="max-w-sm space-y-2">
                    <p className="text-lg font-semibold text-foreground">Genie Code</p>
                    <p className="text-sm text-muted-foreground">
                      Switch to Build on the workspace home and submit a prompt to open this view with a
                      live session, or describe a task below.
                    </p>
                  </div>
                </div>
              ) : isLaunchThread && narrative ? (
                <>
                  <p className="text-[15px] leading-7 text-foreground">{userDisplay}</p>
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <DbIcon icon={SparkleDoubleIcon} color="ai" size={18} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Thinking
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">{narrative.thinking}</p>
                      <p className="text-xs text-muted-foreground">2:14 PM</p>
                    </div>
                  </div>
                  <Card className="gap-3 rounded-lg border-border/80 p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-foreground">Answer</h2>
                    <p className="text-sm leading-6 text-foreground">{narrative.answer}</p>
                  </Card>
                  {appends.map((m) =>
                    m.role === "user" ? (
                      <p key={m.id} className="text-[15px] leading-7 text-foreground">
                        {m.content}
                      </p>
                    ) : (
                      <p key={m.id} className="text-sm leading-6 text-muted-foreground">
                        {m.content}
                      </p>
                    ),
                  )}
                </>
              ) : (
                <LiveSessionBody
                  userDisplay={threadMode ? userDisplay : initialMessage.trim()}
                  isSkiDemo={isSkiDemo}
                  notebookLabel={notebookLabel}
                  assets={assets}
                  appends={appends}
                  setActiveAssetId={setActiveAssetId}
                />
              )}
            </div>
          </div>

          {hasQuery && assets.length > 0 && (
            <div className="shrink-0 border-t border-border/60 bg-background px-4 py-2 md:px-6">
              <div className="mx-auto max-w-3xl">
                <GenieAssetsAccordion
                  assets={assets}
                  activeId={activeAssetId}
                  onSelectAsset={setActiveAssetId}
                  createdCount={createdCount}
                />
              </div>
            </div>
          )}

          <footer className="shrink-0 border-t border-border bg-background px-4 py-3 md:px-6">
            <form
              onSubmit={onFollowUp}
              className="mx-auto flex max-w-3xl flex-col gap-2 rounded-[24px] border border-border bg-background p-3 shadow-[0px_3px_6px_0px_rgba(0,0,0,0.05)]"
            >
              <Textarea
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder={hasQuery ? "Ask a follow-up…" : "Describe what to build…"}
                rows={1}
                className="min-h-10 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="Add image">
                  <ImageIcon className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="Mention">
                  <AtSign className="size-4" />
                </Button>
                <div className="flex-1" />
                <Select defaultValue="agent">
                  <SelectTrigger size="sm" className="h-8 w-[min(7rem,100%)] border-border bg-secondary/50">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-[200]">
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="ask">Ask</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" size="icon-sm" className="shrink-0" aria-label="Send" disabled={!followUp.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>
            </form>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[12px] leading-4 text-muted-foreground">
              Always review the accuracy of responses.
            </p>
          </footer>
        </div>

        {hasQuery && assets.length > 0 && activeAssetId && (
          <motion.aside
            className="hidden h-full min-h-0 w-[min(100%,680px)] max-w-full shrink-0 flex-col border-t border-border/60 bg-background md:flex md:w-[min(640px,54vw)] md:min-w-[360px] md:max-w-[60%] md:border-l md:border-t-0 lg:w-[min(720px,58%)]"
            initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 36, mass: 0.85, delay: 0.08 }
            }
          >
            <GeniePreviewPanel
              assets={assets}
              activeId={activeAssetId}
              onActiveChange={setActiveAssetId}
              notebookDemoVariant={isSkiDemo ? "ski" : "default"}
            />
          </motion.aside>
        )}
      </div>
    </motion.div>
  )
}
