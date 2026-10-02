import { Grid, Skeleton, Stack } from '@mui/material'

export function AnalyticsOverviewSkeleton() {
  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, lg: 3 }}>
            <Skeleton variant="rounded" height={88} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton variant="rounded" height={260} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton variant="rounded" height={260} />
        </Grid>
      </Grid>
    </Stack>
  )
}

export function AnalyticsTableSkeleton() {
  return <Skeleton variant="rounded" height={320} />
}

export function AnalyticsChartSkeleton() {
  return <Skeleton variant="rounded" height={280} />
}
