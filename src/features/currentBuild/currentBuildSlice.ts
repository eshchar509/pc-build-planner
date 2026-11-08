import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Category } from '../../types/parts'
import type { Selection } from '../../types/build'

interface CurrentBuildState {
  name: string
  parts: Selection
}

const initialState: CurrentBuildState = {
  name: 'My new build',
  parts: {},
}

const currentBuildSlice = createSlice({
  name: 'currentBuild',
  initialState,
  reducers: {
    partSelected(state, action: PayloadAction<{ category: Category; partId: string }>) {
      state.parts[action.payload.category] = action.payload.partId
    },
    partRemoved(state, action: PayloadAction<Category>) {
      delete state.parts[action.payload]
    },
    buildRenamed(state, action: PayloadAction<string>) {
      state.name = action.payload
    },
    buildReset: () => initialState,
  },
})

export const { partSelected, partRemoved, buildRenamed, buildReset } = currentBuildSlice.actions
export default currentBuildSlice.reducer