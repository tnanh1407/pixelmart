import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

export default function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {item.href ? (
                <a href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  )
}
