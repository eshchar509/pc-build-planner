import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchCatalog } from './features/catalog/catalogSlice'
import { buildReset, partSelected } from './features/currentBuild/currentBuildSlice'
import { selectSelectedParts, selectTotalPrice } from './features/currentBuild/selectors'

export default function App() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.catalog.status)
  const error = useAppSelector((state) => state.catalog.error)
  const count = useAppSelector((state) => state.catalog.ids.length)
  const selected = useAppSelector(selectSelectedParts)
  const total = useAppSelector(selectTotalPrice)

  useEffect(() => {
    dispatch(fetchCatalog())
  }, [dispatch])

  return (
    <div>
      <h1>PC Build Planner</h1>
      {status === 'loading' && <p>Loading catalog...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && <p>Loaded {count} parts</p>}

      {/* TEMP demo: will be removed when the real UI is built */}
      <button onClick={() => dispatch(partSelected({ category: 'cpu', partId: 'cpu-ryzen5-7600' }))}>
        Select Ryzen 5 7600
      </button>
      <button onClick={() => dispatch(buildReset())}>Reset</button>
      <p>CPU: {selected.cpu?.name ?? 'none'}</p>
      <p>Total: ${total}</p>
    </div>
  )
}