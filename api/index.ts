import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './connect'
import authRoutes from '../server/src/routes/auth'
import sessionRoutes from '../server/src/routes/sessions'
import detectionRoutes from '../server/src/routes/detections'
import reportRoutes from '../server/src/routes/reports'
import settingsRoutes from '../server/src/routes/settings'
import categoryRoutes from '../server/src/routes/categories'
import adminRoutes from '../server/src/routes/admin'
import { errorHandler, notFound } from '../server/src/middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/detections', detectionRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(notFound)
app.use(errorHandler)

export default async function handler(req: any, res: any) {
  await connectDB()
  return app(req, res)
}
