import { useEffect, useState } from 'react'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
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
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
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
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          flexShrink: 0,
          bgcolor: 'primary.main',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          color: '#000',
        }}
      >
        <Container>
          <Toolbar disableGutters sx={{ gap: 0.5 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                textDecoration: 'none',
                color: '#000',
                mr: 'auto',
                minHeight: 44,
              }}
            >
              <FolderOutlinedIcon sx={{ fontSize: 26, color: '#000' }} />
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  color: '#000',
                }}
              >
                Project hub
              </Typography>
            </Box>

            {user && (
              <>
                <Tooltip title="Copy public hub link" arrow>
                  <IconButton
                    size="small"
                    onClick={copyShareLink}
                    aria-label="Copy public hub link"
                    sx={{ width: 40, height: 40, color: '#000' }}
                  >
                    <ShareOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View public hub" arrow>
                  <IconButton
                    component={RouterLink}
                    to={`/u/${user.username}`}
                    size="small"
                    aria-label="View public hub"
                    sx={{ width: 40, height: 40, color: '#000' }}
                  >
                    <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} arrow>
              <IconButton
                size="small"
                onClick={toggleMode}
                aria-label="Toggle color mode"
                sx={{ width: 40, height: 40, color: '#000' }}
              >
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title={isHome && showAddForm ? 'Cancel' : 'Add project'} arrow>
              <IconButton
                size="small"
                onClick={onAddClick}
                aria-label={isHome && showAddForm ? 'Cancel' : 'Add project'}
                sx={{
                  width: 40,
                  height: 40,
                  color: '#000',
                  bgcolor: isHome && showAddForm ? 'transparent' : 'rgba(0,0,0,0.08)',
                  border: 1,
                  borderColor: 'rgba(0,0,0,0.35)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.14)',
                  },
                }}
              >
                {isHome && showAddForm ? (
                  <CloseIcon sx={{ fontSize: 20 }} />
                ) : (
                  <AddIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Account" arrow>
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                aria-label="Account menu"
                sx={{ p: 0.5, width: 40, height: 40 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: '#000',
                    color: '#fff',
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
