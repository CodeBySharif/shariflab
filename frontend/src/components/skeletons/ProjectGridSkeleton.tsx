import { Card, CardContent, Grid, Skeleton } from '@mui/material'

export default function ProjectGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={140} />
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Skeleton width="60%" height={24} />
              <Skeleton width="90%" height={14} sx={{ mt: 1 }} />
              <Skeleton width="70%" height={14} sx={{ mt: 0.5 }} />
              <Skeleton height={40} sx={{ mt: 2, borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
