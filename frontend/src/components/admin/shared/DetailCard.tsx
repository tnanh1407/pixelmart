import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DetailCardProps {
  title: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export default function DetailCard({
  title,
  icon: Icon,
  children,
  className,
}: DetailCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card shadow-sm p-6',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-primary" />}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h2>
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
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          'text-sm font-medium text-foreground',
          mono && 'font-mono text-xs bg-muted px-2 py-1 rounded',
        )}
      >
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
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
        <Icon size={18} className="text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
