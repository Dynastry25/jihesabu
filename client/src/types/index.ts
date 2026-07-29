export interface User {
  id: string
  name: string
  email?: string
  role: 'guest' | 'user' | 'admin'
  avatar?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  language: 'en' | 'sw'
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
}

export interface Session {
  _id: string
  userId: string
  name: string
  description?: string
  location?: string
  category: Category
  customCategoryId?: string
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  sourceType: 'live' | 'upload' | 'cctv'
  sourceUrl?: string
  totalCount: number
  maleCount: number
  femaleCount: number
  animalCounts: Record<string, number>
  vehicleCounts: Record<string, number>
  customCounts: Record<string, number>
  confidenceAvg: number
  processingSpeed: number
  startTime: string
  endTime?: string
  duration: number
  analytics: Analytics
  createdAt: string
}

export interface Detection {
  _id: string
  sessionId: string
  timestamp: string
  objects: DetectedObject[]
  frameCount: number
  processingTime: number
}

export interface DetectedObject {
  id: string
  label: string
  confidence: number
  gender?: 'male' | 'female'
  bbox: [number, number, number, number]
  trackId?: string
}

export interface TrackedObject extends DetectedObject {
  history: Array<{ x: number; y: number; time: number }>
  lastSeen: number
  active: boolean
}

export interface Analytics {
  peakTime?: string
  hourlyCounts: Array<{ hour: string; count: number }>
  trends: Array<{ label: string; value: number }>
}

export interface Report {
  _id: string
  userId: string
  sessionId: string
  type: 'pdf' | 'csv' | 'excel'
  title: string
  data: object
  url?: string
  createdAt: string
}

export interface CustomCategory {
  _id: string
  userId: string
  name: string
  label: string
  description?: string
  isActive: boolean
}

export interface Settings {
  camera: { resolution: string; fps: number; defaultCamera: string }
  ai: { confidenceThreshold: number; detectionModel: string; trackingMode: 'bytetrack' | 'sort' | 'iou' }
  storage: { local: boolean; cloudSync: boolean }
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'sw'
  notifications: boolean
}

export type Category = 'people' | 'animals' | 'vehicles' | 'containers' | 'trees' | 'inventory' | 'custom'
export type SourceType = 'live' | 'upload' | 'cctv'
export type DetectionModel = 'coco-ssd' | 'mobilenet' | 'custom'
export type TrackingMode = 'bytetrack' | 'sort' | 'iou'

export interface DetectionResult {
  objects: DetectedObject[]
  count: number
  confidence: number
  processingTime: number
}

export interface GenderResult {
  male: number
  female: number
  malePercent: number
  femalePercent: number
}
