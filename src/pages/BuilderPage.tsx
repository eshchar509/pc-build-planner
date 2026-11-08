import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import PartPickerDialog from '../components/PartPickerDialog'
import PartSlot from '../components/PartSlot'
import { CATEGORY_ORDER } from '../domain/categories'
import { formatPrice } from '../domain/format'
import { buildReset, partRemoved, partSelected } from '../features/currentBuild/currentBuildSlice'
import { selectSelectedParts, selectTotalPrice } from '../features/currentBuild/selectors'
import type { Category, Part } from '../types/parts'

export default function BuilderPage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(selectSelectedParts)
  const total = useAppSelector(selectTotalPrice)
  const [pickerCategory, setPickerCategory] = useState<Category | null>(null)

  const handleSelect = (part: Part) => {
    dispatch(partSelected({ category: part.category, partId: part.id }))
    setPickerCategory(null)
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h4">Builder</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h6">Total: {formatPrice(total)}</Typography>
          <Button variant="outlined" onClick={() => dispatch(buildReset())}>
            Reset
          </Button>
        </Stack>
      </Stack>

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
            onChoose={() => setPickerCategory(category)}
            onRemove={() => dispatch(partRemoved(category))}
          />
        ))}
      </Box>

      <PartPickerDialog
        category={pickerCategory}
        selectedId={pickerCategory ? selected[pickerCategory]?.id : undefined}
        onClose={() => setPickerCategory(null)}
        onSelect={handleSelect}
      />
    </Stack>
  )
}