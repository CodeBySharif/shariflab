import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { eq, or } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { isValidUsername } from '../lib/slug.js'
import {
  requireAuth,
  signToken,
  toPublicUser,
  type AuthRequest,
} from '../middleware/auth.js'

const router = Router()

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email().max(200),
  password: z.string().min(8).max(128),
  displayName: z.string().max(100).optional().nullable(),
})

const loginSchema = z.object({
  login: z.string().min(1).max(200),
  password: z.string().min(1).max(128),
})

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const username = parsed.data.username.toLowerCase()
  if (!isValidUsername(username)) {
    res.status(400).json({
      error: 'Username must be 3-30 chars, lowercase letters, numbers, and hyphens only',
    })
    return
  }

  const email = parsed.data.email.toLowerCase()
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1)

  if (existing.length > 0) {
    res.status(409).json({ error: 'Username or email already taken' })
    return
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  const [user] = await db
    .insert(users)
    .values({
      username,
      email,
      passwordHash,
      displayName: parsed.data.displayName ?? username,
    })
    .returning()

  const token = signToken(user)
  res.status(201).json({ token, user: toPublicUser(user) })
})

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const login = parsed.data.login.trim().toLowerCase()
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, login), eq(users.username, login)))
    .limit(1)

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!ok) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  res.json({ token: signToken(user), user: toPublicUser(user) })
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  res.json({ user: toPublicUser(req.user!) })
})

const profileSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
})

router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  const parsed = profileSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const [updated] = await db
    .update(users)
    .set({
      displayName: parsed.data.displayName ?? req.user!.displayName,
      bio: parsed.data.bio ?? req.user!.bio,
      updatedAt: new Date(),
    })
    .where(eq(users.id, req.user!.id))
    .returning()

  res.json({ user: toPublicUser(updated) })
})

export default router
