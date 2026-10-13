import { Router } from 'express'
import { getPublicHub, getPublicProject } from '../services/projects.js'

const router = Router()

router.get('/u/:username', async (req, res) => {
  const hub = await getPublicHub(String(req.params.username))
  if (!hub) {
    res.status(404).json({ error: 'Hub not found' })
    return
  }
  res.json(hub)
})

router.get('/u/:username/p/:slug', async (req, res) => {
  const detail = await getPublicProject(String(req.params.username), String(req.params.slug))
  if (!detail) {
    res.status(404).json({ error: 'Project not found' })
    return
  }
  res.json(detail)
})

export default router
