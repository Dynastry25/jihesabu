import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color?: string
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
}

export const StatCard = ({ title, value, icon, color = '#2563EB', subtitle, trend }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-muted text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-white">{value.toLocaleString()}</p>
          {subtitle && <p className="text-dark-muted text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-yellow-400'}`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '■'}
          </span>
        </div>
      )}
    </motion.div>
  )
}
