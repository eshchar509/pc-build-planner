import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchCatalog } from './features/catalog/catalogSlice'

export default function App() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.catalog.status)
  const error = useAppSelector((state) => state.catalog.error)
  const count = useAppSelector((state) => state.catalog.ids.length)

  useEffect(() => {
    dispatch(fetchCatalog())
  }, [dispatch])

  return (
    <div>
      <h1>PC Build Planner</h1>
      {status === 'loading' && <p>Loading catalog...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && <p>Loaded {count} parts</p>}
    </div>
  )
}