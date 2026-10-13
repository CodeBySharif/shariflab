import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import type { Project } from '../types'

export default function DeleteModal({
  project,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  project: Project
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}) {
  return (
    <Dialog open onClose={isDeleting ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Delete project?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          <strong>{project.name}</strong> will be permanently removed from your hub. This cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-start', gap: 1 }}>
        <Button
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteOutlinedIcon />}
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={onCancel}
          disabled={isDeleting}
          sx={{ ml: 'auto' }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
