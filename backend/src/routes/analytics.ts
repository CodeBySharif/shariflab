import { Router, type Request, type Response, type NextFunction } from 'express'
import { type AuthRequest, requireAuth } from '../middleware/auth.js'
import {
  getOverview,
  getPageStats,
  getTraffic,
  getReferrers,
  getDevices,
  getRealtime,
  getOwnedProject,
} from '../services/analytics.js'

const router = Router({ mergeParams: true })

type ProjectParams = { id: string }

async function requireProject(req: AuthRequest, res: Response, next: NextFunction) {
  const id = String(req.params.id)
  const project = await getOwnedProject(id, req.user!.id)
  if (!project) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  next()
}

router.use(requireAuth, requireProject)

router.get('/overview', async (req: Request<ProjectParams>, res) => {
  const days = Math.min(90, Math.max(1, parseInt(String(req.query.days ?? '30'), 10) || 30))
  const data = await getOverview(req.params.id, days)
  res.json(data)
})

router.get('/pages', async (req: Request<ProjectParams>, res) => {
  const days = Math.min(90, Math.max(1, parseInt(String(req.query.days ?? '30'), 10) || 30))
  res.json(await getPageStats(req.params.id, days))
})

router.get('/traffic', async (req: Request<ProjectParams>, res) => {
  const days = Math.min(90, Math.max(1, parseInt(String(req.query.days ?? '30'), 10) || 30))
  res.json(await getTraffic(req.params.id, days))
})

router.get('/referrers', async (req: Request<ProjectParams>, res) => {
  const days = Math.min(90, Math.max(1, parseInt(String(req.query.days ?? '30'), 10) || 30))
  res.json(await getReferrers(req.params.id, days))
})

router.get('/devices', async (req: Request<ProjectParams>, res) => {
  const days = Math.min(90, Math.max(1, parseInt(String(req.query.days ?? '30'), 10) || 30))
  res.json(await getDevices(req.params.id, days))
})

router.get('/realtime', async (req: Request<ProjectParams>, res) => {
  res.json(await getRealtime(req.params.id))
})

export default router
