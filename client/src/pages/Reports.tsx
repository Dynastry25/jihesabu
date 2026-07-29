import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useTranslation } from '../i18n'
import { useAppStore } from '../store/appStore'
import { Report } from '../types'
import api from '../services/api'

export const Reports = () => {
  const { language } = useAppStore()
  const { t } = useTranslation(language)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/reports')
        setReports(data)
      } catch (err) {
        console.error('Failed to fetch reports', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const deleteReport = async (id: string) => {
    try {
      await api.delete(`/reports/${id}`)
      setReports((prev) => prev.filter((r) => r._id !== id))
    } catch (err) {
      console.error('Failed to delete report', err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">{t('report.title')}</h1>
        <div className="grid gap-4">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('report.title')}</h1>
      </div>

      {reports.length === 0 ? (
        <Card>
          <p className="text-dark-muted text-center py-12">{t('report.noReports')}</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report._id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{report.title}</h3>
                  <p className="text-dark-muted text-sm">
                    {report.type.toUpperCase()} · {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteReport(report._id)}>
                  🗑️
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
