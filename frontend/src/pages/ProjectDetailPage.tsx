import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Alert, Box, Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import api from '../api/client'
import FormSkeleton from '../components/skeletons/FormSkeleton'
import ProjectCaseStudy from '../components/ProjectCaseStudy'
import type { Project } from '../types'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()

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
  })

  if (isLoading) return <FormSkeleton />

  if (isError || !project) {
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
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 3, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} size="small">
          All projects
        </Button>
        <Button
          component={RouterLink}
          to={`/projects/${project.id}/edit`}
          startIcon={<EditOutlinedIcon />}
          variant="outlined"
          size="small"
        >
          Edit case study
        </Button>
      </Stack>
      <ProjectCaseStudy project={project} />
    </Box>
  )
}
