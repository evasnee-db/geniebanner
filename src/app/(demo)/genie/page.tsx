"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/shell"
import { DemoExperienceBar } from "../shell/DemoExperienceBar"
import { parseSafeReturnPath } from "@/lib/safe-return-path"
import {
  GENIE_CODE_LAUNCH_THREAD_ID,
  buildLaunchNarrative,
  titleFromGenieUserQuery,
} from "@/lib/genie-code-launch"

function GenieShellInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get("q") ?? ""
  const threadFirst = searchParams.get("gcLaunch") === "threadFirst"

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    if (threadFirst && q.trim()) return GENIE_CODE_LAUNCH_THREAD_ID
    return "eda-ski"
  })

  const launchNarrative = useMemo(
    () => (threadFirst && q.trim() ? buildLaunchNarrative(q) : undefined),
    [threadFirst, q],
  )

  const launchThreadRow = useMemo(() => {
    if (!threadFirst || !q.trim()) return undefined
    return {
      id: GENIE_CODE_LAUNCH_THREAD_ID,
      title: titleFromGenieUserQuery(q),
      subtitle: "New · from workspace",
      time: "Now",
      plus: "+0",
      minus: "-0",
      files: "0 Files",
      dot: true,
    }
  }, [threadFirst, q])

  const onGenieFullscreenClose = useCallback(() => {
    const dest = parseSafeReturnPath(searchParams.get("returnTo"))
    if (dest) {
      router.push(dest)
      return
    }
    router.back()
  }, [router, searchParams])

  return (
    <AppShell
      activeItem="genie-code"
      workspace="pm-ai-bootcamp"
      userInitial="E"
      aboveChrome={<DemoExperienceBar />}
      sidebarVariant="genie-code"
      mainClassName="mb-0 mr-0 ml-0 rounded-none border-0 shadow-none"
      genieFullscreen
      genieFullscreenInitialMessage={q}
      onGenieFullscreenClose={onGenieFullscreenClose}
      genieCodeActiveThreadId={threadFirst ? activeThreadId : undefined}
      onGenieCodeThreadSelect={threadFirst ? setActiveThreadId : undefined}
      genieCodeLaunchThreadRow={launchThreadRow}
      genieFullscreenLaunchNarrative={threadFirst ? launchNarrative : undefined}
    >
      {null}
    </AppShell>
  )
}

export default function GeniePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh flex-col overflow-hidden bg-secondary">
          <div className="h-12 shrink-0 border-b border-border/60 bg-background" />
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="hidden shrink-0 md:flex">
              <div className="h-full w-[200px] border-r border-border/80 bg-secondary" />
              <div className="h-full w-[272px] border-r border-border/80 bg-secondary" />
            </div>
            <div className="min-h-0 flex-1 bg-background" />
          </div>
        </div>
      }
    >
      <GenieShellInner />
    </Suspense>
  )
}
