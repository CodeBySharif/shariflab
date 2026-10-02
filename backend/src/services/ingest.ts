import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db/index.js'
import { projects, analyticsSessions, pageViews } from '../db/schema.js'
import type { Project } from '../db/schema.js'
import { truncate, verifySiteSecret } from './security.js'

export interface IngestEvent {
  type: string
  sessionId?: string
  visitorId?: string
  timestamp?: string
  path?: string
  title?: string
  referrer?: string
  device?: string
  browser?: string
  dwellSec?: number
}

export async function validateSite(siteKey: string, siteSecret: string): Promise<Project | null> {
  const [project] = await db.select().from(projects).where(eq(projects.siteKey, siteKey)).limit(1)
  if (!project || !project.trackingEnabled) return null
  const valid = await verifySiteSecret(siteSecret, project.siteSecretHash)
  return valid ? project : null
}

export async function processEvents(project: Project, events: IngestEvent[], country: string | null) {
  for (const evt of events) {
    const ts = evt.timestamp ? new Date(evt.timestamp) : new Date()
    switch (evt.type.toLowerCase()) {
      case 'session_start':
        await handleSessionStart(project, evt, ts, country)
        break
      case 'page_view':
        await handlePageView(project, evt, ts)
        break
      case 'page_leave':
      case 'heartbeat':
        await handlePageLeave(project, evt, ts)
        break
      case 'session_end':
        await handleSessionEnd(project, evt, ts)
        break
    }
  }
}

async function handleSessionStart(
  project: Project,
  evt: IngestEvent,
  ts: Date,
  country: string | null
) {
  if (!evt.sessionId || !evt.visitorId) return

  const exists = await db
    .select({ id: analyticsSessions.id })
    .from(analyticsSessions)
    .where(eq(analyticsSessions.id, evt.sessionId))
    .limit(1)
  if (exists.length > 0) return

  const prior = await db
    .select({ id: analyticsSessions.id })
    .from(analyticsSessions)
    .where(
      and(eq(analyticsSessions.projectId, project.id), eq(analyticsSessions.visitorId, evt.visitorId))
    )
    .limit(1)

  await db.insert(analyticsSessions).values({
    id: evt.sessionId,
    projectId: project.id,
    visitorId: evt.visitorId,
    startedAt: ts,
    referrer: truncate(evt.referrer, 500),
    device: truncate(evt.device, 50),
    browser: truncate(evt.browser, 100),
    country,
    isReturning: prior.length > 0,
    pageCount: 0,
    lastActivityAt: ts,
  })
}

async function handlePageView(project: Project, evt: IngestEvent, ts: Date) {
  if (!evt.sessionId || !evt.path) return

  const [session] = await db
    .select()
    .from(analyticsSessions)
    .where(eq(analyticsSessions.id, evt.sessionId))
    .limit(1)
  if (!session) return

  await db
    .update(analyticsSessions)
    .set({ pageCount: session.pageCount + 1, lastActivityAt: ts })
    .where(eq(analyticsSessions.id, evt.sessionId))

  await db.insert(pageViews).values({
    sessionId: evt.sessionId,
    projectId: project.id,
    path: truncate(evt.path, 500) ?? '/',
    title: truncate(evt.title, 300),
    enteredAt: ts,
  })
}

async function handlePageLeave(project: Project, evt: IngestEvent, ts: Date) {
  if (!evt.sessionId || !evt.path) return

  const [session] = await db
    .select()
    .from(analyticsSessions)
    .where(eq(analyticsSessions.id, evt.sessionId))
    .limit(1)
  if (!session) return

  await db
    .update(analyticsSessions)
    .set({ lastActivityAt: ts })
    .where(eq(analyticsSessions.id, evt.sessionId))

  const views = await db
    .select()
    .from(pageViews)
    .where(
      and(
        eq(pageViews.sessionId, evt.sessionId),
        eq(pageViews.path, evt.path),
        eq(pageViews.projectId, project.id)
      )
    )
    .orderBy(desc(pageViews.enteredAt))

  const pageView = views.find((v) => !v.leftAt)
  if (!pageView) return

  const dwellSec = evt.dwellSec ?? Math.round((ts.getTime() - pageView.enteredAt.getTime()) / 1000)
  await db
    .update(pageViews)
    .set({ leftAt: ts, dwellSec })
    .where(eq(pageViews.id, pageView.id))
}

async function handleSessionEnd(project: Project, evt: IngestEvent, ts: Date) {
  if (!evt.sessionId) return

  const [session] = await db
    .select()
    .from(analyticsSessions)
    .where(eq(analyticsSessions.id, evt.sessionId))
    .limit(1)
  if (!session) return

  const durationSec =
    evt.dwellSec ?? Math.round((ts.getTime() - session.startedAt.getTime()) / 1000)

  await db
    .update(analyticsSessions)
    .set({ endedAt: ts, durationSec, lastActivityAt: ts })
    .where(eq(analyticsSessions.id, evt.sessionId))
}
