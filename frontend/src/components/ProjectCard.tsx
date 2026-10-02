import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useState } from 'react'
import { parseTechStack } from '../lib/techStack'
import type { DeployPlatform, Project } from '../types'

const PLATFORM_LABELS: Record<DeployPlatform, string> = {
  vercel: 'Vercel',
  netlify: 'Netlify',
  gcp: 'GCP',
  cloudflare: 'Cloudflare',
  other: 'Other',
}

function Placeholder({ name }: { name: string }) {
  return (
    <Box
      sx={{
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: (t) =>
          t.palette.mode === 'dark'
            ? 'linear-gradient(160deg, rgba(255,255,255,0.04), transparent 55%)'
            : 'linear-gradient(160deg, rgba(24,24,27,0.04), transparent 55%)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Typography
        sx={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'text.secondary',
          letterSpacing: '-0.03em',
        }}
      >
        {name.charAt(0).toUpperCase()}
      </Typography>
    </Box>
  )
}

export default function ProjectCard({
  project,
  onDelete,
  exiting = false,
  onExitComplete,
}: {
  project: Project
  onDelete: (project: Project) => void
  exiting?: boolean
  onExitComplete?: () => void
}) {
  const stack = parseTechStack(project.techStack)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  return (
    <Box
      className={exiting ? 'project-card-shell-exit' : 'project-card-shell fade-in'}
      sx={{ height: '100%' }}
      onAnimationEnd={(e) => {
        if (exiting && e.currentTarget === e.target && e.animationName.includes('card-exit')) {
          onExitComplete?.()
        }
      }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'border-color 0.15s ease, transform 0.15s ease',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          {project.thumbnailUrl ? (
            <CardMedia
              component="img"
              image={project.thumbnailUrl}
              alt=""
              sx={{ height: 140, objectFit: 'cover', objectPosition: 'top' }}
            />
          ) : (
            <Placeholder name={project.name} />
          )}
          {project.deployPlatform && (
            <Chip
              label={PLATFORM_LABELS[project.deployPlatform]}
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'rgba(15, 15, 17, 0.92)',
                color: '#fafafa',
                border: '1px solid rgba(255,255,255,0.14)',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
        </Box>

        <CardContent
          sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            '&:last-child': { pb: 2 },
          }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                }}
              >
                {project.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  minHeight: 40,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.description || 'No notes'}
              </Typography>
            </Box>
            {project.githubUrl && (
              <Tooltip title="Open GitHub">
                <IconButton
                  component="a"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label={`Open GitHub for ${project.name}`}
                >
                  <GitHubIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {stack.length > 0 && (
            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                mt: 'auto',
                pt: 1.5,
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0.75,
              }}
            >
              {stack.slice(0, 3).map((tech) => (
                <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ maxWidth: 88 }} />
              ))}
              {stack.length > 3 && (
                <Chip label={`+${stack.length - 3}`} size="small" variant="outlined" />
              )}
            </Stack>
          )}
        </CardContent>

        <CardActions
          sx={{
            px: 2,
            pb: 2,
            pt: 0,
            gap: 1,
            borderTop: 1,
            borderColor: 'divider',
            mt: 'auto',
          }}
        >
          <Button
            component="a"
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            variant="contained"
            sx={{ flex: 1 }}
          >
            Open site
          </Button>
          <Tooltip title="More actions">
            <IconButton
              size="small"
              aria-label={`More actions for ${project.name}`}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MoreHorizIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MenuItem
              component={RouterLink}
              to={`/projects/${project.id}`}
              onClick={() => setMenuAnchor(null)}
              sx={{ minHeight: 44 }}
            >
              <ListItemIcon>
                <InfoOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Details</ListItemText>
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to={`/projects/${project.id}/edit`}
              onClick={() => setMenuAnchor(null)}
              sx={{ minHeight: 44 }}
            >
              <ListItemIcon>
                <EditOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null)
                onDelete(project)
              }}
              sx={{ minHeight: 44, color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteOutlineOutlinedIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>
    </Box>
  )
}
