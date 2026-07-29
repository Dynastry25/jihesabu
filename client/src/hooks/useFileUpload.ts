import { useState, useCallback, useRef } from 'react'
import { detect, loadModel, isModelLoaded } from '../ai/detector'
import { useCountingStore } from '../store/countingStore'

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const imgRef = useRef<HTMLImageElement>(null!)
  const videoRef = useRef<HTMLVideoElement>(null!)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const updateDetection = useCountingStore((s) => s.updateDetection)
  const isActive = useCountingStore((s) => s.isActive)

  const handleFile = useCallback(async (file: File) => {
    setUploading(true)
    const url = URL.createObjectURL(file)
    setPreview(url)
    setFileType(file.type.startsWith('video') ? 'video' : 'image')

    if (!isModelLoaded()) {
      await loadModel()
    }

    if (file.type.startsWith('image')) {
      const img = new Image()
      img.onload = async () => {
        if (canvasRef.current) {
          canvasRef.current.width = img.width
          canvasRef.current.height = img.height
          const ctx = canvasRef.current.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          const result = await detect(canvasRef.current)
          updateDetection(result)

          // Draw boxes
          result.objects.forEach((obj) => {
            const [x, y, w, h] = obj.bbox
            ctx.strokeStyle = '#10B981'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, w, h)
            ctx.fillStyle = '#2563EB'
            ctx.font = '14px Inter, sans-serif'
            ctx.fillText(`${obj.label} (${(obj.confidence * 100).toFixed(0)}%)`, x, y - 5)
          })
        }
      }
      img.src = url
    }

    setUploading(false)
  }, [updateDetection])

  const reset = useCallback(() => {
    setPreview(null)
    setFileType(null)
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  return { uploading, preview, fileType, imgRef, videoRef, canvasRef, handleFile, reset }
}
