import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { PerformanceEstimate, ScoreResult } from '../domain/performance'

interface ScoreRowProps {
  label: string
  result: ScoreResult | null
  missing: string
}

function ScoreRow({ label, result, missing }: ScoreRowProps) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle2">{label}</Typography>
        {result && <Chip size="small" color="primary" variant="outlined" label={result.tier} />}
      </Stack>
      {result ? (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <LinearProgress
            variant="determinate"
            value={result.score}
            aria-label={`${label} score`}
            sx={{ flex: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" sx={{ minWidth: 64, textAlign: 'right' }}>
            {result.score} / 100
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {missing}
        </Typography>
      )}
    </Box>
  )
}

interface PerformancePanelProps {
  estimate: PerformanceEstimate
}

export default function PerformancePanel({ estimate }: PerformancePanelProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Performance estimate</Typography>
          <ScoreRow label="Gaming" result={estimate.gaming} missing="Select a CPU and a graphics card to estimate." />
          <ScoreRow label="Work" result={estimate.work} missing="Select a CPU, a graphics card and memory to estimate." />
          {estimate.bottleneck && <Alert severity="warning">{estimate.bottleneck}</Alert>}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            A rough estimate from sample benchmark scores, not a measurement.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}