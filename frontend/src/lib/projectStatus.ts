import type { ProjectStatus } from '../types'

export function statusLabel(status: ProjectStatus) {
  if (status === 'wip') return 'WIP'
  if (status === 'live') return 'Live'
  return 'Archived'
}

export function statusColors(status: ProjectStatus) {
  if (status === 'live') {
    return {
      bg: '#16a34a',
      border: 'rgba(134, 239, 172, 0.7)',
      color: '#ffffff',
    }
  }
  if (status === 'wip') {
    return {
      bg: '#ca8a04',
      border: 'rgba(253, 224, 71, 0.75)',
      color: '#ffffff',
    }
  }
  return {
    bg: '#dc2626',
    border: 'rgba(252, 165, 165, 0.75)',
    color: '#ffffff',
  }
}

export function deployLabel(platform?: string | null, location?: string | null) {
  const value = (platform || location || '').trim()
  return value || null
}
