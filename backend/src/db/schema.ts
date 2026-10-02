import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const deployPlatformEnum = pgEnum('deploy_platform', [
  'vercel',
  'netlify',
  'gcp',
  'cloudflare',
  'other',
])

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull(),
  name: text('name').notNull(),
  websiteUrl: text('website_url').notNull(),
  githubUrl: text('github_url'),
  deployPlatform: deployPlatformEnum('deploy_platform'),
  description: text('description'),
  techStack: text('tech_stack'),
  thumbnailUrl: text('thumbnail_url'),
  thumbnailUpdatedAt: timestamp('thumbnail_updated_at', { withTimezone: true }),
  trackingEnabled: boolean('tracking_enabled').notNull().default(true),
  siteKey: text('site_key').notNull().unique(),
  siteSecretHash: text('site_secret_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const analyticsSessions = pgTable('analytics_sessions', {
  id: uuid('id').primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  visitorId: text('visitor_id').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  durationSec: integer('duration_sec'),
  referrer: text('referrer'),
  device: text('device'),
  browser: text('browser'),
  country: text('country'),
  isReturning: boolean('is_returning').notNull().default(false),
  pageCount: integer('page_count').notNull().default(0),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).notNull(),
})

export const pageViews = pgTable('page_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => analyticsSessions.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  title: text('title'),
  enteredAt: timestamp('entered_at', { withTimezone: true }).notNull(),
  leftAt: timestamp('left_at', { withTimezone: true }),
  dwellSec: integer('dwell_sec'),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type AnalyticsSession = typeof analyticsSessions.$inferSelect
export type PageView = typeof pageViews.$inferSelect
