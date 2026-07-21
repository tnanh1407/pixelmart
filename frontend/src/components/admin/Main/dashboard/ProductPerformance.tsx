import { TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { ProductAnalytics } from '@/services/admin/analytics.service'

interface ProductPerformanceProps {
  bestSelling: ProductAnalytics[]
  lowStock: ProductAnalytics[]
  loading?: boolean
}

const formatPrice = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  return `${(v / 1_000).toFixed(0)}K`
}

export default function ProductPerformance({ bestSelling, lowStock, loading }: ProductPerformanceProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 bg-muted rounded flex-shrink-0" />
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
        <CardTitle className="text-base font-semibold">Sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
            <TrendingUp size={13} className="text-emerald-500" />
            Bán chạy nhất
          </div>
          {bestSelling.slice(0, 5).map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 py-1.5 rounded-lg hover:bg-muted/30 transition-colors px-1 -mx-1"
            >
              <span className="text-xs font-semibold text-muted-foreground w-4 text-center">
                {i + 1}
              </span>
              <Avatar className="h-8 w-8 flex-shrink-0 rounded-md">
                <AvatarImage src={p.image} alt={p.name} />
                <AvatarFallback className="rounded-md text-[10px] bg-primary/10">
                  {p.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.storeName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">{formatPrice(p.price)}</p>
                <p className="text-xs text-muted-foreground">Đã bán: {p.sold}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
            <AlertTriangle size={13} className="text-amber-500" />
            Sắp hết hàng
          </div>
          {lowStock.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 py-1.5 rounded-lg hover:bg-muted/30 transition-colors px-1 -mx-1"
            >
              <Avatar className="h-8 w-8 flex-shrink-0 rounded-md">
                <AvatarImage src={p.image} alt={p.name} />
                <AvatarFallback className="rounded-md text-[10px] bg-red-100 text-red-500">
                  {p.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.storeName}</p>
              </div>
              <Badge variant={p.stock === 0 ? 'destructive' : 'outline'} className="text-xs flex-shrink-0">
                {p.stock === 0 ? 'Hết hàng' : `Còn ${p.stock}`}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
