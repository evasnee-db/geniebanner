import { Suspense } from "react"
import { OneChatGenieChatShell } from "./OneChatGenieChatShell"

function ChatFallback() {
  return (
    <div className="flex h-dvh items-center justify-center bg-secondary text-sm text-muted-foreground">
      Loading Genie…
    </div>
  )
}

export default function OneChatGenieChatPage() {
  return (
    <Suspense fallback={<ChatFallback />}>
      <OneChatGenieChatShell />
    </Suspense>
  )
}
