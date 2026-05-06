export type SearchAskBuildComposerMode = "search" | "ask" | "build"

/**
 * Heuristic mode for Search–Ask–Build composer. User can always override via tabs.
 * Priority: build (tasks) → ask (questions) → search (names / paths / keywords).
 */
export function inferSearchAskBuildMode(raw: string): SearchAskBuildComposerMode {
  const q = raw.trim()
  if (!q) return "search"

  const lower = q.toLowerCase()

  // Explicit questions
  if (/\?/.test(q)) return "ask"
  if (
    /^(who|what|which|whose|how many|how much|why|when|where|list|show|tell|find|is |are |do |does |did |can you|could you|would you|give me|help me)\b/i.test(
      lower,
    )
  ) {
    return "ask"
  }
  if (/\b(who|what|which|whose|how many|how much|how often)\b/i.test(lower)) return "ask"
  if (/\b(top|bottom|ranked|average|sum of|total|trend|compare|breakdown|insight)\b/i.test(lower)) {
    if (/\b(rep|reps|sales|revenue|customer|user|growth|kpi|metric)\b/i.test(lower)) return "ask"
  }

  // Build / create tasks
  const buildVerb =
    /\b(create|make|start|run|schedule|build|add|generate|deploy|set up|spin up|write|initialize|init|launch|open|new)\b/i
  const buildObject =
    /\b(notebook|dashboard|job|pipeline|table|view|alert|cluster|warehouse|repo|report|genie space|space|workflow|app)\b/i
  if (buildVerb.test(lower) && buildObject.test(lower)) return "build"
  if (/^\s*(create|make|start|run|build|add|schedule)\s+/i.test(q)) return "build"
  if (/\b(create|make)\s+(a|an|the)\s+/i.test(lower)) return "build"

  // File / path / identifier-like → search
  if (/[/\\]/.test(q)) return "search"
  if (/\.(py|sql|ipynb|scala|rb|md|txt|json|yaml|yml|csv|ts|tsx|js|jsx|html|xml)\b/i.test(q)) return "search"
  if (/^[\w.\-@%]+\.[\w.\-]+\b/.test(q) && !/\s/.test(q)) return "search"
  if (/^[\w\-]+\.[\w\-]+$/.test(q.trim())) return "search"
  if (!/\s/.test(q) && q.length >= 2 && /^[\w.\-]+$/.test(q)) return "search"

  // Default: treat multi-token phrases like workspace search (e.g. "user growth")
  return "search"
}

/**
 * Code–Ask composer (no Search). Anything that would be "search" defaults to Code (`build`).
 */
export function inferBuildAskMode(raw: string): "build" | "ask" {
  const m = inferSearchAskBuildMode(raw)
  return m === "ask" ? "ask" : "build"
}
