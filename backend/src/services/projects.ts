import { and, asc, desc, eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { projectDiagrams, projects, users, type Project } from '../db/schema.js'
import { slugify } from '../lib/slug.js'

export async function listOwnedProjects(ownerId: string) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .orderBy(desc(projects.updatedAt))
}

export async function getOwnedProject(id: string, ownerId: string) {
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
    .limit(1)
  return row ?? null
}

export async function getDiagrams(projectId: string) {
  return db
    .select()
    .from(projectDiagrams)
    .where(eq(projectDiagrams.projectId, projectId))
    .orderBy(asc(projectDiagrams.sortOrder), asc(projectDiagrams.createdAt))
}

export async function uniqueSlugForOwner(ownerId: string, name: string, excludeId?: string) {
  const base = slugify(name)
  let candidate = base
  let i = 2
  while (true) {
    const [existing] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.ownerId, ownerId), eq(projects.slug, candidate)))
      .limit(1)
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${base}-${i}`
    i += 1
  }
}

export function toProjectDto(p: Project, diagrams: Awaited<ReturnType<typeof getDiagrams>> = []) {
  return {
    id: p.id,
    ownerId: p.ownerId,
    slug: p.slug,
    name: p.name,
    websiteUrl: p.websiteUrl,
    githubUrl: p.githubUrl,
    description: p.description,
    techStack: p.techStack,
    thumbnailUrl: p.thumbnailUrl,
    problemStatement: p.problemStatement,
    solution: p.solution,
    targetUsers: p.targetUsers,
    useCases: p.useCases,
    deployLocation: p.deployLocation,
    deployPlatform: p.deployPlatform,
    status: p.status,
    timeline: p.timeline,
    role: p.role,
    keyFeatures: p.keyFeatures,
    lessonsLearned: p.lessonsLearned,
    demoUrl: p.demoUrl,
    isPublished: p.isPublished,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    diagrams: diagrams.map((d) => ({
      id: d.id,
      title: d.title,
      imageUrl: d.imageUrl,
      sortOrder: d.sortOrder,
    })),
  }
}

export async function getPublicHub(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1)
  if (!user) return null

  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.ownerId, user.id), eq(projects.isPublished, true)))
    .orderBy(desc(projects.updatedAt))

  return {
    user: {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
    },
    projects: rows.map((p) => toProjectDto(p)),
  }
}

export async function getPublicProject(username: string, slug: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1)
  if (!user) return null

  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.ownerId, user.id),
        eq(projects.slug, slug),
        eq(projects.isPublished, true),
      ),
    )
    .limit(1)
  if (!project) return null

  const diagrams = await getDiagrams(project.id)
  return {
    user: {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
    },
    project: toProjectDto(project, diagrams),
  }
}
