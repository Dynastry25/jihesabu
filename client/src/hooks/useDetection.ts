import { useRef, useCallback, useEffect } from 'react'
import { loadModel, isModelLoaded, isModelLoading, detect, detectWithGender } from '../ai/detector'
import { useCountingStore } from '../store/countingStore'
import { useAppStore } from '../store/appStore'

interface UseDetectionReturn {
  startDetection: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void
  stopDetection: () => void
  togglePause: () => void
  isModelReady: boolean
  isModelLoading: boolean
}

export const useDetection = (): UseDetectionReturn => {
  const animFrameRef = useRef<number>(0)
  const detectionRef = useRef<boolean>(false)
  const pausedRef = useRef<boolean>(false)
  const lastTimeRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)
  const updateDetection = useCountingStore((s) => s.updateDetection)
  const settings = useAppStore((s) => s.settings)

  const processFrame = useCallback(async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    if (!detectionRef.current || pausedRef.current) return
    const now = Date.now()
    if (now - lastTimeRef.current < 100) {
      animFrameRef.current = requestAnimationFrame(() => processFrame(video, canvas))
      return
    }
    lastTimeRef.current = now
    frameCountRef.current++

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const threshold = settings?.ai?.confidenceThreshold ?? 0.5
    const useGender = settings?.ai?.detectionModel === 'face'
    const result = useGender ? await detectWithGender(canvas, threshold) : await detect(canvas, threshold)
    updateDetection(result)

    // Draw bounding boxes
    result.objects.forEach((obj) => {
      const [x, y, w, h] = obj.bbox
      ctx.strokeStyle = obj.gender === 'male' ? '#2563EB' : obj.gender === 'female' ? '#EC4899' : '#10B981'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, h)
      ctx.fillStyle = '#2563EB'
      ctx.font = '14px Inter, sans-serif'
      ctx.fillText(`${obj.label} (${(obj.confidence * 100).toFixed(0)}%)`, x, y - 5)
    })

    animFrameRef.current = requestAnimationFrame(() => processFrame(video, canvas))
  }, [updateDetection, settings])

  const startDetection = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    detectionRef.current = true
    pausedRef.current = false
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    processFrame(video, canvas)
  }, [processFrame])

  const stopDetection = useCallback(() => {
    detectionRef.current = false
    pausedRef.current = false
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current
  }, [])

  useEffect(() => {
    if (!isModelLoaded() && !isModelLoading()) {
      loadModel()
    }
  }, [])

  return { startDetection, stopDetection, togglePause, isModelReady: isModelLoaded(), isModelLoading: isModelLoading() }
}
