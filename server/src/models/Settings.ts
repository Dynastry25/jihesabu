import mongoose, { Document, Schema } from 'mongoose'

export interface ISettings extends Document {
  userId: mongoose.Types.ObjectId
  camera: {
    resolution: string
    fps: number
    defaultCamera: string
  }
  ai: {
    confidenceThreshold: number
    detectionModel: string
    trackingMode: 'bytetrack' | 'sort' | 'iou'
  }
  storage: {
    local: boolean
    cloudSync: boolean
  }
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'sw'
  notifications: boolean
  createdAt: Date
  updatedAt: Date
}

const settingsSchema = new Schema<ISettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    camera: {
      resolution: { type: String, default: '1280x720' },
      fps: { type: Number, default: 30 },
      defaultCamera: { type: String, default: 'environment' },
    },
    ai: {
      confidenceThreshold: { type: Number, default: 0.5, min: 0, max: 1 },
      detectionModel: { type: String, default: 'coco-ssd' },
      trackingMode: { type: String, enum: ['bytetrack', 'sort', 'iou'], default: 'bytetrack' },
    },
    storage: {
      local: { type: Boolean, default: true },
      cloudSync: { type: Boolean, default: false },
    },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    language: { type: String, enum: ['en', 'sw'], default: 'en' },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model<ISettings>('Settings', settingsSchema)
