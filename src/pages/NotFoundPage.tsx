import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Typography variant="h4">Page not found</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Back to builder
      </Button>
    </Stack>
  )
}