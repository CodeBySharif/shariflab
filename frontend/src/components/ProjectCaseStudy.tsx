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
import { statusColors, statusLabel } from '../lib/projectStatus'
import { parseTechStack } from '../lib/techStack'
import type { Project } from '../types'

function Heading({ children, first = false }: { children: ReactNode; first?: boolean }) {
  return (
    <Typography
      variant="h6"
      component="h2"
      sx={{
        mt: first ? 0 : 2.75,
        mb: 1,
        pb: 0.85,
        borderBottom: 1,
        borderColor: 'divider',
        fontWeight: 700,
        letterSpacing: '-0.015em',
        fontSize: '1.125rem',
        lineHeight: 1.3,
        color: 'text.primary',
      }}
    >
      {children}
    </Typography>
  )
}

function TextBlock({ value }: { value?: string | null }) {
  if (!value?.trim()) return null
  return (
    <Typography
      variant="body2"
      sx={{
        whiteSpace: 'pre-wrap',
        color: 'text.secondary',
        lineHeight: 1.7,
        fontSize: '0.875rem',
        fontWeight: 400,
      }}
    >
      {value}
    </Typography>
  )
}

function SidebarItem({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
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
  const colors = statusColors(project.status)
  const hasDescription = Boolean(project.description?.trim())

  return (
    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
      <Grid size={{ xs: 12, md: 8.5 }}>
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            overflow: 'hidden',
            p: { xs: 2, md: 2.5 },
          }}
        >
          {project.thumbnailUrl && (
            <Box
              component="img"
              src={project.thumbnailUrl}
              alt=""
              sx={{
                width: '100%',
                maxHeight: 280,
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: 1.5,
                border: 1,
                borderColor: 'divider',
                mb: 2,
              }}
            />
          )}

          {!hideTitle && (
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontSize: '1.25rem',
                mb: 1,
              }}
            >
              {project.name}
            </Typography>
          )}

          {hubUsername && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8125rem' }}>
              by @{hubUsername}
            </Typography>
          )}

          {hasDescription && (
            <>
              <Heading first>Description</Heading>
              <TextBlock value={project.description} />
            </>
          )}

          {project.problemStatement?.trim() && (
            <>
              <Heading first={!hasDescription}>The problem</Heading>
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
              <Stack spacing={2}>
                {project.diagrams.map((d) => (
                  <Box key={d.id}>
                    {d.title && (
                      <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.8125rem' }}>
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
      </Grid>

      <Grid size={{ xs: 12, md: 3.5 }}>
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            p: 2,
            position: { md: 'sticky' },
            top: { md: 108 },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.875rem' }}>
            About
          </Typography>
          <Divider sx={{ mb: 1.5 }} />

          <SidebarItem label="Status">
            <Chip
              label={statusLabel(project.status)}
              size="small"
              sx={{
                borderRadius: '999px',
                bgcolor: colors.bg,
                color: colors.color,
                border: `1px solid ${colors.border}`,
                fontWeight: 600,
              }}
            />
          </SidebarItem>

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
              <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                {[project.deployPlatform, project.deployLocation].filter(Boolean).join(' · ')}
              </Typography>
            ) : null}
          </SidebarItem>

          <SidebarItem label="Timeline">
            {project.timeline ? (
              <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                {project.timeline}
              </Typography>
            ) : null}
          </SidebarItem>

          <SidebarItem label="Role">
            {project.role ? (
              <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                {project.role}
              </Typography>
            ) : null}
          </SidebarItem>

          <SidebarItem label="Website">
            {project.websiteUrl ? (
              <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ fontSize: '0.8125rem' }}>
                {project.websiteUrl}
              </Link>
            ) : null}
          </SidebarItem>

          <SidebarItem label="Repository">
            {project.githubUrl ? (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ fontSize: '0.8125rem' }}>
                {project.githubUrl}
              </Link>
            ) : null}
          </SidebarItem>

          <SidebarItem label="Demo">
            {project.demoUrl ? (
              <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ fontSize: '0.8125rem' }}>
                {project.demoUrl}
              </Link>
            ) : null}
          </SidebarItem>
        </Box>
      </Grid>
    </Grid>
  )
}
