import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import api from '../api/client'
import ProjectGridSkeleton from '../components/skeletons/ProjectGridSkeleton'
import { parseTechStack } from '../lib/techStack'
import type { PublicHub } from '../types'

export default function PublicHubPage() {
  const { username } = useParams<{ username: string }>()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-hub', username],
    queryFn: async () => (await api.get<PublicHub>(`/public/u/${username}`)).data,
    enabled: Boolean(username),
    retry: false,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
      <Container>
        {isLoading ? (
          <ProjectGridSkeleton />
        ) : isError || !data ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            Hub not found{error instanceof Error ? `: ${error.message}` : '.'}
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ letterSpacing: '-0.03em', fontWeight: 700 }}>
                {data.user.displayName || data.user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                @{data.user.username}
              </Typography>
              {data.user.bio && (
                <Typography variant="body1" sx={{ mt: 2, maxWidth: 560 }}>
                  {data.user.bio}
                </Typography>
              )}
            </Box>

            {data.projects.length === 0 ? (
              <Card sx={{ py: 6, px: 3, borderStyle: 'dashed' }}>
                <Typography color="text.secondary">No published projects yet.</Typography>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {data.projects.map((p) => {
                  const stack = parseTechStack(p.techStack).slice(0, 4)
                  return (
                    <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card sx={{ height: '100%' }}>
                        <CardActionArea
                          component={RouterLink}
                          to={`/u/${data.user.username}/p/${p.slug}`}
                          sx={{ height: '100%', alignItems: 'stretch', display: 'flex', flexDirection: 'column' }}
                        >
                          {p.thumbnailUrl ? (
                            <Box
                              component="img"
                              src={p.thumbnailUrl}
                              alt=""
                              sx={{
                                width: '100%',
                                height: 160,
                                objectFit: 'cover',
                                objectPosition: 'top',
                                borderBottom: 1,
                                borderColor: 'divider',
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                height: 160,
                                bgcolor: 'action.hover',
                                borderBottom: 1,
                                borderColor: 'divider',
                              }}
                            />
                          )}
                          <CardContent sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                              <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
                                {p.name}
                              </Typography>
                              <Chip
                                label={p.status}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: '4px' }}
                              />
                            </Stack>
                            {p.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 1.5,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {p.description}
                              </Typography>
                            )}
                            {stack.length > 0 && (
                              <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                {stack.map((t) => (
                                  <Chip
                                    key={t}
                                    label={t}
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderRadius: '4px' }}
                                  />
                                ))}
                              </Stack>
                            )}
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}
