import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CameraFeed } from '../components/camera/CameraFeed'
import { UploadSource } from '../components/camera/UploadSource'
import { DetectionOverlay } from '../components/camera/DetectionOverlay'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { useDetection } from '../hooks/useDetection'
import { useCountingStore } from '../store/countingStore'
import { useAppStore } from '../store/appStore'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../i18n'
import { Category, SourceType } from '../types'
import api from '../services/api'

export const Counting = () => {
  const { language } = useAppStore()
  const { user } = useAuthStore()
  const { t } = useTranslation(language)
  const { startDetection, stopDetection, togglePause, isModelReady } = useDetection()
  const store = useCountingStore()
  const [sourceMode, setSourceMode] = useState<SourceType>('live')
  const [sessionName, setSessionName] = useState('')
  const [showSessionDialog, setShowSessionDialog] = useState(false)

  const onStreamReady = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    startDetection(video, canvas)
  }, [startDetection])

  const handleStart = async () => {
    if (!sessionName) {
      setShowSessionDialog(true)
      return
    }
    try {
      const { data } = await api.post('/sessions', {
        name: sessionName,
        category: store.category,
        sourceType: sourceMode,
        status: 'active',
      })
      store.setSessionId(data._id)
      store.setActive(true)
    } catch (err) {
      console.error('Failed to create session', err)
    }
  }

  const handleStop = async () => {
    stopDetection()
    if (store.sessionId) {
      try {
        await api.put(`/sessions/${store.sessionId}`, {
          status: 'completed',
          endTime: new Date().toISOString(),
          totalCount: store.totalCount,
          maleCount: store.maleCount,
          femaleCount: store.femaleCount,
          confidenceAvg: store.confidence,
        })
      } catch (err) {
        console.error('Failed to update session', err)
      }
    }
    store.reset()
  }

  const handlePauseResume = () => {
    togglePause()
    store.setPaused(!store.isPaused)
  }

  const categoryOptions: { value: string; label: string }[] = [
    { value: 'people', label: t('common.people') },
    { value: 'animals', label: t('common.animals') },
    { value: 'vehicles', label: t('common.vehicles') },
    { value: 'containers', label: 'Containers' },
    { value: 'trees', label: 'Trees' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'custom', label: 'Custom' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('nav.counting')}</h1>
        <div className="flex items-center gap-3">
          <Select
            options={categoryOptions}
            value={store.category}
            onChange={(e) => store.setCategory(e.target.value as Category)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative">
          <div className="flex gap-2 mb-3">
            {(['live', 'upload'] as SourceType[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSourceMode(mode)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sourceMode === mode
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-card text-dark-muted border border-white/10 hover:text-white'
                }`}
              >
                {mode === 'live' ? t('counting.source.camera') : t('counting.source.upload')}
              </button>
            ))}
          </div>

          {sourceMode === 'live' ? (
            <CameraFeed onStreamReady={onStreamReady} isDetecting={store.isActive} />
          ) : (
            <UploadSource />
          )}
        </div>

        <div className="space-y-4">
          <StatCard title={t('counting.total')} value={store.totalCount} icon={<span>👥</span>} color="#2563EB" />
          {store.category === 'people' && (
            <>
              <StatCard title={t('counting.male')} value={store.maleCount} icon={<span>♂</span>} color="#10B981" />
              <StatCard title={t('counting.female')} value={store.femaleCount} icon={<span>♀</span>} color="#EC4899" />
            </>
          )}
          {store.category === 'animals' && Object.keys(store.animalCounts).length > 0 && (
            <Card>
              <h4 className="text-white font-medium mb-2">{t('counting.species')}</h4>
              {Object.entries(store.animalCounts).map(([species, count]) => (
                <div key={species} className="flex justify-between text-sm py-1">
                  <span className="text-dark-muted capitalize">{species}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </Card>
          )}
          {store.category === 'vehicles' && Object.keys(store.vehicleCounts).length > 0 && (
            <Card>
              <h4 className="text-white font-medium mb-2">{t('counting.category')}</h4>
              {Object.entries(store.vehicleCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm py-1">
                  <span className="text-dark-muted capitalize">{type}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </Card>
          )}
          <StatCard title={t('counting.confidence')} value={`${(store.confidence * 100).toFixed(1)}%`} icon={<span>🎯</span>} color="#F59E0B" />
          <StatCard title={t('counting.speed')} value={`${store.processingSpeed.toFixed(0)}ms`} icon={<span>⚡</span>} color="#8B5CF6" />

          <div className="space-y-2">
            {!store.isActive ? (
              <>
                {showSessionDialog && (
                  <Input
                    label={t('session.name')}
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="My Counting Session"
                  />
                )}
                <Button className="w-full" size="lg" onClick={handleStart} disabled={!isModelReady}>
                  {isModelReady ? t('counting.start') : t('common.loading')}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button className="flex-1" variant="danger" onClick={handleStop}>
                  {t('counting.stop')}
                </Button>
                <Button className="flex-1" variant="ghost" onClick={handlePauseResume}>
                  {store.isPaused ? t('counting.resume') : t('counting.pause')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
