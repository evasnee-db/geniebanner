"use client"

import * as React from "react"

/** App list id for Genie in the nine-dot launcher (see `AppSwitcher`). */
export const APP_SWITCHER_GENIE_ID = "genie"

export type AppSwitcherAskLaunchHandler = (thenOpenTab: () => void) => void

type AppSwitcherLaunchContextValue = {
  /** Called by `AppSwitcher` on mount; pass `null` on unmount. */
  registerAskLaunchHandler: (handler: AppSwitcherAskLaunchHandler | null) => void
  /** Open app menu, highlight Genie, then run `thenOpenTab` (e.g. `window.open`). */
  runAskLaunchSequence: (thenOpenTab: () => void) => void
}

const AppSwitcherLaunchContext = React.createContext<AppSwitcherLaunchContextValue | null>(null)

export function AppSwitcherLaunchProvider({ children }: { children: React.ReactNode }) {
  const handlerRef = React.useRef<AppSwitcherAskLaunchHandler | null>(null)

  const registerAskLaunchHandler = React.useCallback((handler: AppSwitcherAskLaunchHandler | null) => {
    handlerRef.current = handler
  }, [])

  const runAskLaunchSequence = React.useCallback((thenOpenTab: () => void) => {
    const h = handlerRef.current
    if (h) {
      h(thenOpenTab)
      return
    }
    thenOpenTab()
  }, [])

  const value = React.useMemo(
    () => ({ registerAskLaunchHandler, runAskLaunchSequence }),
    [registerAskLaunchHandler, runAskLaunchSequence],
  )

  return (
    <AppSwitcherLaunchContext.Provider value={value}>{children}</AppSwitcherLaunchContext.Provider>
  )
}

/** Returns a no-op fallthrough when used outside `AppSwitcherLaunchProvider`. */
export function useAppSwitcherAskLaunch() {
  const ctx = React.useContext(AppSwitcherLaunchContext)
  return ctx?.runAskLaunchSequence ?? ((thenOpenTab: () => void) => thenOpenTab())
}

export function useAppSwitcherLaunchRegister() {
  const register = React.useContext(AppSwitcherLaunchContext)?.registerAskLaunchHandler
  return React.useMemo(
    () => register ?? ((_handler: AppSwitcherAskLaunchHandler | null) => {}),
    [register],
  )
}
