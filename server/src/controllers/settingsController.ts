import { Response } from 'express'
import Settings from '../models/Settings'
import { AuthRequest } from '../middleware/auth'

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    let settings = await Settings.findOne({ userId: req.user!._id })
    if (!settings) {
      settings = await Settings.create({ userId: req.user!._id })
    }
    res.json(settings)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user!._id },
      req.body,
      { new: true, upsert: true }
    )
    res.json(settings)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
