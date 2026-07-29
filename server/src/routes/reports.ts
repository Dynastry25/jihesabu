import { Router } from 'express'
import { generateReport, getReports, deleteReport } from '../controllers/reportController'
import { protect } from '../middleware/auth'

const router = Router()

router.post('/', protect, generateReport)
router.get('/', protect, getReports)
router.delete('/:id', protect, deleteReport)

export default router
