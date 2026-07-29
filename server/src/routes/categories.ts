import { Router } from 'express'
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController'
import { protect } from '../middleware/auth'

const router = Router()

router.post('/', protect, createCategory)
router.get('/', protect, getCategories)
router.put('/:id', protect, updateCategory)
router.delete('/:id', protect, deleteCategory)

export default router
