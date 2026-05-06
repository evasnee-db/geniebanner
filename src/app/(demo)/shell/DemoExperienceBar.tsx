"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { usePrototypeAnnotations } from "@/contexts/PrototypeAnnotationsContext"
import { cn } from "@/lib/utils"
import type { ShellExperienceMode } from "./ShellHomeView"

const ROUTES: Record<Exclude<ShellExperienceMode, "onechat">, string> = {
  promotional: "/shell/promotional",
  full: "/shell/full-integrated",
  searchAskBuild: "/shell/search-ask-build",
  searchAskBuildB: "/shell/search-ask-build-b",
  buildAsk: "/shell/build-ask",
  gcPane: "/shell/gc-pane",
}

function pathnameToMode(path: string): ShellExperienceMode {
  const normalized = path.replace(/\/$/, "") || "/"
  if (normalized.startsWith("/shell/onechat")) return "onechat"
  if (normalized.startsWith("/shell/full-integrated")) return "full"
  if (normalized.startsWith("/shell/gc-pane")) return "gcPane"
  /** More specific branches first — `/shell/search-ask-build-b` prefixes `search-ask-build`; `build-ask` is distinct. */
  if (normalized.startsWith("/shell/search-ask-build-b")) return "searchAskBuildB"
  if (normalized.startsWith("/shell/build-ask")) return "buildAsk"
  if (normalized.startsWith("/shell/search-ask-build")) return "searchAskBuild"
  if (normalized.startsWith("/shell/promotional")) return "promotional"
  return "searchAskBuild"
}

/** Modes listed in the prototype picker (OneChat remains reachable via URL only). */
function selectModeFromPath(path: string): Exclude<ShellExperienceMode, "onechat"> {
  const m = pathnameToMode(path)
  return m === "onechat" ? "promotional" : m
}

export function DemoExperienceBar({ className }: { className?: string }) {
  const pathname = usePathname() ?? "/"
  const router = useRouter()
  const selectValue = selectModeFromPath(pathname)
  const { annotationsOn, setAnnotationsOn } = usePrototypeAnnotations()

  return (
    <div
      role="region"
      aria-label="Prototype controls"
      className={cn(
        "flex w-full shrink-0 flex-wrap items-center justify-end gap-x-4 gap-y-2 border-b border-border bg-background px-4 py-2 sm:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:justify-end">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-hint shrink-0 whitespace-nowrap text-muted-foreground">
            Prototype version
          </span>
          <Select
            value={selectValue}
            onValueChange={(v) => {
              const mode = v as Exclude<ShellExperienceMode, "onechat">
              const href = ROUTES[mode]
              const normalized = pathname.replace(/\/$/, "") || "/"
              if (href && href !== normalized) {
                router.push(href)
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className="min-w-0 max-w-[min(100%,16rem)] bg-secondary sm:min-w-[14rem]"
            >
              <SelectValue placeholder="Select prototype version" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[200]">
              <SelectItem value="promotional">Promotional Banner</SelectItem>
              <SelectItem value="full">Search-Ask</SelectItem>
              <SelectItem value="searchAskBuild">search-ask-build</SelectItem>
              <SelectItem value="buildAsk">build-ask</SelectItem>
              <SelectItem value="searchAskBuildB">search-ask-build-b</SelectItem>
              <SelectItem value="gcPane">GC-pane</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border-border sm:border-l sm:pl-4">
          <span className="text-hint shrink-0 whitespace-nowrap text-muted-foreground" id="annotations-label">
            Annotations
          </span>
          <Switch
            size="sm"
            checked={annotationsOn}
            onCheckedChange={setAnnotationsOn}
            aria-labelledby="annotations-label"
          />
          <span
            className="text-hint w-8 shrink-0 font-medium tabular-nums text-foreground"
            aria-live="polite"
          >
            {annotationsOn ? "On" : "Off"}
          </span>
        </div>
      </div>
    </div>
  )
}
