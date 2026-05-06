"use client"

import { History, MessageSquare, Zap, Plug, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, SidebarOpenIcon, SidebarClosedIcon } from "@/components/icons"
import { PlusIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

export const GENIE_CODE_NEEDS_ATTENTION = [
  {
    id: "eda-ski",
    title: "EDA on ski resort properties",
    subtitle: "Publishing dashboard — awaiting approval",
    time: "3h",
    plus: "+5",
    minus: "-0",
    files: "1 File",
    dot: true,
  },
  {
    id: "security",
    title: "Security audit log review",
    subtitle: "Correlating access patterns across warehouses",
    time: "1d",
    plus: "+12",
    minus: "-2",
    files: "3 Files",
    dot: true,
  },
] as const

export const GENIE_CODE_CHATS = [
  {
    id: "c1",
    title: "Process customer feedback analysis",
    subtitle: "Sentiment tags + theme clustering",
    time: "2d",
    plus: "+3",
    minus: "-0",
    files: "1 File",
  },
  {
    id: "c2",
    title: "Generate marketing content variations",
    subtitle: "A/B copy blocks for email campaign",
    time: "4d",
    plus: "+1",
    minus: "-0",
    files: "2 Files",
  },
  {
    id: "c3",
    title: "Warehouse cost anomaly sweep",
    subtitle: "Job runtime vs. slot hours",
    time: "1w",
    plus: "+8",
    minus: "-1",
    files: "1 File",
  },
] as const

function FileDiffBadges({
  plus,
  minus,
  files,
  compact = false,
}: {
  plus: string
  minus: string
  files: string
  compact?: boolean
}) {
  const chip = compact
    ? "rounded px-1 py-px text-[10px] font-medium tabular-nums leading-none"
    : "rounded px-1.5 py-0.5 text-[11px] font-medium tabular-nums"

  return (
    <div
      className={cn(
        "flex shrink-0 items-center",
        compact ? "gap-0.5 flex-nowrap" : "flex-wrap gap-1",
      )}
    >
      <span
        className={cn(
          chip,
          "text-emerald-800 bg-emerald-600/[0.09] dark:bg-emerald-500/15 dark:text-emerald-100",
        )}
      >
        {plus}
      </span>
      <span
        className={cn(
          chip,
          "text-rose-800 bg-rose-600/[0.08] dark:bg-rose-500/15 dark:text-rose-100",
        )}
      >
        {minus}
      </span>
      <span className={cn(chip, "text-muted-foreground bg-muted/80")}>{files}</span>
    </div>
  )
}

type ThreadRow = {
  title: string
  subtitle: string
  time: string
  plus: string
  minus: string
  files: string
  dot?: boolean
  active?: boolean
}

function GenieThreadRow({
  title,
  subtitle,
  time,
  plus,
  minus,
  files,
  dot,
  active,
  onSelect,
}: ThreadRow & { onSelect?: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      className={cn(
        "h-auto w-full rounded-lg border border-transparent px-2 py-1.5 text-left font-normal shadow-none",
        "flex flex-col items-stretch justify-start gap-0 whitespace-normal hover:text-foreground",
        "hover:border-border/50 hover:bg-muted/40",
        active && "border-primary/15 bg-primary/[0.07] hover:bg-primary/[0.09] hover:border-primary/20",
      )}
    >
      <div className="flex w-full min-w-0 gap-1.5">
        <div className="mt-1 flex size-2 shrink-0 items-center justify-center" aria-hidden>
          {dot ? (
            <span className="size-1.5 shrink-0 rounded-full bg-primary ring-2 ring-primary/20" />
          ) : (
            <span className="size-1.5 shrink-0 rounded-full bg-transparent" />
          )}
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
          <div className="flex min-w-0 items-baseline justify-between gap-2">
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-tight text-foreground">
              {title}
            </span>
            <span className="shrink-0 text-[11px] font-medium tabular-nums leading-none text-muted-foreground">
              {time}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="min-w-0 flex-1 truncate text-[11px] leading-tight text-muted-foreground">
              {subtitle}
            </span>
            <FileDiffBadges compact plus={plus} minus={minus} files={files} />
          </div>
        </div>
      </div>
    </Button>
  )
}

function GenieCodeCollapsedRail({ onExpand }: { onExpand: () => void }) {
  const iconBtn =
    "size-9 shrink-0 rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground"

  return (
    <div
      role="toolbar"
      aria-label="Genie Code (collapsed)"
      className="flex h-full min-h-0 w-full flex-col items-center gap-1 border-b-0 bg-background py-3"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={iconBtn}
        aria-label="Expand Genie Code sidebar"
        onClick={onExpand}
      >
        <SidebarClosedIcon className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" className={iconBtn} aria-label="Chats" onClick={onExpand}>
        <MessageSquare className="size-4" strokeWidth={1.75} />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" className={iconBtn} aria-label="Quick actions" onClick={onExpand}>
        <Zap className="size-4" strokeWidth={1.75} />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" className={iconBtn} aria-label="Connections" onClick={onExpand}>
        <Plug className="size-4" strokeWidth={1.75} />
      </Button>
      <div className="my-2 h-px w-5 shrink-0 bg-border/70" aria-hidden />
      <Button type="button" variant="ghost" size="icon-sm" className={iconBtn} aria-label="New chat" onClick={onExpand}>
        <Pencil className="size-4" strokeWidth={1.75} />
      </Button>
    </div>
  )
}

export function GenieCodeSidebarHeader({ onToggleRail }: { onToggleRail?: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background px-3 py-2.5">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {onToggleRail ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Collapse Genie Code sidebar"
            onClick={onToggleRail}
          >
            <SidebarOpenIcon className="h-4 w-4" />
          </Button>
        ) : null}
        <span className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground">Genie Code</span>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button type="button" variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-foreground" aria-label="History">
          <History className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-foreground" aria-label="Threads">
          <MessageSquare className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

type GenieCodeSidebarProps = {
  open?: boolean
  className?: string
  activeThreadId?: string
  /** Prepend a synthetic thread (e.g. build-ask Code launch). */
  launchThread?: ThreadRow & { id: string }
  onSelectThread?: (id: string) => void
  /** Collapses the entire Genie Code rail (header + nav), same idea as workspace sidebar. */
  onToggleRail?: () => void
}

const navScrollClass = cn(
  "flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto overscroll-contain bg-background px-3 pb-4 pt-3",
  "[&::-webkit-scrollbar]:w-1.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:bg-border/80",
  "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/35",
)

export function GenieCodeSidebarNav({
  open = true,
  className,
  activeThreadId = "eda-ski",
  launchThread,
  onSelectThread,
  onToggleRail,
}: GenieCodeSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden bg-background transition-[width] duration-200 ease-out motion-reduce:transition-none",
        open ? "w-[272px]" : onToggleRail ? "w-14 rounded-tl-md" : "w-0",
        className,
      )}
    >
      {!open && onToggleRail ? <GenieCodeCollapsedRail onExpand={onToggleRail} /> : null}
      {open && (
        <>
          <GenieCodeSidebarHeader onToggleRail={onToggleRail} />
          <nav className={navScrollClass} aria-label="Genie threads">
            <div className="flex shrink-0 flex-col gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-full justify-start gap-2 rounded-lg border-border/80 bg-background px-3 font-medium text-foreground shadow-[var(--shadow-db-sm)] hover:border-border hover:bg-muted/45 hover:text-foreground dark:bg-background dark:hover:bg-muted/30"
              >
                <PlusIcon className="size-4 shrink-0 text-muted-foreground" />
                New Chat
              </Button>

              <div className="relative shrink-0">
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/80" />
                <Input
                  type="search"
                  placeholder="Search threads…"
                  className="h-9 border-border/60 bg-muted/40 py-2 pl-8 pr-3 text-sm shadow-sm placeholder:text-muted-foreground/70 dark:bg-muted/30"
                  aria-label="Search threads"
                />
              </div>
            </div>

            {launchThread && (
              <div className="mt-4 flex shrink-0 flex-col gap-2">
                <h2 className="px-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/90">
                  This session
                </h2>
                <div className="flex flex-col gap-1.5">
                  <GenieThreadRow
                    title={launchThread.title}
                    subtitle={launchThread.subtitle}
                    time={launchThread.time}
                    plus={launchThread.plus}
                    minus={launchThread.minus}
                    files={launchThread.files}
                    dot={launchThread.dot}
                    active={launchThread.id === activeThreadId}
                    onSelect={() => onSelectThread?.(launchThread.id)}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex shrink-0 flex-col gap-2">
              <h2 className="px-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/90">
                Needs attention
              </h2>
              <div className="flex flex-col gap-1.5">
                {GENIE_CODE_NEEDS_ATTENTION.map((row) => (
                  <GenieThreadRow
                    key={row.id}
                    title={row.title}
                    subtitle={row.subtitle}
                    time={row.time}
                    plus={row.plus}
                    minus={row.minus}
                    files={row.files}
                    dot={row.dot}
                    active={row.id === activeThreadId}
                    onSelect={() => onSelectThread?.(row.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex shrink-0 flex-col gap-2">
              <h2 className="px-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/90">
                Chats <span className="font-normal normal-case tracking-normal text-muted-foreground/70">(7)</span>
              </h2>
              <div className="flex flex-col gap-1.5">
                {GENIE_CODE_CHATS.map((row) => (
                  <GenieThreadRow
                    key={row.id}
                    title={row.title}
                    subtitle={row.subtitle}
                    time={row.time}
                    plus={row.plus}
                    minus={row.minus}
                    files={row.files}
                    dot={false}
                    active={row.id === activeThreadId}
                    onSelect={() => onSelectThread?.(row.id)}
                  />
                ))}
              </div>
            </div>
          </nav>
        </>
      )}
    </aside>
  )
}
