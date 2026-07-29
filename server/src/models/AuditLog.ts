import mongoose, { Document, Schema } from 'mongoose'

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId
  action: string
  resource: string
  resourceId?: string
  details: object
  ip?: string
  userAgent?: string
  createdAt: Date
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema)
