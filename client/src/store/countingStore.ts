import { create } from 'zustand'
import { Category, DetectedObject, TrackedObject, GenderResult, SourceType } from '../types'

interface CountingState {
  isActive: boolean
  isPaused: boolean
  sourceType: SourceType | null
  category: Category
  totalCount: number
  maleCount: number
  femaleCount: number
  animalCounts: Record<string, number>
  vehicleCounts: Record<string, number>
  customCounts: Record<string, number>
  confidence: number
  processingSpeed: number
  trackedObjects: TrackedObject[]
  fps: number
  startTime: number | null
  sessionId: string | null
  setActive: (active: boolean) => void
  setPaused: (paused: boolean) => void
  setSourceType: (type: SourceType) => void
  setCategory: (cat: Category) => void
  setSessionId: (id: string | null) => void
  updateDetection: (result: { objects: DetectedObject[]; confidence: number; processingTime: number }) => void
  reset: () => void
}

const MAX_TRACK_AGE = 3000
const IOU_THRESHOLD = 0.3

const computeIOU = (a: [number, number, number, number], b: [number, number, number, number]): number => {
  const [ax, ay, aw, ah] = a
  const [bx, by, bw, bh] = b
  const xOverlap = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx))
  const yOverlap = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by))
  const intersection = xOverlap * yOverlap
  const union = aw * ah + bw * bh - intersection
  return union > 0 ? intersection / union : 0
}

export const useCountingStore = create<CountingState>((set, get) => ({
  isActive: false,
  isPaused: false,
  sourceType: null,
  category: 'people',
  totalCount: 0,
  maleCount: 0,
  femaleCount: 0,
  animalCounts: {},
  vehicleCounts: {},
  customCounts: {},
  confidence: 0,
  processingSpeed: 0,
  trackedObjects: [],
  fps: 0,
  startTime: null,
  sessionId: null,

  setActive: (active) => set({ isActive: active, startTime: active ? Date.now() : null }),
  setPaused: (paused) => set({ isPaused: paused }),
  setSourceType: (type) => set({ sourceType: type }),
  setCategory: (cat) => set({ category: cat }),
  setSessionId: (id) => set({ sessionId: id }),

  updateDetection: (result) => {
    const state = get()
    const now = Date.now()

    const tracked = [...state.trackedObjects]
    const newObjects: TrackedObject[] = []

    result.objects.forEach((obj) => {
      let matched = false
      for (let i = 0; i < tracked.length; i++) {
        const existing = tracked[i]
        if (!existing.active) continue
        const iou = computeIOU(obj.bbox, existing.bbox)
        if (iou > IOU_THRESHOLD) {
          tracked[i] = {
            ...existing,
            ...obj,
            history: [...existing.history, { x: obj.bbox[0], y: obj.bbox[1], time: now }],
            lastSeen: now,
          }
          matched = true
          break
        }
      }
      if (!matched) {
        newObjects.push({
          ...obj,
          history: [{ x: obj.bbox[0], y: obj.bbox[1], time: now }],
          lastSeen: now,
          active: true,
        })
      }
    })

    const activeTracked = [...tracked.filter((t) => now - t.lastSeen < MAX_TRACK_AGE && t.active), ...newObjects]

    const totalCount = activeTracked.length
    const maleCount = activeTracked.filter((t) => t.gender === 'male').length
    const femaleCount = activeTracked.filter((t) => t.gender === 'female').length

    const animalCounts: Record<string, number> = {}
    const vehicleCounts: Record<string, number> = {}
    const customCounts: Record<string, number> = {}

    activeTracked.forEach((t) => {
      const animalLabels = ['cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'bird', 'chicken']
      const vehicleLabels = ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'airplane', 'boat', 'train']
      if (animalLabels.includes(t.label)) {
        animalCounts[t.label] = (animalCounts[t.label] || 0) + 1
      } else if (vehicleLabels.includes(t.label)) {
        vehicleCounts[t.label] = (vehicleCounts[t.label] || 0) + 1
      } else {
        customCounts[t.label] = (customCounts[t.label] || 0) + 1
      }
    })

    const confidence = result.objects.length > 0
      ? result.objects.reduce((a: number, o: DetectedObject) => a + o.confidence, 0) / result.objects.length
      : 0

    set({
      trackedObjects: activeTracked,
      totalCount,
      maleCount,
      femaleCount,
      animalCounts,
      vehicleCounts,
      customCounts,
      confidence,
      processingSpeed: result.processingTime,
    })
  },

  reset: () => set({
    isActive: false,
    isPaused: false,
    sourceType: null,
    totalCount: 0,
    maleCount: 0,
    femaleCount: 0,
    animalCounts: {},
    vehicleCounts: {},
    customCounts: {},
    confidence: 0,
    processingSpeed: 0,
    trackedObjects: [],
    fps: 0,
    startTime: null,
    sessionId: null,
  }),
}))
