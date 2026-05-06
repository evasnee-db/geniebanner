/** Synthetic thread id for a session opened from build-ask Code submit. */
export const GENIE_CODE_LAUNCH_THREAD_ID = "gc-launch"

export function titleFromGenieUserQuery(q: string): string {
  const t = q.trim()
  if (!t) return "Genie"
  if (/ski|resort/i.test(t)) return "EDA on ski resort properties"
  const line = (t.split(/[.\n]/)[0] ?? t).trim()
  return line.length <= 48 ? line : `${line.slice(0, 45)}…`
}

export function buildLaunchNarrative(userPrompt: string): { thinking: string; answer: string } {
  const t = userPrompt.trim() || "your request"
  const short = t.length > 120 ? `${t.slice(0, 117)}…` : t
  return {
    thinking:
      "I’m reasoning about which Unity Catalog objects are in scope, what outputs fit best (notebook vs. job vs. dashboard), and what checks you’ll need before promoting anything to production.",
    answer: `For “${short}”: inventory the relevant tables and metrics first, sketch the transformation in a small notebook with sample filters, then wire a job or dashboard once the numbers look trustworthy. Say if you want this constrained to a schema, SLA, or cost ceiling.`,
  }
}

/** Threads that show the asset strip + preview rail when selected. */
export function genieThreadHasArtifacts(threadId: string): boolean {
  return threadId !== GENIE_CODE_LAUNCH_THREAD_ID
}

export function genieThreadIsSkiDemo(threadId: string): boolean {
  return threadId === "eda-ski"
}

/** User prompt shown at top of the thread (launch thread uses the live URL `q`). */
export const GENIE_THREAD_USER_PROMPT: Record<string, string> = {
  "eda-ski": "Run EDA on ski resort bookings and rank destinations by confirmed revenue.",
  security:
    "Review warehouse access logs and correlate anomalies with warehouse slot usage.",
  c1: "Process customer feedback — sentiment tags and theme clustering for CS triage.",
  c2: "Generate marketing copy variations for the Q3 lifecycle email experiment.",
  c3: "Sweep warehouse jobs for cost spikes vs. allocated slot hours.",
}

/** Session header line per thread (sidebar titles). */
export const GENIE_THREAD_HEADER_TITLE: Record<string, string> = {
  "eda-ski": "EDA on ski resort properties",
  security: "Security audit log review",
  c1: "Process customer feedback analysis",
  c2: "Generate marketing content variations",
  c3: "Warehouse cost anomaly sweep",
}
