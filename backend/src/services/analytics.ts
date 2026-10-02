import { eq, and, gte, desc, inArray, isNull, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { projects, analyticsSessions, pageViews } from '../db/schema.js'
import type { Project } from '../db/schema.js'

export async function getOwnedProject(projectId: string, ownerId: string): Promise<Project | null> {
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .limit(1)
  return row ?? null
}

export async function listProjects(ownerId: string) {
  return db.select().from(projects).where(eq(projects.ownerId, ownerId)).orderBy(desc(projects.createdAt))
}

export async function getPageViewCount7d(projectId: string): Promise<number> {
  const since = new Date()
  since.setDate(since.getDate() - 7)
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pageViews)
    .where(and(eq(pageViews.projectId, projectId), gte(pageViews.enteredAt, since)))
  return row?.count ?? 0
}

export async function getOverview(projectId: string, days: number) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const sessions = await db
    .select()
    .from(analyticsSessions)
    .where(and(eq(analyticsSessions.projectId, projectId), gte(analyticsSessions.startedAt, since)))

  const views = await db
    .select()
    .from(pageViews)
    .where(and(eq(pageViews.projectId, projectId), gte(pageViews.enteredAt, since)))

  const uniqueVisitors = new Set(sessions.map((s) => s.visitorId)).size
  const durations = sessions.filter((s) => s.durationSec != null).map((s) => s.durationSec!)
  const avgDuration = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  const bounceRate = sessions.length ? (sessions.filter((s) => s.pageCount <= 1).length * 100) / sessions.length : 0
  const pagesPerSession = sessions.length ? sessions.reduce((a, s) => a + s.pageCount, 0) / sessions.length : 0

  const dailyMap = new Map<string, number>()
  for (const v of views) {
    const key = v.enteredAt.toISOString().slice(0, 10)
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1)
  }
  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))

  return {
    pageViews: views.length,
    uniqueVisitors,
    avgDurationSec: Math.round(avgDuration),
    bounceRate: Math.round(bounceRate * 10) / 10,
    pagesPerSession: Math.round(pagesPerSession * 10) / 10,
    newVisitors: sessions.filter((s) => !s.isReturning).length,
    returningVisitors: sessions.filter((s) => s.isReturning).length,
    daily,
  }
}

export async function getPageStats(projectId: string, days: number) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const views = await db
    .select()
    .from(pageViews)
    .where(and(eq(pageViews.projectId, projectId), gte(pageViews.enteredAt, since)))

  const map = new Map<string, { path: string; title: string | null; views: number; dwellTotal: number; dwellCount: number }>()
  for (const v of views) {
    const key = v.path
    const entry = map.get(key) ?? { path: v.path, title: v.title, views: 0, dwellTotal: 0, dwellCount: 0 }
    entry.views++
    if (v.dwellSec != null) {
      entry.dwellTotal += v.dwellSec
      entry.dwellCount++
    }
    if (v.title) entry.title = v.title
    map.set(key, entry)
  }

  return [...map.values()]
    .map((p) => ({
      path: p.path,
      title: p.title,
      views: p.views,
      avgDwellSec: p.dwellCount ? Math.round(p.dwellTotal / p.dwellCount) : 0,
      totalDwellSec: p.dwellTotal,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 50)
}

export async function getTraffic(projectId: string, days: number) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const views = await db
    .select()
    .from(pageViews)
    .where(and(eq(pageViews.projectId, projectId), gte(pageViews.enteredAt, since)))

  const hourlyMap = new Map<string, number>()
  const dailyMap = new Map<string, number>()
  for (const v of views) {
    const day = v.enteredAt.getUTCDay()
    const hour = v.enteredAt.getUTCHours()
    const hKey = `${day}-${hour}`
    hourlyMap.set(hKey, (hourlyMap.get(hKey) ?? 0) + 1)
    const dKey = v.enteredAt.toISOString().slice(0, 10)
    dailyMap.set(dKey, (dailyMap.get(dKey) ?? 0) + 1)
  }

  const hourly = [...hourlyMap.entries()].map(([key, count]) => {
    const [day, hour] = key.split('-').map(Number)
    return { day, hour, count }
  })
  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))

  return { hourly, daily }
}

export async function getReferrers(projectId: string, days: number) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const sessions = await db
    .select()
    .from(analyticsSessions)
    .where(and(eq(analyticsSessions.projectId, projectId), gte(analyticsSessions.startedAt, since)))

  const map = new Map<string, number>()
  for (const s of sessions) {
    const ref = s.referrer || 'direct'
    map.set(ref, (map.get(ref) ?? 0) + 1)
  }

  return [...map.entries()]
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
}

export async function getDevices(projectId: string, days: number) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const sessions = await db
    .select()
    .from(analyticsSessions)
    .where(and(eq(analyticsSessions.projectId, projectId), gte(analyticsSessions.startedAt, since)))

  const map = new Map<string, number>()
  for (const s of sessions) {
    const device = s.device || 'unknown'
    map.set(device, (map.get(device) ?? 0) + 1)
  }

  return [...map.entries()]
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getRealtime(projectId: string) {
  const since = new Date()
  since.setMinutes(since.getMinutes() - 5)

  const sessions = await db
    .select()
    .from(analyticsSessions)
    .where(and(eq(analyticsSessions.projectId, projectId), gte(analyticsSessions.lastActivityAt, since)))

  const sessionIds = sessions.map((s) => s.id)
  if (sessionIds.length === 0) return { activeUsers: 0, activePages: [] as string[] }

  const activeViews = await db
    .select({ path: pageViews.path })
    .from(pageViews)
    .where(
      and(
        eq(pageViews.projectId, projectId),
        inArray(pageViews.sessionId, sessionIds),
        isNull(pageViews.leftAt)
      )
    )

  const activePages = [...new Set(activeViews.map((v) => v.path))].slice(0, 10)
  return { activeUsers: sessions.length, activePages }
}
