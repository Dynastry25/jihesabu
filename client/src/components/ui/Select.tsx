import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-dark-muted mb-1.5">{label}</label>}
        <select
          ref={ref}
          className={`w-full bg-dark-card border border-white/10 rounded-xl px-4 py-2.5 text-white 
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-card">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)
