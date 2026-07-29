import mongoose, { Document, Schema } from 'mongoose'

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  type: 'pdf' | 'csv' | 'excel'
  title: string
  data: object
  url?: string
  createdAt: Date
}

const reportSchema = new Schema<IReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    type: { type: String, enum: ['pdf', 'csv', 'excel'], required: true },
    title: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
    url: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model<IReport>('Report', reportSchema)
