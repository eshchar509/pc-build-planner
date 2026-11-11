import type { Build } from '../../types/build'

const STORAGE_KEY = 'pc-build-planner:saved-builds'

// localStorage content is untrusted: it can be missing, edited by hand, or from an older version.
function isBuild(value: unknown): value is Build {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    typeof candidate.parts === 'object' &&
    candidate.parts !== null
  )
}

export function loadBuilds(): Build[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isBuild) : []
  } catch {
    return []
  }
}

export function saveBuilds(builds: Build[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds))
  } catch {
    // Storage may be full or disabled; losing persistence should not break the app.
  }
}