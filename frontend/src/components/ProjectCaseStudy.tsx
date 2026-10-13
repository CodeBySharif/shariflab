import type { ReactNode } from 'react'
import {
  Box,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { parseTechStack } from '../lib/techStack'
import type { Project } from '../types'

function Heading({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{
        mt: 3.5,
        mb: 1.5,
        pb: 1,
        borderBottom: 1,
        borderColor: 'divider',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        fontSize: '1.25rem',
      }}
    >
      {children}
    </Typography>
  )
}

function TextBlock({ value }: { value?: string | null }) {
  if (!value?.trim()) return null
  return (
    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary', lineHeight: 1.7 }}>
      {value}
    </Typography>
  )
}

function SidebarItem({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.8125rem' }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  )
}

export default function ProjectCaseStudy({
  project,
  hubUsername,
  hideTitle = false,
}: {
  project: Project
  hubUsername?: string
  hideTitle?: boolean
}) {
  const stack = parseTechStack(project.techStack)
  const hasAbout =
    stack.length > 0 ||
    project.deployLocation ||
    project.deployPlatform ||
    project.timeline ||
    project.role ||
    project.websiteUrl ||
    project.githubUrl ||
    project.demoUrl

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8.5 }}>
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              README
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            {project.thumbnailUrl && (
              <Box
                component="img"
                src={project.thumbnailUrl}
                alt=""
                sx={{
                  width: '100%',
                  maxHeight: 320,
                  objectFit: 'cover',
                  objectPosition: 'top',
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: 'divider',
                  mb: 3,
                }}
              />
            )}

            {!hideTitle && (
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                  mb: 1.5,
                }}
              >
                {project.name}
              </Typography>
            )}

            {hubUsername && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                by @{hubUsername}
              </Typography>
            )}

            {project.description && (
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {project.description}
              </Typography>
            )}

            <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Chip
                label={project.status}
                size="small"
                sx={{ borderRadius: '4px', textTransform: 'lowercase' }}
              />
              {project.isPublished !== undefined && (
                <Chip
                  label={project.isPublished ? 'published' : 'draft'}
                  size="small"
                  color={project.isPublished ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ borderRadius: '4px' }}
                />
              )}
              {stack.length > 0 && (
                <Chip
                  label={`stack | ${stack.join(' | ')}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: '4px', height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal' } }}
                />
              )}
            </Stack>

            {project.problemStatement?.trim() && (
              <>
                <Heading>The problem</Heading>
                <TextBlock value={project.problemStatement} />
              </>
            )}
            {project.solution?.trim() && (
              <>
                <Heading>How it solves the problem</Heading>
                <TextBlock value={project.solution} />
              </>
            )}
            {project.targetUsers?.trim() && (
              <>
                <Heading>Users</Heading>
                <TextBlock value={project.targetUsers} />
              </>
            )}
            {project.useCases?.trim() && (
              <>
                <Heading>Use cases</Heading>
                <TextBlock value={project.useCases} />
              </>
            )}
            {project.keyFeatures?.trim() && (
              <>
                <Heading>Key features</Heading>
                <TextBlock value={project.keyFeatures} />
              </>
            )}
            {project.lessonsLearned?.trim() && (
              <>
                <Heading>Lessons learned</Heading>
                <TextBlock value={project.lessonsLearned} />
              </>
            )}
            {project.diagrams?.length > 0 && (
              <>
                <Heading>Diagrams</Heading>
                <Stack spacing={2.5}>
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
              </>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 3.5 }}>
        {hasAbout && (
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              p: 2.5,
              position: { md: 'sticky' },
              top: { md: 72 },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              About
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <SidebarItem label="Tech stack">
              {stack.length > 0 ? (
                <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                  {stack.map((t) => (
                    <Chip key={t} label={t} size="small" variant="outlined" sx={{ borderRadius: '4px' }} />
                  ))}
                </Stack>
              ) : null}
            </SidebarItem>

            <SidebarItem label="Deployed at">
              {project.deployLocation || project.deployPlatform ? (
                <Typography variant="body2">
                  {project.deployLocation || project.deployPlatform}
                </Typography>
              ) : null}
            </SidebarItem>

            <SidebarItem label="Timeline">
              {project.timeline ? <Typography variant="body2">{project.timeline}</Typography> : null}
            </SidebarItem>

            <SidebarItem label="Role">
              {project.role ? <Typography variant="body2">{project.role}</Typography> : null}
            </SidebarItem>

            <SidebarItem label="Website">
              {project.websiteUrl ? (
                <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                  {project.websiteUrl}
                </Link>
              ) : null}
            </SidebarItem>

            <SidebarItem label="Repository">
              {project.githubUrl ? (
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                  {project.githubUrl}
                </Link>
              ) : null}
            </SidebarItem>

            <SidebarItem label="Demo">
              {project.demoUrl ? (
                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                  {project.demoUrl}
                </Link>
              ) : null}
            </SidebarItem>
          </Box>
        )}
      </Grid>
    </Grid>
  )
}
