import type { ReactNode } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { parseTechStack } from '../lib/techStack'
import type { Project } from '../types'

function Section({ title, children }: { title: string; children: ReactNode }) {
  if (!children) return null
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Box sx={{ mt: 0.75 }}>{children}</Box>
    </Box>
  )
}

function TextBlock({ value }: { value?: string | null }) {
  if (!value?.trim()) return null
  return (
    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
      {value}
    </Typography>
  )
}

export default function ProjectCaseStudy({
  project,
  hubUsername,
}: {
  project: Project
  hubUsername?: string
}) {
  const stack = parseTechStack(project.techStack)

  return (
    <Box>
      {project.thumbnailUrl && (
        <Box
          component="img"
          src={project.thumbnailUrl}
          alt=""
          sx={{
            width: '100%',
            maxHeight: 360,
            objectFit: 'cover',
            objectPosition: 'top',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            mb: 3,
          }}
        />
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ letterSpacing: '-0.02em', fontWeight: 600 }}>
            {project.name}
          </Typography>
          {hubUsername && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              by @{hubUsername}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip label={project.status} size="small" variant="outlined" sx={{ borderRadius: '4px' }} />
          {project.websiteUrl && (
            <Button
              component="a"
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="small"
            >
              Open site
            </Button>
          )}
          {project.githubUrl && (
            <Button
              component="a"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
            >
              GitHub
            </Button>
          )}
          {project.demoUrl && (
            <Button
              component="a"
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
            >
              Demo
            </Button>
          )}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Section title="Overview">
                <TextBlock value={project.description} />
              </Section>
              <Section title="Problem">
                <TextBlock value={project.problemStatement} />
              </Section>
              <Section title="How it solves the problem">
                <TextBlock value={project.solution} />
              </Section>
              <Section title="Users">
                <TextBlock value={project.targetUsers} />
              </Section>
              <Section title="Use cases">
                <TextBlock value={project.useCases} />
              </Section>
              <Section title="Key features">
                <TextBlock value={project.keyFeatures} />
              </Section>
              <Section title="Lessons learned">
                <TextBlock value={project.lessonsLearned} />
              </Section>
              {project.diagrams?.length > 0 && (
                <Section title="Diagrams">
                  <Stack spacing={2}>
                    {project.diagrams.map((d) => (
                      <Box key={d.id}>
                        {d.title && (
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {d.title}
                          </Typography>
                        )}
                        <Box
                          component="img"
                          src={d.imageUrl}
                          alt={d.title || 'Diagram'}
                          sx={{
                            width: '100%',
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'divider',
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Section>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Section title="Tech stack">
                {stack.length > 0 ? (
                  <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                    {stack.map((t) => (
                      <Chip key={t} label={t} size="small" variant="outlined" sx={{ borderRadius: '4px' }} />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not set
                  </Typography>
                )}
              </Section>
              <Section title="Deployed at">
                <Typography variant="body2">
                  {project.deployLocation || project.deployPlatform || 'Not set'}
                </Typography>
              </Section>
              <Section title="Timeline">
                <Typography variant="body2">{project.timeline || 'Not set'}</Typography>
              </Section>
              <Section title="Role">
                <Typography variant="body2">{project.role || 'Not set'}</Typography>
              </Section>
              {project.websiteUrl && (
                <Section title="Live URL">
                  <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                    {project.websiteUrl}
                  </Link>
                </Section>
              )}
              {project.githubUrl && (
                <Section title="Repository">
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                    {project.githubUrl}
                  </Link>
                </Section>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
