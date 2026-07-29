import { TrackedObject, DetectedObject } from '../types'

interface TrackState {
  objects: TrackedObject[]
  nextId: number
}

const trackState: TrackState = { objects: [], nextId: 0 }
const MAX_INACTIVE_FRAMES = 30
const IOU_THRESHOLD = 0.3

const computeIOU = (a: number[], b: number[]): number => {
  const [ax, ay, aw, ah] = a
  const [bx, by, bw, bh] = b
  const xOverlap = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx))
  const yOverlap = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by))
  const intersection = xOverlap * yOverlap
  const union = aw * ah + bw * bh - intersection
  return union > 0 ? intersection / union : 0
}

export const updateTracks = (detections: DetectedObject[]): TrackedObject[] => {
  const now = Date.now()
  const updatedTracks: TrackedObject[] = []
  const matched = new Set<number>()

  for (const det of detections) {
    let bestMatch = -1
    let bestIOU = 0

    for (let i = 0; i < trackState.objects.length; i++) {
      if (matched.has(i)) continue
      const track = trackState.objects[i]
      if (!track.active) continue
      const iou = computeIOU(det.bbox, track.bbox)
      if (iou > bestIOU && iou > IOU_THRESHOLD) {
        bestIOU = iou
        bestMatch = i
      }
    }

    if (bestMatch >= 0) {
      matched.add(bestMatch)
      const existing = trackState.objects[bestMatch]
      updatedTracks.push({
        ...existing,
        ...det,
        history: [...existing.history, { x: det.bbox[0], y: det.bbox[1], time: now }],
        lastSeen: now,
      })
    } else {
      trackState.nextId++
      updatedTracks.push({
        ...det,
        trackId: `track_${trackState.nextId}`,
        history: [{ x: det.bbox[0], y: det.bbox[1], time: now }],
        lastSeen: now,
        active: true,
      })
    }
  }

  trackState.objects = updatedTracks.map((t) => ({
    ...t,
    active: now - t.lastSeen < MAX_INACTIVE_FRAMES * 33,
  }))

  return trackState.objects
}

export const resetTracks = (): void => {
  trackState.objects = []
  trackState.nextId = 0
}

export const getActiveTracks = (): TrackedObject[] => {
  return trackState.objects.filter((t) => t.active)
}
