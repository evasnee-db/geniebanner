"use client"

import * as React from "react"
import { ChevronRightIcon } from "@/components/icons"
import { DbIcon } from "@/components/ui/db-icon"
import { NewButton } from "./NewButton"
import {
  NotebookIcon,
  ClockIcon,
  CatalogIcon,
  WorkflowsIcon,
  CloudIcon,
  StorefrontIcon,
  QueryEditorIcon,
  QueryIcon,
  BarChartIcon,
  AssistantIcon,
  NotificationIcon,
  HistoryIcon,
  DatabaseIcon,
  RunIcon,
  IngestionIcon,
  PipelineIcon,
  SparkleDoubleIcon,
  BeakerIcon,
  LayerIcon,
  ModelsIcon,
  PlayCircleIcon,
  CompassIcon,
  HomeIcon,
  AppIcon,
  DomainsIcon,
  CalendarClockIcon,
  PencilFillIcon,
  SearchIcon,
  GenieCodeIcon,
} from "@/components/icons"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDemoExperienceBarChrome } from "@/contexts/DemoExperienceBarContext"
import { GENIE_CHAT_HISTORY_EXAMPLES } from "./genie-chat-nav"

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  id: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>
  iconColor?: "default" | "muted" | "primary" | "ai"
  href?: string
}

type NavSection = {
  label?: string
  items: NavItem[]
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { id: "home",         label: "Home",         icon: HomeIcon,       href: "/shell" },
      {
        id: "genie-code",
        label: "Genie Code",
        icon: GenieCodeIcon,
        href: "/genie",
      },
      { id: "workspace",   label: "Workspace",   icon: NotebookIcon,   href: "/workspace" },
      { id: "recents",     label: "Recents",     icon: ClockIcon },
      { id: "catalog",     label: "Catalog",     icon: CatalogIcon,    href: "/catalog" },
      { id: "workflows",   label: "Workflows",   icon: WorkflowsIcon,  href: "/jobs" },
      { id: "compute",     label: "Compute",     icon: CloudIcon,      href: "/compute" },
      { id: "discover",    label: "Discover",    icon: CompassIcon,  href: "/discover" },
      { id: "marketplace", label: "Marketplace", icon: StorefrontIcon },
    ],
  },
  {
    label: "SQL",
    items: [
      { id: "sql-editor",     label: "SQL Editor",     icon: QueryEditorIcon, href: "/sql" },
      { id: "queries",        label: "Queries",        icon: QueryIcon },
      { id: "dashboards",     label: "Dashboards",     icon: BarChartIcon,   href: "/dashboards" },
      { id: "alerts",         label: "Alerts",         icon: NotificationIcon },
      { id: "query-history",  label: "Query History",  icon: HistoryIcon },
      { id: "sql-warehouses", label: "SQL Warehouses", icon: DatabaseIcon },
    ],
  },
  {
    label: "Data Engineering",
    items: [
      { id: "job-runs",       label: "Job Runs",       icon: RunIcon },
      { id: "data-ingestion", label: "Data Ingestion", icon: IngestionIcon },
      { id: "pipelines",      label: "Pipelines",      icon: PipelineIcon },
    ],
  },
  {
    label: "Machine Learning",
    items: [
      { id: "playground",  label: "Playground",  icon: SparkleDoubleIcon },
      { id: "experiments", label: "Experiments", icon: BeakerIcon },
      { id: "features",    label: "Features",    icon: LayerIcon },
      { id: "models",      label: "Models",      icon: ModelsIcon },
      { id: "serving",     label: "Serving",     icon: PlayCircleIcon },
    ],
  },
]

/** Slim workspace nav for Genie full-page chat (matches product screenshot density). */
const GENIE_CHAT_WORKSPACE_NAV: NavItem[] = [
  { id: "genie-home", label: "Home", icon: HomeIcon, href: "/shell" },
  { id: "dashboards", label: "Dashboards", icon: BarChartIcon, href: "/dashboards" },
  { id: "genie-spaces", label: "Genie spaces", icon: AssistantIcon, href: "/shell/onechat" },
  { id: "apps", label: "Apps", icon: AppIcon },
  { id: "domains", label: "Domains", icon: DomainsIcon },
  { id: "scheduled-tasks", label: "Scheduled tasks", icon: CalendarClockIcon, href: "/jobs" },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface SidebarProps {
  open?: boolean
  activeItem?: string
  onNavigate?: (id: string) => void
  className?: string
  /** Genie chat page: short workspace links + new chat / history (no SQL/ML sections). */
  variant?: "default" | "genie-chat"
  /** Current chat title for the history list (Genie chat variant). */
  genieChatTitle?: string
  /** Override Home link in Genie-style sidebar (e.g. promo Genie home preview). */
  genieChatHomeHref?: string
}

const navScrollClass = cn(
  "flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-2",
  "[&::-webkit-scrollbar]:w-[5px]",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:bg-border",
  "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40",
)

export function Sidebar({
  open = true,
  activeItem = "workspace",
  onNavigate,
  className,
  variant = "default",
  genieChatTitle = "New chat",
  genieChatHomeHref,
}: SidebarProps) {
  // Labelled sections are collapsible; start all expanded
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({})

  const demoExperienceBarChrome = useDemoExperienceBarChrome()

  const toggleSection = (label: string) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }))

  if (variant === "genie-chat") {
    return (
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col bg-secondary transition-all duration-200 overflow-hidden",
          open ? "w-[200px]" : "w-0",
          className,
        )}
      >
        <nav className={navScrollClass} aria-label="Workspace and chats">
          <div className="flex flex-col gap-0.5 pt-1">
            {GENIE_CHAT_WORKSPACE_NAV.map((item) => {
              const navItem =
                item.id === "genie-home" && genieChatHomeHref
                  ? { ...item, href: genieChatHomeHref }
                  : item
              return (
                <NavItemButton
                  key={item.id}
                  item={navItem}
                  active={activeItem === item.id}
                  sidebarCollapsed={!open}
                  onClick={() => onNavigate?.(item.id)}
                />
              )
            })}
          </div>

          <div className="flex flex-col gap-1 px-0 pt-1">
            <Button variant="ghost" size="sm" className="h-8 justify-start px-3 font-normal" asChild>
              <Link
                href="/shell/onechat/chat"
                className="flex items-center gap-2"
                prefetch={false}
                onClick={() => onNavigate?.("new-chat")}
              >
                <PencilFillIcon size={16} className="text-muted-foreground" />
                New chat
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start gap-2 px-3 font-normal"
              type="button"
              onClick={() => onNavigate?.("search-chats")}
            >
              <SearchIcon size={16} className="text-muted-foreground" />
              Search chats
            </Button>
          </div>

          <div className="flex flex-col gap-0.5 pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-auto min-h-8 w-full justify-start whitespace-normal rounded px-3 py-1.5 text-left font-normal"
              type="button"
            >
              <span className="line-clamp-2 text-sm">{genieChatTitle}</span>
            </Button>
            {GENIE_CHAT_HISTORY_EXAMPLES.map((label) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                className="h-auto min-h-8 w-full justify-start whitespace-normal rounded px-3 py-1.5 text-left font-normal text-muted-foreground"
                type="button"
              >
                <span className="line-clamp-2 text-sm">{label}</span>
              </Button>
            ))}
          </div>
        </nav>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col bg-secondary transition-all duration-200 overflow-hidden",
        open ? "w-[200px]" : "w-0",
        className
      )}
    >
      {/* New button — Figma: 8px top padding, 16px gap below before first nav item */}
      {open && <div className="px-3 pb-4"><NewButton /></div>}

      {/* Nav — scrollable */}
      <nav className={navScrollClass}>

        {NAV_SECTIONS.map((section, i) => {
          const isSectionCollapsed = section.label ? !!collapsed[section.label] : false

          return (
            <div key={i} className="flex flex-col gap-0.5">
              {/* Collapsible section header */}
              {section.label && open && (
                <button
                  onClick={() => toggleSection(section.label!)}
                  className="group flex h-6 w-full items-center rounded px-3 text-left transition-colors hover:bg-[var(--action-default-bg-hover)]"
                >
                  <span className="text-xs font-normal text-muted-foreground">
                    {section.label}
                  </span>
                  <ChevronRightIcon
                    size={12}
                    className={cn(
                      "ml-auto shrink-0 text-muted-foreground transition-all duration-150",
                      // Collapsed: always visible, pointing right
                      // Expanded: hidden by default, visible on hover (pointing down)
                      isSectionCollapsed
                        ? "opacity-100"
                        : "rotate-90 opacity-0 group-hover:opacity-100"
                    )}
                  />
                </button>
              )}

              {/* Items — hidden when section is collapsed */}
              {!isSectionCollapsed && section.items.map((item) => (
                <NavItemButton
                  key={item.id}
                  item={item}
                  active={
                    activeItem === item.id ||
                    (item.id === "features" && Boolean(demoExperienceBarChrome?.open))
                  }
                  sidebarCollapsed={!open}
                  onClick={() => {
                    if (item.id === "features") {
                      demoExperienceBarChrome?.toggle()
                    }
                    onNavigate?.(item.id)
                  }}
                />
              ))}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

// ─── Nav item button ──────────────────────────────────────────────────────────

function NavItemButton({
  item,
  active,
  sidebarCollapsed,
  onClick,
}: {
  item: NavItem
  active: boolean
  sidebarCollapsed: boolean
  onClick: () => void
}) {
  const pathname = usePathname() ?? ""
  const searchParams = useSearchParams()

  const resolvedHref = React.useMemo(() => {
    if (!item.href) return undefined
    if (item.id !== "genie-code" || item.href !== "/genie") return item.href
    if (!pathname || pathname === "/genie") return item.href
    const qs = searchParams.toString()
    const ret = encodeURIComponent(pathname + (qs ? `?${qs}` : ""))
    return `/genie?returnTo=${ret}`
  }, [item.href, item.id, pathname, searchParams])

  const className = cn(
    // Figma: h-28px, px-12px, gap-8px, rounded-4px, text-13px
    "group flex h-7 w-full items-center gap-2 rounded px-3 text-left text-sm transition-colors",
    active
      ? "bg-primary/10 text-primary font-semibold"
      : "text-foreground hover:bg-[var(--action-default-bg-hover)]",
    sidebarCollapsed && "justify-center px-0"
  )

  const content = (
    <>
      <span className={cn(
        "shrink-0 transition-colors",
        // Active: primary (blue). Inactive: muted by default, foreground on hover.
        active
          ? "text-primary"
          : "text-muted-foreground group-hover:text-foreground"
      )}>
        <DbIcon icon={item.icon} size={16} color={item.iconColor === "ai" ? "ai" : "default"} />
      </span>
      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
    </>
  )

  if (resolvedHref) {
    return (
      <Link
        href={resolvedHref}
        title={sidebarCollapsed ? item.label : undefined}
        className={className}
        onClick={onClick}
        data-nav-id={item.id}
      >
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} title={sidebarCollapsed ? item.label : undefined} className={className}>
      {content}
    </button>
  )
}
