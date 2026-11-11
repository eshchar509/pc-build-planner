import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { resolveSelection, totalPrice } from '../../domain/build'
import { checkCompatibility, estimateLoadW } from '../../domain/compatibility'
import { estimatePerformance } from '../../domain/performance'

export const selectCurrentBuild = (state: RootState) => state.currentBuild
const selectCatalogEntities = (state: RootState) => state.catalog.entities

export const selectSelectedParts = createSelector(
  [selectCurrentBuild, selectCatalogEntities],
  (build, entities) => resolveSelection(build.parts, entities),
)

export const selectTotalPrice = createSelector([selectSelectedParts], totalPrice)

export const selectIssues = createSelector([selectSelectedParts], checkCompatibility)

export const selectEstimatedLoad = createSelector([selectSelectedParts], estimateLoadW)

export const selectPerformance = createSelector([selectSelectedParts], estimatePerformance)