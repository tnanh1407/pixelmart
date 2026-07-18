import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  className?: string
}

export default function LoadingState({ className }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center py-20 ${className ?? ''}`}>
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  )
}
