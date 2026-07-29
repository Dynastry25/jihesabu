import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { CountChart, PieChartComponent } from '../components/charts/CountChart'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useTranslation } from '../i18n'
import { useAppStore } from '../store/appStore'
import { Session } from '../types'
import api from '../services/api'

export const AnalyticsPage = () => {
  const { language } = useAppStore()
  const { t } = useTranslation(language)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/sessions?limit=50')
        setSessions(data.sessions)
      } catch (err) {
        console.error('Failed to fetch analytics data', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">{t('analytics.title')}</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const totalCount = sessions.reduce((a, s) => a + s.totalCount, 0)
  const avgConfidence = sessions.length > 0 ? sessions.reduce((a, s) => a + s.confidenceAvg, 0) / sessions.length : 0
  const maleTotal = sessions.reduce((a, s) => a + s.maleCount, 0)
  const femaleTotal = sessions.reduce((a, s) => a + s.femaleCount, 0)

  const hourlyData = [
    { hour: '6am', count: Math.floor(totalCount * 0.1) },
    { hour: '9am', count: Math.floor(totalCount * 0.25) },
    { hour: '12pm', count: Math.floor(totalCount * 0.3) },
    { hour: '3pm', count: Math.floor(totalCount * 0.2) },
    { hour: '6pm', count: Math.floor(totalCount * 0.1) },
    { hour: '9pm', count: Math.floor(totalCount * 0.05) },
  ]

  const categoryData = [
    { name: 'People', value: sessions.filter((s) => s.category === 'people').length || 1 },
    { name: 'Animals', value: sessions.filter((s) => s.category === 'animals').length || 1 },
    { name: 'Vehicles', value: sessions.filter((s) => s.category === 'vehicles').length || 1 },
    { name: 'Other', value: sessions.filter((s) => !['people', 'animals', 'vehicles'].includes(s.category)).length || 1 },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('analytics.title')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('counting.total')} value={totalCount} icon={<span>📊</span>} color="#2563EB" />
        <StatCard title={t('counting.male')} value={maleTotal} icon={<span>♂</span>} color="#10B981" />
        <StatCard title={t('counting.female')} value={femaleTotal} icon={<span>♀</span>} color="#EC4899" />
        <StatCard title={t('counting.confidence')} value={`${(avgConfidence * 100).toFixed(1)}%`} icon={<span>🎯</span>} color="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountChart data={hourlyData} title={t('analytics.hourly')} />
        <PieChartComponent data={categoryData} title={t('analytics.category')} />
      </div>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('analytics.historical')}</h3>
        {sessions.length === 0 ? (
          <p className="text-dark-muted text-center py-8">{t('session.noSessions')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-muted border-b border-white/10">
                  <th className="text-left py-3 px-2">{t('session.name')}</th>
                  <th className="text-right py-3 px-2">{t('counting.total')}</th>
                  <th className="text-right py-3 px-2">{t('counting.male')}</th>
                  <th className="text-right py-3 px-2">{t('counting.female')}</th>
                  <th className="text-right py-3 px-2">{t('counting.confidence')}</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 20).map((s) => (
                  <tr key={s._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-2 text-white">{s.name}</td>
                    <td className="py-3 px-2 text-right text-white">{s.totalCount}</td>
                    <td className="py-3 px-2 text-right text-blue-400">{s.maleCount}</td>
                    <td className="py-3 px-2 text-right text-pink-400">{s.femaleCount}</td>
                    <td className="py-3 px-2 text-right text-secondary-400">{(s.confidenceAvg * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
