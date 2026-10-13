import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
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
import { useToast } from '../context/ToastContext'
import { parseTechStack } from '../lib/techStack'
import type { Project } from '../types'

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { showAddForm, setShowAddForm } = useOutletContext<LayoutOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [techFilter, setTechFilter] = useState('All')

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

  const techPills = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) {
      for (const t of parseTechStack(p.techStack)) set.add(t)
    }
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [projects])

  const filtered = useMemo(() => {
    if (techFilter === 'All') return projects
    return projects.filter((p) =>
      parseTechStack(p.techStack).some((t) => t.toLowerCase() === techFilter.toLowerCase()),
    )
  }, [projects, techFilter])

  useEffect(() => {
    if (techFilter !== 'All' && !techPills.includes(techFilter)) {
      setTechFilter('All')
    }
  }, [techFilter, techPills])

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
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, alignItems: 'baseline', justifyContent: 'space-between' }}
      >
        <Typography variant="h4" sx={{ letterSpacing: '-0.02em', fontWeight: 600 }}>
          Projects
        </Typography>
        {!showSkeleton && !isError && (
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            {filtered.length === 0
              ? 'No projects'
              : `${filtered.length} project${filtered.length === 1 ? '' : 's'}`}
          </Typography>
        )}
      </Stack>

      {!showSkeleton && !isError && projects.length > 0 && (
        <Stack
          direction="row"
          useFlexGap
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            mb: 3,
          }}
        >
          {techPills.map((pill) => {
            const active = techFilter === pill
            return (
              <Chip
                key={pill}
                label={pill}
                clickable
                onClick={() => setTechFilter(pill)}
                sx={{
                  height: 36,
                  borderRadius: '8px',
                  fontWeight: active ? 600 : 500,
                  bgcolor: active ? 'text.primary' : 'action.hover',
                  color: active ? 'background.default' : 'text.primary',
                  border: 'none',
                  '&:hover': {
                    bgcolor: active ? 'text.primary' : 'action.selected',
                  },
                }}
              />
            )
          })}
        </Stack>
      )}

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
      ) : filtered.length === 0 ? (
        <Card sx={{ py: 6, px: 3, borderStyle: 'dashed' }}>
          <Typography color="text.secondary">
            No projects match the {techFilter} filter.
          </Typography>
          <Button size="small" sx={{ mt: 2 }} onClick={() => setTechFilter('All')}>
            Show all
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3} className="fade-in">
          {filtered.map((p) => (
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
