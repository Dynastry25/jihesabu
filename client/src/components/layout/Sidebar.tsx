import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import { useTranslation } from '../../i18n'

const navItems = (t: (key: string) => string) => [
  { path: '/', icon: '📊', label: t('nav.dashboard') },
  { path: '/counting', icon: '🎯', label: t('nav.counting') },
  { path: '/sessions', icon: '📋', label: t('nav.sessions') },
  { path: '/reports', icon: '📄', label: t('nav.reports') },
  { path: '/analytics', icon: '📈', label: t('nav.analytics') },
  { path: '/settings', icon: '⚙️', label: t('nav.settings') },
]

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, language } = useAppStore()
  const { user } = useAuthStore()
  const { t } = useTranslation(language)

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="fixed left-0 top-0 h-screen bg-dark-card/90 backdrop-blur-xl border-r border-white/10 z-40 overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Jihesabu</h1>
                <p className="text-dark-muted text-xs">{t('app.tagline')}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems(t).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-dark-muted hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0] || 'G'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name || 'Guest'}</p>
                <p className="text-dark-muted text-xs capitalize">{user?.role || 'guest'}</p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
