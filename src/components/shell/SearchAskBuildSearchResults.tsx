"use client"

import * as React from "react"
import {
  ChevronDown,
  Clock,
  Folder,
  LayoutDashboard,
  List,
  SlidersHorizontal,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterPill } from "@/components/ui/filter-pill"

type ResultCard = {
  id: string
  title: string
  path: string
  modified: string
  owner: string
  description?: string
}

function mockResults(query: string): ResultCard[] {
  const q = query.trim() || "user growth"
  return [
    {
      id: "1",
      title: "FSE User Growth",
      path: `/Users/mingyang.ge@databricks.com/${q.replace(/\s+/g, "_")}`,
      modified: "Modified 1 year ago",
      owner: "Mingyang Ge",
      description:
        "This Genie space was automatically created from a Dashboard, Lakeview User Growth.",
    },
    {
      id: "2",
      title: `Lakeview ${q} 2025-04-21 slowdown`,
      path: "/Users/mingyang.ge@databricks.com/workspace",
      modified: "Modified 8 months ago",
      owner: "Mingyang Ge",
      description:
        "Ask follow-up questions about (Clone) Lakeview User Growth's data here. Use natural language to explore trends, drill into segments, and share insights with your team.",
    },
  ]
}

export function SearchAskBuildSearchResults({ query }: { query: string }) {
  const [activeChip, setActiveChip] = React.useState<string | null>(null)
  const chips = ["Notebooks", "Tables", "Jobs", "Dashboards"] as const

  const results = React.useMemo(() => mockResults(query), [query])

  return (
    <div className="relative z-0 mx-auto flex w-full max-w-4xl flex-col gap-5 pb-8">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="icon-sm" className="h-8 w-8 shrink-0 rounded-full" aria-label="Filters">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {chips.map((c) => (
          <FilterPill key={c} active={activeChip === c} onClick={() => setActiveChip(c)}>
            {c}
          </FilterPill>
        ))}
        <FilterPill>More types</FilterPill>
        <FilterPill>Domain</FilterPill>
        <FilterPill>Owned by me</FilterPill>
        <FilterPill>Certified</FilterPill>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <h2 className="text-base font-semibold text-foreground">
          Search results for &apos;{query.trim()}&apos;
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="h-8 border-primary/40 text-primary hover:bg-primary/5">
            [BB] Search quality feedback
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 font-normal">
            <List className="h-4 w-4" aria-hidden />
            Detail
            <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {results.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <LayoutDashboard className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-semibold text-foreground">{r.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Folder className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                  <span className="truncate">{r.path}</span>
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {r.modified}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {r.owner}
                  </span>
                </div>
                {r.description ? <p className="text-sm leading-relaxed text-muted-foreground">{r.description}</p> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
