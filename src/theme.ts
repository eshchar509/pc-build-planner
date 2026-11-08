import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4fc3f7' },
    background: { default: '#0f1419', paper: '#171d24' },
  },
  shape: { borderRadius: 10 },
})