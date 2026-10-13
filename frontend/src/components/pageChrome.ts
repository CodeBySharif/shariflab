/** Shared sticky page action bar styles (detail + edit). */
export const stickyPageBarSx = {
  position: 'sticky' as const,
  top: 56,
  zIndex: 5,
  bgcolor: 'background.default',
  mt: { xs: -2, md: -3 },
  py: 1,
  mb: 2,
  mx: { xs: -2, sm: -3 },
  px: { xs: 2, sm: 3 },
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  flexWrap: 'wrap' as const,
  minHeight: 52,
}
