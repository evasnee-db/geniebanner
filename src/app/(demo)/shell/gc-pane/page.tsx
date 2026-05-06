"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { GcPaneBuildShellProvider } from "@/contexts/GcPaneBuildShellContext"
import { AppShell } from "@/components/shell"
import { DemoExperienceBar } from "../DemoExperienceBar"
import { ShellHomeView } from "../ShellHomeView"

function GcPaneShellInner() {
  const searchParams = useSearchParams()
  const searchUrlQuery = searchParams.get("search") ?? ""
  return <ShellHomeView experienceMode="gcPane" searchUrlQuery={searchUrlQuery} />
}

export default function GcPaneShellPage() {
  return (
    <GcPaneBuildShellProvider>
      <AppShell
        activeItem=""
        workspace="pm-ai-bootcamp"
        userInitial="E"
        aboveChrome={<DemoExperienceBar />}
        integrateGcPaneBuildSidePane
        mainClassName="flex min-h-0 flex-col overflow-hidden"
      >
        <Suspense
          fallback={
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-8 pb-8 pt-8">
              <div className="mx-auto h-64 w-full max-w-4xl animate-pulse rounded-xl bg-muted/40" />
            </div>
          }
        >
          <GcPaneShellInner />
        </Suspense>
      </AppShell>
    </GcPaneBuildShellProvider>
  )
}
