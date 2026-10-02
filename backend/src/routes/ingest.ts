import { Router } from 'express'
import { z } from 'zod'
import { processEvents, validateSite, type IngestEvent } from '../services/ingest.js'

const router = Router()

const batchSchema = z.object({
  siteKey: z.string(),
  siteSecret: z.string(),
  events: z.array(
    z.object({
      type: z.string(),
      sessionId: z.string().optional(),
      visitorId: z.string().optional(),
      timestamp: z.string().optional(),
      path: z.string().optional(),
      title: z.string().optional(),
      referrer: z.string().optional(),
      device: z.string().optional(),
      browser: z.string().optional(),
      dwellSec: z.number().optional(),
    })
  ),
})

router.post('/events', async (req, res) => {
  const siteKey = (req.body?.siteKey ?? req.headers['x-site-key']) as string
  const siteSecret = (req.body?.siteSecret ?? req.headers['x-site-secret']) as string

  const parsed = batchSchema.safeParse({ ...req.body, siteKey, siteSecret })
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }

  const project = await validateSite(parsed.data.siteKey, parsed.data.siteSecret)
  if (!project) {
    res.status(401).json({ error: 'Invalid site credentials' })
    return
  }

  const country =
    (req.headers['cf-ipcountry'] as string) ||
    (req.headers['x-vercel-ip-country'] as string) ||
    null

  await processEvents(project, parsed.data.events as IngestEvent[], country)
  res.status(204).send()
})

export default router
