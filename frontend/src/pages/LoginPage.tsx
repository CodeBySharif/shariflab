import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 3, sm: 4 } } }}>
          <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
            <Box
              component="img"
              src="/logo.svg"
              alt=""
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                boxShadow: (t) =>
                  t.palette.mode === 'dark'
                    ? 'inset 0 1px 0 rgba(255,255,255,0.14)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            />
            <Box>
              <Typography variant="h4" component="h1" sx={{ letterSpacing: '-0.02em' }}>
                Sharif Lab
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                Sign in to open your project hub.
              </Typography>
            </Box>
          </Stack>

          {loading ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}
              role="status"
              aria-live="polite"
            >
              <CircularProgress size={28} />
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                }}
              >
                Checking session
              </Box>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 4 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<GoogleIcon />}
                disabled={submitting}
                onClick={async () => {
                  setError('')
                  setSubmitting(true)
                  try {
                    await signInWithGoogle()
                  } catch (e) {
                    setError(e instanceof Error ? e.message : 'Sign in failed')
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {submitting ? 'Opening Google…' : 'Continue with Google'}
              </Button>
              <Typography variant="caption" color="text.secondary">
                Private catalog for your deployed sites. One account, your shelf only.
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
