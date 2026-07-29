import { Router } from 'express'
import { register, login, googleAuth, guestLogin, getMe, updateProfile } from '../controllers/authController'
import { protect } from '../middleware/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/guest', guestLogin)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)

export default router
