"use client"

import * as React from "react"
import Link from "next/link"
import { Barlow } from "next/font/google"
import {
  GeniePromoBanner,
  GenieOneChatEntryBanner,
  FullIntegratedWorkspaceHero,
} from "@/components/shell"
import { SearchAskBuildSearchResults } from "@/components/shell/SearchAskBuildSearchResults"
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
import { usePrototypeAnnotations } from "@/contexts/PrototypeAnnotationsContext"
import { useGcPaneBuildShellOptional } from "@/contexts/GcPaneBuildShellContext"
import { cn } from "@/lib/utils"

const postItBarlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const postItCardClass =
  "rounded-sm border border-border bg-background shadow-[3px_4px_0_rgba(0,0,0,0.06),0_14px_32px_-10px_rgba(0,0,0,0.12)] dark:border-border dark:bg-card dark:shadow-[3px_4px_0_rgba(0,0,0,0.25),0_14px_32px_-10px_rgba(0,0,0,0.35)]"

const postItTextClass = "text-pretty leading-snug text-neutral-800 dark:text-neutral-100"

export type ShellExperienceMode =
  | "promotional"
  | "onechat"
  | "full"
  | "searchAskBuild"
  | "searchAskBuildB"
  | "buildAsk"
  | "gcPane"

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

const TABS: FilterTab[] = [
  { id: "suggested", label: "Suggested", icon: <SparkleDoubleFillIcon size={14} /> },
  { id: "favorites", label: "Favorites", icon: <StarFillIcon size={14} /> },
  { id: "popular", label: "Popular", icon: <TrendingUp className="h-[14px] w-[14px]" /> },
  { id: "mosaic-ai", label: "Mosaic AI", icon: <SparkleDoubleFillIcon size={14} /> },
  { id: "whats-new", label: "What's new", icon: <Gift className="h-[14px] w-[14px]" /> },
]

const FEED_DATA: Record<string, FeedItem[]> = {
  suggested: [
    { id: "1", name: "otel", path: "andre", timeAgo: "22 days ago", type: "Schema" },
    { id: "2", name: "usage", path: "system.billing", timeAgo: "1 year ago", type: "Table" },
    { id: "3", name: "forecast_price", path: "ml.hosted_functions", timeAgo: "1 year ago", type: "Function" },
    { id: "4", name: "departuredelay", path: "joy.default", timeAgo: "1 year ago", type: "Table" },
    { id: "5", name: "joy", path: "", timeAgo: "1 year ago", type: "Catalog" },
    { id: "6", name: "add_two_numbers", path: "smurching.default", timeAgo: "1 year ago", type: "Function" },
    { id: "7", name: "acme_avo", path: "", timeAgo: "1 year ago", type: "Catalog" },
  ],
  favorites: [
    { id: "1", name: "otel", path: "andre", timeAgo: "22 days ago", type: "Schema" },
    { id: "2", name: "usage", path: "system.billing", timeAgo: "1 year ago", type: "Table" },
    { id: "3", name: "forecast_price", path: "ml.hosted_functions", timeAgo: "1 year ago", type: "Function" },
    { id: "4", name: "departuredelay", path: "joy.default", timeAgo: "1 year ago", type: "Table" },
    { id: "5", name: "joy", path: "", timeAgo: "1 year ago", type: "Catalog" },
    { id: "6", name: "add_two_numbers", path: "smurching.default", timeAgo: "1 year ago", type: "Function" },
    { id: "7", name: "acme_avo", path: "", timeAgo: "1 year ago", type: "Catalog" },
  ],
  popular: [
    { id: "1", name: "forecast_price", path: "ml.hosted_functions", timeAgo: "1 year ago", type: "Function" },
    { id: "2", name: "departuredelay", path: "joy.default", timeAgo: "1 year ago", type: "Table" },
    { id: "3", name: "usage", path: "system.billing", timeAgo: "2 years ago", type: "Table" },
  ],
  "mosaic-ai": [],
  "whats-new": [],
}

function ItemTypeIcon({ type }: { type: ItemType }) {
  const cls = "text-muted-foreground shrink-0"
  switch (type) {
    case "Schema":
      return <SchemaIcon size={16} className={cls} />
    case "Table":
      return <TableIcon size={16} className={cls} />
    case "Function":
      return <FunctionIcon size={16} className={cls} />
    case "Catalog":
      return <CatalogIcon size={16} className={cls} />
  }
}

const PROMOTIONAL_ANNOTATION = {
  intro:
    "Banner appears on homepage to improve discoverability of Genie (AKA Databricks One).",
  pros: "Sole focus is improving discovery and awareness of Genie. Minimizes usability challenges and confusion between Genie Code and Genie inside of the workspace.",
  cons: "Banner will create an uptick in traffic to start, but unlikely to maintain the traffic long-term.",
} as const

const ONECHAT_ANNOTATION = {
  intro:
    "Promotional banner that has an entry box to type in your question. When someone executes their search from inside the banner, it opens the full screen experience of Genie (Databricks One) in a new window.",
  pros: "Clearly differentiated from Genie Code and traditional search. Clearly explains in the banner what Genie is for and why they should try it.",
  cons: "There are two text inputs in one view (Genie and Search), which can create additional confusion.",
} as const

const FULL_INTEGRATED_ANNOTATION = {
  intro:
    "Search Box and Genie are integrated into one input, resembling how we show it in Databricks One today. Search Toggle shows search results on the page (just as we do today in Lakehouse), and Ask opens a new window to the full screen Genie (Databricks One).",
  pros: "Most integrated experience that we can do in today's constraints.",
  cons: "Blurs the lines between search, Genie Code, and Genie in a way that could be confusing, but we've tried to mitigate with the banner below that appears when someone toggles to Ask.",
} as const

const SEARCH_ASK_BUILD_ANNOTATION = {
  intro:
    "Single point of entry with three toggles for Search, Ask (Genie), Code (Genie Code).",
  pros: "Takes the first step to creating a more unified experience inside of the workspace.",
  cons: "Forcing the user to manage a toggle with three options feels heavy handed and potentially confusing.",
} as const

const BUILD_ASK_ANNOTATION = {
  intro:
    "Same integrated composer as search-ask-build, but only two toggles: Code (Genie Code) and Ask (Genie). Search is not offered as a mode.",
  pros: "Reduces toggle complexity when workspace search is not required in this entry point.",
  cons: "Users cannot run the same in-page search results flow from this composer without switching prototypes.",
} as const

type PostItLayout = { top: number; left: number; width: number }

const DIM_SHADE = "bg-[color-mix(in_srgb,var(--foreground)_45%,transparent)]"

function intersectDomRect(a: DOMRect, b: DOMRect): DOMRect | null {
  const left = Math.max(a.left, b.left)
  const top = Math.max(a.top, b.top)
  const right = Math.min(a.right, b.right)
  const bottom = Math.min(a.bottom, b.bottom)
  if (right <= left || bottom <= top) return null
  return new DOMRect(left, top, right - left, bottom - top)
}

/** Viewport-wide dim below `dimTop` (prototype bar bottom), with a clear hole for the hero/banner. */
function ViewportDimmingPanels({ dimTop, hole }: { dimTop: number; hole: DOMRect }) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const t = dimTop
  const b = vh
  const l = 0
  const r = vw

  const ht = Math.max(hole.top, t)
  const hb = Math.min(hole.bottom, b)
  const hl = Math.max(hole.left, l)
  const hr = Math.min(hole.right, r)

  if (hb <= t || ht >= b || hr <= l || hl >= r) {
    return (
      <div
        className={cn("pointer-events-auto fixed z-[90]", DIM_SHADE)}
        style={{ top: t, left: 0, width: vw, height: Math.max(0, b - t) }}
        aria-hidden
      />
    )
  }

  const panels: { top: number; left: number; width: number; height: number }[] = []
  if (ht > t) panels.push({ top: t, left: 0, width: vw, height: ht - t })
  if (hb < b) panels.push({ top: hb, left: 0, width: vw, height: b - hb })
  if (hb > ht && hl > l) panels.push({ top: ht, left: l, width: hl - l, height: hb - ht })
  if (hb > ht && hr < r) panels.push({ top: ht, left: hr, width: r - hr, height: hb - ht })

  return (
    <>
      {panels.map((p, i) => (
        <div
          key={i}
          className={cn("pointer-events-auto fixed z-[90]", DIM_SHADE)}
          style={{ top: p.top, left: p.left, width: p.width, height: p.height }}
          aria-hidden
        />
      ))}
    </>
  )
}

export function ShellHomeView({
  experienceMode,
  searchUrlQuery = "",
}: {
  experienceMode: ShellExperienceMode
  /** Search–Ask–Build: current `?search=` value (from URL). */
  searchUrlQuery?: string
}) {
  const { annotationsOn } = usePrototypeAnnotations()
  const gcPaneBuildShell = useGcPaneBuildShellOptional()
  const enablePromoCoachmark = experienceMode === "promotional" && annotationsOn
  const enableOneChatCoachmark = experienceMode === "onechat" && annotationsOn
  const enableFullIntegratedCoachmark = experienceMode === "full" && annotationsOn
  const isSearchAskBuildExperience =
    experienceMode === "searchAskBuild" ||
    experienceMode === "searchAskBuildB" ||
    experienceMode === "buildAsk" ||
    experienceMode === "gcPane"
  const enableSearchAskBuildCoachmark = isSearchAskBuildExperience && annotationsOn

  const [activeTab, setActiveTab] = React.useState("favorites")
  const [search, setSearch] = React.useState("")
  const [annotationRevealed, setAnnotationRevealed] = React.useState(false)
  const [postItLayout, setPostItLayout] = React.useState<PostItLayout | null>(null)
  const [spotlightHoleRect, setSpotlightHoleRect] = React.useState<DOMRect | null>(null)
  const [viewportDimTop, setViewportDimTop] = React.useState<number | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const bannerRef = React.useRef<HTMLDivElement>(null)

  const promoSpotlightActive = enablePromoCoachmark && annotationRevealed
  const oneChatSpotlightActive = enableOneChatCoachmark && annotationRevealed
  const fullIntegratedSpotlightActive = enableFullIntegratedCoachmark && annotationRevealed
  const searchAskBuildSpotlightActive = enableSearchAskBuildCoachmark && annotationRevealed
  const measureSpotlight =
    promoSpotlightActive ||
    oneChatSpotlightActive ||
    fullIntegratedSpotlightActive ||
    searchAskBuildSpotlightActive

  React.useEffect(() => {
    setAnnotationRevealed(false)
  }, [experienceMode])

  React.useEffect(() => {
    if (!annotationsOn) setAnnotationRevealed(false)
  }, [annotationsOn])

  const updateSpotlightLayout = React.useCallback(() => {
    if (!measureSpotlight || !bannerRef.current) {
      setPostItLayout(null)
      setSpotlightHoleRect(null)
      setViewportDimTop(null)
      return
    }
    const bar = document.querySelector<HTMLElement>("[data-shell-experience-bar]")
    setViewportDimTop(bar?.getBoundingClientRect().bottom ?? 0)
    const measureTarget =
      experienceMode === "full" || isSearchAskBuildExperience
        ? (bannerRef.current.querySelector<HTMLElement>("[data-full-integrated-annotation-hole]") ??
          bannerRef.current)
        : bannerRef.current
    const r = measureTarget.getBoundingClientRect()
    setSpotlightHoleRect(r)
    const width =
      experienceMode === "onechat"
        ? Math.min(560, Math.max(300, r.width))
        : experienceMode === "full" || isSearchAskBuildExperience
          ? Math.min(640, Math.max(320, r.width))
          : Math.min(768, Math.max(280, r.width))
    setPostItLayout({
      top: r.bottom + 12,
      left: r.left + r.width / 2,
      width,
    })
  }, [measureSpotlight, experienceMode, isSearchAskBuildExperience])

  React.useLayoutEffect(() => {
    if (!measureSpotlight) {
      setPostItLayout(null)
      setSpotlightHoleRect(null)
      setViewportDimTop(null)
      return
    }
    updateSpotlightLayout()
  }, [measureSpotlight, updateSpotlightLayout])

  React.useEffect(() => {
    if (!measureSpotlight) return
    const scrollEl = scrollRef.current
    updateSpotlightLayout()
    window.addEventListener("resize", updateSpotlightLayout)
    scrollEl?.addEventListener("scroll", updateSpotlightLayout, { passive: true })
    return () => {
      window.removeEventListener("resize", updateSpotlightLayout)
      scrollEl?.removeEventListener("scroll", updateSpotlightLayout)
    }
  }, [measureSpotlight, updateSpotlightLayout])

  const shellAnnotationsEligible =
    annotationsOn &&
    (experienceMode === "promotional" ||
      experienceMode === "onechat" ||
      experienceMode === "full" ||
      isSearchAskBuildExperience)

  React.useEffect(() => {
    if (!shellAnnotationsEligible) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target
      if (t instanceof Element && t.closest('[data-slot="select-content"]')) return
      if (t instanceof Element && t.closest('[data-slot="switch"]')) return

      if (annotationRevealed) {
        setAnnotationRevealed(false)
        return
      }

      const bar = document.querySelector<HTMLElement>("[data-shell-experience-bar]")
      if (bar) {
        const br = bar.getBoundingClientRect()
        if (e.clientY <= br.bottom) return
      }

      setAnnotationRevealed(true)
    }
    window.addEventListener("pointerdown", onPointerDown, true)
    return () => window.removeEventListener("pointerdown", onPointerDown, true)
  }, [shellAnnotationsEligible, annotationRevealed])

  const items = FEED_DATA[activeTab] ?? []
  const filtered = search
    ? items.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.path.toLowerCase().includes(search.toLowerCase()),
      )
    : items

  const clippedHole =
    typeof window !== "undefined" && spotlightHoleRect
      ? intersectDomRect(
          spotlightHoleRect,
          new DOMRect(0, 0, window.innerWidth, window.innerHeight),
        ) ?? spotlightHoleRect
      : null

  const showViewportDim =
    measureSpotlight &&
    viewportDimTop !== null &&
    clippedHole != null &&
    clippedHole.width >= 2 &&
    clippedHole.height >= 2

  return (
    <div
      ref={scrollRef}
      className="relative flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-8 pb-8 pt-8"
    >
      {showViewportDim && viewportDimTop !== null && clippedHole && (
        <ViewportDimmingPanels dimTop={viewportDimTop} hole={clippedHole} />
      )}

      {experienceMode !== "full" && !isSearchAskBuildExperience && (
        <h1 className="relative z-0 text-center text-2xl font-semibold text-foreground">
          Welcome to Databricks
        </h1>
      )}

      <div
        className={cn(
          experienceMode === "buildAsk" && "flex min-h-0 flex-1 flex-col justify-center",
        )}
      >
        <div
          ref={bannerRef}
          className={cn(
            "relative mx-auto w-full max-w-4xl",
            promoSpotlightActive ||
              oneChatSpotlightActive ||
              fullIntegratedSpotlightActive ||
              searchAskBuildSpotlightActive
              ? "z-[95]"
              : "z-20",
          )}
        >
          {experienceMode === "full" || isSearchAskBuildExperience ? (
            <FullIntegratedWorkspaceHero
              className="max-w-none"
              annotationComposerLift={fullIntegratedSpotlightActive || searchAskBuildSpotlightActive}
              variant={
                experienceMode === "full"
                  ? "default"
                  : experienceMode === "searchAskBuildB"
                    ? "searchAskBuildB"
                    : experienceMode === "buildAsk"
                      ? "buildAsk"
                      : experienceMode === "gcPane"
                        ? "gcPane"
                        : "searchAskBuild"
              }
              urlSearchQuery={
                isSearchAskBuildExperience && experienceMode !== "buildAsk" ? searchUrlQuery : ""
              }
              onBuildSubmitOverride={
                experienceMode === "gcPane" && gcPaneBuildShell
                  ? (q) => gcPaneBuildShell.openPanelWithBuildPrompt(q)
                  : undefined
              }
              heroTitle={
                experienceMode === "buildAsk"
                  ? "What would you like to do today, Eva?"
                  : undefined
              }
            />
          ) : experienceMode === "onechat" ? (
            <GenieOneChatEntryBanner className="max-w-none" />
          ) : (
            <GeniePromoBanner className="max-w-none" />
          )}
        </div>
      </div>

      {promoSpotlightActive && postItLayout && (
        <div
          className={cn(
            postItBarlow.className,
            postItCardClass,
            "fixed z-[200] max-w-[calc(100vw-2rem)] px-3 py-3 sm:px-4 sm:py-4",
          )}
          style={{
            top: postItLayout.top,
            left: postItLayout.left,
            width: postItLayout.width,
            transform: "translateX(-50%)",
          }}
          role="note"
          aria-label="Design annotation"
        >
          <p className={cn(postItTextClass, "text-left text-base sm:text-lg")}>
            {PROMOTIONAL_ANNOTATION.intro}
          </p>
          <div className={cn("mt-3 space-y-1.5 text-left text-sm", postItTextClass)}>
            <p>
              <span className="font-semibold">Pros: </span>
              {PROMOTIONAL_ANNOTATION.pros}
            </p>
            <p>
              <span className="font-semibold">Cons: </span>
              {PROMOTIONAL_ANNOTATION.cons}
            </p>
          </div>
        </div>
      )}

      {oneChatSpotlightActive && postItLayout && (
        <div
          className={cn(
            postItBarlow.className,
            postItCardClass,
            "fixed z-[200] max-w-[calc(100vw-2rem)] px-3 py-3 sm:px-4 sm:py-4",
          )}
          style={{
            top: postItLayout.top,
            left: postItLayout.left,
            width: postItLayout.width,
            transform: "translateX(-50%)",
          }}
          role="note"
          aria-label="Design annotation"
        >
          <p className={cn(postItTextClass, "text-left text-base sm:text-lg")}>
            {ONECHAT_ANNOTATION.intro}
          </p>
          <div className={cn("mt-3 space-y-1.5 text-left text-sm", postItTextClass)}>
            <p>
              <span className="font-semibold">Pros: </span>
              {ONECHAT_ANNOTATION.pros}
            </p>
            <p>
              <span className="font-semibold">Cons: </span>
              {ONECHAT_ANNOTATION.cons}
            </p>
          </div>
        </div>
      )}

      {fullIntegratedSpotlightActive && postItLayout && (
        <div
          className={cn(
            postItBarlow.className,
            postItCardClass,
            "fixed z-[200] max-w-[calc(100vw-2rem)] px-3 py-3 sm:px-4 sm:py-4",
          )}
          style={{
            top: postItLayout.top,
            left: postItLayout.left,
            width: postItLayout.width,
            transform: "translateX(-50%)",
          }}
          role="note"
          aria-label="Design annotation"
        >
          <p className={cn(postItTextClass, "text-left text-base sm:text-lg")}>
            {FULL_INTEGRATED_ANNOTATION.intro}
          </p>
          <div className={cn("mt-3 space-y-1.5 text-left text-sm", postItTextClass)}>
            <p>
              <span className="font-semibold">Pros: </span>
              {FULL_INTEGRATED_ANNOTATION.pros}
            </p>
            <p>
              <span className="font-semibold">Cons: </span>
              {FULL_INTEGRATED_ANNOTATION.cons}
            </p>
          </div>
        </div>
      )}

      {searchAskBuildSpotlightActive && postItLayout && (
        <div
          className={cn(
            postItBarlow.className,
            postItCardClass,
            "fixed z-[200] max-w-[calc(100vw-2rem)] px-3 py-3 sm:px-4 sm:py-4",
          )}
          style={{
            top: postItLayout.top,
            left: postItLayout.left,
            width: postItLayout.width,
            transform: "translateX(-50%)",
          }}
          role="note"
          aria-label="Design annotation"
        >
          <p className={cn(postItTextClass, "text-left text-base sm:text-lg")}>
            {(experienceMode === "buildAsk" ? BUILD_ASK_ANNOTATION : SEARCH_ASK_BUILD_ANNOTATION).intro}
          </p>
          <div className={cn("mt-3 space-y-1.5 text-left text-sm", postItTextClass)}>
            <p>
              <span className="font-semibold">Pros: </span>
              {(experienceMode === "buildAsk" ? BUILD_ASK_ANNOTATION : SEARCH_ASK_BUILD_ANNOTATION).pros}
            </p>
            <p>
              <span className="font-semibold">Cons: </span>
              {(experienceMode === "buildAsk" ? BUILD_ASK_ANNOTATION : SEARCH_ASK_BUILD_ANNOTATION).cons}
            </p>
          </div>
        </div>
      )}

      {experienceMode !== "full" && !isSearchAskBuildExperience && (
        <div className="relative z-0 mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
          <HeroSearch
            className="w-full"
            placeholder="Search data, notebooks, recents, and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {experienceMode === "buildAsk" ? null : isSearchAskBuildExperience &&
        searchUrlQuery.trim() ? (
        <div className="relative z-0 mx-auto w-full max-w-4xl">
          <SearchAskBuildSearchResults query={searchUrlQuery.trim()} />
        </div>
      ) : (
        <div className="relative z-0 mx-auto flex w-full max-w-[726px] flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
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

          <div className="w-full">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No items found.</p>
            ) : (
              filtered.map((item) => (
                <Link
                  key={item.id + item.name}
                  href="/catalog"
                  className="group flex h-12 w-full items-center gap-3 border-b border-border px-2 text-left transition-colors hover:bg-secondary"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary">
                    <ItemTypeIcon type={item.type} />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold text-foreground">{item.name}</span>
                    {item.path && (
                      <span className="text-hint truncate text-muted-foreground">{item.path}</span>
                    )}
                  </div>

                  <span className="w-28 shrink-0 text-right text-sm text-foreground">{item.timeAgo}</span>

                  <span className="w-20 shrink-0 text-right text-sm text-foreground">{item.type}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
