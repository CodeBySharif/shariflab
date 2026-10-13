import { useEffect, useState } from 'react'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { useAuth } from '../context/AuthContext'
import { useColorMode } from '../context/ColorModeContext'
import { useToast } from '../context/ToastContext'

export interface LayoutOutletContext {
  showAddForm: boolean
  setShowAddForm: (open: boolean) => void
}

export default function Layout() {
  const { user, signOut } = useAuth()
  const { mode, toggleMode } = useColorMode()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [showAddForm, setShowAddForm] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  useEffect(() => {
    if (!isHome) setShowAddForm(false)
  }, [isHome])

  const initial = (user?.displayName || user?.username || '?').charAt(0).toUpperCase()

  const onAddClick = () => {
    if (isHome) {
      setShowAddForm((open) => !open)
      return
    }
    navigate('/?add=1')
  }

  const copyShareLink = async () => {
    if (!user?.username) return
    const url = `${window.location.origin}/u/${user.username}`
    await navigator.clipboard.writeText(url)
    showToast('Public hub link copied')
    setMenuAnchor(null)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ flexShrink: 0 }}>
        <Container>
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'text.primary',
                mr: 'auto',
                minHeight: 44,
              }}
            >
              <Box
                component="img"
                src="/logo.svg"
                alt=""
                sx={{ width: 28, height: 28, borderRadius: '6px' }}
              />
              <Box>
                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Sharif Lab
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.2 }}
                >
                  Project hub
                </Typography>
              </Box>
            </Box>

            <Tooltip title={mode === 'dark' ? 'Day mode' : 'Night mode'}>
              <IconButton size="small" onClick={toggleMode} aria-label="Toggle color mode">
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>

            <Button
              size="small"
              variant={isHome && showAddForm ? 'outlined' : 'contained'}
              color={isHome && showAddForm ? 'inherit' : 'primary'}
              startIcon={
                isHome && showAddForm ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />
              }
              onClick={onAddClick}
            >
              {isHome && showAddForm ? 'Cancel' : 'Add project'}
            </Button>

            <Tooltip title="Account">
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                aria-label="Account menu"
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  {initial}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={menuAnchor}
              open={!!menuAnchor}
              onClose={() => setMenuAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{ paper: { sx: { mt: 1.5, minWidth: 220 } } }}
            >
              {user && (
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Typography variant="overline" color="text.secondary">
                    Signed in as
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    @{user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                    {user.email}
                  </Typography>
                </Box>
              )}
              <Divider />
              <MenuItem onClick={copyShareLink} sx={{ minHeight: 44, fontSize: '0.875rem' }}>
                <ShareOutlinedIcon sx={{ fontSize: 18, mr: 1.25 }} />
                Copy public hub link
              </MenuItem>
              {user && (
                <MenuItem
                  component={RouterLink}
                  to={`/u/${user.username}`}
                  onClick={() => setMenuAnchor(null)}
                  sx={{ minHeight: 44, fontSize: '0.875rem' }}
                >
                  View public hub
                </MenuItem>
              )}
              <Divider />
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null)
                  signOut()
                }}
                sx={{ minHeight: 44, fontSize: '0.875rem' }}
              >
                <LogoutIcon sx={{ fontSize: 18, mr: 1.25 }} />
                Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: { xs: 2, md: 3 } }}>
        <Container>
          <Outlet context={{ showAddForm, setShowAddForm } satisfies LayoutOutletContext} />
        </Container>
      </Box>
    </Box>
  )
}
