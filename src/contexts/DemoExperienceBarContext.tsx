"use client"

import * as React from "react"

type DemoExperienceBarContextValue = {
  open: boolean
  toggle: () => void
}

const DemoExperienceBarContext =
  React.createContext<DemoExperienceBarContextValue | null>(null)

export function DemoExperienceBarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const toggle = React.useCallback(() => setOpen((v) => !v), [])
  const value = React.useMemo(() => ({ open, toggle }), [open, toggle])

  return (
    <DemoExperienceBarContext.Provider value={value}>{children}</DemoExperienceBarContext.Provider>
  )
}

/** Sidebar / chrome: toggle may be unavailable when Sidebar renders outside AppShell. */
export function useDemoExperienceBarChrome() {
  return React.useContext(DemoExperienceBarContext)
}
