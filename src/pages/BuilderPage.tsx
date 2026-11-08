import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { buildReset, partSelected } from '../features/currentBuild/currentBuildSlice'
import { selectSelectedParts, selectTotalPrice } from '../features/currentBuild/selectors'

export default function BuilderPage() {
  const dispatch = useAppDispatch()
  const count = useAppSelector((state) => state.catalog.ids.length)
  const selected = useAppSelector(selectSelectedParts)
  const total = useAppSelector(selectTotalPrice)

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Typography variant="h4">Builder</Typography>
      <Typography sx={{ color: 'text.secondary' }}>Catalog: {count} parts</Typography>
      {/* TEMP demo: replaced by the real part slots in the next steps */}
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => dispatch(partSelected({ category: 'cpu', partId: 'cpu-ryzen5-7600' }))}>
          Select Ryzen 5 7600
        </Button>
        <Button variant="outlined" onClick={() => dispatch(buildReset())}>
          Reset
        </Button>
      </Stack>
      <Typography>CPU: {selected.cpu?.name ?? 'none'}</Typography>
      <Typography>Total: ${total}</Typography>
    </Stack>
  )
}