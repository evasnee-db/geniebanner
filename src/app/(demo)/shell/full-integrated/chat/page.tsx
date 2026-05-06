"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/shell"
import { DemoExperienceBar } from "../../DemoExperienceBar"
import { Button } from "@/components/ui/button"

function FullIntegratedChatContent() {
  const q = useSearchParams().get("q")?.trim() ?? ""

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <h1 className="text-xl font-semibold text-foreground">Search-Ask</h1>
      {q ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          You asked: <span className="font-medium text-foreground">{q}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">No question in the URL yet.</p>
      )}
      <Button variant="outline" size="sm" asChild>
        <Link href="/shell/full-integrated" prefetch={false}>
          Back to home
        </Link>
      </Button>
    </div>
  )
}

export default function FullIntegratedChatPage() {
  return (
    <AppShell
      activeItem=""
      workspace="pm-ai-bootcamp"
      userInitial="E"
      aboveChrome={<DemoExperienceBar />}
      mainClassName="flex min-h-0 flex-col overflow-hidden"
    >
      <React.Suspense
        fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}
      >
        <FullIntegratedChatContent />
      </React.Suspense>
    </AppShell>
  )
}
