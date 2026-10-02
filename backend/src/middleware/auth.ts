import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { Request, Response, NextFunction } from 'express'

let supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required')
    supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return supabaseAdmin
}

export interface AuthRequest extends Request {
  user?: User
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const token = header.slice(7)
  const { data, error } = await getSupabaseAdmin().auth.getUser(token)
  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid token' })
    return
  }

  req.user = data.user
  next()
}
