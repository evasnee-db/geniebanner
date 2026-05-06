"use client"

import * as React from "react"

type GcPaneBuildShellValue = {
  panelOpen: boolean
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  pendingUserMessage: string | null
  openPanelWithBuildPrompt: (prompt: string) => void
  consumePendingUserMessage: () => void
}

const GcPaneBuildShellContext = React.createContext<GcPaneBuildShellValue | null>(null)

export function GcPaneBuildShellProvider({ children }: { children: React.ReactNode }) {
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [pendingUserMessage, setPendingUserMessage] = React.useState<string | null>(null)

  const openPanelWithBuildPrompt = React.useCallback((prompt: string) => {
    setPendingUserMessage(prompt.trim() || null)
    setPanelOpen(true)
  }, [])

  const consumePendingUserMessage = React.useCallback(() => {
    setPendingUserMessage(null)
  }, [])

  const value = React.useMemo(
    (): GcPaneBuildShellValue => ({
      panelOpen,
      setPanelOpen,
      pendingUserMessage,
      openPanelWithBuildPrompt,
      consumePendingUserMessage,
    }),
    [panelOpen, pendingUserMessage, openPanelWithBuildPrompt, consumePendingUserMessage],
  )

  return (
    <GcPaneBuildShellContext.Provider value={value}>{children}</GcPaneBuildShellContext.Provider>
  )
}

export function useGcPaneBuildShellOptional() {
  return React.useContext(GcPaneBuildShellContext)
}
