import { NavLink, Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const links = [
  { to: '/', label: 'Builder', end: true },
  { to: '/builds', label: 'Saved builds', end: false },
  { to: '/compare', label: 'Compare', end: false },
]

export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            PC Build Planner
          </Typography>
          {links.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              end={link.end}
              color="inherit"
              sx={{ '&.active': { color: 'primary.main' } }}
            >
              {link.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}