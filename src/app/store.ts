import { configureStore } from '@reduxjs/toolkit'
import catalogReducer from '../features/catalog/catalogSlice'
import currentBuildReducer from '../features/currentBuild/currentBuildSlice'

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    currentBuild: currentBuildReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch