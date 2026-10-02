import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

export function generateSiteKey(): string {
  return nanoid(16)
}

export function generateSiteSecret(): string {
  return nanoid(32)
}

export async function hashSiteSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10)
}

export async function verifySiteSecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash)
}

export function truncate(value: string | undefined | null, max: number): string | null {
  if (!value) return null
  return value.length <= max ? value : value.slice(0, max)
}
