import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { users, type User } from '../db/schema.js'

export interface AuthRequest extends Request {
  user?: User
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is required')
  return secret
}

export function signToken(user: User): string {
  return jwt.sign(
    { sub: user.id, username: user.username, email: user.email },
    getJwtSecret(),
    { expiresIn: '30d' },
  )
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const payload = jwt.verify(header.slice(7), getJwtSecret()) as { sub: string }
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1)
    if (!user) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export function toPublicUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    bio: user.bio,
    createdAt: user.createdAt,
  }
}
