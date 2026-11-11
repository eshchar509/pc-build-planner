import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { resolveSelection, totalPrice } from '../../domain/build'
import { checkCompatibility } from '../../domain/compatibility'

const selectSavedBuilds = (state: RootState) => state.savedBuilds.items
const selectCatalogEntities = (state: RootState) => state.catalog.entities

// Each saved build together with its resolved parts, price and number of compatibility issues.
export const selectSavedBuildsView = createSelector(
  [selectSavedBuilds, selectCatalogEntities],
  (builds, entities) =>
    builds.map((build) => {
      const parts = resolveSelection(build.parts, entities)
      return { build, parts, total: totalPrice(parts), issueCount: checkCompatibility(parts).length }
    }),
)