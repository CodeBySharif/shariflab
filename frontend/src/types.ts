export type DeployPlatform = 'vercel' | 'netlify' | 'gcp' | 'cloudflare' | 'other'

export interface Project {
  id: string
  name: string
  websiteUrl: string
  githubUrl: string | null
  deployPlatform: DeployPlatform | null
  description: string | null
  techStack: string | null
  thumbnailUrl: string | null
  thumbnailUpdatedAt: string | null
  trackingEnabled: boolean
  siteKey: string
  createdAt: string
  updatedAt: string
  pageViews7d: number
}

export interface ProjectCreated extends Project {
  siteSecret?: string
}

export interface Overview {
  pageViews: number
  uniqueVisitors: number
  avgDurationSec: number
  bounceRate: number
  pagesPerSession: number
  newVisitors: number
  returningVisitors: number
  daily: { date: string; count: number }[]
}

export interface PageStats {
  path: string
  title: string | null
  views: number
  avgDwellSec: number
  totalDwellSec: number
}

export interface Traffic {
  hourly: { day: number; hour: number; count: number }[]
  daily: { date: string; count: number }[]
}

export interface ReferrerStats {
  referrer: string
  count: number
}

export interface DeviceStats {
  device: string
  count: number
}

export interface Realtime {
  activeUsers: number
  activePages: string[]
}
