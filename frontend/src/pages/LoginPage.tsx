import { useState } from 'react'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
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
          <Stack spacing={1}>
            <Typography variant="h4" component="h1" sx={{ letterSpacing: '-0.02em' }}>
              Sharif Lab
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your project hub.
            </Typography>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Box
              component="form"
              sx={{ mt: 3 }}
              onSubmit={async (e) => {
                e.preventDefault()
                setError('')
                setSubmitting(true)
                try {
                  await login(loginValue, password)
                  navigate('/')
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Sign in failed')
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                  label="Email or username"
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                  required
                  fullWidth
                  autoComplete="username"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoComplete="current-password"
                />
                <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
                  {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  No account yet?{' '}
                  <Link component={RouterLink} to="/register">
                    Create one
                  </Link>
                </Typography>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
