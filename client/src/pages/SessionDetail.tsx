import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/ui/StatCard'
import { CountChart, PieChartComponent } from '../components/charts/CountChart'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useTranslation } from '../i18n'
import { useAppStore } from '../store/appStore'
import { generatePDF, generateCSV } from '../services/reports'
import { Session } from '../types'
import api from '../services/api'

export const SessionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useAppStore()
  const { t } = useTranslation(language)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/sessions/${id}`)
        setSession(data)
      } catch (err) {
        console.error('Failed to fetch session', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!session) {
    return <div className="text-dark-muted text-center py-12">Session not found</div>
  }

  const hourlyData = session.analytics?.hourlyCounts?.length > 0
    ? session.analytics.hourlyCounts
    : [{ hour: 'N/A', count: session.totalCount }]

  const categoryData = [
    { name: 'Male', value: session.maleCount },
    { name: 'Female', value: session.femaleCount },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/sessions')} className="text-dark-muted hover:text-white mb-2 flex items-center gap-1 text-sm">
            ← {t('common.back')}
          </button>
          <h1 className="text-2xl font-bold text-white">{session.name}</h1>
          <p className="text-dark-muted text-sm">{session.category} · {session.location || 'No location'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => generatePDF(session)} icon={<span>📄</span>}>
            {t('report.pdf')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => generateCSV(session)} icon={<span>📊</span>}>
            {t('report.csv')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('counting.total')} value={session.totalCount} icon={<span>👥</span>} color="#2563EB" />
        <StatCard title={t('counting.male')} value={session.maleCount} icon={<span>♂</span>} color="#10B981" />
        <StatCard title={t('counting.female')} value={session.femaleCount} icon={<span>♀</span>} color="#EC4899" />
        <StatCard title={t('counting.confidence')} value={`${(session.confidenceAvg * 100).toFixed(1)}%`} icon={<span>🎯</span>} color="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountChart data={hourlyData} title={t('analytics.hourly')} />
        <PieChartComponent data={categoryData.filter((d) => d.value > 0)} title={t('analytics.gender')} />
      </div>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('session.details')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-dark-muted">{t('session.status')}:</span>
            <span className="text-white ml-2 capitalize">{session.status}</span>
          </div>
          <div>
            <span className="text-dark-muted">{t('counting.speed')}:</span>
            <span className="text-white ml-2">{session.processingSpeed.toFixed(0)}ms</span>
          </div>
          <div>
            <span className="text-dark-muted">{t('session.startTime')}:</span>
            <span className="text-white ml-2">{new Date(session.startTime).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-dark-muted">{t('session.endTime')}:</span>
            <span className="text-white ml-2">{session.endTime ? new Date(session.endTime).toLocaleString() : 'N/A'}</span>
          </div>
          <div>
            <span className="text-dark-muted">{t('session.duration')}:</span>
            <span className="text-white ml-2">{Math.floor(session.duration / 60)}m {session.duration % 60}s</span>
          </div>
          <div>
            <span className="text-dark-muted">Source:</span>
            <span className="text-white ml-2 capitalize">{session.sourceType}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
