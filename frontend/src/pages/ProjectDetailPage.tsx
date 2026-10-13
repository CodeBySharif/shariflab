import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Alert, Box, Button, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import api from '../api/client'
import FormSkeleton from '../components/skeletons/FormSkeleton'
import ProjectCaseStudy from '../components/ProjectCaseStudy'
import type { Project } from '../types'

const stickyBarSx = {
  position: 'sticky' as const,
  top: 0,
  zIndex: 5,
  bgcolor: 'background.default',
  py: 1.5,
  mb: 2,
  mx: { xs: -2, sm: -3 },
  px: { xs: 2, sm: 3 },
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  flexWrap: 'wrap' as const,
}

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
      <Box sx={stickyBarSx}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          size="small"
          color="inherit"
        >
          Back
        </Button>
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            minWidth: 0,
            fontWeight: 600,
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
