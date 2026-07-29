import { Router } from 'express'
import { getUsers, updateUser, deleteUser, getSystemStats } from '../controllers/adminController'
import { protect, adminOnly } from '../middleware/auth'

const router = Router()

router.get('/users', protect, adminOnly, getUsers)
router.put('/users/:id', protect, adminOnly, updateUser)
router.delete('/users/:id', protect, adminOnly, deleteUser)
router.get('/stats', protect, adminOnly, getSystemStats)

export default router
