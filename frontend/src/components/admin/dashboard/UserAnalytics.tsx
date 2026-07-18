import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserAnalyticPoint } from '@/services/admin/analytics.service'

interface UserAnalyticsProps {
  data: UserAnalyticPoint[]
  loading?: boolean
}

export default function UserAnalytics({ data, loading }: UserAnalyticsProps) {
  const aggregated = useMemo(() => {
    const map = new Map<string, UserAnalyticPoint>()
    for (const p of data) {
      const week = p.date.slice(0, 7)
      const existing = map.get(week)
      if (existing) {
        existing.newUsers += p.newUsers
        existing.activeUsers += p.activeUsers
        existing.returningUsers += p.returningUsers
      } else {
        map.set(week, { ...p, date: week })
      }
    }
    return Array.from(map.values()).slice(-12)
  }, [data])

  const totalNew = aggregated.reduce((s, p) => s + p.newUsers, 0)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-36 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-[280px] bg-muted/50 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Người dùng</CardTitle>
          <span className="text-xs text-muted-foreground">
            +{totalNew} mới tuần này
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={aggregated} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="newUsersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="activeUsersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="returningUsersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={(v: string) => {
                if (v === 'activeUsers') return 'Hoạt động'
                if (v === 'newUsers') return 'Mới'
                return 'Quay lại'
              }}
            />
            <Area
              type="monotone"
              dataKey="activeUsers"
              stroke="var(--chart-1)"
              fill="url(#activeUsersGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="newUsers"
              stroke="var(--chart-2)"
              fill="url(#newUsersGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="returningUsers"
              stroke="var(--chart-4)"
              fill="url(#returningUsersGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
