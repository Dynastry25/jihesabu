import { Response } from 'express'
import CustomCategory from '../models/CustomCategory'
import { AuthRequest } from '../middleware/auth'

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await CustomCategory.create({ ...req.body, userId: req.user!._id })
    res.status(201).json(category)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await CustomCategory.find({ userId: req.user!._id, isActive: true })
    res.json(categories)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await CustomCategory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true }
    )
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    await CustomCategory.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
    res.json({ message: 'Category deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
