import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Build, Selection } from '../../types/build'
import { loadBuilds } from './storage'

interface SavedBuildsState {
  items: Build[]
}

const initialState: SavedBuildsState = {
  items: loadBuilds(),
}

const savedBuildsSlice = createSlice({
  name: 'savedBuilds',
  initialState,
  reducers: {
    buildSaved: {
      reducer(state, action: PayloadAction<Build>) {
        state.items.unshift(action.payload)
      },
      // Reducers must be pure, so the random id and timestamps are created in `prepare`.
      prepare(name: string, parts: Selection) {
        const now = new Date().toISOString()
        const build: Build = { id: crypto.randomUUID(), name, parts, createdAt: now, updatedAt: now }
        return { payload: build }
      },
    },
    buildDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter((build) => build.id !== action.payload)
    },
  },
})

export const { buildSaved, buildDeleted } = savedBuildsSlice.actions
export default savedBuildsSlice.reducer