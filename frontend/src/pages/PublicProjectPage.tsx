import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Alert, Box, Button, Container } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import api from '../api/client'
import FormSkeleton from '../components/skeletons/FormSkeleton'
import ProjectCaseStudy from '../components/ProjectCaseStudy'
import type { PublicProjectDetail } from '../types'

export default function PublicProjectPage() {
  const { username, slug } = useParams<{ username: string; slug: string }>()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-project', username, slug],
    queryFn: async () =>
      (await api.get<PublicProjectDetail>(`/public/u/${username}/p/${slug}`)).data,
    enabled: Boolean(username && slug),
    retry: false,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
      <Container>
        {isLoading ? (
          <FormSkeleton />
        ) : isError || !data ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            Project not found{error instanceof Error ? `: ${error.message}` : '.'}
          </Alert>
        ) : (
          <>
            <Button
              component={RouterLink}
              to={`/u/${username}`}
              startIcon={<ArrowBackIcon />}
              size="small"
              sx={{ mb: 3 }}
            >
              {data.user.displayName || data.user.username}&apos;s hub
            </Button>
            <ProjectCaseStudy project={data.project} hubUsername={data.user.username} />
          </>
        )}
      </Container>
    </Box>
  )
}
