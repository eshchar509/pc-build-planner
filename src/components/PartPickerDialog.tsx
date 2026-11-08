import { useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useAppSelector } from '../app/hooks'
import { CATEGORY_LABELS } from '../domain/categories'
import { formatPrice } from '../domain/format'
import { selectAllParts } from '../features/catalog/selectors'
import type { Category, Part } from '../types/parts'

interface PartPickerDialogProps {
  category: Category | null
  selectedId?: string
  onClose: () => void
  onSelect: (part: Part) => void
}

export default function PartPickerDialog({ category, selectedId, onClose, onSelect }: PartPickerDialogProps) {
  const allParts = useAppSelector(selectAllParts)
  const parts = useMemo(
    () => (category ? allParts.filter((part) => part.category === category) : []),
    [allParts, category],
  )

  return (
    <Dialog open={category !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Choose {category ? CATEGORY_LABELS[category] : ''}</DialogTitle>
      <DialogContent dividers>
        <List disablePadding>
          {parts.map((part) => (
            <ListItemButton key={part.id} selected={part.id === selectedId} onClick={() => onSelect(part)}>
              <ListItemText primary={`${part.brand} ${part.name}`} secondary={formatPrice(part.price)} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}