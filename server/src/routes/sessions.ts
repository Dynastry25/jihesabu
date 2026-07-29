import { Router } from 'express'
import {
  createSession, getSessions, getSession, updateSession, deleteSession, getSessionAnalytics, getAllSessionsAdmin,
} from '../controllers/sessionController'
import { protect, adminOnly } from '../middleware/auth'

const router = Router()

router.get('/admin', protect, adminOnly, getAllSessionsAdmin)
router.post('/', protect, createSession)
router.get('/', protect, getSessions)
router.get('/:id', protect, getSession)
router.put('/:id', protect, updateSession)
router.delete('/:id', protect, deleteSession)
router.get('/:id/analytics', protect, getSessionAnalytics)

export default router
