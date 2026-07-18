import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'Có lỗi xảy ra',
  message = 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive-light">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 size-4" />
          Thử lại
        </Button>
      )}
    </div>
  )
}
