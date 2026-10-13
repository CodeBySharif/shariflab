import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const projectStatusEnum = pgEnum('project_status', ['wip', 'live', 'archived'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    websiteUrl: text('website_url'),
    githubUrl: text('github_url'),
    description: text('description'),
    techStack: text('tech_stack'),
    thumbnailUrl: text('thumbnail_url'),
    problemStatement: text('problem_statement'),
    solution: text('solution'),
    targetUsers: text('target_users'),
    useCases: text('use_cases'),
    deployLocation: text('deploy_location'),
    deployPlatform: text('deploy_platform'),
    status: projectStatusEnum('status').notNull().default('wip'),
    timeline: text('timeline'),
    role: text('role'),
    keyFeatures: text('key_features'),
    lessonsLearned: text('lessons_learned'),
    demoUrl: text('demo_url'),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('projects_owner_slug_idx').on(t.ownerId, t.slug)],
)

export const projectDiagrams = pgTable('project_diagrams', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title'),
  imageUrl: text('image_url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectDiagram = typeof projectDiagrams.$inferSelect
