import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface KPICardProps {
  title: string
  value: string
  icon: LucideIcon
  change: number
  sparkline?: number[]
  color: string
  bgColor: string
  loading?: boolean
}

export default function KPICard({ title, value, icon: Icon, change, color, bgColor, loading }: KPICardProps) {
  const isPositive = change >= 0

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            <div className="h-7 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
              <div className={`${bgColor} p-2 rounded-lg`}>
                <Icon size={18} className={color} />
              </div>
            </div>

            <p className="text-2xl font-bold tracking-tight text-foreground mb-1.5">
              {value}
            </p>

            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs tháng trước</span>
            </div>
          </>
        )}
      </CardContent>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-50"
        style={{
          backgroundColor: bgColor.replace('bg-', '').replace('-50', '') ? 'var(--primary)' : bgColor,
          background: `linear-gradient(to right, ${isPositive ? 'var(--primary)' : 'var(--destructive)'}, transparent)`,
          width: `${Math.min(Math.abs(change) * 2, 85)}%`,
        }}
      />
    </Card>
  )
}
