import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useTranslation } from '../i18n'
import { useAppStore } from '../store/appStore'
import { Session, Category } from '../types'
import api from '../services/api'

export const Sessions = () => {
  const { language } = useAppStore()
  const { t } = useTranslation(language)
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', location: '', category: 'people' as Category })

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/sessions')
        setSessions(data.sessions)
      } catch (err) {
        console.error('Failed to fetch sessions', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const createSession = async () => {
    try {
      const { data } = await api.post('/sessions', {
        ...form,
        sourceType: 'live',
        status: 'active',
      })
      setSessions((prev) => [data, ...prev])
      setShowCreate(false)
      setForm({ name: '', description: '', location: '', category: 'people' })
    } catch (err) {
      console.error('Failed to create session', err)
    }
  }

  const deleteSession = async (id: string) => {
    try {
      await api.delete(`/sessions/${id}`)
      setSessions((prev) => prev.filter((s) => s._id !== id))
    } catch (err) {
      console.error('Failed to delete session', err)
    }
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-red-500/20 text-red-400',
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{t('nav.sessions')}</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('nav.sessions')}</h1>
        <Button onClick={() => setShowCreate(true)} icon={<span>+</span>}>
          {t('session.create')}
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <p className="text-dark-muted text-center py-12">{t('session.noSessions')}</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session._id} className="hover:border-primary-500/30 cursor-pointer" onClick={() => navigate(`/sessions/${session._id}`)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{session.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                      {t(`session.${session.status}`)}
                    </span>
                  </div>
                  <p className="text-dark-muted text-sm">
                    {session.category} · {session.location || 'No location'} · {new Date(session.startTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-2xl font-bold text-white">{session.totalCount}</p>
                  <p className="text-dark-muted text-xs">{t('counting.total')}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); deleteSession(session._id) }}
                >
                  🗑️
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={t('session.create')}>
        <div className="space-y-4">
          <Input label={t('session.name')} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label={t('session.description')} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input label={t('session.location')} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          <Select
            label={t('counting.category')}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
            options={[
              { value: 'people', label: t('common.people') },
              { value: 'animals', label: t('common.animals') },
              { value: 'vehicles', label: t('common.vehicles') },
              { value: 'containers', label: 'Containers' },
              { value: 'trees', label: 'Trees' },
              { value: 'inventory', label: 'Inventory' },
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={createSession} disabled={!form.name}>{t('session.create')}</Button>
            <Button variant="ghost" className="flex-1" onClick={() => setShowCreate(false)}>{t('common.cancel')}</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
