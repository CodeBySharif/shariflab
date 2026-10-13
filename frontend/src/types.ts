export type ProjectStatus = 'wip' | 'live' | 'archived'

export interface ProjectDiagram {
  id: string
  title: string | null
  imageUrl: string
  sortOrder: number
}

export interface Project {
  id: string
  ownerId: string
  slug: string
  name: string
  websiteUrl: string | null
  githubUrl: string | null
  description: string | null
  techStack: string | null
  thumbnailUrl: string | null
  problemStatement: string | null
  solution: string | null
  targetUsers: string | null
  useCases: string | null
  deployLocation: string | null
  deployPlatform: string | null
  status: ProjectStatus
  timeline: string | null
  role: string | null
  keyFeatures: string | null
  lessonsLearned: string | null
  demoUrl: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  diagrams: ProjectDiagram[]
}

export interface AuthUser {
  id: string
  username: string
  email: string
  displayName: string | null
  bio: string | null
  createdAt: string
}

export interface PublicHub {
  user: {
    username: string
    displayName: string | null
    bio: string | null
  }
  projects: Project[]
}

export interface PublicProjectDetail {
  user: {
    username: string
    displayName: string | null
    bio: string | null
  }
  project: Project
}
