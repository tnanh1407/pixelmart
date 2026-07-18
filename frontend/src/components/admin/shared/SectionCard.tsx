import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export default function SectionCard({ title, description, action, children, className }: SectionCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card shadow-sm', className)}>
      {(title || action) && (
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
