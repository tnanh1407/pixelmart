import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export default function StatusBadge({
  active,
  activeLabel = 'Hoạt động',
  inactiveLabel = 'Ẩn',
}: StatusBadgeProps) {
  return (
    <Badge
      variant={active ? 'default' : 'destructive'}
      className={`px-3 py-1 text-xs font-semibold shadow-none border-none ${
        active ? 'bg-green-500/10 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </Badge>
  )
}
