import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import IssuesPanel from '../components/IssuesPanel'
import PartPickerDialog from '../components/PartPickerDialog'
import PartSlot from '../components/PartSlot'
import PerformancePanel from '../components/PerformancePanel'
import { CATEGORY_ORDER } from '../domain/categories'
import { formatPrice } from '../domain/format'
import { buildRenamed, buildReset, partRemoved, partSelected } from '../features/currentBuild/currentBuildSlice'
import {
  selectCurrentBuild,
  selectEstimatedLoad,
  selectIssues,
  selectPerformance,
  selectSelectedParts,
  selectTotalPrice,
} from '../features/currentBuild/selectors'
import { buildSaved } from '../features/savedBuilds/savedBuildsSlice'
import type { Category, Part } from '../types/parts'

export default function BuilderPage() {
  const dispatch = useAppDispatch()
  const build = useAppSelector(selectCurrentBuild)
  const selected = useAppSelector(selectSelectedParts)
  const total = useAppSelector(selectTotalPrice)
  const issues = useAppSelector(selectIssues)
  const load = useAppSelector(selectEstimatedLoad)
  const performance = useAppSelector(selectPerformance)
  const [pickerCategory, setPickerCategory] = useState<Category | null>(null)
  const [justSaved, setJustSaved] = useState(false)

  const partCount = Object.keys(selected).length
  const showLoad = Boolean(selected.cpu || selected.gpu)

  const handleSelect = (part: Part) => {
    dispatch(partSelected({ category: part.category, partId: part.id }))
    setPickerCategory(null)
  }

  const handleSave = () => {
    dispatch(buildSaved(build.name.trim() || 'Untitled build', build.parts))
    setJustSaved(true)
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h4">Builder</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {showLoad && <Typography sx={{ color: 'text.secondary' }}>Estimated load: {load}W</Typography>}
          <Typography variant="h6">Total: {formatPrice(total)}</Typography>
          <Button variant="outlined" onClick={() => dispatch(buildReset())}>
            Reset
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          size="small"
          label="Build name"
          value={build.name}
          onChange={(event) => dispatch(buildRenamed(event.target.value))}
          sx={{ flex: 1, maxWidth: 360 }}
        />
        <Button variant="contained" disabled={partCount === 0} onClick={handleSave}>
          Save build
        </Button>
      </Stack>

      <IssuesPanel issues={issues} partCount={partCount} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        }}
      >
        {CATEGORY_ORDER.map((category) => (
          <PartSlot
            key={category}
            category={category}
            part={selected[category]}
            hasIssue={issues.some((issue) => issue.categories.includes(category))}
            onChoose={() => setPickerCategory(category)}
            onRemove={() => dispatch(partRemoved(category))}
          />
        ))}
      </Box>

      <PerformancePanel estimate={performance} />

      <PartPickerDialog
        category={pickerCategory}
        selectedId={pickerCategory ? selected[pickerCategory]?.id : undefined}
        onClose={() => setPickerCategory(null)}
        onSelect={handleSelect}
      />

      <Snackbar open={justSaved} autoHideDuration={3000} onClose={() => setJustSaved(false)}>
        <Alert severity="success" variant="filled" onClose={() => setJustSaved(false)}>
          Build saved
        </Alert>
      </Snackbar>
    </Stack>
  )
}