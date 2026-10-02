import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import projectsRouter from './routes/projects.js'
import analyticsRouter from './routes/analytics.js'
import ingestRouter from './routes/ingest.js'
import trackRouter from './routes/track.js'

const app = express()
const port = parseInt(process.env.PORT ?? '3001', 10)

const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(',').map((o) => o.trim())

const dashboardCors = cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) callback(null, true)
    else callback(null, false)
  },
})

const ingestCors = cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Site-Key', 'X-Site-Secret', 'Authorization'],
  maxAge: 86400,
})

app.use(express.json({ limit: '256kb' }))

app.options('/api/ingest/*', ingestCors)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use(trackRouter)
app.use('/api/ingest', ingestCors, ingestRouter)
app.use('/api/projects', dashboardCors, projectsRouter)
app.use('/api/projects/:id/analytics', dashboardCors, analyticsRouter)

app.listen(port, () => {
  console.log(`Sharif Lab API listening on port ${port}`)
})
