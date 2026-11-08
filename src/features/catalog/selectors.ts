import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

export const selectAllParts = createSelector(
  [(state: RootState) => state.catalog.ids, (state: RootState) => state.catalog.entities],
  (ids, entities) => ids.map((id) => entities[id]),
)