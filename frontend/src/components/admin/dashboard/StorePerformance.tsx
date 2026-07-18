import { Star, Store } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { StorePerformance as StorePerf } from '@/services/admin/analytics.service'

interface StorePerformanceProps {
  data: StorePerf[]
  loading?: boolean
}

const formatRevenue = (v: number) => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} tỷ`
  return `${(v / 1_000_000).toFixed(0)}M`
}

export default function StorePerformance({ data, loading }: StorePerformanceProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 bg-muted rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-muted rounded w-2/3" />
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
        <CardTitle className="text-base font-semibold">Top cửa hàng</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {data.slice(0, 8).map((store, i) => (
            <div
              key={store.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
            >
              <span className="text-xs font-semibold text-muted-foreground w-5 text-right">
                {i + 1}
              </span>
              <Avatar className="h-9 w-9 flex-shrink-0 rounded-lg">
                <AvatarImage src={store.logo} alt={store.name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs">
                  <Store size={14} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{store.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{store.orders} đơn</span>
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs text-muted-foreground">{store.rating}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground flex-shrink-0">
                {formatRevenue(store.revenue)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
