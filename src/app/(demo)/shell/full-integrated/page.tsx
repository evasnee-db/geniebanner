"use client"

import { AppShell } from "@/components/shell"
import { DemoExperienceBar } from "../DemoExperienceBar"
import { ShellHomeView } from "../ShellHomeView"

export default function FullIntegratedShellPage() {
  return (
    <AppShell
      activeItem=""
      workspace="pm-ai-bootcamp"
      userInitial="E"
      aboveChrome={<DemoExperienceBar />}
      mainClassName="flex min-h-0 flex-col overflow-hidden"
    >
      <ShellHomeView experienceMode="full" />
    </AppShell>
  )
}
