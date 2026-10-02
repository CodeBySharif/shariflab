import { Router } from 'express'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { projects } from '../db/schema.js'
import { type AuthRequest, requireAuth } from '../middleware/auth.js'
import {
  generateSiteKey,
  generateSiteSecret,
  hashSiteSecret,
} from '../services/security.js'
import { getPageViewCount7d, listProjects, getOwnedProject } from '../services/analytics.js'
import { captureThumbnail, scheduleThumbnailCapture } from '../services/thumbnails.js'

const router = Router()

const createSchema = z.object({
  name: z.string().min(1).max(200),
  websiteUrl: z.string().url(),
  githubUrl: z.string().url().optional().nullable(),
  deployPlatform: z.enum(['vercel', 'netlify', 'gcp', 'cloudflare', 'other']).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  techStack: z.string().max(500).optional().nullable(),
  trackingEnabled: z.boolean().default(true),
})

const updateSchema = createSchema.partial()

function toDto(p: typeof projects.$inferSelect, pageViews7d?: number) {
  return {
    id: p.id,
    name: p.name,
    websiteUrl: p.websiteUrl,
    githubUrl: p.githubUrl,
    deployPlatform: p.deployPlatform,
    description: p.description,
    techStack: p.techStack,
    thumbnailUrl: p.thumbnailUrl,
    thumbnailUpdatedAt: p.thumbnailUpdatedAt,
    trackingEnabled: p.trackingEnabled,
    siteKey: p.siteKey,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    pageViews7d: pageViews7d ?? 0,
  }
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const rows = await listProjects(req.user!.id)
  const withStats = await Promise.all(
    rows.map(async (p) => toDto(p, await getPageViewCount7d(p.id)))
  )
  res.json(withStats)
})

router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = String(req.params.id)
  const project = await getOwnedProject(id, req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(toDto(project, await getPageViewCount7d(project.id)))
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const siteKey = generateSiteKey()
  const siteSecret = generateSiteSecret()
  const siteSecretHash = await hashSiteSecret(siteSecret)

  const [project] = await db
    .insert(projects)
    .values({
      ownerId: req.user!.id,
      name: parsed.data.name,
      websiteUrl: parsed.data.websiteUrl,
      githubUrl: parsed.data.githubUrl ?? null,
      deployPlatform: parsed.data.deployPlatform ?? null,
      description: parsed.data.description ?? null,
      techStack: parsed.data.techStack ?? null,
      trackingEnabled: parsed.data.trackingEnabled,
      siteKey,
      siteSecretHash,
    })
    .returning()

  scheduleThumbnailCapture(project.id, project.websiteUrl)

  res.status(201).json({
    ...toDto(project),
    siteSecret: parsed.data.trackingEnabled ? siteSecret : undefined,
  })
})

router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = String(req.params.id)
  const project = await getOwnedProject(id, req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const parsed = updateSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const urlChanged = parsed.data.websiteUrl && parsed.data.websiteUrl !== project.websiteUrl

  const [updated] = await db
    .update(projects)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projects.id, project.id))
    .returning()

  if (urlChanged) {
    scheduleThumbnailCapture(updated.id, updated.websiteUrl)
  }

  res.json(toDto(updated, await getPageViewCount7d(updated.id)))
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = String(req.params.id)
  const project = await getOwnedProject(id, req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  await db.delete(projects).where(eq(projects.id, project.id))
  res.status(204).send()
})

router.post('/:id/tracking-secret/rotate', requireAuth, async (req: AuthRequest, res) => {
  const id = String(req.params.id)
  const project = await getOwnedProject(id, req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const siteSecret = generateSiteSecret()
  const siteSecretHash = await hashSiteSecret(siteSecret)

  await db
    .update(projects)
    .set({ siteSecretHash, updatedAt: new Date() })
    .where(eq(projects.id, project.id))

  // The plaintext is deliberately returned once and never stored.
  res.json({ siteSecret })
})

router.post('/:id/thumbnail/refresh', requireAuth, async (req: AuthRequest, res) => {
  const id = String(req.params.id)
  const project = await getOwnedProject(id, req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const url = await captureThumbnail(project.id, project.websiteUrl)
  if (!url) {
    res.status(502).json({ error: 'Failed to capture thumbnail' })
    return
  }

  res.json({ thumbnailUrl: url })
})

export default router
