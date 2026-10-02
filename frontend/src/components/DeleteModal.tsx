import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
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
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button size="small" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button size="small" color="error" variant="contained" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
