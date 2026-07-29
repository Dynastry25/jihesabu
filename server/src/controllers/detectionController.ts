import { Response } from 'express'
import Detection from '../models/Detection'
import Session from '../models/Session'
import Analytics from '../models/Analytics'
import { AuthRequest } from '../middleware/auth'

export const saveDetection = async (req: AuthRequest, res: Response) => {
  try {
    const detection = await Detection.create(req.body)
    res.status(201).json(detection)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getDetections = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, page = '1', limit = '50' } = req.query
    const query: any = {}
    if (sessionId) query.sessionId = sessionId
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const detections = await Detection.find(query).sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit as string))
    const total = await Detection.countDocuments(query)
    res.json({ detections, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
