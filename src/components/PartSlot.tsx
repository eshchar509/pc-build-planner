import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CATEGORY_LABELS } from '../domain/categories'
import { describePart, formatPrice } from '../domain/format'
import type { Category, Part } from '../types/parts'

interface PartSlotProps {
  category: Category
  part?: Part
  hasIssue?: boolean
  onChoose: () => void
  onRemove: () => void
}

export default function PartSlot({ category, part, hasIssue = false, onChoose, onRemove }: PartSlotProps) {
  const label = CATEGORY_LABELS[category]

  return (
    <Card variant="outlined" sx={hasIssue ? { borderColor: 'error.main' } : undefined}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: 28 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
          {hasIssue && <Chip size="small" color="error" label="Compatibility issue" />}
        </Stack>
        {part ? (
          <>
            <Typography variant="h6">
              {part.brand} {part.name}
            </Typography>
            <Typography sx={{ color: 'primary.main' }}>{formatPrice(part.price)}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {describePart(part)}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>No part selected</Typography>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={onChoose} aria-label={`${part ? 'Change' : 'Choose'} ${label}`}>
          {part ? 'Change' : 'Choose'}
        </Button>
        {part && (
          <Button color="error" onClick={onRemove} aria-label={`Remove ${label}`}>
            Remove
          </Button>
        )}
      </CardActions>
    </Card>
  )
}