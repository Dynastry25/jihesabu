import { useRef, useState, useCallback, useEffect } from 'react'

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  isStreaming: boolean
  error: string | null
  startCamera: (facingMode?: 'user' | 'environment') => Promise<void>
  stopCamera: () => void
  captureFrame: () => HTMLCanvasElement | null
  switchCamera: () => Promise<void>
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null!)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const facingRef = useRef<'user' | 'environment'>('environment')

  const startCamera = useCallback(async (facingMode: 'user' | 'environment' = 'environment') => {
    setError(null)
    facingRef.current = facingMode
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsStreaming(true)
    } catch (err: any) {
      setError(err.message || 'Camera access denied')
      setIsStreaming(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }, [])

  const captureFrame = useCallback((): HTMLCanvasElement | null => {
    if (!videoRef.current || !canvasRef.current) return null
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas
  }, [])

  const switchCamera = useCallback(async () => {
    facingRef.current = facingRef.current === 'user' ? 'environment' : 'user'
    await startCamera(facingRef.current)
  }, [startCamera])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  return { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, captureFrame, switchCamera }
}
