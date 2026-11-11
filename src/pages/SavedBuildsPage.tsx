import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { CATEGORY_ORDER } from '../domain/categories'
import { formatPrice } from '../domain/format'
import { MAX_COMPARE, compareToggled } from '../features/compare/compareSlice'
import { buildLoaded } from '../features/currentBuild/currentBuildSlice'
import { buildDeleted } from '../features/savedBuilds/savedBuildsSlice'
import { selectSavedBuildsView } from '../features/savedBuilds/selectors'

export default function SavedBuildsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const views = useAppSelector(selectSavedBuildsView)
  const compareIds = useAppSelector((state) => state.compare.ids)

  if (views.length === 0) {
    return (
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h4">Saved builds</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          You have no saved builds yet. Create one in the builder and press Save build.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go to builder
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h4">Saved builds</Typography>
        <Button variant="contained" disabled={compareIds.length < 2} onClick={() => navigate('/compare')}>
          Compare selected ({compareIds.length}/{MAX_COMPARE})
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {views.map(({ build, parts, total, issueCount }) => {
          const isSelected = compareIds.includes(build.id)
          return (
            <Card key={build.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{build.name}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Saved {new Date(build.updatedAt).toLocaleDateString('en-US')} · {Object.keys(parts).length} of{' '}
                  {CATEGORY_ORDER.length} parts
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.5 }}>
                  <Typography sx={{ color: 'primary.main' }}>{formatPrice(total)}</Typography>
                  <Chip
                    size="small"
                    color={issueCount === 0 ? 'success' : 'error'}
                    label={issueCount === 0 ? 'No issues' : `${issueCount} issue${issueCount === 1 ? '' : 's'}`}
                  />
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    dispatch(buildLoaded({ name: build.name, parts: build.parts }))
                    navigate('/')
                  }}
                >
                  Open
                </Button>
                <Button color="error" onClick={() => dispatch(buildDeleted(build.id))}>
                  Delete
                </Button>
                <FormControlLabel
                  sx={{ ml: 'auto' }}
                  label="Compare"
                  control={
                    <Checkbox
                      checked={isSelected}
                      disabled={!isSelected && compareIds.length >= MAX_COMPARE}
                      onChange={() => dispatch(compareToggled(build.id))}
                    />
                  }
                />
              </CardActions>
            </Card>
          )
        })}
      </Box>
    </Stack>
  )
}