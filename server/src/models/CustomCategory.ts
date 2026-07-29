import mongoose, { Document, Schema } from 'mongoose'

export interface ICustomCategory extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  label: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const customCategorySchema = new Schema<ICustomCategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model<ICustomCategory>('CustomCategory', customCategorySchema)
