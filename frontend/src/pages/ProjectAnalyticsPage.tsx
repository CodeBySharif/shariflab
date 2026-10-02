import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  MenuItem,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import api from '../api/client'
import {
  AnalyticsChartSkeleton,
  AnalyticsOverviewSkeleton,
  AnalyticsTableSkeleton,
} from '../components/skeletons/AnalyticsSkeleton'
import { useToast } from '../context/ToastContext'
import { parseTechStack } from '../lib/techStack'
import type {
  DeviceStats,
  Overview,
  PageStats,
  Project,
  Realtime,
  ReferrerStats,
  Traffic,
} from '../types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const PLATFORM_LABELS: Record<string, string> = {
  vercel: 'Vercel',
  netlify: 'Netlify',
  gcp: 'GCP',
  cloudflare: 'Cloudflare Pages',
  other: 'Other',
}

const ANALYTICS_TABS = ['Overview', 'Pages', 'Traffic', 'Referrers', 'Devices', 'Realtime'] as const
const BASE_TABS = ['Project', 'Tracking'] as const
type DetailTab = (typeof ANALYTICS_TABS)[number] | (typeof BASE_TABS)[number]

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h5" sx={{ mt: 0.5 }}>{value}</Typography>
        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      </CardContent>
    </Card>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  )
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
      {children}
    </Typography>
  )
}

function QueryError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  )
}

export default function ProjectAnalyticsPage() {
  const { id } = useParams<{ id: string }>()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [tab, setTab] = useState<DetailTab>('Project')
  const [days, setDays] = useState(30)
  const [trackingSecret, setTrackingSecret] = useState<string | null>(null)

  const chartGrid = theme.palette.divider
  const chartAxis = theme.palette.text.secondary
  const chartAccent = theme.palette.primary.main
  const chartFill = theme.palette.primary.dark || theme.palette.primary.main
  const pieColors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ]
  const tooltipStyle = {
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  }

  const cached = queryClient.getQueryData<Project[]>(['projects'])?.find((p) => p.id === id)

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
    error: projectErr,
    refetch: refetchProject,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => (await api.get<Project>(`/projects/${id}`)).data,
    enabled: !!id,
    initialData: cached,
    retry: false,
  })

  const trackingOn = Boolean(project?.trackingEnabled)
  const analyticsEnabled = !!id && trackingOn

  const tabs = useMemo<DetailTab[]>(
    () => (trackingOn ? ['Project', ...ANALYTICS_TABS, 'Tracking'] : ['Project', 'Tracking']),
    [trackingOn],
  )

  useEffect(() => {
    if (!tabs.includes(tab)) setTab('Project')
  }, [tabs, tab])

  const overviewQuery = useQuery({
    queryKey: ['overview', id, days],
    queryFn: async () =>
      (await api.get<Overview>(`/projects/${id}/analytics/overview`, { params: { days } })).data,
    enabled: analyticsEnabled && (tab === 'Overview' || tab === 'Project'),
  })

  const pagesQuery = useQuery({
    queryKey: ['pages', id, days],
    queryFn: async () =>
      (await api.get<PageStats[]>(`/projects/${id}/analytics/pages`, { params: { days } })).data,
    enabled: analyticsEnabled && tab === 'Pages',
  })

  const trafficQuery = useQuery({
    queryKey: ['traffic', id, days],
    queryFn: async () =>
      (await api.get<Traffic>(`/projects/${id}/analytics/traffic`, { params: { days } })).data,
    enabled: analyticsEnabled && tab === 'Traffic',
  })

  const referrersQuery = useQuery({
    queryKey: ['referrers', id, days],
    queryFn: async () =>
      (await api.get<ReferrerStats[]>(`/projects/${id}/analytics/referrers`, { params: { days } })).data,
    enabled: analyticsEnabled && (tab === 'Referrers' || tab === 'Overview'),
  })

  const devicesQuery = useQuery({
    queryKey: ['devices', id, days],
    queryFn: async () =>
      (await api.get<DeviceStats[]>(`/projects/${id}/analytics/devices`, { params: { days } })).data,
    enabled: analyticsEnabled && (tab === 'Devices' || tab === 'Overview'),
  })

  const realtimeQuery = useQuery({
    queryKey: ['realtime', id],
    queryFn: async () => (await api.get<Realtime>(`/projects/${id}/analytics/realtime`)).data,
    enabled: analyticsEnabled && tab === 'Realtime',
    refetchInterval: tab === 'Realtime' ? 10000 : false,
  })

  const refreshThumbnail = useMutation({
    mutationFn: async () => {
      const res = await api.post<{ thumbnailUrl: string }>(`/projects/${id}/thumbnail/refresh`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      showToast('Thumbnail updated')
    },
    onError: () => showToast('Thumbnail capture failed', 'error'),
  })

  const rotateTrackingSecret = useMutation({
    mutationFn: async () =>
      (await api.post<{ siteSecret: string }>(`/projects/${id}/tracking-secret/rotate`)).data,
    onSuccess: ({ siteSecret }) => {
      setTrackingSecret(siteSecret)
      showToast('New tracking secret generated')
    },
    onError: () => showToast('Could not generate tracking secret', 'error'),
  })

  const apiBase = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '')
  const embedSnippet =
    project?.trackingEnabled && trackingSecret
      ? `<script async src="${apiBase}/track.js" data-site-key="${project.siteKey}" data-site-secret="${trackingSecret}"></script>`
      : null

  const overview = overviewQuery.data
  const pages = pagesQuery.data
  const traffic = trafficQuery.data
  const referrers = referrersQuery.data
  const devices = devicesQuery.data
  const realtime = realtimeQuery.data

  const visitorPie =
    overview &&
    [
      { name: 'New', value: overview.newVisitors },
      { name: 'Returning', value: overview.returningVisitors },
    ].filter((d) => d.value > 0)

  if (projectLoading && !project) {
    return (
      <Box className="fade-in">
        <Skeleton width={120} height={20} sx={{ mb: 1 }} />
        <Skeleton width={240} height={32} sx={{ mb: 2 }} />
        <AnalyticsOverviewSkeleton />
      </Box>
    )
  }

  if (projectError || !project) {
    return (
      <Box className="fade-in">
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 2 }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} /> All projects
        </Link>
        <QueryError
          message={
            projectErr instanceof Error
              ? `Project not found: ${projectErr.message}`
              : 'Project not found.'
          }
          onRetry={() => refetchProject()}
        />
      </Box>
    )
  }

  return (
    <Box className="fade-in">
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color="text.secondary"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 2, minHeight: 40 }}
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} /> All projects
      </Link>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 2.5,
          pb: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'flex-end' },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            Project
          </Typography>
          <Typography
            variant="h4"
            sx={{
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
            }}
          >
            {project.name}
          </Typography>
          <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer" variant="body2">
            {project.websiteUrl}
          </Link>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
          {trackingOn && tab !== 'Realtime' && tab !== 'Project' && tab !== 'Tracking' && (
            <TextField select size="small" value={days} onChange={(e) => setDays(Number(e.target.value))} sx={{ minWidth: 132 }}>
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </TextField>
          )}
          <Button
            component="a"
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          >
            Open site
          </Button>
          <Button component={RouterLink} to={`/projects/${id}/edit`} variant="outlined">
            Edit
          </Button>
        </Stack>
      </Stack>

      {!trackingOn && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This hub catalogs and opens your sites. Visitor tracking is off for this project. Turn it on in Edit if you need it.
        </Alert>
      )}

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 40,
          borderBottom: 1,
          borderColor: 'divider',
          mb: 2,
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.default',
        }}
      >
        {tabs.map((t) => (
          <Tab key={t} label={t} value={t} />
        ))}
      </Tabs>

      <Box key={tab} className="fade-in">
        {tab === 'Overview' && (
          overviewQuery.isLoading && !overview ? (
            <AnalyticsOverviewSkeleton />
          ) : overviewQuery.isError ? (
            <QueryError message="Could not load overview." onRetry={() => overviewQuery.refetch()} />
          ) : overview ? (
            <Stack spacing={2}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, lg: 3 }}><KpiCard label="Page views" value={overview.pageViews} /></Grid>
                <Grid size={{ xs: 6, lg: 3 }}><KpiCard label="Unique visitors" value={overview.uniqueVisitors} /></Grid>
                <Grid size={{ xs: 6, lg: 3 }}><KpiCard label="Avg. session" value={`${overview.avgDurationSec}s`} /></Grid>
                <Grid size={{ xs: 6, lg: 3 }}><KpiCard label="Bounce rate" value={`${overview.bounceRate}%`} /></Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Daily page views</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={overview.daily}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                        <XAxis dataKey="date" stroke={chartAxis} fontSize={11} />
                        <YAxis stroke={chartAxis} fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="count" name="Views" stroke={chartAccent} fill={chartFill} fillOpacity={0.25} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>New vs returning</Typography>
                    {visitorPie && visitorPie.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={visitorPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                            {visitorPie.map((_, i) => (
                              <Cell key={i} fill={pieColors[i % pieColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyHint>No visitor data yet. Confirm the embed script is live on the site.</EmptyHint>
                    )}
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Top referrers</Typography>
                    {referrersQuery.isError ? (
                      <QueryError message="Could not load referrers." onRetry={() => referrersQuery.refetch()} />
                    ) : referrers && referrers.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={referrers.slice(0, 8)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                          <XAxis type="number" stroke={chartAxis} fontSize={11} />
                          <YAxis type="category" dataKey="referrer" stroke={chartAxis} fontSize={10} width={100} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Bar dataKey="count" fill={chartAccent} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyHint>No referrer data yet</EmptyHint>
                    )}
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Devices</Typography>
                    {devicesQuery.isError ? (
                      <QueryError message="Could not load devices." onRetry={() => devicesQuery.refetch()} />
                    ) : devices && devices.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={devices} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={70}>
                            {devices.map((_, i) => (
                              <Cell key={i} fill={pieColors[i % pieColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyHint>No device data yet</EmptyHint>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          ) : (
            <EmptyHint>No overview data yet</EmptyHint>
          )
        )}

        {tab === 'Pages' && (
          pagesQuery.isLoading && !pages ? (
            <AnalyticsTableSkeleton />
          ) : pagesQuery.isError ? (
            <QueryError message="Could not load pages." onRetry={() => pagesQuery.refetch()} />
          ) : (
            <Card variant="outlined" sx={{ overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Path</TableCell>
                    <TableCell align="right">Views</TableCell>
                    <TableCell align="right">Avg. dwell</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!pages || pages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No page views yet. Confirm the embed script is live on the site.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pages.map((p) => (
                      <TableRow key={p.path}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{p.path}</Typography>
                          {p.title && <Typography variant="caption" color="text.secondary">{p.title}</Typography>}
                        </TableCell>
                        <TableCell align="right">{p.views}</TableCell>
                        <TableCell align="right">{p.avgDwellSec}s</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          )
        )}

        {tab === 'Traffic' && (
          trafficQuery.isLoading && !traffic ? (
            <AnalyticsChartSkeleton />
          ) : trafficQuery.isError ? (
            <QueryError message="Could not load traffic." onRetry={() => trafficQuery.refetch()} />
          ) : traffic ? (
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Daily traffic</Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={traffic.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                    <XAxis dataKey="date" stroke={chartAxis} fontSize={12} />
                    <YAxis stroke={chartAxis} fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="count" stroke={chartAccent} fill={chartAccent} fillOpacity={0.12} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>By hour (UTC)</Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={traffic.hourly.map((h) => ({
                      label: `${DAYS[h.day]} ${h.hour}:00`,
                      count: h.count,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                    <XAxis dataKey="label" stroke={chartAxis} fontSize={10} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke={chartAxis} fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill={chartAccent} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Stack>
          ) : (
            <EmptyHint>No traffic data yet</EmptyHint>
          )
        )}

        {tab === 'Referrers' && (
          referrersQuery.isLoading && !referrers ? (
            <AnalyticsTableSkeleton />
          ) : referrersQuery.isError ? (
            <QueryError message="Could not load referrers." onRetry={() => referrersQuery.refetch()} />
          ) : (
            <Card variant="outlined" sx={{ overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Referrer</TableCell>
                    <TableCell align="right">Sessions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!referrers || referrers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No referrer data yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    referrers.map((r) => (
                      <TableRow key={r.referrer}>
                        <TableCell>{r.referrer}</TableCell>
                        <TableCell align="right">{r.count}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          )
        )}

        {tab === 'Devices' && (
          devicesQuery.isLoading && !devices ? (
            <AnalyticsChartSkeleton />
          ) : devicesQuery.isError ? (
            <QueryError message="Could not load devices." onRetry={() => devicesQuery.refetch()} />
          ) : !devices || devices.length === 0 ? (
            <Card variant="outlined" sx={{ p: 2 }}>
              <EmptyHint>No device data yet</EmptyHint>
            </Card>
          ) : (
            <Card variant="outlined" sx={{ p: 2 }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={devices}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis dataKey="device" stroke={chartAxis} />
                  <YAxis stroke={chartAxis} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill={chartAccent} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )
        )}

        {tab === 'Realtime' && (
          realtimeQuery.isLoading && !realtime ? (
            <AnalyticsOverviewSkeleton />
          ) : realtimeQuery.isError ? (
            <QueryError message="Could not load realtime data." onRetry={() => realtimeQuery.refetch()} />
          ) : realtime ? (
            <Stack spacing={2}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}><KpiCard label="Active users (5 min)" value={realtime.activeUsers} /></Grid>
                <Grid size={{ xs: 6 }}><KpiCard label="Active pages" value={realtime.activePages.length} /></Grid>
              </Grid>
              {realtime.activePages.length > 0 ? (
                <Card variant="outlined">
                  <CardContent>
                    {realtime.activePages.map((p) => (
                      <Typography key={p} variant="body2">{p}</Typography>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <EmptyHint>No active pages in the last 5 minutes</EmptyHint>
              )}
              <Button size="small" variant="outlined" onClick={() => realtimeQuery.refetch()} sx={{ alignSelf: 'flex-start', minHeight: 36 }}>
                Refresh
              </Button>
            </Stack>
          ) : (
            <EmptyHint>No realtime data yet</EmptyHint>
          )
        )}

        {tab === 'Project' && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Project details</Typography>
                  <DetailRow label="Name">{project.name}</DetailRow>
                  <DetailRow label="Website">
                    <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer">{project.websiteUrl}</Link>
                  </DetailRow>
                  <DetailRow label="GitHub">
                    {project.githubUrl ? (
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">{project.githubUrl}</Link>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Not set</Typography>
                    )}
                  </DetailRow>
                  <DetailRow label="Deploy platform">
                    {project.deployPlatform
                      ? PLATFORM_LABELS[project.deployPlatform] ?? project.deployPlatform
                      : 'Not set'}
                  </DetailRow>
                  <DetailRow label="Tech stack">
                    {parseTechStack(project.techStack).length > 0 ? (
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {parseTechStack(project.techStack).map((tech) => (
                          <Chip key={tech} label={tech} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Not set</Typography>
                    )}
                  </DetailRow>
                  <DetailRow label="Notes">
                    {project.description || <Typography variant="body2" color="text.secondary">Not set</Typography>}
                  </DetailRow>
                  <DetailRow label="Tracking">
                    <Chip
                      label={project.trackingEnabled ? 'Enabled' : 'Off'}
                      size="small"
                      color={project.trackingEnabled ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </DetailRow>
                  <DetailRow label="Added">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </DetailRow>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                    <Box>
                      <Typography variant="subtitle1">Thumbnail</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Auto-captured from your live URL. No tracking script required.
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => refreshThumbnail.mutate()}
                      disabled={refreshThumbnail.isPending}
                      sx={{ minHeight: 36 }}
                    >
                      {refreshThumbnail.isPending ? 'Capturing...' : 'Refresh'}
                    </Button>
                  </Stack>
                  {project.thumbnailUrl ? (
                    <Box
                      component="img"
                      src={project.thumbnailUrl}
                      alt={project.name}
                      sx={{ mt: 2, width: '100%', height: 160, objectFit: 'cover', objectPosition: 'top', borderRadius: 1, border: 1, borderColor: 'divider' }}
                    />
                  ) : (
                    <Box sx={{ mt: 2, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">No thumbnail yet</Typography>
                    </Box>
                  )}
                  {project.thumbnailUpdatedAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Updated {new Date(project.thumbnailUpdatedAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tab === 'Tracking' && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Tracking snippet</Typography>
              {!project.trackingEnabled ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Tracking is off. Edit the project and enable visitor tracking only if you plan to embed the script on the live site.
                </Typography>
              ) : (
                <Stack spacing={1.5} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Site key: <Box component="code" sx={{ color: 'primary.main' }}>{project.siteKey}</Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secrets are stored as hashes and cannot be revealed later. Generate a secret, then copy the snippet. Do not paste a placeholder.
                  </Typography>
                  {embedSnippet ? (
                    <>
                      <Alert severity="warning">
                        This secret is shown once. Copy the snippet now; regenerating invalidates the previous secret.
                      </Alert>
                      <Box component="pre" sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, overflow: 'auto', fontSize: '0.75rem' }}>
                        {embedSnippet}
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => navigator.clipboard.writeText(embedSnippet)}
                          sx={{ minHeight: 36 }}
                        >
                          Copy snippet
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          disabled={rotateTrackingSecret.isPending}
                          onClick={() => rotateTrackingSecret.mutate()}
                          sx={{ minHeight: 36 }}
                        >
                          {rotateTrackingSecret.isPending ? 'Generating…' : 'Generate new secret'}
                        </Button>
                      </Stack>
                    </>
                  ) : (
                    <Stack spacing={1.5}>
                      <Typography variant="body2" color="text.secondary">
                        No secret is available to show. Generate one to get a working embed snippet.
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        disabled={rotateTrackingSecret.isPending}
                        onClick={() => rotateTrackingSecret.mutate()}
                        sx={{ alignSelf: 'flex-start', minHeight: 36 }}
                      >
                        {rotateTrackingSecret.isPending ? 'Generating…' : 'Generate tracking secret'}
                      </Button>
                    </Stack>
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}
