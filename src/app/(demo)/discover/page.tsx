"use client"

import * as React from "react"
import Link from "next/link"
import { AppShell, GeniePromoBanner } from "@/components/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FilterPill } from "@/components/ui/filter-pill"
import { DbIcon } from "@/components/ui/db-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NotebookIcon,
  TableIcon,
  RunIcon,
  BarChartIcon,
  CatalogIcon,
} from "@/components/icons"
import {
  ChevronDown,
  MoreVertical,
  Search,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react"

// ─── Domain browse cards ──────────────────────────────────────────────────────

const DOMAIN_CARDS = [
  {
    id: "1",
    title: "Sales Data",
    description: "All data assets related to Sales",
    assets: 24,
    swatch: "bg-green-600",
  },
  {
    id: "2",
    title: "System Tables",
    description: "This domain covers data assets found in Databricks system tables",
    assets: 37,
    swatch: "bg-pink-500",
  },
  {
    id: "3",
    title: "Product",
    description: "Governed Domain for Products",
    assets: 2,
    swatch: "bg-blue-600",
  },
  {
    id: "4",
    title: "Finance",
    description: "Financial reporting and planning assets",
    assets: 18,
    swatch: "bg-teal-600",
  },
] as const

// ─── Asset cards (lizhen-test) ────────────────────────────────────────────────

const ASSET_CARDS = [
  {
    id: "a1",
    name: "table_lineage",
    verified: true,
    description:
      "Tracks lineage relationships between tables across workspaces for governance and impact analysis.",
    updated: "Apr 22, 2026",
    path: "system.access",
    tags: ["abac", "GTM", "Finance", "+7"],
  },
  {
    id: "a2",
    name: "usage",
    verified: true,
    description:
      "Aggregated usage metrics for billing and capacity planning across clusters and SQL warehouses.",
    updated: "Apr 21, 2026",
    path: "system.billing",
    tags: ["billing", "ops"],
  },
  {
    id: "a3",
    name: "query_history_archive",
    verified: false,
    description: "Archived query execution metadata retained for compliance and auditing workflows.",
    updated: "Apr 18, 2026",
    path: "lizhen-test.default",
    tags: ["compliance", "archive"],
  },
] as const

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  return (
    <AppShell activeItem="discover" workspace="pm-ai-bootcamp" userInitial="J">
      <div className="px-6 pb-12 pt-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <GeniePromoBanner className="max-w-none" />

        {/* Search */}
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search across assets..."
            className="h-10 w-full rounded-md border-border bg-background pl-9"
            aria-label="Search across assets"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="icon-xs" aria-label="Filters">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <FilterPill icon={<DbIcon icon={NotebookIcon} size={14} />}>Notebooks</FilterPill>
          <FilterPill icon={<DbIcon icon={TableIcon} size={14} />}>Tables</FilterPill>
          <FilterPill icon={<DbIcon icon={RunIcon} size={14} />}>Jobs</FilterPill>
          <FilterPill icon={<DbIcon icon={BarChartIcon} size={14} />}>Dashboards</FilterPill>
          <FilterPill icon={<ChevronDown className="h-3.5 w-3.5" />}>More types</FilterPill>
          <FilterPill icon={<ChevronDown className="h-3.5 w-3.5" />}>Domain</FilterPill>
          <FilterPill>Owned by me</FilterPill>
          <FilterPill icon={<ShieldCheck className="h-3.5 w-3.5" />}>Certified</FilterPill>
        </div>

        {/* Page title + actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Discover</h1>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="ghost" size="icon-xs" aria-label="More options">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="gap-1">
                  Edit
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit domain order</DropdownMenuItem>
                <DropdownMenuItem>Manage sections</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button" size="sm">
              Create domain
            </Button>
          </div>
        </div>

        {/* Browse by domain */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Browse by domain</h2>
              <p className="text-sm text-muted-foreground">
                Explore data and insights organized by business area
              </p>
            </div>
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:text-blue-700 sm:shrink-0"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DOMAIN_CARDS.map((d) => (
              <Link key={d.id} href="/catalog" className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Card className="h-full gap-0 p-4 shadow-[var(--shadow-db-sm)] transition-colors hover:bg-secondary/40">
                  <CardContent className="flex flex-col gap-3 p-0">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded ${d.swatch}`}
                      aria-hidden
                    >
                      <CatalogIcon size={18} className="text-white" />
                    </div>
                    <div className="text-base font-semibold text-foreground">{d.title}</div>
                    <p className="text-sm leading-5 text-muted-foreground">{d.description}</p>
                    <span className="text-sm text-foreground">{d.assets} assets</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* lizhen-test */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">lizhen-test</h2>
              <p className="text-sm text-muted-foreground">lizhen-test</p>
            </div>
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:text-blue-700 sm:shrink-0"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {ASSET_CARDS.map((a) => (
              <Card key={a.id} className="gap-0 p-4 shadow-[var(--shadow-db-sm)]">
                <CardContent className="flex flex-col gap-3 p-0">
                  <div className="flex items-start gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary">
                      <TableIcon size={16} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-foreground">{a.name}</span>
                        {a.verified && (
                          <Badge variant="outline" className="h-5 gap-0.5 border-primary/30 px-1.5 text-xs font-normal text-primary">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-hint text-muted-foreground">Table</p>
                    </div>
                  </div>
                  <p className="text-sm leading-5 text-foreground">{a.description}</p>
                  <div className="flex flex-col gap-1 border-t border-border pt-3 text-hint text-muted-foreground">
                    <span>Last updated {a.updated}</span>
                    <span className="truncate font-mono text-foreground">{a.path}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {a.tags.map((t) => (
                      <Badge key={t} variant="outline" className="font-normal">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        </div>
      </div>
    </AppShell>
  )
}
