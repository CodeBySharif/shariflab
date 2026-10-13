export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return base || 'project'
}

export function isValidUsername(username: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/.test(username)
}
