"use client"

import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/shell"
import { DemoExperienceBar } from "../../DemoExperienceBar"
import { GenieChatView } from "./GenieChatView"

function truncateTitle(s: string, max = 42) {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

export function OneChatGenieChatShell() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q")?.trim() ?? ""
  const chatTitle = q ? truncateTitle(q) : "New chat"

  return (
    <AppShell
      activeItem="genie-spaces"
      workspace="pm-ai-bootcamp"
      userInitial="E"
      aboveChrome={<DemoExperienceBar />}
      sidebarVariant="genie-chat"
      genieChatTitle={chatTitle}
      mainClassName="flex min-h-0 flex-col overflow-hidden p-0"
    >
      <GenieChatView initialQuery={q} />
    </AppShell>
  )
}
