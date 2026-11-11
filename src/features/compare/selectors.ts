import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { selectSavedBuildsView, type SavedBuildView } from '../savedBuilds/selectors'

const selectCompareIds = (state: RootState) => state.compare.ids

// The builds picked for comparison, in the order they were picked.
export const selectCompareViews = createSelector([selectSavedBuildsView, selectCompareIds], (views, ids) =>
  ids
    .map((id) => views.find((view) => view.build.id === id))
    .filter((view): view is SavedBuildView => view !== undefined),
)