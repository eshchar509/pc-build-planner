import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { CATEGORY_LABELS } from '../domain/categories'
import { formatPrice } from '../domain/format'
import type { Category, Part } from '../types/parts'

interface PartSlotProps {
  category: Category
  part?: Part
  onChoose: () => void
  onRemove: () => void
}

export default function PartSlot({ category, part, onChoose, onRemove }: PartSlotProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {CATEGORY_LABELS[category]}
        </Typography>
        {part ? (
          <>
            <Typography variant="h6">
              {part.brand} {part.name}
            </Typography>
            <Typography sx={{ color: 'primary.main' }}>{formatPrice(part.price)}</Typography>
          </>
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>No part selected</Typography>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={onChoose}>{part ? 'Change' : 'Choose'}</Button>
        {part && (
          <Button color="error" onClick={onRemove}>
            Remove
          </Button>
        )}
      </CardActions>
    </Card>
  )
}