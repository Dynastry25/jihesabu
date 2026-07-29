import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { useTranslation } from '../../i18n'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export const AdminDashboard = () => {
  const { language } = useAppStore()
  const { user } = useAuthStore()
  const { t } = useTranslation(language)
  const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0, activeSessions: 0, totalDetections: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/stats')
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch admin stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (user?.role !== 'admin') {
    return <div className="text-center py-12 text-dark-muted">Admin access required</div>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">{t('admin.dashboard')}</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('admin.totalUsers')} value={stats.totalUsers} icon={<span>👥</span>} color="#2563EB" />
        <StatCard title={t('admin.totalSessions')} value={stats.totalSessions} icon={<span>📋</span>} color="#10B981" />
        <StatCard title={t('admin.activeSessions')} value={stats.activeSessions} icon={<span>🟢</span>} color="#F59E0B" />
        <StatCard title={t('admin.totalDetections')} value={stats.totalDetections} icon={<span>🎯</span>} color="#EC4899" />
      </div>

      <Card>
        <h3 className="text-white font-semibold mb-4">{t('admin.system')}</h3>
        <p className="text-dark-muted">System monitoring and configuration tools available in the admin panel.</p>
      </Card>
    </motion.div>
  )
}
