import { Router } from 'express'
import { saveDetection, getDetections } from '../controllers/detectionController'
import { protect } from '../middleware/auth'

const router = Router()

router.post('/', protect, saveDetection)
router.get('/', protect, getDetections)

export default router
