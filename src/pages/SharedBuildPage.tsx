import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'

export default function SharedBuildPage() {
  const { code } = useParams()
  return <Typography variant="h4">Shared build ({code?.length ?? 0} chars)</Typography>
}