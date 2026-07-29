import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'jihesabu',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'],
    resource_type: 'auto',
  }),
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${ext} not allowed`))
  }
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } })
