import { Card, CardContent, Skeleton, Stack } from '@mui/material'

export default function FormSkeleton() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Skeleton height={40} sx={{ flex: 1 }} />
            <Skeleton height={40} sx={{ flex: 1 }} />
          </Stack>
          <Skeleton height={40} />
          <Skeleton height={72} />
          <Skeleton height={24} width="40%" />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <Skeleton width={72} height={32} />
            <Skeleton width={72} height={32} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
