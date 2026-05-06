"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowUp, AtSign, ExternalLink, Hammer, MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "@/components/icons"
import { inferBuildAskMode, inferSearchAskBuildMode } from "@/lib/infer-search-ask-build-mode"
import { cn } from "@/lib/utils"
import { useAppSwitcherAskLaunch } from "@/contexts/AppSwitcherLaunchContext"

type ComposerMode = "search" | "ask" | "build"

const TRIPLE_TRACK = "22.5rem"
const TRIPLE_THUMB =
  "h-7 w-[calc((22.5rem-8px)/3)] rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-border/50 transition-transform duration-200 ease-out motion-reduce:transition-none"

/** Reserved height below the composer so the Ask hint can appear without shifting the input. */
const ASK_HINT_SLOT_MIN = "min-h-[5.25rem]"

function AskGenieHintBelowCard() {
  return (
    <div
      className="w-full rounded-md border border-border bg-[#FFF0D3] shadow-[var(--shadow-db-sm)]"
      role="note"
      aria-label="About Ask Genie"
    >
      <div className="flex items-start gap-3 px-4 py-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <img
            src="/genie-promo-icon.svg"
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 select-none"
            draggable={false}
          />
        </div>
        <p className="min-w-0 flex-1 text-pretty text-sm leading-snug text-[#1B2733]">
          <span className="font-semibold">Ask Genie</span> lets you ask questions from all the data across
          your workspace without needing to find data or write SQL queries manually. We will launch Genie
          in a separate tab so you don't lose your place here.
        </p>
      </div>
    </div>
  )
}

export function FullIntegratedWorkspaceHero({
  className,
  annotationComposerLift,
  variant = "default",
  /** When set (Search–Ask–Code), syncs composer text from `?search=` and resets tab lock. */
  urlSearchQuery = "",
  onBuildSubmitOverride,
  heroTitle,
}: {
  className?: string
  /** Lifts only the composer card above the annotation dim layer (Search-Ask + annotations). */
  annotationComposerLift?: boolean
  /** Pill row (`searchAskBuild` \| `gcPane` \| `buildAsk`: Code \| Ask only) vs top line tabs (`searchAskBuildB`). */
  variant?: "default" | "searchAskBuild" | "searchAskBuildB" | "buildAsk" | "gcPane"
  urlSearchQuery?: string
  onBuildSubmitOverride?: (query: string) => void
  /** Main heading above the composer (default: “What would you like to do?”). */
  heroTitle?: string
}) {
  const router = useRouter()
  const pathname = usePathname() ?? ""
  const pageSearchParams = useSearchParams()
  const runAskLaunchSequence = useAppSwitcherAskLaunch()
  const [, startNavTransition] = React.useTransition()
  const [query, setQuery] = React.useState("")
  const [composerMode, setComposerMode] = React.useState<ComposerMode>(() =>
    variant === "buildAsk" ? "build" : "search",
  )
  const modeLockedByUserRef = React.useRef(false)

  const isTriple =
    variant === "searchAskBuild" ||
    variant === "searchAskBuildB" ||
    variant === "buildAsk" ||
    variant === "gcPane"
  const isBuildAsk = variant === "buildAsk"
  const isLineTabsTop = variant === "searchAskBuildB"
  const tripleShellBase =
    variant === "searchAskBuildB"
      ? "/shell/search-ask-build-b"
      : variant === "buildAsk"
        ? "/shell/build-ask"
        : variant === "gcPane"
          ? "/shell/gc-pane"
          : "/shell/search-ask-build"
  const shellBase = isTriple ? tripleShellBase : "/shell/full-integrated"

  React.useEffect(() => {
    if (!isTriple) return
    if (isBuildAsk) return
    setQuery(urlSearchQuery)
    if (urlSearchQuery.trim()) {
      setComposerMode("search")
      modeLockedByUserRef.current = false
    }
  }, [isBuildAsk, isTriple, urlSearchQuery])

  const handleQueryChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value
      setQuery(v)
      if (!isTriple) return
      if (isBuildAsk) {
        if (!v.trim()) {
          modeLockedByUserRef.current = false
          setComposerMode("build")
          return
        }
        if (modeLockedByUserRef.current) return
        setComposerMode(inferBuildAskMode(v))
        return
      }
      if (!v.trim()) {
        modeLockedByUserRef.current = false
        setComposerMode("search")
        return
      }
      if (modeLockedByUserRef.current) return
      setComposerMode(inferSearchAskBuildMode(v))
    },
    [isBuildAsk, isTriple],
  )

  const selectMode = React.useCallback((mode: ComposerMode) => {
    modeLockedByUserRef.current = true
    setComposerMode(mode)
  }, [])

  const trimmed = query.trim()
  const canSubmit = trimmed.length > 0

  /** Fixed textarea box — same footprint before/after search results and across modes. */
  const composerTextareaBoxClass =
    "h-[7.5rem] min-h-[7.5rem] max-h-[7.5rem] overflow-y-auto"

  const submit = React.useCallback(() => {
    if (!canSubmit) return
    const mode =
      isBuildAsk && composerMode === "search" ? ("build" as ComposerMode) : composerMode
    if (mode === "ask") {
      const url = `/shell/onechat/chat?q=${encodeURIComponent(trimmed)}`
      runAskLaunchSequence(() => {
        window.open(url, "_blank", "noopener,noreferrer")
      })
    } else if (mode === "build") {
      if (onBuildSubmitOverride) {
        onBuildSubmitOverride(trimmed)
        return
      }
      if (isTriple) {
        startNavTransition(() => {
          const qs = pageSearchParams?.toString() ?? ""
          const here = pathname && pathname !== "/genie" ? pathname + (qs ? `?${qs}` : "") : ""
          const returnTo = here ? `&returnTo=${encodeURIComponent(here)}` : ""
          const threadFirst = isBuildAsk ? `&gcLaunch=threadFirst` : ""
          router.push(`/genie?q=${encodeURIComponent(trimmed)}${returnTo}${threadFirst}`)
        })
      } else {
        router.push(`${shellBase}?build=${encodeURIComponent(trimmed)}`)
      }
    } else {
      router.push(`${shellBase}?search=${encodeURIComponent(trimmed)}`)
    }
  }, [
    canSubmit,
    composerMode,
    isBuildAsk,
    isTriple,
    onBuildSubmitOverride,
    router,
    shellBase,
    pageSearchParams,
    pathname,
    runAskLaunchSequence,
    startNavTransition,
    trimmed,
  ])

  const handleTextareaKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!isTriple) return
      if (e.key !== "Enter" || e.shiftKey) return
      if (e.nativeEvent.isComposing) return
      e.preventDefault()
      if (!trimmed) return
      submit()
    },
    [isTriple, trimmed, submit],
  )

  const placeholder =
    composerMode === "search"
      ? "Search workspace…"
      : composerMode === "ask"
        ? "Ask anything…"
        : "Describe what to code…"

  const inputAria =
    composerMode === "search"
      ? "Search workspace"
      : composerMode === "ask"
        ? "Ask anything"
        : "Describe what to code"

  return (
    <div className={cn("mx-auto flex w-full max-w-4xl flex-col items-center gap-6", className)}>
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-[28px] md:leading-tight">
        {heroTitle ?? "What would you like to do?"}
      </h1>

      <form
        className="w-full max-w-3xl"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div
          data-full-integrated-annotation-hole=""
          className={cn(
            "flex flex-col gap-0 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.12),0_4px_16px_-4px_rgba(0,0,0,0.06)] ring-1",
            isLineTabsTop
              ? cn("overflow-hidden rounded-[1.25rem] border border-border bg-muted/50 ring-border p-[3px]")
              : cn("rounded-[1.25rem] bg-background ring-border p-5 pb-4"),
            annotationComposerLift && "relative z-[95]",
          )}
        >
          {isLineTabsTop ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[calc(1.25rem-6px)] bg-background shadow-[var(--shadow-db-sm)] ring-1 ring-border/70">
              <div
                data-sab-mode-toggle-line=""
                role="tablist"
                aria-label="Search, Code, or Ask"
                className="flex shrink-0 gap-6 border-b border-border bg-muted/20 px-3 pt-4 sm:px-5"
              >
                {(
                  [
                    { mode: "search" as const, label: "Search" },
                    { mode: "build" as const, label: "Code" },
                    { mode: "ask" as const, label: "Ask" },
                  ] as const
                ).map(({ mode, label }) => {
                  const active = composerMode === mode
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={cn(
                        "relative shrink-0 px-1 pb-3 text-sm outline-none transition-colors",
                        "focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-2",
                        active &&
                          "before:pointer-events-none before:absolute before:inset-x-0 before:-top-[1px] before:h-0.5 before:rounded-[1px] before:bg-primary",
                        active ? "font-semibold text-foreground" : "font-normal text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => selectMode(mode)}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>

              <textarea
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleTextareaKeyDown}
                placeholder={placeholder}
                className={cn(
                  "w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-foreground",
                  "outline-none placeholder:text-muted-foreground focus-visible:ring-0",
                  composerTextareaBoxClass,
                  "px-3 py-4 sm:px-5",
                )}
                aria-label={inputAria}
              />

              <div
                className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Mention" className="text-muted-foreground">
                    <AtSign className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Add" className="text-muted-foreground">
                    <Plus className="size-4" />
                  </Button>
                </div>
                {composerMode === "ask" ? (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    disabled={!canSubmit}
                    className="h-9 shrink-0 gap-2 rounded-full px-4 font-semibold text-foreground"
                  >
                    Ask Genie
                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="icon-sm"
                    disabled={!canSubmit}
                    aria-label={composerMode === "build" ? "Code" : "Search"}
                    className="size-9 shrink-0 rounded-full"
                  >
                    <ArrowUp className="size-4" strokeWidth={2.25} aria-hidden />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <textarea
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleTextareaKeyDown}
                placeholder={placeholder}
                className={cn(
                  "w-full resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground",
                  "outline-none placeholder:text-muted-foreground focus-visible:ring-0",
                  composerTextareaBoxClass,
                )}
                aria-label={inputAria}
              />

              <div
                className="flex flex-wrap items-center justify-between gap-3 border-t border-border mt-4 pt-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {isTriple ? (
                    isBuildAsk ? (
                      <div
                        data-sab-mode-toggle-pill=""
                        role="tablist"
                        aria-label="Code or Ask"
                        className="relative inline-flex h-9 w-[13rem] shrink-0 rounded-full bg-muted/90 p-1 ring-1 ring-border"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute left-1 top-1 h-7 w-[calc((13rem-8px)/2)] rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-border/50 transition-transform duration-200 ease-out motion-reduce:transition-none",
                            composerMode === "ask" && "translate-x-[calc((13rem-8px)/2)]",
                          )}
                        />
                        <button
                          type="button"
                          role="tab"
                          aria-selected={composerMode === "build"}
                          className={cn(
                            "relative z-10 flex flex-1 items-center justify-center gap-1 rounded-full px-1.5 text-sm font-semibold outline-none transition-colors",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            composerMode === "build"
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => selectMode("build")}
                        >
                          <Hammer className="size-3.5 shrink-0 opacity-90" aria-hidden />
                          Code
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={composerMode === "ask"}
                          className={cn(
                            "relative z-10 flex flex-1 items-center justify-center gap-1 rounded-full px-1.5 text-sm font-semibold outline-none transition-colors",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            composerMode === "ask"
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => selectMode("ask")}
                        >
                          <MessageSquare className="size-3.5 shrink-0 opacity-90" aria-hidden />
                          Ask
                        </button>
                      </div>
                    ) : (
                      <div
                        data-sab-mode-toggle-pill=""
                        role="tablist"
                        aria-label="Search, Code, or Ask"
                        className="relative inline-flex h-9 shrink-0 rounded-full bg-muted/90 p-1 ring-1 ring-border"
                        style={{ width: TRIPLE_TRACK }}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute left-1 top-1",
                            TRIPLE_THUMB,
                            composerMode === "search" && "translate-x-0",
                            composerMode === "build" && "translate-x-[calc((22.5rem-8px)/3)]",
                            composerMode === "ask" && "translate-x-[calc((22.5rem-8px)*2/3)]",
                          )}
                        />
                        <button
                          type="button"
                          role="tab"
                          aria-selected={composerMode === "search"}
                          className={cn(
                            "relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-1.5 text-sm font-semibold outline-none transition-colors",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            composerMode === "search"
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => selectMode("search")}
                        >
                          <SearchIcon size={14} className="shrink-0 opacity-90" />
                          Search
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={composerMode === "build"}
                          className={cn(
                            "relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-1.5 text-sm font-semibold outline-none transition-colors",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            composerMode === "build"
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => selectMode("build")}
                        >
                          <Hammer className="size-3.5 shrink-0 opacity-90" aria-hidden />
                          Code
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={composerMode === "ask"}
                          className={cn(
                            "relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-1.5 text-sm font-semibold outline-none transition-colors",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            composerMode === "ask"
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => selectMode("ask")}
                        >
                          <MessageSquare className="size-3.5 shrink-0 opacity-90" aria-hidden />
                          Ask
                        </button>
                      </div>
                    )
                  ) : (
                    <div
                      role="tablist"
                      aria-label="Search or Ask"
                      className="relative inline-flex h-9 w-[13rem] shrink-0 rounded-full bg-muted/90 p-1 ring-1 ring-border"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute left-1 top-1 h-7 w-[calc((13rem-8px)/2)] rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-border/50 transition-transform duration-200 ease-out motion-reduce:transition-none",
                          composerMode === "ask" && "translate-x-[calc((13rem-8px)/2)]",
                        )}
                      />
                      <button
                        type="button"
                        role="tab"
                        aria-selected={composerMode === "search"}
                        className={cn(
                          "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold outline-none transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          composerMode === "search"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => setComposerMode("search")}
                      >
                        <SearchIcon size={16} className="shrink-0 opacity-90" />
                        Search
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={composerMode === "ask"}
                        className={cn(
                          "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold outline-none transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          composerMode === "ask"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => setComposerMode("ask")}
                      >
                        <MessageSquare className="size-4 shrink-0 opacity-90" aria-hidden />
                        Ask
                      </button>
                    </div>
                  )}
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Mention" className="text-muted-foreground">
                    <AtSign className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Add" className="text-muted-foreground">
                    <Plus className="size-4" />
                  </Button>
                </div>
                {composerMode === "ask" ? (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    disabled={!canSubmit}
                    className="h-9 shrink-0 gap-2 rounded-full px-4 font-semibold text-foreground"
                  >
                    Ask Genie
                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="icon-sm"
                    disabled={!canSubmit}
                    aria-label={composerMode === "build" ? "Code" : "Search"}
                    className="size-9 shrink-0 rounded-full"
                  >
                    <ArrowUp className="size-4" strokeWidth={2.25} aria-hidden />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </form>

      <div
        className={cn("w-full max-w-3xl shrink-0", ASK_HINT_SLOT_MIN)}
        aria-hidden={composerMode !== "ask"}
      >
        {composerMode === "ask" ? <AskGenieHintBelowCard /> : null}
      </div>
    </div>
  )
}
