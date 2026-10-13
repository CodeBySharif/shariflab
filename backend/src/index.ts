import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { runMigrations } from './db/migrate.js'
import { ensureUploadDir, getUploadRoot } from './services/uploads.js'
import authRouter from './routes/auth.js'
import projectsRouter from './routes/projects.js'
import publicRouter from './routes/public.js'

async function main() {
  await runMigrations()
  ensureUploadDir()

  const app = express()
  const port = parseInt(process.env.PORT ?? '3001', 10)
  const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin) || corsOrigins.includes('*')) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      },
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use('/uploads', express.static(getUploadRoot()))

  app.get('/health', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api/auth', authRouter)
  app.use('/api/projects', projectsRouter)
  app.use('/api/public', publicRouter)

  app.listen(port, () => {
    console.log(`Sharif Lab API listening on port ${port}`)
  })
}

main().catch((err) => {
  console.error('Failed to start API', err)
  process.exit(1)
})
