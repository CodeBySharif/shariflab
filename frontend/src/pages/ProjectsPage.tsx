import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useOutletContext, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import api from '../api/client'
import DeleteModal from '../components/DeleteModal'
import ProjectCard from '../components/ProjectCard'
import ProjectGridSkeleton from '../components/skeletons/ProjectGridSkeleton'
import type { LayoutOutletContext } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import type { Project } from '../types'

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { user } = useAuth()
  const { showAddForm, setShowAddForm } = useOutletContext<LayoutOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  useEffect(() => {
    if (searchParams.get('add') === '1') {
      setShowAddForm(true)
      searchParams.delete('add')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams, setShowAddForm])

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
        await api.post<Project>('/projects', {
          name,
          websiteUrl: websiteUrl || null,
        })
      ).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowAddForm(false)
      setName('')
      setWebsiteUrl('')
      showToast(`${data.name} added`)
    },
    onError: () => showToast('Could not create project', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      showToast(`${deleteTarget?.name ?? 'Project'} deleted`)
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => showToast('Could not delete project', 'error'),
  })

  const showSkeleton = isLoading || (isFetching && projects.length === 0)

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ letterSpacing: '-0.02em', fontWeight: 600 }}>
            Projects
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Public hub:{' '}
              <Box component={RouterLink} to={`/u/${user.username}`} sx={{ color: 'primary.main' }}>
                /u/{user.username}
              </Box>
            </Typography>
          )}
        </Box>
        {!showSkeleton && !isError && (
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            {projects.length === 0
              ? 'No projects yet'
              : `${projects.length} project${projects.length === 1 ? '' : 's'}`}
          </Typography>
        )}
      </Stack>

      <Dialog
        open={showAddForm}
        onClose={() => !createMutation.isPending && setShowAddForm(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate()
          }}
        >
          <DialogTitle>Add project</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 0.5 }}>
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
                placeholder="https://..."
                fullWidth
              />
              <Typography variant="caption" color="text.secondary">
                You can add problem statement, diagrams, and more on the edit page.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 1.5 }}>
            <Button onClick={() => setShowAddForm(false)} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create project'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
          Could not load projects{error instanceof Error ? `: ${error.message}` : '.'}
        </Alert>
      )}

      {showSkeleton ? (
        <ProjectGridSkeleton />
      ) : !isError && projects.length === 0 ? (
        <Card sx={{ py: 8, px: 3, borderStyle: 'dashed' }}>
          <Typography variant="h6" sx={{ mb: 0.75 }}>
            No projects yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 420 }}>
            Add a project case study: snapshot, problem, solution, tech stack, and more.
          </Typography>
          <Button variant="contained" onClick={() => setShowAddForm(true)}>
            Add project
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3} className="fade-in">
          {projects.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
                <ProjectCard project={p} onDelete={setDeleteTarget} />
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
