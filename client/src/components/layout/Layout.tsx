import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAppStore } from '../../store/appStore'

export const Layout = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[260px]' : 'ml-0'}`}>
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
