import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import { useTranslation } from '../../i18n'

export const Header = () => {
  const { toggleSidebar, language } = useAppStore()
  const { user, logout } = useAuthStore()
  const { t } = useTranslation(language)

  return (
    <header className="h-16 border-b border-white/10 bg-dark-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <button
        onClick={toggleSidebar}
        className="text-dark-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <span className="px-2 py-1 bg-accent-500/20 text-accent-400 text-xs rounded-lg font-medium">
            Admin
          </span>
        )}

        {user && (
          <button
            onClick={logout}
            className="text-dark-muted hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            {t('nav.logout')}
          </button>
        )}
      </div>
    </header>
  )
}
