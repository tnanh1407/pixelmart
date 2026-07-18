import { Package, SearchX, Inbox, FileX } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  package: Package,
  search: SearchX,
  inbox: Inbox,
  file: FileX,
}

interface EmptyStateProps {
  icon?: LucideIcon | string
  message: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({
  icon: iconProp = Package,
  message,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon: LucideIcon =
    typeof iconProp === 'string' && ICON_MAP[iconProp]
      ? ICON_MAP[iconProp]
      : (iconProp as LucideIcon)

  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
        <Icon size={32} className="text-muted-foreground" />
      </div>
      <p className="text-base font-medium text-foreground">{message}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
