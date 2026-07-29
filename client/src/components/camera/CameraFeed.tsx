import { useEffect, useRef } from 'react'
import { useCamera } from '../../hooks/useCamera'
import { Button } from '../ui/Button'
import { useTranslation } from '../../i18n'
import { useAppStore } from '../../store/appStore'

interface CameraFeedProps {
  onStreamReady?: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void
  isDetecting?: boolean
}

export const CameraFeed = ({ onStreamReady, isDetecting }: CameraFeedProps) => {
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, switchCamera } = useCamera()
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null!)
  const { language } = useAppStore()
  const { t } = useTranslation(language)

  useEffect(() => {
    if (isStreaming && videoRef.current && canvasOverlayRef.current) {
      onStreamReady?.(videoRef.current, canvasOverlayRef.current)
    }
  }, [isStreaming, onStreamReady])

  useEffect(() => {
    return () => stopCamera()
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden bg-dark-card border border-white/10">
      <div className="relative aspect-video bg-black/50 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-contain"
        />
        <canvas
          ref={canvasOverlayRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        {!isStreaming && !error && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="text-dark-muted text-sm">Camera not started</p>
          </div>
        )}
        {error && (
          <div className="text-center p-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-center gap-3">
        {!isStreaming ? (
          <Button onClick={() => startCamera('environment')} icon={<span>📷</span>}>
            {t('counting.source.camera')}
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={stopCamera}>
              {t('counting.stop')}
            </Button>
            <Button variant="ghost" onClick={switchCamera}>
              🔄 Switch
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
