import { Response } from 'express'
import Session from '../models/Session'
import Report from '../models/Report'
import { AuthRequest } from '../middleware/auth'

export const generateReport = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, type } = req.body
    const session = await Session.findById(sessionId)
    if (!session) return res.status(404).json({ message: 'Session not found' })
    const reportData = {
      sessionName: session.name,
      category: session.category,
      totalCount: session.totalCount,
      maleCount: session.maleCount,
      femaleCount: session.femaleCount,
      confidenceAvg: session.confidenceAvg,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      analytics: session.analytics,
    }
    const report = await Report.create({
      userId: req.user!._id,
      sessionId,
      type,
      title: `Report_${session.name}_${Date.now()}`,
      data: reportData,
    })
    res.status(201).json(report)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.find({ userId: req.user!._id }).sort({ createdAt: -1 })
    res.json(reports)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    await Report.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
    res.json({ message: 'Report deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
