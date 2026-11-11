import { configureStore } from '@reduxjs/toolkit'
import catalogReducer from '../features/catalog/catalogSlice'
import currentBuildReducer from '../features/currentBuild/currentBuildSlice'
import savedBuildsReducer from '../features/savedBuilds/savedBuildsSlice'
import { saveBuilds } from '../features/savedBuilds/storage'

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    currentBuild: currentBuildReducer,
    savedBuilds: savedBuildsReducer,
  },
})

// Persist the saved builds whenever that slice changes (and only then).
let previousItems = store.getState().savedBuilds.items
store.subscribe(() => {
  const items = store.getState().savedBuilds.items
  if (items !== previousItems) {
    previousItems = items
    saveBuilds(items)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch