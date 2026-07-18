import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  className?: string
  rows?: number
  type?: 'spinner' | 'skeleton' | 'card'
}

export default function LoadingState({
  className,
  rows = 5,
  type = 'spinner',
}: LoadingStateProps) {
  if (type === 'skeleton') {
    return (
      <div className={cn('space-y-3 py-6', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="mb-3 h-5 w-3/5" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}
