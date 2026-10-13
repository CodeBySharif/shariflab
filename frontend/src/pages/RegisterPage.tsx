import { useState } from 'react'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function RegisterPage() {
  const { user, loading, register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
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
              Create account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your public hub will be at /u/your-username
            </Typography>
          </Stack>

          <Box
            component="form"
            sx={{ mt: 3 }}
            onSubmit={async (e) => {
              e.preventDefault()
              setError('')
              setSubmitting(true)
              try {
                await register({
                  username,
                  email,
                  password,
                  displayName: displayName || undefined,
                })
                navigate('/')
              } catch (err) {
                if (axios.isAxiosError(err)) {
                  const data = err.response?.data as { error?: string } | undefined
                  setError(typeof data?.error === 'string' ? data.error : 'Registration failed')
                } else {
                  setError('Registration failed')
                }
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                fullWidth
                helperText="3-30 chars, lowercase, numbers, hyphens"
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                helperText="At least 8 characters"
              />
              <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
                {submitting ? 'Creating…' : 'Create account'}
              </Button>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
