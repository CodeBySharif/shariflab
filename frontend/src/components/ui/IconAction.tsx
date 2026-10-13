import { IconButton, Tooltip, type IconButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

/** Icon-only control with arrow tooltip kept close to the icon. */
export default function IconAction({
  title,
  children,
  ...props
}: IconButtonProps & { title: string; children: ReactNode }) {
  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton size="small" aria-label={title} sx={{ width: 40, height: 40, ...props.sx }} {...props}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  )
}
