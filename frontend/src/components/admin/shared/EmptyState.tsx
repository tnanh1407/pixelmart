import { type LucideIcon, Package } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  message: string
}

export default function EmptyState({ icon: Icon = Package, message }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <Icon size={48} className="mx-auto text-text-muted mb-3" />
      <p className="text-text-muted">{message}</p>
    </div>
  )
}
