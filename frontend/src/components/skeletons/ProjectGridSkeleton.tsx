import { Card, CardContent, Grid, Skeleton, Stack } from '@mui/material'

export default function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={180} />
            <CardContent sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
              <Skeleton width="55%" height={28} />
              <Skeleton width="90%" height={16} sx={{ mt: 1 }} />
              <Skeleton width="70%" height={16} sx={{ mt: 0.5 }} />
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Skeleton width={64} height={22} />
                <Skeleton width={56} height={22} />
              </Stack>
            </CardContent>
            <Stack
              direction="row"
              sx={{
                px: 2.5,
                py: 1.5,
                borderTop: 1,
                borderColor: 'divider',
                justifyContent: 'space-between',
              }}
            >
              <Skeleton width={88} height={36} sx={{ borderRadius: 1 }} />
              <Stack direction="row" spacing={1}>
                <Skeleton width={56} height={36} />
                <Skeleton width={40} height={36} />
              </Stack>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
