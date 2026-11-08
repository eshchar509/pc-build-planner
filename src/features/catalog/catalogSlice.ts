import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import axios from 'axios'
import type { Part } from '../../types/parts'

const catalogAdapter = createEntityAdapter<Part>()

export const fetchCatalog = createAsyncThunk('catalog/fetchCatalog', async () => {
  const response = await axios.get<Part[]>('/data/components.json')
  return response.data
})

interface CatalogExtraState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: catalogAdapter.getInitialState<CatalogExtraState>({
    status: 'idle',
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded'
        catalogAdapter.setAll(state, action.payload)
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load catalog'
      })
  },
})

export default catalogSlice.reducer