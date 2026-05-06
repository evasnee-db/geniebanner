/**
 * Parses an in-app return path from a query param. Rejects values that could be used for open redirects.
 */
export function parseSafeReturnPath(raw: string | null | undefined): string | null {
  if (raw == null) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  let decoded: string
  try {
    decoded = decodeURIComponent(trimmed)
  } catch {
    return null
  }
  const p = decoded.trim()
  if (!p.startsWith("/") || p.startsWith("//")) return null
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(p)) return null
  return p
}
