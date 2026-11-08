import type { Category } from './parts'

// Which part (by id) is chosen for each category. Everything else is derived via selectors.
export type Selection = Partial<Record<Category, string>>

export interface Build {
  id: string
  name: string
  parts: Selection
  createdAt: string
  updatedAt: string
}