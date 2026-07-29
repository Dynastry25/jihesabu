import { Response } from 'express'
import Session from '../models/Session'
import Detection from '../models/Detection'
import Analytics from '../models/Analytics'
import { AuthRequest } from '../middleware/auth'

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.create({ ...req.body, userId: req.user!._id })
    res.status(201).json(session)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { status, category, page = '1', limit = '20' } = req.query
    const query: any = { userId: req.user!._id }
    if (status) query.status = status
    if (category) query.category = category
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const sessions = await Session.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
    const total = await Session.countDocuments(query)
    res.json({ sessions, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user!._id })
    if (!session) return res.status(404).json({ message: 'Session not found' })
    res.json(session)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true }
    )
    if (!session) return res.status(404).json({ message: 'Session not found' })
    res.json(session)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
    if (!session) return res.status(404).json({ message: 'Session not found' })
    await Detection.deleteMany({ sessionId: req.params.id })
    await Analytics.deleteMany({ sessionId: req.params.id })
    res.json({ message: 'Session deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getSessionAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const analytics = await Analytics.find({ sessionId: req.params.id }).sort({ date: 1 })
    res.json(analytics)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllSessionsAdmin = async (_req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(100)
    res.json(sessions)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
