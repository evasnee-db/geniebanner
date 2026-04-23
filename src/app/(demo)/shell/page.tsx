"use client"

import * as React from "react"
import Link from "next/link"
import { Caveat } from "next/font/google"
import { AppShell, GeniePromoBanner } from "@/components/shell"
import { HeroSearch } from "@/components/ui/hero-search"
import { FilterPill } from "@/components/ui/filter-pill"
import {
  SchemaIcon,
  CatalogIcon,
  FunctionIcon,
  TableIcon,
  StarFillIcon,
  SparkleDoubleFillIcon,
} from "@/components/icons"
import { TrendingUp, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

const postItHandwriting = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
})

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = "Schema" | "Table" | "Function" | "Catalog"

type FeedItem = {
  id: string
  name: string
  path: string
  timeAgo: string
  type: ItemType
}

type FilterTab = {
  id: string
  label: string
  icon: React.ReactNode
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS: FilterTab[] = [
  { id: "suggested", label: "Suggested",  icon: <SparkleDoubleFillIcon size={14} /> },
  { id: "favorites", label: "Favorites",  icon: <StarFillIcon size={14} /> },
  { id: "popular",   label: "Popular",    icon: <TrendingUp className="h-[14px] w-[14px]" /> },
  { id: "mosaic-ai", label: "Mosaic AI",  icon: <SparkleDoubleFillIcon size={14} /> },
  { id: "whats-new", label: "What's new", icon: <Gift className="h-[14px] w-[14px]" /> },
]

const FEED_DATA: Record<string, FeedItem[]> = {
  suggested: [
    { id: "1", name: "otel",             path: "andre",               timeAgo: "22 days ago",  type: "Schema"   },
    { id: "2", name: "usage",            path: "system.billing",      timeAgo: "1 year ago",   type: "Table"    },
    { id: "3", name: "forecast_price",   path: "ml.hosted_functions", timeAgo: "1 year ago",   type: "Function" },
    { id: "4", name: "departuredelay",   path: "joy.default",         timeAgo: "1 year ago",   type: "Table"    },
    { id: "5", name: "joy",              path: "",                    timeAgo: "1 year ago",   type: "Catalog"  },
    { id: "6", name: "add_two_numbers",  path: "smurching.default",   timeAgo: "1 year ago",   type: "Function" },
    { id: "7", name: "acme_avo",         path: "",                    timeAgo: "1 year ago",   type: "Catalog"  },
  ],
  favorites: [
    { id: "1", name: "otel",             path: "andre",               timeAgo: "22 days ago",  type: "Schema"   },
    { id: "2", name: "usage",            path: "system.billing",      timeAgo: "1 year ago",   type: "Table"    },
    { id: "3", name: "forecast_price",   path: "ml.hosted_functions", timeAgo: "1 year ago",   type: "Function" },
    { id: "4", name: "departuredelay",   path: "joy.default",         timeAgo: "1 year ago",   type: "Table"    },
    { id: "5", name: "joy",              path: "",                    timeAgo: "1 year ago",   type: "Catalog"  },
    { id: "6", name: "add_two_numbers",  path: "smurching.default",   timeAgo: "1 year ago",   type: "Function" },
    { id: "7", name: "acme_avo",         path: "",                    timeAgo: "1 year ago",   type: "Catalog"  },
  ],
  popular: [
    { id: "1", name: "forecast_price",   path: "ml.hosted_functions", timeAgo: "1 year ago",   type: "Function" },
    { id: "2", name: "departuredelay",   path: "joy.default",         timeAgo: "1 year ago",   type: "Table"    },
    { id: "3", name: "usage",            path: "system.billing",      timeAgo: "2 years ago",  type: "Table"    },
  ],
  "mosaic-ai": [],
  "whats-new":  [],
}

// ─── Item type icon ────────────────────────────────────────────────────────────

function ItemTypeIcon({ type }: { type: ItemType }) {
  const cls = "text-muted-foreground shrink-0"
  switch (type) {
    case "Schema":   return <SchemaIcon   size={16} className={cls} />
    case "Table":    return <TableIcon    size={16} className={cls} />
    case "Function": return <FunctionIcon size={16} className={cls} />
    case "Catalog":  return <CatalogIcon  size={16} className={cls} />
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type GenieSpotlight = "idle" | "active" | "dismissed"

const GENIE_SPOTLIGHT_CAPTION =
  "Banner appears on homepage to improve discoverability of Genie (AKA Databricks One)."

const DISCOVER_NAV_HINT =
  "Banner can also appear on our Discover page."

type PostItLayout = { top: number; left: number; width: number }

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState("favorites")
  const [search, setSearch]       = React.useState("")
  const [genieSpotlight, setGenieSpotlight] = React.useState<GenieSpotlight>("idle")
  const [postItLayout, setPostItLayout]     = React.useState<PostItLayout | null>(null)
  const [spotlightHoleRect, setSpotlightHoleRect] = React.useState<DOMRect | null>(null)
  const [showDiscoverNavHint, setShowDiscoverNavHint] = React.useState(false)
  const [discoverHintAnchor, setDiscoverHintAnchor] = React.useState<DOMRect | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const bannerRef = React.useRef<HTMLDivElement>(null)
  const spotlightPrevRef = React.useRef<GenieSpotlight>("idle")

  const updatePostItLayout = React.useCallback(() => {
    if (genieSpotlight !== "active" || !bannerRef.current) {
      setPostItLayout(null)
      setSpotlightHoleRect(null)
      return
    }
    const r = bannerRef.current.getBoundingClientRect()
    setSpotlightHoleRect(r)
    const width = Math.min(768, Math.max(280, r.width))
    setPostItLayout({
      top: r.bottom + 12,
      left: r.left + r.width / 2,
      width,
    })
  }, [genieSpotlight])

  React.useLayoutEffect(() => {
    if (genieSpotlight !== "active") {
      setPostItLayout(null)
      setSpotlightHoleRect(null)
      return
    }
    updatePostItLayout()
  }, [genieSpotlight, updatePostItLayout])

  React.useEffect(() => {
    if (genieSpotlight !== "active") return
    const scrollEl = scrollRef.current
    updatePostItLayout()
    window.addEventListener("resize", updatePostItLayout)
    scrollEl?.addEventListener("scroll", updatePostItLayout, { passive: true })
    return () => {
      window.removeEventListener("resize", updatePostItLayout)
      scrollEl?.removeEventListener("scroll", updatePostItLayout)
    }
  }, [genieSpotlight, updatePostItLayout])

  React.useEffect(() => {
    if (spotlightPrevRef.current === "active" && genieSpotlight === "dismissed") {
      setShowDiscoverNavHint(true)
    }
    spotlightPrevRef.current = genieSpotlight
  }, [genieSpotlight])

  React.useEffect(() => {
    const onPointerDown = () => {
      setShowDiscoverNavHint((h) => (h ? false : h))
      setGenieSpotlight((s) => {
        if (s === "idle") return "active"
        if (s === "active") return "dismissed"
        return s
      })
    }
    window.addEventListener("pointerdown", onPointerDown, true)
    return () => window.removeEventListener("pointerdown", onPointerDown, true)
  }, [])

  React.useLayoutEffect(() => {
    if (!showDiscoverNavHint) {
      setDiscoverHintAnchor(null)
      return
    }
    const el = document.querySelector<HTMLElement>('[data-nav-id="discover"]')
    if (!el) {
      setDiscoverHintAnchor(null)
      return
    }
    const read = () => {
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) {
        setDiscoverHintAnchor(null)
        return
      }
      setDiscoverHintAnchor(r)
    }
    read()
    window.addEventListener("resize", read)
    window.addEventListener("scroll", read, true)
    return () => {
      window.removeEventListener("resize", read)
      window.removeEventListener("scroll", read, true)
    }
  }, [showDiscoverNavHint])

  const items = FEED_DATA[activeTab] ?? []
  const filtered = search
    ? items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.path.toLowerCase().includes(search.toLowerCase())
      )
    : items

  return (
    <AppShell activeItem="" workspace="pm-ai-bootcamp" userInitial="J">
      <div
        ref={scrollRef}
        className="relative flex h-full flex-col gap-6 overflow-y-auto px-8 pb-8 pt-12"
      >
        {genieSpotlight === "active" &&
          spotlightHoleRect &&
          spotlightHoleRect.width >= 2 &&
          spotlightHoleRect.height >= 2 && (
            <div
              className="pointer-events-none fixed z-[100] rounded-md"
              style={{
                top: spotlightHoleRect.top,
                left: spotlightHoleRect.left,
                width: spotlightHoleRect.width,
                height: spotlightHoleRect.height,
                boxShadow:
                  "0 0 0 9999px color-mix(in srgb, var(--foreground) 45%, transparent)",
              }}
              aria-hidden
            />
          )}

        <h1 className="relative z-0 text-center text-2xl font-semibold text-foreground">
          Welcome to Databricks
        </h1>

        <div ref={bannerRef} className="relative z-20 mx-auto w-full max-w-4xl">
          <GeniePromoBanner className="max-w-none" />
        </div>

        {genieSpotlight === "active" && postItLayout && (
          <div
            className="fixed z-[200] max-w-[calc(100vw-2rem)] rounded-sm border border-amber-300/90 bg-yellow-200 px-1.5 py-3 shadow-[3px_4px_0_rgba(0,0,0,0.1),0_14px_32px_-10px_rgba(0,0,0,0.2)] dark:border-amber-700/80 dark:bg-amber-950 dark:shadow-[3px_4px_0_rgba(0,0,0,0.35)] sm:px-2"
            style={{
              top: postItLayout.top,
              left: postItLayout.left,
              width: postItLayout.width,
              transform: "translateX(-50%)",
            }}
            role="note"
            aria-label="Design annotation"
          >
            <p
              className={cn(
                postItHandwriting.className,
                "text-center text-base leading-snug text-neutral-900 dark:text-amber-50 sm:text-lg sm:leading-snug md:text-xl",
              )}
            >
              {GENIE_SPOTLIGHT_CAPTION}
            </p>
          </div>
        )}

        <div className="relative z-0 mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
          <HeroSearch
            className="w-full"
            placeholder="Search data, notebooks, recents, and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Left-aligned: filter tabs + list */}
        <div className="relative z-0 mx-auto flex w-full max-w-[726px] flex-col gap-4">

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {TABS.map((tab) => (
            <FilterPill
              key={tab.id}
              active={activeTab === tab.id}
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </FilterPill>
          ))}
        </div>

        {/* Items list */}
        <div className="w-full">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No items found.</p>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id + item.name}
                href="/catalog"
                className="group flex w-full h-12 items-center gap-3 border-b border-border px-2 text-left hover:bg-secondary transition-colors"
              >
                {/* Type icon */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary">
                  <ItemTypeIcon type={item.type} />
                </div>

                {/* Name + path */}
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </span>
                  {item.path && (
                    <span className="text-hint text-muted-foreground truncate">
                      {item.path}
                    </span>
                  )}
                </div>

                {/* Time */}
                <span className="shrink-0 text-sm text-foreground w-28 text-right">
                  {item.timeAgo}
                </span>

                {/* Type label */}
                <span className="shrink-0 text-sm text-foreground w-20 text-right">
                  {item.type}
                </span>
              </Link>
            ))
          )}
        </div>

        </div>{/* end left-aligned */}

        {showDiscoverNavHint && discoverHintAnchor && (
          <div className="pointer-events-none fixed inset-0 z-[185]">
            <svg
              className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible"
              aria-hidden
            >
              <defs>
                <marker
                  id="discover-hint-arrow"
                  markerWidth="9"
                  markerHeight="9"
                  refX="0"
                  refY="4.5"
                  orient="auto"
                >
                  <path d="M0,0 L0,9 L9,4.5 z" fill="#000000" />
                </marker>
              </defs>
              <line
                x1={discoverHintAnchor.right + 220}
                y1={discoverHintAnchor.top + discoverHintAnchor.height / 2}
                x2={discoverHintAnchor.right + 2}
                y2={discoverHintAnchor.top + discoverHintAnchor.height / 2}
                stroke="#000000"
                strokeWidth={2.5}
                markerEnd="url(#discover-hint-arrow)"
              />
            </svg>
            <div
              className="pointer-events-auto absolute max-w-[min(18rem,calc(100vw-3rem))] rounded-sm border border-amber-300/90 bg-yellow-200 px-4 py-3 shadow-lg dark:border-amber-700/80 dark:bg-amber-950"
              style={{
                left: discoverHintAnchor.right + 16,
                top: discoverHintAnchor.top + discoverHintAnchor.height / 2,
                transform: "translateY(-50%)",
              }}
              role="note"
              aria-live="polite"
            >
              <p
                className={cn(
                  postItHandwriting.className,
                  "text-pretty text-lg leading-snug text-neutral-900 dark:text-amber-50 sm:text-xl",
                )}
              >
                {DISCOVER_NAV_HINT}
              </p>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  )
}
