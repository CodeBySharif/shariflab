import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined'

export default function DiagramTitleModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: (title: string) => void
}) {
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (open) setTitle('')
  }, [open])

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Diagram title</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="dense"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onConfirm(title.trim())
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" size="small" startIcon={<CloseIcon />} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<UploadOutlinedIcon />}
          onClick={() => onConfirm(title.trim())}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  )
}
