import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-dark-muted mb-1.5">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted">{icon}</div>}
          <input
            ref={ref}
            className={`w-full bg-dark-card border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-dark-muted/50
              focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all
              ${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    )
  }
)
