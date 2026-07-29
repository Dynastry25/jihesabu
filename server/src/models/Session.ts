import mongoose, { Document, Schema } from 'mongoose'

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  description?: string
  location?: string
  category: 'people' | 'animals' | 'vehicles' | 'containers' | 'trees' | 'inventory' | 'custom'
  customCategoryId?: mongoose.Types.ObjectId
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  sourceType: 'live' | 'upload' | 'cctv'
  sourceUrl?: string
  totalCount: number
  maleCount: number
  femaleCount: number
  animalCounts: Map<string, number>
  vehicleCounts: Map<string, number>
  customCounts: Map<string, number>
  confidenceAvg: number
  processingSpeed: number
  startTime: Date
  endTime?: Date
  duration: number
  analytics: {
    peakTime: Date
    hourlyCounts: { hour: string; count: number }[]
    trends: { label: string; value: number }[]
  }
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    category: {
      type: String,
      enum: ['people', 'animals', 'vehicles', 'containers', 'trees', 'inventory', 'custom'],
      required: true,
    },
    customCategoryId: { type: Schema.Types.ObjectId, ref: 'CustomCategory' },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'cancelled'],
      default: 'active',
    },
    sourceType: {
      type: String,
      enum: ['live', 'upload', 'cctv'],
      required: true,
    },
    sourceUrl: { type: String },
    totalCount: { type: Number, default: 0 },
    maleCount: { type: Number, default: 0 },
    femaleCount: { type: Number, default: 0 },
    animalCounts: { type: Map, of: Number, default: new Map() },
    vehicleCounts: { type: Map, of: Number, default: new Map() },
    customCounts: { type: Map, of: Number, default: new Map() },
    confidenceAvg: { type: Number, default: 0 },
    processingSpeed: { type: Number, default: 0 },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
    analytics: {
      peakTime: { type: Date },
      hourlyCounts: [{ hour: String, count: Number }],
      trends: [{ label: String, value: Number }],
    },
  },
  { timestamps: true }
)

export default mongoose.model<ISession>('Session', sessionSchema)
