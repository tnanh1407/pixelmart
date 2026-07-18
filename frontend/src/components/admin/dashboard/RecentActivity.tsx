import {
  UserPlus, ShoppingBag, Store, Megaphone, Zap, Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Activity } from '@/services/admin/analytics.service'

const activityIcons = {
  new_user: { icon: UserPlus, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
  new_order: { icon: ShoppingBag, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  new_store: { icon: Store, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
  new_campaign: { icon: Megaphone, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' },
  flash_sale: { icon: Zap, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' },
} as const

interface RecentActivityProps {
  data: Activity[]
  loading?: boolean
}

export default function RecentActivity({ data, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-36 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {data.map((activity) => {
          const cfg = activityIcons[activity.type]
          const Icon = cfg.icon
          return (
            <div
              key={activity.id}
              className="flex gap-3 py-2.5 border-b border-border/50 last:border-0"
            >
              <div className={`${cfg.color} p-1.5 rounded-full flex-shrink-0 mt-0.5`}>
                <Icon size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
                {activity.detail && (
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.detail}</p>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock size={10} />
                {activity.time}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
