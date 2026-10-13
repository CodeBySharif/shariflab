import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Alert, Box, Button, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import api from '../api/client'
import FormSkeleton from '../components/skeletons/FormSkeleton'
import ProjectCaseStudy from '../components/ProjectCaseStudy'
import { stickyPageBarSx } from '../components/pageChrome'
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
          <Button color="inherit" size="small" onClick={() => refetch()} startIcon={<ArrowBackIcon />}>
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
      <Box sx={stickyPageBarSx}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          size="small"
          variant="outlined"
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
          {project.name}
        </Typography>
        <Button
          component={RouterLink}
          to={`/projects/${project.id}/edit`}
          startIcon={<EditOutlinedIcon />}
          variant="outlined"
          size="small"
        >
          Edit
        </Button>
      </Box>

      <ProjectCaseStudy project={project} hideTitle />
    </Box>
  )
}
