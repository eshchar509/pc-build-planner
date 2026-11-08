import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useAppDispatch, useAppSelector } from './app/hooks'
import Layout from './components/Layout'
import { fetchCatalog } from './features/catalog/catalogSlice'
import BuilderPage from './pages/BuilderPage'
import ComparePage from './pages/ComparePage'
import NotFoundPage from './pages/NotFoundPage'
import SavedBuildsPage from './pages/SavedBuildsPage'
import SharedBuildPage from './pages/SharedBuildPage'

export default function App() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.catalog.status)
  const error = useAppSelector((state) => state.catalog.error)

  useEffect(() => {
    dispatch(fetchCatalog())
  }, [dispatch])

  if (status === 'failed') {
    return <Alert severity="error">Failed to load the parts catalog: {error}</Alert>
  }

  if (status !== 'succeeded') {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BuilderPage />} />
        <Route path="builds" element={<SavedBuildsPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="b/:code" element={<SharedBuildPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}