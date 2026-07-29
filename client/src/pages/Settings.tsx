import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { useToast } from '../components/ui/Toast'
import { useTranslation } from '../i18n'
import { useAppStore } from '../store/appStore'
import { Settings } from '../types'
import api from '../services/api'

export const SettingsPage = () => {
  const { language, setLanguage, setTheme, theme } = useAppStore()
  const { t } = useTranslation(language)
  const { showToast } = useToast()
  const [settings, setSettings] = useState<Settings>({
    camera: { resolution: '1280x720', fps: 30, defaultCamera: 'environment' },
    ai: { confidenceThreshold: 0.5, detectionModel: 'coco-ssd', trackingMode: 'bytetrack' },
    storage: { local: true, cloudSync: false },
    theme: 'dark',
    language: 'en',
    notifications: true,
  })

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/settings')
        setSettings(data)
      } catch (err) {
        console.error('Failed to fetch settings', err)
      }
    }
    fetch()
  }, [])

  const save = async () => {
    try {
      await api.put('/settings', settings)
      setLanguage(settings.language)
      setTheme(settings.theme)
      showToast(t('settings.saved'), 'success')
    } catch (err) {
      showToast(t('common.error'), 'error')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('settings.camera')}</h3>
        <div className="space-y-4">
          <Select
            label={t('settings.resolution')}
            value={settings.camera.resolution}
            onChange={(e) => setSettings((s) => ({ ...s, camera: { ...s.camera, resolution: e.target.value } }))}
            options={[
              { value: '640x480', label: '640x480' },
              { value: '1280x720', label: '1280x720' },
              { value: '1920x1080', label: '1920x1080' },
            ]}
          />
          <Select
            label={t('settings.fps')}
            value={settings.camera.fps.toString()}
            onChange={(e) => setSettings((s) => ({ ...s, camera: { ...s.camera, fps: parseInt(e.target.value) } }))}
            options={[
              { value: '15', label: '15 FPS' },
              { value: '30', label: '30 FPS' },
              { value: '60', label: '60 FPS' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('settings.ai')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1.5">{t('settings.confidenceThreshold')}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.ai.confidenceThreshold * 100}
              onChange={(e) => setSettings((s) => ({ ...s, ai: { ...s.ai, confidenceThreshold: parseInt(e.target.value) / 100 } }))}
              className="w-full accent-primary-500"
            />
            <span className="text-white text-sm">{(settings.ai.confidenceThreshold * 100).toFixed(0)}%</span>
          </div>
          <Select
            label="Model"
            value={settings.ai.detectionModel}
            onChange={(e) => setSettings((s) => ({ ...s, ai: { ...s.ai, detectionModel: e.target.value } }))}
            options={[
              { value: 'coco-ssd', label: 'COCO-SSD' },
              { value: 'mobilenet', label: 'MobileNet' },
              { value: 'face', label: 'Face API' },
            ]}
          />
          <Select
            label="Tracking"
            value={settings.ai.trackingMode}
            onChange={(e) => setSettings((s) => ({ ...s, ai: { ...s.ai, trackingMode: e.target.value as any } }))}
            options={[
              { value: 'bytetrack', label: 'ByteTrack' },
              { value: 'sort', label: 'SORT' },
              { value: 'iou', label: 'IoU' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('settings.theme')}</h3>
        <div className="flex gap-3">
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setSettings((s) => ({ ...s, theme: themeOption }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                settings.theme === themeOption
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-dark-muted hover:text-white'
              }`}
            >
              {t(`settings.${themeOption}`)}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('settings.language')}</h3>
        <div className="flex gap-3">
          {(['en', 'sw'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setSettings((s) => ({ ...s, language: l }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                settings.language === l
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-dark-muted hover:text-white'
              }`}
            >
              {t(`settings.${l === 'en' ? 'english' : 'swahili'}`)}
            </button>
          ))}
        </div>
      </Card>

      <Button onClick={save} className="w-full" size="lg">
        {t('settings.save')}
      </Button>
    </motion.div>
  )
}
