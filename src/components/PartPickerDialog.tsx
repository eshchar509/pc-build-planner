import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAppSelector } from '../app/hooks'
import { CATEGORY_LABELS } from '../domain/categories'
import { describePart, formatPrice } from '../domain/format'
import { selectAllParts } from '../features/catalog/selectors'
import type { Category, Part } from '../types/parts'

type SortKey = 'price-asc' | 'price-desc' | 'name'

interface PartListProps {
  category: Category
  selectedId?: string
  onSelect: (part: Part) => void
}

// Lives inside the dialog content, so its filter state resets every time the dialog opens.
function PartList({ category, selectedId, onSelect }: PartListProps) {
  const allParts = useAppSelector(selectAllParts)
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const [sort, setSort] = useState<SortKey>('price-asc')

  const categoryParts = useMemo(
    () => allParts.filter((part) => part.category === category),
    [allParts, category],
  )
  const brands = useMemo(() => [...new Set(categoryParts.map((part) => part.brand))].sort(), [categoryParts])

  const visibleParts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categoryParts
      .filter((part) => brand === 'all' || part.brand === brand)
      .filter((part) => `${part.brand} ${part.name}`.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        return `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`)
      })
  }, [categoryParts, query, brand, sort])

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ flex: 1, minWidth: 180 }}
        />
        <TextField
          select
          size="small"
          label="Brand"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="all">All brands</MenuItem>
          {brands.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Sort by"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="price-asc">Price: low to high</MenuItem>
          <MenuItem value="price-desc">Price: high to low</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </TextField>
      </Box>

      {visibleParts.length === 0 ? (
        <Typography sx={{ color: 'text.secondary', py: 2 }}>No parts match your filters.</Typography>
      ) : (
        <List disablePadding>
          {visibleParts.map((part) => (
            <ListItemButton key={part.id} selected={part.id === selectedId} onClick={() => onSelect(part)}>
              <ListItemText
                primary={`${part.brand} ${part.name}`}
                secondary={`${formatPrice(part.price)} · ${describePart(part)}`}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </>
  )
}

interface PartPickerDialogProps {
  category: Category | null
  selectedId?: string
  onClose: () => void
  onSelect: (part: Part) => void
}

export default function PartPickerDialog({ category, selectedId, onClose, onSelect }: PartPickerDialogProps) {
  return (
    <Dialog open={category !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Choose {category ? CATEGORY_LABELS[category] : ''}</DialogTitle>
      <DialogContent dividers>
        {category && <PartList key={category} category={category} selectedId={selectedId} onSelect={onSelect} />}
      </DialogContent>
    </Dialog>
  )
}