import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import GitHubIcon from '@mui/icons-material/GitHub'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { parseTechStack } from '../lib/techStack'
import type { Project } from '../types'

function Placeholder({ name }: { name: string }) {
  return (
    <Box
      sx={{
        aspectRatio: '16 / 9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
      }}
    >
      <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'text.secondary' }}>
        {name.charAt(0).toUpperCase()}
      </Typography>
    </Box>
  )
}

export default function ProjectCard({
  project,
  onDelete,
  readOnly = false,
  detailTo,
}: {
  project: Project
  onDelete?: (project: Project) => void
  readOnly?: boolean
  detailTo?: string
}) {
  const stack = parseTechStack(project.techStack)
  const detailsPath = detailTo ?? `/projects/${project.id}`

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        backgroundImage: 'none',
      }}
    >
      <Box
        component={RouterLink}
        to={detailsPath}
        sx={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          '&:hover': { opacity: 0.92 },
        }}
      >
        {project.thumbnailUrl ? (
          <CardMedia
            component="img"
            image={project.thumbnailUrl}
            alt=""
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block',
            }}
          />
        ) : (
          <Placeholder name={project.name} />
        )}
      </Box>

      <CardContent sx={{ px: 0.25, pt: 1.5, pb: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', mb: 0.75 }}>
          <Typography
            component={RouterLink}
            to={detailsPath}
            variant="subtitle1"
            sx={{
              flex: 1,
              minWidth: 0,
              fontWeight: 600,
              lineHeight: 1.35,
              textDecoration: 'none',
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {project.name}
          </Typography>
          {!readOnly && (
            <Chip
              label={project.isPublished ? 'Published' : 'Draft'}
              size="small"
              color={project.isPublished ? 'success' : 'default'}
              variant="outlined"
              sx={{ borderRadius: '4px', height: 22, flexShrink: 0 }}
            />
          )}
        </Stack>

        {stack.length > 0 && (
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
            {stack.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                variant="outlined"
                sx={{ borderRadius: '4px', height: 24 }}
              />
            ))}
          </Stack>
        )}

        <Stack
          direction="row"
          sx={{
            mt: 'auto',
            pt: 0.5,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Visit site">
              <span>
                <IconButton
                  component="a"
                  href={project.websiteUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  disabled={!project.websiteUrl}
                  aria-label="Visit site"
                  sx={{ width: 40, height: 40 }}
                >
                  <OpenInNewIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="GitHub">
              <span>
                <IconButton
                  component="a"
                  href={project.githubUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  disabled={!project.githubUrl}
                  aria-label="GitHub"
                  sx={{ width: 40, height: 40 }}
                >
                  <GitHubIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Details">
              <IconButton
                component={RouterLink}
                to={detailsPath}
                size="small"
                aria-label="Details"
                sx={{ width: 40, height: 40 }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            {!readOnly && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    component={RouterLink}
                    to={`/projects/${project.id}/edit`}
                    size="small"
                    aria-label="Edit"
                    sx={{ width: 40, height: 40 }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
                {onDelete && (
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(project)}
                      aria-label="Delete"
                      sx={{ width: 40, height: 40 }}
                    >
                      <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
