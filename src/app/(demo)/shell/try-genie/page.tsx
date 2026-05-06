"use client"

import { AppShell } from "@/components/shell"
import { DemoExperienceBar } from "../DemoExperienceBar"
import { TryGenieHomeView } from "./TryGenieHomeView"

export default function TryGenieHomePage() {
  return (
    <AppShell
      activeItem="genie-home"
      workspace="pm-ai-bootcamp"
      userInitial="E"
      aboveChrome={<DemoExperienceBar />}
      sidebarVariant="genie-chat"
      genieChatTitle="which customer uses g…"
      genieChatHomeHref="/shell/try-genie"
      mainClassName="flex min-h-0 flex-col overflow-y-auto"
    >
      <TryGenieHomeView />
    </AppShell>
  )
}
