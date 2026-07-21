import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemHealthStatus } from '@/services/admin/analytics.service'

const statusConfig = {
  healthy: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', label: 'Hoạt động' },
  degraded: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', label: 'Suy giảm' },
  down: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', label: 'Ngừng' },
} as const

interface SystemHealthProps {
  data: SystemHealthStatus[]
  loading?: boolean
}

export default function SystemHealth({ data, loading }: SystemHealthProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-2 h-2 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4 mt-1" />
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
        <CardTitle className="text-base font-semibold">Tình trạng hệ thống</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const cfg = statusConfig[item.status]
          const Icon = cfg.icon
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${cfg.bg} p-1.5 rounded-full`}>
                  <Icon size={12} className={cfg.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uptime: {item.uptime} · {item.latency}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
