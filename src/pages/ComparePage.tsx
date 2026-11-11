import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { bestIndices, type Preference } from '../domain/compare'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../domain/categories'
import { formatPrice } from '../domain/format'
import { compareCleared, compareToggled } from '../features/compare/compareSlice'
import { selectCompareViews } from '../features/compare/selectors'

interface MetricRow {
  label: string
  values: (number | null)[]
  format: (value: number) => string
  prefer?: Preference
}

const bestStyle = { color: 'success.main', fontWeight: 700 }

export default function ComparePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const views = useAppSelector(selectCompareViews)

  if (views.length < 2) {
    return (
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h4">Compare</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Pick at least two saved builds to compare them side by side.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/builds')}>
          Go to saved builds
        </Button>
      </Stack>
    )
  }

  const metrics: MetricRow[] = [
    { label: 'Total price', values: views.map((view) => view.total), format: formatPrice, prefer: 'lowest' },
    {
      label: 'Gaming score',
      values: views.map((view) => view.performance.gaming?.score ?? null),
      format: (value) => `${value} / 100`,
      prefer: 'highest',
    },
    {
      label: 'Work score',
      values: views.map((view) => view.performance.work?.score ?? null),
      format: (value) => `${value} / 100`,
      prefer: 'highest',
    },
    { label: 'Estimated load', values: views.map((view) => view.loadW), format: (value) => `${value}W` },
    {
      label: 'Compatibility issues',
      values: views.map((view) => view.issueCount),
      format: (value) => (value === 0 ? 'None' : String(value)),
      prefer: 'lowest',
    },
  ]

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Compare</Typography>
        <Button variant="outlined" onClick={() => dispatch(compareCleared())}>
          Clear
        </Button>
      </Stack>

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                {views.map((view) => (
                  <TableCell key={view.build.id}>
                    <Typography variant="subtitle1">{view.build.name}</Typography>
                    <Button size="small" color="error" onClick={() => dispatch(compareToggled(view.build.id))}>
                      Remove
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {metrics.map((metric) => {
                const best = metric.prefer ? bestIndices(metric.values, metric.prefer) : []
                return (
                  <TableRow key={metric.label}>
                    <TableCell sx={{ fontWeight: 600 }}>{metric.label}</TableCell>
                    {views.map((view, index) => {
                      const value = metric.values[index] ?? null
                      return (
                        <TableCell key={view.build.id} sx={best.includes(index) ? bestStyle : undefined}>
                          {value === null ? '—' : metric.format(value)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}

              {CATEGORY_ORDER.map((category) => (
                <TableRow key={category}>
                  <TableCell sx={{ fontWeight: 600 }}>{CATEGORY_LABELS[category]}</TableCell>
                  {views.map((view) => {
                    const part = view.parts[category]
                    return <TableCell key={view.build.id}>{part ? `${part.brand} ${part.name}` : '—'}</TableCell>
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  )
}