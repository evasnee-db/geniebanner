import * as React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SCREENSHOT_URL = "/genie-home-screenshot.png"

/**
 * Ask Genie promo — left copy stays vector-sharp; right preview is a fixed-size panel with the
 * home UI as a CSS background (`contain`, panel aspect matches the 1024×592 asset).
 */
export function GeniePromoBanner({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative flex w-full max-w-4xl flex-col overflow-hidden rounded-md border border-border bg-[#FFF0D3] shadow-[var(--shadow-db-sm)] md:flex-row md:items-stretch",
        className,
      )}
      aria-label="Ask Genie promotion"
    >
      <div className="pointer-events-none absolute inset-0 md:opacity-100" aria-hidden>
        <div className="absolute -right-[6%] bottom-0 top-0 w-[55%] skew-x-[-10deg] bg-[#F9B132]/95 md:block" />
      </div>

      <div className="relative z-[1] flex flex-1 flex-col gap-5 p-8 md:max-w-[min(100%,24rem)] md:pr-6">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <img
              src="/genie-promo-icon.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 select-none"
              draggable={false}
            />
          </div>
          <h2 className="text-lg font-semibold leading-tight text-[#1B2733]">Ask Genie</h2>
        </div>
        <p className="text-sm leading-5 text-[#1B2733]">
          Genie lets you ask questions from all the data across your workspace without needing to find
          data or write SQL queries manually. Try it today.
        </p>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border border-[#E8ECF0] bg-white px-5 font-semibold text-[#1B2733] shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:bg-white"
            asChild
          >
            <Link
              href="/shell/try-genie"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              Try Genie
              <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative z-[1] flex min-h-[220px] w-full flex-1 flex-col items-end justify-end px-6 pb-6 pt-4 md:min-h-0 md:items-end md:justify-end md:px-0 md:pb-0 md:pl-6 md:pt-10">
        <div
          className="max-w-full overflow-hidden rounded-tl shadow-[0_8px_40px_0_rgba(0,0,0,0.13)]"
          style={{
            width: "min(100%, 405.438px)",
            flexShrink: 0,
            aspectRatio: "1024 / 592",
            background: `url(${SCREENSHOT_URL}) lightgray 50% / contain no-repeat`,
          }}
          role="img"
          aria-label="Databricks home — What would you like to know?, search, filters, and content cards"
        />
      </div>
    </section>
  )
}
