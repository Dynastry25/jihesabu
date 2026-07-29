import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password?: string
  name: string
  avatar?: string
  role: 'guest' | 'user' | 'admin'
  googleId?: string
  isActive: boolean
  preferences: {
    language: 'en' | 'sw'
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 },
    name: { type: String, required: true, trim: true },
    avatar: { type: String },
    role: { type: String, enum: ['guest', 'user', 'admin'], default: 'guest' },
    googleId: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    preferences: {
      language: { type: String, enum: ['en', 'sw'], default: 'en' },
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', userSchema)
