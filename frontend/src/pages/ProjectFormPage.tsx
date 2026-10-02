import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import api from '../api/client'
import FormSkeleton from '../components/skeletons/FormSkeleton'
import TechStackInput from '../components/TechStackInput'
import { useToast } from '../context/ToastContext'
import type { Project } from '../types'

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const isEdit = Boolean(id)

  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [deployPlatform, setDeployPlatform] = useState('')
  const [description, setDescription] = useState('')
  const [techStack, setTechStack] = useState('')
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const [thumbnailMsg, setThumbnailMsg] = useState<string | null>(null)

  const cached = queryClient.getQueryData<Project[]>(['projects'])?.find((p) => p.id === id)

  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => (await api.get<Project>(`/projects/${id}`)).data,
    enabled: isEdit,
    initialData: cached,
    retry: false,
  })

  useEffect(() => {
    if (project) {
      setName(project.name)
      setWebsiteUrl(project.websiteUrl)
      setGithubUrl(project.githubUrl ?? '')
      setDeployPlatform(project.deployPlatform ?? '')
      setDescription(project.description ?? '')
      setTechStack(project.techStack ?? '')
      setTrackingEnabled(project.trackingEnabled)
    }
  }, [project])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        name,
        websiteUrl,
        githubUrl: githubUrl || null,
        deployPlatform: deployPlatform || null,
        description: description || null,
        techStack: techStack || null,
        trackingEnabled,
      }
      if (isEdit) return (await api.patch<Project>(`/projects/${id}`, body)).data
      return (await api.post<Project>('/projects', body)).data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', data.id] })
      showToast(`${data.name} ${isEdit ? 'updated' : 'added'}`)
      navigate('/')
    },
    onError: () => {
      showToast('Could not save project. Check the fields and try again.', 'error')
    },
  })

  const refreshThumbnail = useMutation({
    mutationFn: async () => {
      const res = await api.post<{ thumbnailUrl: string }>(`/projects/${id}/thumbnail/refresh`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setThumbnailMsg('Thumbnail captured.')
      showToast('Thumbnail updated')
    },
    onError: () => {
      setThumbnailMsg('Capture failed. Check that the website URL is public.')
      showToast('Thumbnail capture failed', 'error')
    },
  })

  if (isEdit && isLoading && !project) {
    return (
      <Box>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 1 }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} /> Back
        </Link>
        <FormSkeleton />
      </Box>
    )
  }

  if (isEdit && (isError || (!isLoading && !project))) {
    return (
      <Box>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 2 }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} /> All projects
        </Link>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Project not found{error instanceof Error && error.message ? `: ${error.message}` : '.'}
        </Alert>
      </Box>
    )
  }

  return (
    <Box className="fade-in">
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, alignSelf: 'flex-start', minHeight: 40 }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} /> All projects
        </Link>
        <Typography variant="overline" color="text.secondary">
          Settings
        </Typography>
        <Typography variant="h4" sx={{ letterSpacing: '-0.02em' }}>
          {isEdit ? 'Edit project' : 'New project'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update catalog fields. Save when you are done.
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 4 }, '&:last-child': { pb: { xs: 2.5, md: 4 } } }}>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault()
              saveMutation.mutate()
            }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                <Stack spacing={2.5} sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Identity
                  </Typography>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Website URL"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="GitHub URL"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Deploy platform"
                    value={deployPlatform}
                    onChange={(e) => setDeployPlatform(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="vercel">Vercel</MenuItem>
                    <MenuItem value="netlify">Netlify</MenuItem>
                    <MenuItem value="gcp">GCP</MenuItem>
                    <MenuItem value="cloudflare">Cloudflare Pages</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                      Tech stack
                    </Typography>
                    <TechStackInput value={techStack} onChange={setTechStack} />
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={trackingEnabled}
                        onChange={(e) => setTrackingEnabled(e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Enable visitor tracking (optional)</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Optional. The hub works without it.
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                <Stack spacing={2.5} sx={{ width: '100%', flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notes & preview
                  </Typography>
                  <TextField
                    label="Notes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    minRows={isEdit ? 8 : 12}
                    fullWidth
                  />

                  {isEdit && (
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                        {project?.thumbnailUrl ? (
                          <Box
                            component="img"
                            src={project.thumbnailUrl}
                            alt={project.name}
                            sx={{
                              width: 180,
                              height: 104,
                              objectFit: 'cover',
                              objectPosition: 'top',
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'divider',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 180,
                              height: 104,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: 1,
                              borderStyle: 'dashed',
                              borderColor: 'divider',
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No thumb
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Thumbnail
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Auto-captured from your live URL.
                          </Typography>
                          {thumbnailMsg && (
                            <Typography
                              variant="caption"
                              color={
                                thumbnailMsg.includes('failed') || thumbnailMsg.includes('Capture failed')
                                  ? 'error.main'
                                  : 'success.main'
                              }
                              sx={{ display: 'block' }}
                            >
                              {thumbnailMsg}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setThumbnailMsg(null)
                            refreshThumbnail.mutate()
                          }}
                          disabled={refreshThumbnail.isPending}
                          sx={{ flexShrink: 0 }}
                        >
                          {refreshThumbnail.isPending ? 'Capturing...' : 'Refresh'}
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'flex-end',
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button component={RouterLink} to="/" variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
