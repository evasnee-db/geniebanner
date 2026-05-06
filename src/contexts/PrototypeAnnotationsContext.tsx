"use client"

import * as React from "react"

/** Persisted toggle for prototype spotlight annotations; unset defaults to off. */
const STORAGE_KEY = "geniebanner.prototype.annotations.enabled"
const CHANGE_EVENT = "geniebanner:prototype-annotations"

function readStoredAnnotationsOn(): boolean | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === "false") return false
    if (raw === "true") return true
    return null
  } catch {
    return null
  }
}

function getSnapshot(): boolean {
  return readStoredAnnotationsOn() ?? false
}

function getServerSnapshot(): boolean {
  return false
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {}

  const sameTab = () => onStoreChange()
  const crossTab = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onStoreChange()
  }

  window.addEventListener(CHANGE_EVENT, sameTab)
  window.addEventListener("storage", crossTab)
  return () => {
    window.removeEventListener(CHANGE_EVENT, sameTab)
    window.removeEventListener("storage", crossTab)
  }
}

type PrototypeAnnotationsContextValue = {
  annotationsOn: boolean
  setAnnotationsOn: React.Dispatch<React.SetStateAction<boolean>>
}

const PrototypeAnnotationsContext = React.createContext<PrototypeAnnotationsContextValue | null>(
  null,
)

export function PrototypeAnnotationsProvider({ children }: { children: React.ReactNode }) {
  const annotationsOn = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  /** Persist explicit default `false` on first visit so nothing implicitly reads as “on”. */
  React.useLayoutEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === null) {
        window.localStorage.setItem(STORAGE_KEY, "false")
        window.dispatchEvent(new Event(CHANGE_EVENT))
      }
    } catch {
      // ignore quota / private mode
    }
  }, [])

  const setAnnotationsOn = React.useCallback((update: React.SetStateAction<boolean>) => {
    if (typeof window === "undefined") return
    const prev = readStoredAnnotationsOn() ?? false
    const next = typeof update === "function" ? (update as (p: boolean) => boolean)(prev) : update
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next))
      window.dispatchEvent(new Event(CHANGE_EVENT))
    } catch {
      // ignore quota / private mode
    }
  }, [])

  const value = React.useMemo(
    () => ({ annotationsOn, setAnnotationsOn }),
    [annotationsOn, setAnnotationsOn],
  )

  return (
    <PrototypeAnnotationsContext.Provider value={value}>
      {children}
    </PrototypeAnnotationsContext.Provider>
  )
}

export function usePrototypeAnnotations() {
  const ctx = React.useContext(PrototypeAnnotationsContext)
  if (!ctx) {
    throw new Error("usePrototypeAnnotations must be used within PrototypeAnnotationsProvider")
  }
  return ctx
}
