export function parseTechStack(techStack: string | null | undefined): string[] {
  if (!techStack) return []
  return techStack
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
