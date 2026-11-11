import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import type { CompatibilityIssue } from '../domain/compatibility'

interface IssuesPanelProps {
  issues: CompatibilityIssue[]
  partCount: number
}

export default function IssuesPanel({ issues, partCount }: IssuesPanelProps) {
  // With fewer than two parts there is nothing to compare yet.
  if (partCount < 2) return null

  if (issues.length === 0) {
    return <Alert severity="success">All selected parts are compatible.</Alert>
  }

  return (
    <Stack spacing={1}>
      {issues.map((issue) => (
        <Alert key={issue.id} severity="error">
          {issue.message}
        </Alert>
      ))}
    </Stack>
  )
}