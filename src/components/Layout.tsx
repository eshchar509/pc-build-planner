import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
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

function titleFor(pathname: string): string {
  if (pathname === '/') return 'Builder'
  if (pathname === '/builds') return 'Saved builds'
  if (pathname === '/compare') return 'Compare'
  if (pathname.startsWith('/b/')) return 'Shared build'
  return 'Page not found'
}

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    document.title = `${titleFor(pathname)} · PC Build Planner`

    // After navigating, move focus to the page content so keyboard and screen reader users
    // start at the new page instead of the top of the old one. Not on the first load.
    if (previousPath.current !== pathname) {
      previousPath.current = pathname
      mainRef.current?.focus()
    }
  }, [pathname])

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        component="a"
        href="#main-content"
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          mainRef.current?.focus()
        }}
        sx={{
          position: 'absolute',
          left: -9999,
          top: 8,
          zIndex: 'tooltip',
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          '&:focus': { left: 16 },
        }}
      >
        Skip to content
      </Box>

      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap', py: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, whiteSpace: 'nowrap' }}>
            PC Build Planner
          </Typography>
          <Box component="nav" aria-label="Main" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button component="span" color={isActive ? 'primary' : 'inherit'}>
                    {link.label}
                  </Button>
                )}
              </NavLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <main ref={mainRef} id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </main>
    </Box>
  )
}