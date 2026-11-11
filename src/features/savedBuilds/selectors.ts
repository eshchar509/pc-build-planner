import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { resolveSelection, totalPrice } from '../../domain/build'
import { checkCompatibility, estimateLoadW } from '../../domain/compatibility'
import { estimatePerformance } from '../../domain/performance'

const selectSavedBuilds = (state: RootState) => state.savedBuilds.items
const selectCatalogEntities = (state: RootState) => state.catalog.entities

// Each saved build together with everything derived from it: parts, price, issues, load and performance.
export const selectSavedBuildsView = createSelector(
  [selectSavedBuilds, selectCatalogEntities],
  (builds, entities) =>
    builds.map((build) => {
      const parts = resolveSelection(build.parts, entities)
      return {
        build,
        parts,
        total: totalPrice(parts),
        issueCount: checkCompatibility(parts).length,
        loadW: estimateLoadW(parts),
        performance: estimatePerformance(parts),
      }
    }),
)

export type SavedBuildView = ReturnType<typeof selectSavedBuildsView>[number]