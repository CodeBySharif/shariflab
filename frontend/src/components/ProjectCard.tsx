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
import { deployLabel, statusColors, statusLabel } from '../lib/projectStatus'
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

const tipProps = {
  arrow: true as const,
  enterDelay: 200,
  slotProps: {
    popper: {
      modifiers: [{ name: 'offset', options: { offset: [0, -6] } }],
    },
  },
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
  const colors = statusColors(project.status)
  const deploy = deployLabel(project.deployPlatform, project.deployLocation)

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component={RouterLink}
          to={detailsPath}
          sx={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            overflow: 'hidden',
            '&:hover': { opacity: 0.94 },
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

        {deploy && (
          <Chip
            label={deploy}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              height: 26,
              borderRadius: '999px',
              bgcolor: 'rgba(0,0,0,0.82)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.35)',
              fontWeight: 600,
              fontSize: '0.75rem',
              maxWidth: '48%',
              '& .MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                px: 1.25,
              },
            }}
          />
        )}

        <Chip
          label={statusLabel(project.status)}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            height: 26,
            borderRadius: '999px',
            bgcolor: colors.bg,
            color: colors.color,
            border: `1px solid ${colors.border}`,
            fontWeight: 600,
            fontSize: '0.75rem',
            '& .MuiChip-label': { px: 1.25 },
          }}
        />
      </Box>

      <CardContent sx={{ px: 2, pt: 1.75, pb: 1.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          component={RouterLink}
          to={detailsPath}
          variant="subtitle1"
          sx={{
            mb: 1,
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
            <Tooltip title="Visit site" {...tipProps}>
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
            <Tooltip title="GitHub" {...tipProps}>
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
            <Tooltip title="Details" {...tipProps}>
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
                <Tooltip title="Edit" {...tipProps}>
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
                  <Tooltip title="Delete" {...tipProps}>
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
