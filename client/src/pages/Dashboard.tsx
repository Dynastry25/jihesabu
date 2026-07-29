import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { CountChart, PieChartComponent } from '../components/charts/CountChart'
import { useTranslation } from '../i18n'
import { useAppStore } from '../store/appStore'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Session } from '../types'

export const Dashboard = () => {
  const { language } = useAppStore()
  const { user } = useAuthStore()
  const { t } = useTranslation(language)
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, avgConfidence: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/sessions?limit=5')
        setSessions(data.sessions)
        if (data.sessions.length > 0) {
          const totals = data.sessions.reduce(
            (acc: any, s: Session) => ({
              total: acc.total + s.totalCount,
              male: acc.male + s.maleCount,
              female: acc.female + s.femaleCount,
              avgConfidence: acc.avgConfidence + s.confidenceAvg,
            }),
            { total: 0, male: 0, female: 0, avgConfidence: 0 }
          )
          totals.avgConfidence = data.sessions.length > 0 ? totals.avgConfidence / data.sessions.length : 0
          setStats(totals)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const chartData = [
    { hour: '6am', count: 5 },
    { hour: '9am', count: 25 },
    { hour: '12pm', count: 45 },
    { hour: '3pm', count: 30 },
    { hour: '6pm', count: 20 },
    { hour: '9pm', count: 10 },
  ]

  const categoryData = [
    { name: 'People', value: 120 },
    { name: 'Animals', value: 45 },
    { name: 'Vehicles', value: 30 },
    { name: 'Other', value: 15 },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('nav.dashboard')}</h1>
          <p className="text-dark-muted text-sm mt-1">{t('app.tagline')}</p>
        </div>
        <Button onClick={() => navigate('/counting')} icon={<span>🎯</span>}>
          {t('counting.start')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('counting.total')}
          value={stats.total}
          icon={<span>👥</span>}
          color="#2563EB"
          subtitle="All time"
        />
        <StatCard
          title={t('counting.male')}
          value={stats.male}
          icon={<span>♂</span>}
          color="#10B981"
          subtitle="Detected"
        />
        <StatCard
          title={t('counting.female')}
          value={stats.female}
          icon={<span>♀</span>}
          color="#EC4899"
          subtitle="Detected"
        />
        <StatCard
          title={t('counting.confidence')}
          value={`${(stats.avgConfidence * 100).toFixed(1)}%`}
          icon={<span>📊</span>}
          color="#F59E0B"
          subtitle="Average"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountChart data={chartData} title={t('analytics.hourly')} />
        <PieChartComponent data={categoryData} title={t('analytics.category')} />
      </div>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('session.title')}s</h3>
        {sessions.length === 0 ? (
          <p className="text-dark-muted text-center py-8">{t('session.noSessions')}</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => navigate(`/sessions/${session._id}`)}
              >
                <div>
                  <p className="text-white font-medium">{session.name}</p>
                  <p className="text-dark-muted text-xs">{session.category} · {new Date(session.startTime).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{session.totalCount}</p>
                  <p className="text-dark-muted text-xs">{session.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
