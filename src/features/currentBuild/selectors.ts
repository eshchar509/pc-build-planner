import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Category, Part } from '../../types/parts'

export const selectCurrentBuild = (state: RootState) => state.currentBuild
const selectCatalogEntities = (state: RootState) => state.catalog.entities

// Resolves the stored ids into full Part objects, skipping ids missing from the catalog.
export const selectSelectedParts = createSelector(
  [selectCurrentBuild, selectCatalogEntities],
  (build, entities): Partial<Record<Category, Part>> => {
    const result: Partial<Record<Category, Part>> = {}
    for (const category of Object.keys(build.parts) as Category[]) {
      const id = build.parts[category]
      if (!id) continue
      const part = entities[id]
      if (part) result[category] = part
    }
    return result
  },
)

export const selectTotalPrice = createSelector([selectSelectedParts], (parts) =>
  Object.values(parts).reduce((sum, part) => sum + (part?.price ?? 0), 0),
)