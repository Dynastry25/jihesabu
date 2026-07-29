import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  onClick?: () => void
}

export const Card = ({ children, className = '', glow = false, onClick }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 
        ${glow ? 'shadow-lg shadow-primary-500/10' : ''} ${onClick ? 'cursor-pointer hover:border-primary-500/50 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
