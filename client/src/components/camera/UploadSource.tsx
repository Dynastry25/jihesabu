import { useRef, useCallback } from 'react'
import { useFileUpload } from '../../hooks/useFileUpload'
import { Button } from '../ui/Button'
import { useTranslation } from '../../i18n'
import { useAppStore } from '../../store/appStore'

export const UploadSource = () => {
  const { preview, fileType, canvasRef, handleFile, reset, uploading } = useFileUpload()
  const inputRef = useRef<HTMLInputElement>(null!)
  const { language } = useAppStore()
  const { t } = useTranslation(language)

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="rounded-2xl overflow-hidden bg-dark-card border border-white/10">
      <div className="relative aspect-video bg-black/50 flex items-center justify-center">
        {preview ? (
          <>
            {fileType === 'image' && <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          </>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="text-center cursor-pointer p-8 hover:bg-white/5 transition-colors rounded-2xl"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-dark-muted text-sm">{t('counting.source.upload')}</p>
            <p className="text-dark-muted/50 text-xs mt-1">JPG, PNG, WEBP, MP4, WEBM</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
      </div>
      {preview && (
        <div className="p-4 flex items-center justify-center gap-3">
          <Button variant="ghost" onClick={reset}>{t('common.cancel')}</Button>
        </div>
      )}
    </div>
  )
}
