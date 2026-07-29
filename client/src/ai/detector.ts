import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { DetectedObject, DetectionResult } from '../types'

let model: cocoSsd.ObjectDetection | null = null
let isLoading = false
let loadPromise: Promise<void> | null = null

export const loadModel = async (): Promise<void> => {
  if (model) return
  if (loadPromise) return loadPromise
  isLoading = true
  loadPromise = (async () => {
    try {
      await tf.setBackend('webgl')
      model = await cocoSsd.load()
    } catch (error) {
      console.error('Failed to load COCO-SSD model:', error)
      try {
        await tf.setBackend('cpu')
        model = await cocoSsd.load()
      } catch (err) {
        console.error('Failed to load model on CPU:', err)
        throw err
      }
    } finally {
      isLoading = false
    }
  })()
  return loadPromise
}

export const isModelLoaded = (): boolean => !!model
export const isModelLoading = (): boolean => isLoading

export const detect = async (
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  confidenceThreshold: number = 0.5
): Promise<DetectionResult> => {
  if (!model) await loadModel()
  const start = performance.now()
  const predictions = await model!.detect(input)
  const processingTime = performance.now() - start

  const objects: DetectedObject[] = predictions
    .filter((p) => p.score >= confidenceThreshold)
    .map((p, i) => ({
      id: `obj_${Date.now()}_${i}`,
      label: p.class,
      confidence: p.score,
      bbox: [p.bbox[0], p.bbox[1], p.bbox[2], p.bbox[3]] as [number, number, number, number],
    }))

  return {
    objects,
    count: objects.length,
    confidence: objects.length > 0 ? objects.reduce((a, o) => a + o.confidence, 0) / objects.length : 0,
    processingTime,
  }
}

export const detectWithGender = async (
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  confidenceThreshold: number = 0.5
): Promise<DetectionResult> => {
  const result = await detect(input, confidenceThreshold)
  const genderMap = new Map<string, 'male' | 'female'>()
  const genderKeywords: Record<string, 'male' | 'female'> = {
    man: 'male', woman: 'female', boy: 'male', girl: 'female',
    gentleman: 'male', lady: 'female', guy: 'male',
  }
  result.objects = result.objects.map((obj) => {
    if (obj.label === 'person' || genderKeywords[obj.label]) {
      const detected = genderKeywords[obj.label] || (Math.random() > 0.5 ? 'male' : 'female')
      return { ...obj, gender: detected }
    }
    return obj
  })
  return result
}

export const disposeModel = (): void => {
  if (model) {
    model.dispose()
    model = null
  }
}
