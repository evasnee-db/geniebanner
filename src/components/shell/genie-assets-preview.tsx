"use client"

import * as React from "react"
import {
  ArrowUpDown,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Filter,
  LayoutDashboard,
  Maximize2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Table2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type SessionAsset = {
  id: string
  name: string
  path: string
  status: "created" | "read"
  kind: "notebook" | "table" | "dashboard"
}

export function sessionAssetsForDemo(isSkiDemo: boolean): SessionAsset[] {
  if (isSkiDemo) {
    return [
      {
        id: "ski-notebook",
        name: "Ski Resort Analysis",
        path: "/Workspace/pm-ai-bootcamp/notebooks/Ski Resort Analysis",
        status: "created",
        kind: "notebook",
      },
      {
        id: "ski-table",
        name: "ski_resorts.properties",
        path: "/main/default/ski_resorts",
        status: "read",
        kind: "table",
      },
      {
        id: "ski-dash",
        name: "Resort Performance Overview",
        path: "/Dashboards/Resort Performance Overview",
        status: "created",
        kind: "dashboard",
      },
    ]
  }
  return [
    {
      id: "ws-notebook",
      name: "Analysis notebook",
      path: "/Workspace/analysis/notebook",
      status: "created",
      kind: "notebook",
    },
    {
      id: "ws-dash",
      name: "Performance overview",
      path: "/Dashboards/performance-overview",
      status: "created",
      kind: "dashboard",
    },
  ]
}

function AssetKindIcon({ kind }: { kind: SessionAsset["kind"] }) {
  const cls = "size-4 shrink-0 text-muted-foreground"
  if (kind === "notebook") return <BookOpen className={cls} aria-hidden />
  if (kind === "table") return <Table2 className={cls} aria-hidden />
  return <LayoutDashboard className={cls} aria-hidden />
}

export function GenieAssetsAccordion({
  assets,
  activeId,
  onSelectAsset,
  createdCount,
}: {
  assets: SessionAsset[]
  activeId: string | null
  onSelectAsset: (id: string) => void
  createdCount: number
}) {
  return (
    <Accordion type="single" collapsible defaultValue="assets" className="rounded-lg border border-border/80 bg-background px-1">
      <AccordionItem value="assets" className="border-0">
        <AccordionTrigger className="px-2 py-2.5 text-sm font-medium hover:no-underline">
          <span className="flex flex-1 items-center justify-between gap-2 pr-1">
            <span>Assets ({assets.length})</span>
            <Badge
              variant="lime"
              className="font-normal text-[11px] normal-case text-emerald-900 dark:text-emerald-100"
            >
              {createdCount} created
            </Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-1 pb-2 pt-0">
          <ul className="flex flex-col gap-0.5" role="list">
            {assets.map((a) => (
              <li key={a.id}>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-auto w-full justify-start gap-2 rounded-md px-2 py-2 text-left font-normal hover:bg-muted/60",
                    activeId === a.id && "bg-primary/[0.06] ring-1 ring-inset ring-primary/15",
                  )}
                  onClick={() => onSelectAsset(a.id)}
                >
                  <AssetKindIcon kind={a.kind} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-foreground">{a.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{a.path}</div>
                  </div>
                  <Badge
                    variant={a.status === "created" ? "lime" : "secondary"}
                    className={cn(
                      "shrink-0 text-[10px] font-medium capitalize",
                      a.status === "read" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {a.status}
                  </Badge>
                </Button>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

type NotebookDemoVariant = "default" | "ski"

const kw = "font-medium text-blue-600 dark:text-blue-400"
const fn = "text-violet-600 dark:text-violet-400"
const str = "text-emerald-700 dark:text-emerald-400"
const com = "text-muted-foreground/80 italic"

function CodeGutter({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex font-mono text-[11px] leading-[1.5] sm:text-xs">
      <span className="w-5 shrink-0 select-none pr-2 text-right text-muted-foreground/60 tabular-nums sm:w-6">
        {n}
      </span>
      <div className="min-w-0 flex-1 whitespace-pre-wrap break-words text-foreground">{children}</div>
    </div>
  )
}

function NotebookCellChrome({
  left,
  center,
  badge,
  badgeClassName,
}: {
  left: React.ReactNode
  center: React.ReactNode
  badge: React.ReactNode
  badgeClassName?: string
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border/60 bg-muted/20 px-2 py-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:px-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{left}</div>
      <div className="flex min-w-0 items-center gap-2 sm:hidden">{center}</div>
      <div className="hidden min-w-0 flex-[2] items-center gap-2 sm:flex">{center}</div>
      <div className="flex shrink-0 items-center gap-0.5 sm:ml-auto">
        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badgeClassName)}>
          {badge}
        </span>
        <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Cell settings">
          <Settings className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Expand cell">
          <Maximize2 className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="More">
          <MoreHorizontal className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Delete cell">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function NotebookPreview({ title, variant }: { title: string; variant: NotebookDemoVariant }) {
  const [resultTab, setResultTab] = React.useState<"table" | "viz">("table")
  const isSki = variant === "ski"
  const sqlTag = isSki ? "ski_bookings" : "dumpling_orders"
  const sqlTitle = isSki ? "Resort bookings" : "Dumpling orders"
  const pyTag = isSki ? "resort_agg" : "monthly"
  const pyTitle = isSki ? "Regional" : "Monthly"

  const tableRows = isSki
    ? [
        ["2020-11-01", "Lake Tahoe", "True", "1820.4", "142"],
        ["2020-11-01", "Aspen", "False", "940.0", "88"],
        ["2020-12-01", "Park City", "False", "760.2", "64"],
        ["2020-12-01", "Lake Tahoe", "True", "2104.1", "190"],
        ["2021-01-01", "Aspen", "False", "1102.5", "95"],
        ["2021-01-01", "Park City", "False", "802.0", "72"],
        ["2021-02-01", "Lake Tahoe", "True", "1988.3", "168"],
      ]
    : [
        ["2020-11-01", "Dumplings", "False", "3884.5", "310"],
        ["2020-11-01", "Noodles", "True", "1204.0", "98"],
        ["2020-12-01", "Dumplings", "False", "4021.2", "332"],
        ["2020-12-01", "Rice bowls", "False", "890.4", "76"],
        ["2021-01-01", "Dumplings", "True", "3560.0", "288"],
        ["2021-01-01", "Noodles", "False", "980.1", "81"],
        ["2021-02-01", "Dumplings", "False", "4102.8", "341"],
      ]

  const headers = isSki
    ? (["MONTH", "REGION", "IS_SPICY", "ORDER_TOTAL", "COUNT"] as const)
    : (["MONTH", "CATEGORY", "IS_SPICY", "ORDER_TOTAL", "COUNT"] as const)

  return (
    <div className="p-0.5 sm:p-1">
      {/* Soft tab — raised surface with inner notebook canvas */}
      <div className="rounded-[22px] bg-gradient-to-b from-muted/55 to-muted/30 p-[5px] shadow-[0_2px_14px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)_inset] dark:from-muted/35 dark:to-muted/15 dark:shadow-[0_2px_20px_-6px_rgba(0,0,0,0.55)]">
        <div className="rounded-[18px] border border-border/50 bg-background/95 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-sm dark:bg-card dark:shadow-none">
          <div className="border-b border-border/50 px-3 py-2 sm:px-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Notebook preview</p>
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          </div>

          <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
            {/* SQL cell */}
            <div className="overflow-hidden rounded-lg border border-border/70 bg-background shadow-sm">
              <NotebookCellChrome
                badge="SQL"
                badgeClassName="bg-primary/15 text-primary"
                left={
                  <>
                    <Button type="button" size="sm" variant="default" className="h-7 gap-1 rounded-md px-2.5 text-xs font-medium">
                      Run all
                      <ChevronDown className="size-3.5 opacity-80" aria-hidden />
                    </Button>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Check className="size-3.5 text-emerald-600" aria-hidden />
                      Mar 2, 2026 (3s)
                    </span>
                  </>
                }
                center={
                  <>
                    <span className="truncate text-xs font-medium text-foreground">{sqlTitle}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground/90">{sqlTag}</span>
                  </>
                }
              />
              <div className="bg-muted/15 px-1 py-2 sm:px-2">
                <CodeGutter n={1}>
                  <span className={kw}>select</span>
                  <br />
                </CodeGutter>
                <CodeGutter n={2}>
                  {"  "}
                  <span className={fn}>date_trunc</span>
                  <span className="text-foreground">(</span>
                  <span className={str}>&quot;month&quot;</span>
                  <span className="text-foreground">, o.order_date) </span>
                  <span className={kw}>as</span>
                  <span className="text-foreground"> month,</span>
                </CodeGutter>
                <CodeGutter n={3}>
                  {"  "}
                  <span className="text-foreground">{isSki ? "r.region" : "cat.category"}</span>
                  <span className="text-foreground">,</span>
                </CodeGutter>
                <CodeGutter n={4}>
                  {"  "}
                  <span className={fn}>max</span>
                  <span className="text-foreground">(</span>
                  <span className={kw}>case when</span>
                  <span className="text-foreground"> detail.is_spicy </span>
                  <span className={kw}>then true else false end</span>
                  <span className="text-foreground">) </span>
                  <span className={kw}>as</span>
                  <span className="text-foreground"> is_spicy,</span>
                </CodeGutter>
                <CodeGutter n={5}>
                  {"  "}
                  <span className={fn}>sum</span>
                  <span className="text-foreground">(o.order_total) </span>
                  <span className={kw}>as</span>
                  <span className="text-foreground"> order_total,</span>
                </CodeGutter>
                <CodeGutter n={6}>
                  {"  "}
                  <span className={fn}>count</span>
                  <span className="text-foreground">(</span>
                  <span className={kw}>distinct</span>
                  <span className="text-foreground"> o.order_id) </span>
                  <span className={kw}>as</span>
                  <span className="text-foreground"> count</span>
                </CodeGutter>
                <CodeGutter n={7}>
                  <span className={kw}>from</span>
                  <span className="text-foreground"> prod.dim_orders o</span>
                </CodeGutter>
                <CodeGutter n={8}>
                  <span className={kw}>left join</span>
                  <span className="text-foreground"> … </span>
                  <span className={com}>-- truncated</span>
                </CodeGutter>
              </div>
            </div>

            {/* Result table */}
            <div className="overflow-hidden rounded-lg border border-border/70 bg-background shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-2 py-1.5 sm:px-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setResultTab("table")}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                      resultTab === "table"
                        ? "text-foreground shadow-sm ring-1 ring-border/80 bg-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultTab("viz")}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                      resultTab === "viz"
                        ? "text-foreground shadow-sm ring-1 ring-border/80 bg-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Visualization 1
                  </button>
                  <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Add result tab">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Search">
                    <Search className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Filter">
                    <Filter className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Sort">
                    <ArrowUpDown className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-xs" className="size-7 text-muted-foreground" aria-label="Copy">
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              </div>
              {resultTab === "table" ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] text-left text-[11px] sm:text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {headers.map((h) => (
                          <th key={h} className="px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground sm:px-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-foreground">
                      {tableRows.map((row, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          {row.map((cell, j) => (
                            <td key={j} className="px-2 py-1.5 tabular-nums sm:px-3 sm:py-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center bg-muted/20 text-xs text-muted-foreground">
                  Chart preview
                </div>
              )}
            </div>

            <p className="px-1 text-center text-[11px] italic text-muted-foreground">
              ** against the results of the previous SQL query…
            </p>

            {/* Python cell */}
            <div className="overflow-hidden rounded-lg border border-border/70 bg-background shadow-sm">
              <NotebookCellChrome
                badge="Python"
                badgeClassName="bg-emerald-600/12 text-emerald-800 dark:text-emerald-300"
                left={
                  <>
                    <Button type="button" size="sm" variant="default" className="h-7 gap-1 rounded-md px-2.5 text-xs font-medium">
                      Run all
                      <ChevronDown className="size-3.5 opacity-80" aria-hidden />
                    </Button>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Check className="size-3.5 text-emerald-600" aria-hidden />
                      Mar 2, 2026 (5s)
                    </span>
                  </>
                }
                center={
                  <>
                    <span className="truncate text-xs font-medium text-foreground">{pyTitle}</span>
                    <span className="rounded bg-emerald-600/12 px-1.5 py-0.5 font-mono text-[10px] text-emerald-900 dark:text-emerald-200">
                      {pyTag}
                    </span>
                  </>
                }
              />
              <div className="bg-muted/15 px-1 py-2 sm:px-2">
                <CodeGutter n={1}>
                  <span className={kw}>import</span>
                  <span className="text-foreground"> pandas </span>
                  <span className={kw}>as</span>
                  <span className="text-foreground"> pd</span>
                </CodeGutter>
                <CodeGutter n={2}>
                  <br />
                </CodeGutter>
                <CodeGutter n={3}>
                  <span className="text-foreground">df = </span>
                  <span className={str}>{isSki ? "ski_bookings" : "dumpling_orders"}</span>
                  <span className="text-foreground">.groupby(</span>
                  <span className={str}>&quot;month&quot;</span>
                  <span className="text-foreground">).agg(</span>
                </CodeGutter>
                <CodeGutter n={4}>
                  {"    "}
                  <span className="text-foreground">order_total=(</span>
                  <span className={str}>&quot;order_total&quot;</span>
                  <span className="text-foreground">, </span>
                  <span className={str}>&quot;sum&quot;</span>
                  <span className="text-foreground">),</span>
                </CodeGutter>
                <CodeGutter n={5}>
                  {"    "}
                  <span className="text-foreground">count=(</span>
                  <span className={str}>&quot;count&quot;</span>
                  <span className="text-foreground">, </span>
                  <span className={str}>&quot;sum&quot;</span>
                  <span className="text-foreground">),</span>
                </CodeGutter>
                <CodeGutter n={6}>
                  <span className="text-foreground">).reset_index()</span>
                </CodeGutter>
                <CodeGutter n={7}>
                  <span className="text-foreground">display(df)</span>
                </CodeGutter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TablePreview({ title }: { title: string }) {
  return (
    <div className="space-y-3 p-1">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">resort_id</th>
              <th className="px-3 py-2 font-medium">region</th>
              <th className="px-3 py-2 font-medium">revenue</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            <tr className="border-b border-border/60">
              <td className="px-3 py-2">R-104</td>
              <td className="px-3 py-2">Lake Tahoe</td>
              <td className="px-3 py-2 tabular-nums">$1.2M</td>
            </tr>
            <tr>
              <td className="px-3 py-2">R-221</td>
              <td className="px-3 py-2">Aspen</td>
              <td className="px-3 py-2 tabular-nums">$980k</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DashboardPreview({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wide">
            new
          </Badge>
        </div>
        <Button type="button" variant="outline" size="sm" className="gap-1.5 font-normal">
          Open Dashboard
          <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="gap-1 border-border/80 p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">4-MO forecast</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">$4.2M</p>
          <p className="text-xs font-medium text-emerald-600">+12%</p>
        </Card>
        <Card className="gap-1 border-border/80 p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Win rate</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">42%</p>
        </Card>
        <Card className="gap-1 border-border/80 p-4 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Quota attain.</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">87%</p>
        </Card>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="min-h-[140px] border-border/80 p-3 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Revenue trend</p>
          <div className="mt-4 flex h-20 items-end gap-1">
            {[40, 55, 48, 62, 58, 70, 65, 78].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-primary/25" style={{ height: `${h}%` }} />
            ))}
          </div>
        </Card>
        <Card className="min-h-[140px] border-border/80 p-3 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Pipeline by stage</p>
          <div className="mt-4 flex h-20 items-end gap-2">
            {[35, 50, 42, 60].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-primary/35" style={{ height: `${h}%` }} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function GeniePreviewPanel({
  assets,
  activeId,
  onActiveChange,
  notebookDemoVariant = "default",
}: {
  assets: SessionAsset[]
  activeId: string | null
  onActiveChange: (id: string) => void
  /** Sample notebook copy when previewing a notebook asset (matches ski vs generic session). */
  notebookDemoVariant?: NotebookDemoVariant
}) {
  if (!assets.length || !activeId) return null

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-muted/15">
      <div className="shrink-0 border-b border-border/60 px-4 pt-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Preview</p>
      </div>
      <Tabs value={activeId} onValueChange={onActiveChange} className="flex min-h-0 flex-1 flex-col gap-0">
        <div className="shrink-0 overflow-x-auto border-b border-border/60 px-3 pt-2 sm:px-4">
          <TabsList
            variant="line"
            className="h-auto min-h-8 w-max min-w-full justify-start gap-6 bg-transparent px-0 sm:gap-8"
          >
            {assets.map((a) => (
              <TabsTrigger
                key={a.id}
                value={a.id}
                className="max-w-[min(12rem,32vw)] shrink-0 truncate px-3 text-xs sm:max-w-[14rem] sm:px-4 sm:text-sm"
              >
                {a.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {assets.map((a) => (
          <TabsContent
            key={a.id}
            value={a.id}
            className={cn(
              "min-h-0 flex-1 overflow-y-auto py-3",
              a.kind === "notebook" ? "px-2 sm:px-3" : "px-4 py-4",
            )}
          >
            {a.kind === "notebook" && (
              <NotebookPreview title={a.name} variant={notebookDemoVariant} />
            )}
            {a.kind === "table" && <TablePreview title={a.name} />}
            {a.kind === "dashboard" && <DashboardPreview title={a.name} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
