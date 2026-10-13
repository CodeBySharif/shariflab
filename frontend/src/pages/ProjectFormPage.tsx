import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import api from '../api/client'
import DiagramTitleModal from '../components/DiagramTitleModal'
import FormSkeleton from '../components/skeletons/FormSkeleton'
import TechStackInput from '../components/TechStackInput'
import IconAction from '../components/ui/IconAction'
import { stickyPageBarSx } from '../components/pageChrome'
import { useToast } from '../context/ToastContext'
import type { Project, ProjectDiagram, ProjectStatus } from '../types'

const sectionSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
  p: { xs: 2, md: 2.5 },
  height: '100%',
}

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [problemStatement, setProblemStatement] = useState('')
  const [solution, setSolution] = useState('')
  const [targetUsers, setTargetUsers] = useState('')
  const [useCases, setUseCases] = useState('')
  const [keyFeatures, setKeyFeatures] = useState('')
  const [lessonsLearned, setLessonsLearned] = useState('')
  const [techStack, setTechStack] = useState('')
  const [deployLocation, setDeployLocation] = useState('')
  const [deployPlatform, setDeployPlatform] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('wip')
  const [timeline, setTimeline] = useState('')
  const [role, setRole] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [diagrams, setDiagrams] = useState<ProjectDiagram[]>([])
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [pendingDiagramFile, setPendingDiagramFile] = useState<File | null>(null)

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
    enabled: Boolean(id),
    initialData: cached,
    retry: false,
  })

  useEffect(() => {
    if (!project) return
    setName(project.name)
    setSlug(project.slug)
    setWebsiteUrl(project.websiteUrl ?? '')
    setGithubUrl(project.githubUrl ?? '')
    setDemoUrl(project.demoUrl ?? '')
    setDescription(project.description ?? '')
    setProblemStatement(project.problemStatement ?? '')
    setSolution(project.solution ?? '')
    setTargetUsers(project.targetUsers ?? '')
    setUseCases(project.useCases ?? '')
    setKeyFeatures(project.keyFeatures ?? '')
    setLessonsLearned(project.lessonsLearned ?? '')
    setTechStack(project.techStack ?? '')
    setDeployLocation(project.deployLocation ?? '')
    setDeployPlatform(project.deployPlatform ?? '')
    setStatus(project.status)
    setTimeline(project.timeline ?? '')
    setRole(project.role ?? '')
    setIsPublished(project.isPublished)
    setDiagrams(project.diagrams ?? [])
    setThumbnailUrl(project.thumbnailUrl)
  }, [project])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        name,
        slug: slug || undefined,
        websiteUrl: websiteUrl || null,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        description: description || null,
        problemStatement: problemStatement || null,
        solution: solution || null,
        targetUsers: targetUsers || null,
        useCases: useCases || null,
        keyFeatures: keyFeatures || null,
        lessonsLearned: lessonsLearned || null,
        techStack: techStack || null,
        deployLocation: deployLocation || null,
        deployPlatform: deployPlatform || null,
        status,
        timeline: timeline || null,
        role: role || null,
        isPublished,
      }
      return (await api.patch<Project>(`/projects/${id}`, body)).data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', data.id] })
      showToast(`${data.name} updated`)
      navigate(`/projects/${data.id}`)
    },
    onError: () => showToast('Could not save project', 'error'),
  })

  const uploadThumb = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      return (await api.post<Project>(`/projects/${id}/thumbnail`, form)).data
    },
    onSuccess: (data) => {
      setThumbnailUrl(data.thumbnailUrl)
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      showToast('Snapshot uploaded')
    },
    onError: () => showToast('Could not upload snapshot', 'error'),
  })

  const uploadDiagram = useMutation({
    mutationFn: async ({ file, title }: { file: File; title: string }) => {
      const form = new FormData()
      form.append('file', file)
      if (title) form.append('title', title)
      return (await api.post<ProjectDiagram>(`/projects/${id}/diagrams`, form)).data
    },
    onSuccess: (diagram) => {
      setDiagrams((prev) => [...prev, diagram])
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      showToast('Diagram added')
    },
    onError: () => showToast('Could not upload diagram', 'error'),
  })

  const deleteDiagram = useMutation({
    mutationFn: async (diagramId: string) => {
      await api.delete(`/projects/${id}/diagrams/${diagramId}`)
      return diagramId
    },
    onSuccess: (diagramId) => {
      setDiagrams((prev) => prev.filter((d) => d.id !== diagramId))
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      showToast('Diagram removed')
    },
    onError: () => showToast('Could not remove diagram', 'error'),
  })

  if (isLoading && !project) return <FormSkeleton />

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        Could not load project{error instanceof Error ? `: ${error.message}` : '.'}
      </Alert>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        saveMutation.mutate()
      }}
    >
      <Box sx={stickyPageBarSx}>
        <Button
          component={RouterLink}
          to={id ? `/projects/${id}` : '/'}
          startIcon={<ArrowBackIcon />}
          size="small"
          variant="outlined"
          type="button"
        >
          Back
        </Button>
        <Typography
          variant="subtitle1"
          sx={{
            flex: 1,
            minWidth: 0,
            fontWeight: 600,
            fontSize: '0.9375rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name || 'Edit case study'}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<CloseIcon />}
            onClick={() => navigate(id ? `/projects/${id}` : '/')}
            disabled={saveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outlined"
            size="small"
            startIcon={<SaveOutlinedIcon />}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={sectionSx}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Case study
            </Typography>
            <Stack spacing={2.5}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
              <TextField
                label="URL slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                helperText="Used in public URL: /u/you/p/slug"
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                label="Problem statement"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                label="How it solves the problem"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                label="Target users"
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                label="Use cases"
                value={useCases}
                onChange={(e) => setUseCases(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                label="Key features"
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                label="Lessons learned"
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <Box sx={sectionSx}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Links & status
              </Typography>
              <Stack spacing={2.5}>
                <TechStackInput value={techStack} onChange={setTechStack} />
                <TextField
                  label="Website URL"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="GitHub URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Demo URL"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Deploy location"
                  value={deployLocation}
                  onChange={(e) => setDeployLocation(e.target.value)}
                  placeholder="e.g. VPS in Singapore"
                  fullWidth
                />
                <TextField
                  label="Deploy platform"
                  value={deployPlatform}
                  onChange={(e) => setDeployPlatform(e.target.value)}
                  placeholder="e.g. Docker Compose"
                  fullWidth
                />
                <TextField
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  fullWidth
                >
                  <MenuItem value="wip">WIP</MenuItem>
                  <MenuItem value="live">Live</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </TextField>
                <TextField
                  label="Timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. Jan–Mar 2026"
                  fullWidth
                />
                <TextField
                  label="Your role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                  }
                  label="Published on public hub"
                />
              </Stack>
            </Box>

            <Box sx={sectionSx}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Snapshot
              </Typography>
              {thumbnailUrl && (
                <Box
                  component="img"
                  src={thumbnailUrl}
                  alt=""
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    objectPosition: 'top',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    mb: 2,
                  }}
                />
              )}
              <Button
                variant="outlined"
                component="label"
                size="small"
                startIcon={<ImageOutlinedIcon />}
                disabled={uploadThumb.isPending}
              >
                {uploadThumb.isPending ? 'Uploading…' : 'Upload snapshot'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadThumb.mutate(file)
                    e.target.value = ''
                  }}
                />
              </Button>
            </Box>

            <Box sx={sectionSx}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Diagrams
              </Typography>
              <Stack spacing={2} sx={{ mb: 2 }}>
                {diagrams.map((d) => (
                  <Stack key={d.id} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <Box
                      component="img"
                      src={d.imageUrl}
                      alt={d.title || 'Diagram'}
                      sx={{
                        width: 120,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2">{d.title || 'Untitled diagram'}</Typography>
                    </Box>
                    <IconAction
                      title="Delete diagram"
                      color="error"
                      onClick={() => deleteDiagram.mutate(d.id)}
                      disabled={deleteDiagram.isPending}
                    >
                      <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconAction>
                  </Stack>
                ))}
              </Stack>
              <Button
                variant="outlined"
                component="label"
                size="small"
                startIcon={<AddPhotoAlternateOutlinedIcon />}
                disabled={uploadDiagram.isPending}
              >
                {uploadDiagram.isPending ? 'Uploading…' : 'Add diagram'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setPendingDiagramFile(file)
                    e.target.value = ''
                  }}
                />
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <DiagramTitleModal
        open={Boolean(pendingDiagramFile)}
        onCancel={() => setPendingDiagramFile(null)}
        onConfirm={(title) => {
          if (!pendingDiagramFile) return
          uploadDiagram.mutate({ file: pendingDiagramFile, title })
          setPendingDiagramFile(null)
        }}
      />
    </Box>
  )
}
