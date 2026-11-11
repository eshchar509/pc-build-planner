import type { Selection } from '../types/build'
import type { Category, Part, PartsByCategory } from '../types/parts'

// Turns a stored selection (ids) into real parts. Ids that are missing from the catalog,
// or that point at a part of the wrong category, are skipped.
export function resolveSelection(selection: Selection, entities: Record<string, Part | undefined>): PartsByCategory {
  const result: PartsByCategory = {}
  for (const category of Object.keys(selection) as Category[]) {
    const id = selection[category]
    if (!id) continue
    const part = entities[id]
    // The runtime check guarantees the part belongs to the slot, so the cast is safe.
    if (part && part.category === category) {
      ;(result as Partial<Record<Category, Part>>)[category] = part
    }
  }
  return result
}

export function totalPrice(parts: PartsByCategory): number {
  return Object.values(parts).reduce((sum, part) => sum + (part?.price ?? 0), 0)
}