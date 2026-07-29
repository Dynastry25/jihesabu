import mongoose, { Document, Schema } from 'mongoose'

export interface IAnalytics extends Document {
  userId: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  date: Date
  totalCount: number
  peakTime: Date
  hourlyBreakdown: { hour: number; count: number }[]
  categoryBreakdown: { category: string; count: number }[]
  genderBreakdown: { male: number; female: number }
  averageConfidence: number
  processingSpeed: number
  createdAt: Date
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    date: { type: Date, default: Date.now },
    totalCount: { type: Number, default: 0 },
    peakTime: { type: Date },
    hourlyBreakdown: [{ hour: Number, count: Number }],
    categoryBreakdown: [{ category: String, count: Number }],
    genderBreakdown: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
    },
    averageConfidence: { type: Number, default: 0 },
    processingSpeed: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema)
