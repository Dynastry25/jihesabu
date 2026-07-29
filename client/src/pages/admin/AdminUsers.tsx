import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../i18n'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import { User } from '../../types'
import api from '../../services/api'

export const AdminUsers = () => {
  const { language } = useAppStore()
  const { user } = useAuthStore()
  const { t } = useTranslation(language)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/users')
        setUsers(data)
      } catch (err) {
        console.error('Failed to fetch users', err)
      }
    }
    fetch()
  }, [])

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      console.error('Failed to delete user', err)
    }
  }

  if (user?.role !== 'admin') return <div className="text-center py-12 text-dark-muted">Admin access required</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('admin.users')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-dark-muted border-b border-white/10">
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-left py-3 px-2">Email</th>
                <th className="text-left py-3 px-2">Role</th>
                <th className="text-right py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-2 text-white">{u.name}</td>
                  <td className="py-3 px-2 text-dark-muted">{u.email || 'N/A'}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'admin' ? 'bg-accent-500/20 text-accent-400' :
                      u.role === 'user' ? 'bg-primary-500/20 text-primary-400' :
                      'bg-dark-muted/20 text-dark-muted'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)}>🗑️</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}
