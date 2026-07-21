import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, ComposedChart, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { RevenuePoint } from '@/services/admin/analytics.service'

const RANGES = [
  { key: '7d', label: '7 Ngày' },
  { key: '30d', label: '30 Ngày' },
  { key: '90d', label: '90 Ngày' },
  { key: '12m', label: '12 Tháng' },
] as const

interface RevenueChartProps {
  data: RevenuePoint[]
  loading?: boolean
}

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  const [range, setRange] = useState<string>('12m')

  const sliced = range === '7d' ? data.slice(-7)
    : range === '30d' ? data.slice(-30)
    : range === '90d' ? data.slice(-90)
    : data

  const totalRevenue = sliced.reduce((s, p) => s + p.revenue, 0)
  const totalOrders = sliced.reduce((s, p) => s + p.orders, 0)

  const formatRevenue = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
    return `${(v / 1_000).toFixed(0)}K`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-36 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted/50 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Doanh thu & Đơn hàng</CardTitle>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-muted-foreground">
              Doanh thu: <span className="font-semibold text-foreground">{formatRevenue(totalRevenue)}</span>
            </span>
            <span className="text-sm text-muted-foreground">
              Đơn hàng: <span className="font-semibold text-foreground">{totalOrders.toLocaleString('vi-VN')}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {RANGES.map(r => (
            <Button
              key={r.key}
              variant={range === r.key ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={sliced} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatRevenue}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
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
              formatter={(value: number, name: string) => {
                if (name === 'revenue') return [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']
                return [value, 'Đơn hàng']
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={(value: string) => value === 'revenue' ? 'Doanh thu' : 'Đơn hàng'}
            />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--chart-3)' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
