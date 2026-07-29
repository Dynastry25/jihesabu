import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import { useTranslation } from '../i18n'
import { useToast } from '../components/ui/Toast'

export const Register = () => {
  const { language } = useAppStore()
  const { t } = useTranslation(language)
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(email, password, name)
      navigate('/')
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
            J
          </div>
          <h1 className="text-3xl font-bold text-white">{t('auth.welcome')}</h1>
          <p className="text-dark-muted mt-2">{t('auth.registerTitle')}</p>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t('auth.name')} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            <Input label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label={t('auth.password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            <Button type="submit" className="w-full" loading={loading}>{t('nav.register')}</Button>
          </form>

          <p className="text-center text-sm text-dark-muted mt-4">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">{t('nav.login')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
