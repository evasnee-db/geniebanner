"use client"

import * as React from "react"
import {
  ArrowUp,
  ChevronRight,
  Eye,
  Flame,
  MessageSquare,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

type ComposerTab = "search" | "ask"

const FOR_YOU = [
  { id: "1", title: "product-org-ai-dash", tag: "star" as const },
  { id: "2", title: "[AIBI] Genie Ready Review", tag: "flame" as const },
  { id: "3", title: "Customer health — Q3", tag: "eye" as const },
  { id: "4", title: "Pipeline quality metrics", tag: "star" as const },
]

const RECENTS = [
  { title: "Genie Code Product Integrations", owner: "andre", when: "2 days ago", type: "Dashboard" },
  { title: "Workspace usage summary", owner: "system", when: "5 min ago", type: "Dashboard" },
  { title: "Sales QBR — Genie space", owner: "marketing", when: "1 hr ago", type: "Genie space" },
  { title: "Billing explorer", owner: "system.billing", when: "Yesterday", type: "Dashboard" },
]

const TRENDING = [
  { title: "Revenue by region", owner: "finance", views: "3,087 views", type: "Dashboard" },
  { title: "Notebook: churn model v2", owner: "ml-team", views: "2,401 views", type: "Notebook" },
  { title: "Lakehouse audit log", owner: "security", views: "1,892 views", type: "Table" },
  { title: "Executive KPIs", owner: "exec", views: "1,204 views", type: "Dashboard" },
]

function MiniDashboardPreview({ className }: { className?: string }) {
  const heights = [38, 62, 44, 72, 52, 68, 48, 58, 42, 66]
  return (
    <div
      className={cn(
        "flex h-[7.5rem] items-end justify-between gap-0.5 rounded-sm border border-border/60 bg-muted/40 px-2 pb-2 pt-3",
        className,
      )}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className="min-w-0 flex-1 rounded-sm bg-primary/35"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

function TagIcon({ tag }: { tag: "star" | "flame" | "eye" }) {
  const cls = "size-3.5 shrink-0 text-muted-foreground"
  if (tag === "star") return <Star className={cls} aria-hidden />
  if (tag === "flame") return <Flame className={cls} aria-hidden />
  return <Eye className={cls} aria-hidden />
}

export function TryGenieHomeView() {
  const [tab, setTab] = React.useState<ComposerTab>("search")
  const [draft, setDraft] = React.useState("")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-8 pb-12">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-[26px]">
        What would you like to know?
      </h1>

      <div
        className={cn(
          "mx-auto w-full max-w-3xl rounded-[1.25rem] border border-border bg-background p-4 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.1)] ring-1 ring-border/80",
        )}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question..."
          rows={3}
          className="min-h-[5.5rem] w-full resize-none border-0 bg-transparent p-1 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0"
          aria-label="Ask a question"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative inline-flex h-9 w-[13rem] shrink-0 rounded-full bg-muted/90 p-1 ring-1 ring-border">
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute left-1 top-1 h-7 w-[calc((13rem-8px)/2)] rounded-full bg-background shadow-sm ring-1 ring-border/50 transition-transform duration-200 ease-out motion-reduce:transition-none",
                  tab === "ask" && "translate-x-[calc((13rem-8px)/2)]",
                )}
              />
              <button
                type="button"
                role="tab"
                aria-selected={tab === "search"}
                className={cn(
                  "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  tab === "search" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setTab("search")}
              >
                <SearchIcon size={16} className="shrink-0 opacity-90" />
                Search
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "ask"}
                className={cn(
                  "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  tab === "ask" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setTab("ask")}
              >
                <MessageSquare className="size-4 shrink-0 opacity-90" aria-hidden />
                Ask
              </button>
            </div>
          </div>
          <Button type="button" variant="secondary" size="icon-sm" className="size-9 shrink-0 rounded-full" aria-label="Submit">
            <ArrowUp className="size-4" strokeWidth={2.25} />
          </Button>
        </div>
      </div>

      <section aria-labelledby="for-you-heading" className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <h2 id="for-you-heading" className="text-sm font-semibold text-foreground">
            For you
          </h2>
          <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground" aria-label="More for you">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOR_YOU.map((d) => (
            <Card key={d.id} className="gap-3 p-4 shadow-sm">
              <CardHeader className="gap-2 p-0">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-sm font-semibold leading-snug">
                    {d.title}
                  </CardTitle>
                  <TagIcon tag={d.tag} />
                </div>
                <p className="text-hint text-muted-foreground">Dashboard</p>
              </CardHeader>
              <CardContent className="p-0">
                <MiniDashboardPreview />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="recents-heading" className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <h2 id="recents-heading" className="text-sm font-semibold text-foreground">
              Recents
            </h2>
            <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground" aria-label="More recents">
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex flex-col rounded-md border border-border bg-background">
            {RECENTS.map((r) => (
              <div
                key={r.title}
                className={cn(
                  "flex flex-col gap-0.5 border-b border-border px-4 py-3 last:border-b-0",
                  "hover:bg-secondary/80",
                )}
              >
                <span className="text-sm font-semibold text-foreground">{r.title}</span>
                <span className="text-hint text-muted-foreground">
                  {r.owner} · {r.when} · {r.type}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="trending-heading" className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <h2 id="trending-heading" className="text-sm font-semibold text-foreground">
              Trending
            </h2>
            <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground" aria-label="More trending">
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex flex-col rounded-md border border-border bg-background">
            {TRENDING.map((r) => (
              <div
                key={r.title}
                className="flex flex-col gap-0.5 border-b border-border px-4 py-3 last:border-b-0 hover:bg-secondary/80"
              >
                <span className="text-sm font-semibold text-foreground">{r.title}</span>
                <span className="text-hint text-muted-foreground">
                  {r.owner} · {r.views} · {r.type}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
