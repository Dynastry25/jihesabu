import mongoose, { Document, Schema } from 'mongoose'

export interface IDetection extends Document {
  sessionId: mongoose.Types.ObjectId
  timestamp: Date
  objects: {
    id: string
    label: string
    confidence: number
    gender?: 'male' | 'female'
    bbox: [number, number, number, number]
    trackId?: string
  }[]
  frameCount: number
  processingTime: number
  createdAt: Date
}

const detectionSchema = new Schema<IDetection>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    timestamp: { type: Date, default: Date.now },
    objects: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        confidence: { type: Number, required: true },
        gender: { type: String, enum: ['male', 'female'] },
        bbox: { type: [Number], required: true },
        trackId: { type: String },
      },
    ],
    frameCount: { type: Number, default: 0 },
    processingTime: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model<IDetection>('Detection', detectionSchema)
