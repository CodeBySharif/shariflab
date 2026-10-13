import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { parseTechStack } from '../lib/techStack'
import type { Project } from '../types'

function Placeholder({ name }: { name: string }) {
  return (
    <Box
      sx={{
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Typography sx={{ fontSize: '1.75rem', fontWeight: 600, color: 'text.secondary' }}>
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        {project.thumbnailUrl ? (
          <CardMedia
            component="img"
            image={project.thumbnailUrl}
            alt=""
            sx={{ height: 180, objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <Placeholder name={project.name} />
        )}
        {(project.deployPlatform || project.deployLocation) && (
          <Chip
            label={project.deployLocation || project.deployPlatform}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(15, 15, 17, 0.9)',
              color: '#fafafa',
              borderRadius: '4px',
              height: 22,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ px: 2.5, pt: 2, pb: 1.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75 }}>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '1.0625rem',
              fontWeight: 600,
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
              sx={{ borderRadius: '4px', height: 22 }}
            />
          )}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: 40,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description || project.problemStatement || 'No description'}
        </Typography>

        {stack.length > 0 && (
          <Stack direction="row" useFlexGap sx={{ mt: 'auto', pt: 1.5, flexWrap: 'wrap', gap: 0.75 }}>
            {stack.slice(0, 4).map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                variant="outlined"
                sx={{ maxWidth: 96, borderRadius: '4px', height: 22 }}
              />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions
        sx={{
          px: 2.5,
          py: 1.5,
          gap: 0.5,
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {project.websiteUrl ? (
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
        ) : (
          <Button component={RouterLink} to={detailsPath} variant="contained" size="small">
            View
          </Button>
        )}
        <Stack direction="row" spacing={0.25}>
          <Button
            component={RouterLink}
            to={detailsPath}
            size="small"
            color="inherit"
            sx={{ color: 'text.secondary', minWidth: 0, px: 1.25 }}
          >
            Details
          </Button>
          {!readOnly && (
            <>
              <Button
                component={RouterLink}
                to={`/projects/${project.id}/edit`}
                size="small"
                color="inherit"
                sx={{ color: 'text.secondary', minWidth: 0, px: 1.25 }}
              >
                Edit
              </Button>
              {onDelete && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => onDelete(project)}
                  sx={{ minWidth: 0, px: 1.25 }}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </Stack>
      </CardActions>
    </Card>
  )
}
