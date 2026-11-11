import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { buildDeleted } from '../savedBuilds/savedBuildsSlice'

export const MAX_COMPARE = 3

interface CompareState {
  ids: string[]
}

const initialState: CompareState = { ids: [] }

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    compareToggled(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((existing) => existing !== id)
      } else if (state.ids.length < MAX_COMPARE) {
        state.ids.push(id)
      }
    },
    compareCleared(state) {
      state.ids = []
    },
  },
  extraReducers: (builder) => {
    // A deleted build can no longer be compared.
    builder.addCase(buildDeleted, (state, action) => {
      state.ids = state.ids.filter((id) => id !== action.payload)
    })
  },
})

export const { compareToggled, compareCleared } = compareSlice.actions
export default compareSlice.reducer