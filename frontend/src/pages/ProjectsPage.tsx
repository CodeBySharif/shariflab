import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import api from '../api/client'
import DeleteModal from '../components/DeleteModal'
import ProjectCard from '../components/ProjectCard'
import ProjectGridSkeleton from '../components/skeletons/ProjectGridSkeleton'
import TechStackInput from '../components/TechStackInput'
import type { LayoutOutletContext } from '../components/Layout'
import { useToast } from '../context/ToastContext'
import type { Project, ProjectCreated } from '../types'

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { showAddForm, setShowAddForm } = useOutletContext<LayoutOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [deployPlatform, setDeployPlatform] = useState('')
  const [description, setDescription] = useState('')
  const [techStack, setTechStack] = useState('')
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const [createdSecret, setCreatedSecret] = useState<{ snippet: string; secret: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [exitingId, setExitingId] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('add') === '1') {
      setShowAddForm(true)
      searchParams.delete('add')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams, setShowAddForm])

  const finishDelete = (id: string) => {
    queryClient.setQueryData<Project[]>(['projects'], (old) => old?.filter((p) => p.id !== id) ?? [])
    setExitingId(null)
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  const {
    data: projects = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await api.get<Project[]>('/projects')).data,
  })

  const createMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post<ProjectCreated>('/projects', {
          name,
          websiteUrl,
          githubUrl: githubUrl || null,
          deployPlatform: deployPlatform || null,
          description: description || null,
          techStack: techStack || null,
          trackingEnabled,
        })
      ).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowAddForm(false)
      setName('')
      setWebsiteUrl('')
      setGithubUrl('')
      setDeployPlatform('')
      setDescription('')
      setTechStack('')
      setTrackingEnabled(false)
      showToast(`${data.name} added`)
      if (data.trackingEnabled && data.siteSecret) {
        const apiBase = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '')
        const snippet = `<script async src="${apiBase}/track.js" data-site-key="${data.siteKey}" data-site-secret="${data.siteSecret}"></script>`
        setCreatedSecret({ snippet, secret: data.siteSecret })
      }
    },
    onError: () => {
      showToast('Could not create project. Check the fields and try again.', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: (_data, id) => {
      const deleted = deleteTarget ?? projects.find((p) => p.id === id)
      setDeleteTarget(null)
      setExitingId(id)
      showToast(`${deleted?.name ?? 'Project'} deleted`)
    },
    onError: () => {
      showToast('Could not delete project. Try again.', 'error')
    },
  })

  const showSkeleton = isLoading || (isFetching && projects.length === 0)

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          mb: 3,
          alignItems: { xs: 'stretch', sm: 'flex-end' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Catalog
          </Typography>
          <Typography variant="h4" sx={{ letterSpacing: '-0.02em' }}>
            Projects
          </Typography>
          {!showSkeleton && !isError && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {projects.length === 0
                ? 'No sites yet'
                : `${projects.length} site${projects.length === 1 ? '' : 's'} in your hub`}
            </Typography>
          )}
        </Box>
      </Stack>

      <Dialog
        open={showAddForm}
        onClose={() => !createMutation.isPending && setShowAddForm(false)}
        fullWidth
        maxWidth="md"
      >
        <Box component="form" onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }}>
          <DialogTitle>Add project</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ pt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Website URL" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://my-app.vercel.app" required fullWidth size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} fullWidth size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select label="Deploy platform" value={deployPlatform} onChange={(e) => setDeployPlatform(e.target.value)} fullWidth size="small">
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="vercel">Vercel</MenuItem>
                  <MenuItem value="netlify">Netlify</MenuItem>
                  <MenuItem value="gcp">GCP</MenuItem>
                  <MenuItem value="cloudflare">Cloudflare Pages</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Tech stack
                </Typography>
                <TechStackInput value={techStack} onChange={setTechStack} />
              </Grid>
              <Grid size={12}>
                <TextField label="Notes" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} fullWidth size="small" />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={<Checkbox checked={trackingEnabled} onChange={(e) => setTrackingEnabled(e.target.checked)} size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2">Enable visitor tracking (optional)</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Requires a working embed script on the live site. Leave off unless you need it.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 1.5 }}>
            <Button size="small" onClick={() => setShowAddForm(false)} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button size="small" type="submit" variant="contained" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create project'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {createdSecret && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setCreatedSecret(null)}>
          <Typography variant="subtitle2">Save your site secret (shown once)</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Paste this snippet on the live site before expecting any visitor data.
          </Typography>
          <Box component="pre" sx={{ mt: 1, p: 1.5, bgcolor: 'action.hover', borderRadius: 1, overflow: 'auto', fontSize: '0.75rem' }}>
            {createdSecret.snippet}
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button size="small" onClick={() => navigator.clipboard.writeText(createdSecret.snippet)}>Copy snippet</Button>
            <Button size="small" onClick={() => setCreatedSecret(null)}>Dismiss</Button>
          </Stack>
        </Alert>
      )}

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Could not load projects{error instanceof Error && error.message ? `: ${error.message}` : '.'}
        </Alert>
      )}

      {showSkeleton ? (
        <ProjectGridSkeleton />
      ) : !isError && projects.length === 0 ? (
        <Card sx={{ py: 8, px: 3, borderStyle: 'dashed' }}>
          <Typography variant="h6" sx={{ mb: 0.75, letterSpacing: '-0.01em' }}>
            No projects yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 420 }}>
            Add a deployed site to your hub, then open it from here anytime.
          </Typography>
          <Button variant="contained" onClick={() => setShowAddForm(true)}>
            Add project
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2.5} className="fade-in" sx={{ alignItems: 'stretch' }}>
          {projects.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
                <ProjectCard
                  project={p}
                  onDelete={setDeleteTarget}
                  exiting={exitingId === p.id}
                  onExitComplete={exitingId === p.id ? () => finishDelete(p.id) : undefined}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {deleteTarget && (
        <DeleteModal
          project={deleteTarget}
          isDeleting={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        />
      )}
    </Box>
  )
}
