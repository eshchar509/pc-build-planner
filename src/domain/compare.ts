export type Preference = 'highest' | 'lowest'

// Indices of the best values in a row. Missing values (null) are ignored, and nothing is
// highlighted when fewer than two values exist or when every value is the same.
export function bestIndices(values: (number | null)[], prefer: Preference): number[] {
  const present = values.filter((value): value is number => value !== null)
  if (present.length < 2) return []

  const best = prefer === 'highest' ? Math.max(...present) : Math.min(...present)
  if (present.every((value) => value === best)) return []

  return values.flatMap((value, index) => (value === best ? [index] : []))
}