"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DEMO_PASSWORD = "geniebanner"
const STORAGE_KEY = "geniebanner:demo-access"

type GateState = "checking" | "locked" | "unlocked"

export function AppPasswordGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<GateState>("checking")

  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setState("unlocked")
      } else {
        setState("locked")
      }
    } catch {
      setState("locked")
    }
  }, [])

  if (state === "checking") {
    return (
      <div
        className="fixed inset-0 z-[100] bg-background"
        aria-busy="true"
        aria-label="Loading"
      />
    )
  }

  if (state === "locked") {
    return (
      <PasswordPrompt
        onSuccess={() => {
          try {
            window.localStorage.setItem(STORAGE_KEY, "1")
          } catch {
            /* ignore quota / private mode */
          }
          setState("unlocked")
        }}
      />
    )
  }

  return <>{children}</>
}

function PasswordPrompt({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed === DEMO_PASSWORD) {
      setError(null)
      onSuccess()
      return
    }
    setError("That password is not correct. Try again.")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Enter password</CardTitle>
          <CardDescription>
            This preview is password-protected. Ask your teammate for access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-password">Password</Label>
              <Input
                id="demo-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (error) setError(null)
                }}
                className="h-8"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "demo-password-error" : undefined}
              />
              {error ? (
                <p
                  id="demo-password-error"
                  role="alert"
                  className="text-destructive text-hint"
                >
                  {error}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
