import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db/index.js'
import { projectDiagrams, projects } from '../db/schema.js'
import { type AuthRequest, requireAuth } from '../middleware/auth.js'
import {
  getDiagrams,
  getOwnedProject,
  listOwnedProjects,
  toProjectDto,
  uniqueSlugForOwner,
} from '../services/projects.js'
import { publicUploadUrl, uploadDiagram, uploadThumbnail } from '../services/uploads.js'

const router = Router()

const optionalUrl = z.union([z.string().url(), z.literal(''), z.null()]).optional()

const projectBodySchema = z.object({
  name: z.string().min(1).max(200),
  websiteUrl: optionalUrl,
  githubUrl: optionalUrl,
  description: z.string().max(5000).optional().nullable(),
  techStack: z.string().max(1000).optional().nullable(),
  problemStatement: z.string().max(5000).optional().nullable(),
  solution: z.string().max(5000).optional().nullable(),
  targetUsers: z.string().max(3000).optional().nullable(),
  useCases: z.string().max(5000).optional().nullable(),
  deployLocation: z.string().max(500).optional().nullable(),
  deployPlatform: z.string().max(100).optional().nullable(),
  status: z.enum(['wip', 'live', 'archived']).optional(),
  timeline: z.string().max(200).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  keyFeatures: z.string().max(5000).optional().nullable(),
  lessonsLearned: z.string().max(5000).optional().nullable(),
  demoUrl: optionalUrl,
  isPublished: z.boolean().optional(),
  slug: z.string().min(1).max(80).optional(),
})

function cleanUrl(value?: string | null) {
  if (!value || value === '') return null
  return value
}

function mapBody(data: z.infer<typeof projectBodySchema>) {
  return {
    name: data.name,
    websiteUrl: cleanUrl(data.websiteUrl),
    githubUrl: cleanUrl(data.githubUrl),
    description: data.description ?? null,
    techStack: data.techStack ?? null,
    problemStatement: data.problemStatement ?? null,
    solution: data.solution ?? null,
    targetUsers: data.targetUsers ?? null,
    useCases: data.useCases ?? null,
    deployLocation: data.deployLocation ?? null,
    deployPlatform: data.deployPlatform ?? null,
    status: data.status,
    timeline: data.timeline ?? null,
    role: data.role ?? null,
    keyFeatures: data.keyFeatures ?? null,
    lessonsLearned: data.lessonsLearned ?? null,
    demoUrl: cleanUrl(data.demoUrl),
    isPublished: data.isPublished,
  }
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const rows = await listOwnedProjects(req.user!.id)
  const withDiagrams = await Promise.all(
    rows.map(async (p) => toProjectDto(p, await getDiagrams(p.id))),
  )
  res.json(withDiagrams)
})

router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const project = await getOwnedProject(String(req.params.id), req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(toProjectDto(project, await getDiagrams(project.id)))
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const parsed = projectBodySchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const slug =
    parsed.data.slug?.toLowerCase() ||
    (await uniqueSlugForOwner(req.user!.id, parsed.data.name))

  const body = mapBody(parsed.data)
  const [project] = await db
    .insert(projects)
    .values({
      ownerId: req.user!.id,
      slug,
      name: body.name,
      websiteUrl: body.websiteUrl,
      githubUrl: body.githubUrl,
      description: body.description,
      techStack: body.techStack,
      problemStatement: body.problemStatement,
      solution: body.solution,
      targetUsers: body.targetUsers,
      useCases: body.useCases,
      deployLocation: body.deployLocation,
      deployPlatform: body.deployPlatform,
      status: body.status ?? 'wip',
      timeline: body.timeline,
      role: body.role,
      keyFeatures: body.keyFeatures,
      lessonsLearned: body.lessonsLearned,
      demoUrl: body.demoUrl,
      isPublished: body.isPublished ?? false,
    })
    .returning()

  res.status(201).json(toProjectDto(project, []))
})

router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  const project = await getOwnedProject(String(req.params.id), req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const parsed = projectBodySchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const data = parsed.data
  let slug = project.slug
  if (data.slug) {
    slug = await uniqueSlugForOwner(req.user!.id, data.slug, project.id)
  } else if (data.name && data.name !== project.name) {
    slug = await uniqueSlugForOwner(req.user!.id, data.name, project.id)
  }

  const patch: Record<string, unknown> = { updatedAt: new Date(), slug }
  if (data.name !== undefined) patch.name = data.name
  if (data.websiteUrl !== undefined) patch.websiteUrl = cleanUrl(data.websiteUrl)
  if (data.githubUrl !== undefined) patch.githubUrl = cleanUrl(data.githubUrl)
  if (data.description !== undefined) patch.description = data.description
  if (data.techStack !== undefined) patch.techStack = data.techStack
  if (data.problemStatement !== undefined) patch.problemStatement = data.problemStatement
  if (data.solution !== undefined) patch.solution = data.solution
  if (data.targetUsers !== undefined) patch.targetUsers = data.targetUsers
  if (data.useCases !== undefined) patch.useCases = data.useCases
  if (data.deployLocation !== undefined) patch.deployLocation = data.deployLocation
  if (data.deployPlatform !== undefined) patch.deployPlatform = data.deployPlatform
  if (data.status !== undefined) patch.status = data.status
  if (data.timeline !== undefined) patch.timeline = data.timeline
  if (data.role !== undefined) patch.role = data.role
  if (data.keyFeatures !== undefined) patch.keyFeatures = data.keyFeatures
  if (data.lessonsLearned !== undefined) patch.lessonsLearned = data.lessonsLearned
  if (data.demoUrl !== undefined) patch.demoUrl = cleanUrl(data.demoUrl)
  if (data.isPublished !== undefined) patch.isPublished = data.isPublished

  const [updated] = await db
    .update(projects)
    .set(patch)
    .where(eq(projects.id, project.id))
    .returning()

  res.json(toProjectDto(updated, await getDiagrams(updated.id)))
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const project = await getOwnedProject(String(req.params.id), req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  await db.delete(projects).where(eq(projects.id, project.id))
  res.status(204).send()
})

router.post('/:id/thumbnail', requireAuth, (req: AuthRequest, res) => {
  uploadThumbnail(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (!req.file) {
      res.status(400).json({ error: 'file is required' })
      return
    }
    const project = await getOwnedProject(String(req.params.id), req.user!.id)
    if (!project) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    const thumbnailUrl = publicUploadUrl(req, 'thumbnails', req.file.filename)
    const [updated] = await db
      .update(projects)
      .set({ thumbnailUrl, updatedAt: new Date() })
      .where(eq(projects.id, project.id))
      .returning()
    res.json(toProjectDto(updated, await getDiagrams(updated.id)))
  })
})

router.post('/:id/diagrams', requireAuth, (req: AuthRequest, res) => {
  uploadDiagram(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (!req.file) {
      res.status(400).json({ error: 'file is required' })
      return
    }
    const project = await getOwnedProject(String(req.params.id), req.user!.id)
    if (!project) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    const title = typeof req.body.title === 'string' ? req.body.title : null
    const imageUrl = publicUploadUrl(req, 'diagrams', req.file.filename)
    const existing = await getDiagrams(project.id)
    const [diagram] = await db
      .insert(projectDiagrams)
      .values({
        projectId: project.id,
        title,
        imageUrl,
        sortOrder: existing.length,
      })
      .returning()
    res.status(201).json(diagram)
  })
})

router.delete('/:id/diagrams/:diagramId', requireAuth, async (req: AuthRequest, res) => {
  const project = await getOwnedProject(String(req.params.id), req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  await db
    .delete(projectDiagrams)
    .where(eq(projectDiagrams.id, String(req.params.diagramId)))
  res.status(204).send()
})

export default router
