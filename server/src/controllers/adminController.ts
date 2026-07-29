import { Response } from 'express'
import User from '../models/User'
import Session from '../models/Session'
import Detection from '../models/Detection'
import { AuthRequest } from '../middleware/auth'

export const getUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100)
    res.json(users)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    await Session.deleteMany({ userId: req.params.id })
    await Detection.deleteMany({ userId: req.params.id })
    res.json({ message: 'User deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getSystemStats = async (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalSessions = await Session.countDocuments()
    const activeSessions = await Session.countDocuments({ status: 'active' })
    const totalDetections = await Detection.countDocuments()
    res.json({ totalUsers, totalSessions, activeSessions, totalDetections })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
