import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import connectDB from './config/database'
import { errorHandler, notFound } from './middleware/errorHandler'

import authRoutes from './routes/auth'
import sessionRoutes from './routes/sessions'
import detectionRoutes from './routes/detections'
import reportRoutes from './routes/reports'
import settingsRoutes from './routes/settings'
import categoryRoutes from './routes/categories'
import adminRoutes from './routes/admin'

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] },
})

// Security
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/detections', detectionRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// WebSocket for real-time counting
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('join-session', (sessionId: string) => {
    socket.join(`session:${sessionId}`)
  })

  socket.on('leave-session', (sessionId: string) => {
    socket.leave(`session:${sessionId}`)
  })

  socket.on('detection-update', (data) => {
    socket.to(`session:${data.sessionId}`).emit('detection', data)
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})

export default app
