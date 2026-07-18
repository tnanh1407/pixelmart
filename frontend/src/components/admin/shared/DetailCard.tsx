import { type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface DetailCardProps {
  title: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export default function DetailCard({ title, icon: Icon, children, className }: DetailCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className ?? ''}`}>
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={16} className="text-primary" />}
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  )
}

interface DetailFieldProps {
  label: string
  value: ReactNode
  mono?: boolean
}

export function DetailField({ label, value, mono }: DetailFieldProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className={`text-sm font-medium text-text ${mono ? 'font-mono text-xs bg-gray-100 px-2 py-1 rounded' : ''}`}>
        {value}
      </span>
    </div>
  )
}

interface DetailInfoRowProps {
  icon: LucideIcon
  label: string
  value: ReactNode
}

export function DetailInfoRow({ icon: Icon, label, value }: DetailInfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
        <Icon size={18} className="text-primary" />
      </div>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  )
}
