import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/admin/analytics.service'
import { PageContainer, PageHeader, SectionCard, DataTable } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DollarSign, ShoppingCart, Package, Users, Store,
  Download, TrendingUp, TrendingDown, BarChart3,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, ComposedChart, Legend,
} from 'recharts'

type DateRange = '7d' | '30d' | '90d' | 'year'

const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: '7d', label: '7 ngày qua' },
  { key: '30d', label: '30 ngày qua' },
  { key: '90d', label: '90 ngày qua' },
  { key: 'year', label: 'Năm nay' },
]

interface StatCardData {
  title: string
  value: string
  change: number
  icon: typeof DollarSign
}

interface TopProduct {
  id: string
  name: string
  price: number
  sold: number
  revenue: number
}

interface TopStore {
  id: string
  name: string
  revenue: number
  orders: number
  rating: number
}

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const MOCK_PRODUCTS: TopProduct[] = [
  { id: 'p1', name: 'Bưởi Đoan Hùng OCOP', price: 85000, sold: 1240, revenue: 105400000 },
  { id: 'p2', name: 'Gạo Nếp Tú Lệ', price: 45000, sold: 980, revenue: 44100000 },
  { id: 'p3', name: 'Miến Dong Phia Đén', price: 65000, sold: 876, revenue: 56940000 },
  { id: 'p4', name: 'Mật Ong Bạc Hà', price: 180000, sold: 654, revenue: 117720000 },
  { id: 'p5', name: 'Hồng Sấy Treo Đà Lạt', price: 95000, sold: 543, revenue: 51585000 },
]

const MOCK_STORES: TopStore[] = [
  { id: 's1', name: 'Nông Sản Xanh Hà Nội', revenue: 185000000, orders: 342, rating: 4.8 },
  { id: 's2', name: 'Đặc Sản Tây Bắc', revenue: 156000000, orders: 298, rating: 4.6 },
  { id: 's3', name: 'Gạo Ngon Đồng Bằng', revenue: 142000000, orders: 267, rating: 4.7 },
  { id: 's4', name: 'Trái Cây Vườn Việt', revenue: 128000000, orders: 234, rating: 4.5 },
  { id: 's5', name: 'Trà & Cà Phê Cao Nguyên', revenue: 112000000, orders: 198, rating: 4.9 },
]

const ORDER_BREAKDOWN = [
  { label: 'Chờ xác nhận', value: 120, color: 'oklch(0.67 0.15 75)' },
  { label: 'Đang xử lý', value: 80, color: 'oklch(0.6 0.2 240)' },
  { label: 'Đang giao', value: 140, color: 'oklch(0.6 0.15 200)' },
  { label: 'Hoàn thành', value: 500, color: 'oklch(0.527 0.154 150)' },
  { label: 'Đã hủy', value: 20, color: 'oklch(0.55 0.2 20)' },
]

function DonutChart() {
  const total = ORDER_BREAKDOWN.reduce((s, i) => s + i.value, 0)
  const segments = ORDER_BREAKDOWN.map((item) => {
    const pct = (item.value / total) * 100
    return { ...item, pct }
  })

  const conicGradient = segments
    .map((item, i) => {
      const start = segments.slice(0, i).reduce((s, o) => s + o.pct, 0)
      return `${item.color} ${start}% ${start + item.pct}%`
    })
    .join(', ')

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-[180px] mb-4">
        <div className="size-full rounded-full" style={{ background: `conic-gradient(${conicGradient})` }} />
        <div className="absolute inset-6 rounded-full bg-card flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">đơn</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {ORDER_BREAKDOWN.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => analyticsService.getDashboardAnalytics(),
    staleTime: 60 * 1000,
  })

  const statCards: StatCardData[] = [
    {
      title: 'Doanh thu',
      value: analytics?.revenue.label ?? '0',
      change: analytics?.revenue.change ?? 0,
      icon: DollarSign,
    },
    {
      title: 'Đơn hàng',
      value: analytics?.orders.label ?? '0',
      change: analytics?.orders.change ?? 0,
      icon: ShoppingCart,
    },
    {
      title: 'Sản phẩm đã bán',
      value: (analytics?.bestSelling?.reduce((s, p) => s + p.sold, 0) || 2456).toLocaleString('vi-VN'),
      change: 12.5,
      icon: Package,
    },
    {
      title: 'Người dùng mới',
      value: analytics?.users.label ?? '0',
      change: analytics?.users.change ?? 0,
      icon: Users,
    },
    {
      title: 'Cửa hàng hoạt động',
      value: analytics?.stores.label ?? '0',
      change: analytics?.stores.change ?? 0,
      icon: Store,
    },
  ]

  const chartData = analytics?.revenueTimeline ?? []

  const productColumns: Column<TopProduct>[] = [
    {
      header: 'Sản phẩm',
      cellClassName: 'px-4',
      render: (p) => (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
            <Package size={14} />
          </div>
          <span className="text-sm font-medium text-foreground">{p.name}</span>
        </div>
      ),
    },
    {
      header: 'Giá',
      cellClassName: 'px-4',
      render: (p) => <span className="text-sm text-foreground">{formatVND(p.price)}</span>,
    },
    {
      header: 'Đã bán',
      cellClassName: 'px-4',
      render: (p) => <span className="text-sm text-foreground">{p.sold}</span>,
    },
    {
      header: 'Doanh thu',
      cellClassName: 'px-4',
      render: (p) => (
        <span className="text-sm font-medium text-foreground">{formatVND(p.revenue)}</span>
      ),
    },
  ]

  const storeColumns: Column<TopStore>[] = [
    {
      header: 'Cửa hàng',
      cellClassName: 'px-4',
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
            <Store size={14} />
          </div>
          <span className="text-sm font-medium text-foreground">{s.name}</span>
        </div>
      ),
    },
    {
      header: 'Doanh thu',
      cellClassName: 'px-4',
      render: (s) => (
        <span className="text-sm font-medium text-foreground">{formatVND(s.revenue)}</span>
      ),
    },
    {
      header: 'Đơn hàng',
      cellClassName: 'px-4',
      render: (s) => <span className="text-sm text-foreground">{s.orders}</span>,
    },
    {
      header: 'Đánh giá',
      cellClassName: 'px-4',
      render: (s) => <span className="text-sm text-foreground">{s.rating}/5</span>,
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Báo cáo"
        description="Tổng quan các chỉ số kinh doanh"
        action={
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={15} />
            Xuất báo cáo
          </Button>
        }
      />

      <div className="flex items-center gap-1 mb-6 bg-muted rounded-lg p-0.5 w-fit">
        {DATE_RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setDateRange(r.key)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap',
              dateRange === r.key
                ? 'bg-card text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {statCards.map((card) => {
          const isPositive = card.change >= 0
          const Icon = card.icon
          return (
            <div key={card.title} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <Icon size={16} className="text-muted-foreground" />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {isPositive ? (
                  <TrendingUp size={12} className="text-success" />
                ) : (
                  <TrendingDown size={12} className="text-destructive" />
                )}
                <span
                  className={cn('text-xs font-medium', isPositive ? 'text-success' : 'text-destructive')}
                >
                  {isPositive ? '+' : ''}
                  {card.change}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs kỳ trước</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SectionCard title="Doanh thu theo thời gian">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
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
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : `${(v / 1_000).toFixed(0)}K`)}
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
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? formatVND(value) : value,
                    name === 'revenue' ? 'Doanh thu' : 'Đơn hàng',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  formatter={(value: string) => (value === 'revenue' ? 'Doanh thu' : 'Đơn hàng')}
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
                />
              </ComposedChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Trạng thái đơn hàng">
            <DonutChart />
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Top sản phẩm bán chạy">
          <DataTable columns={productColumns} data={MOCK_PRODUCTS} keyExtractor={(p) => p.id} />
        </SectionCard>
        <SectionCard title="Top cửa hàng">
          <DataTable columns={storeColumns} data={MOCK_STORES} keyExtractor={(s) => s.id} />
        </SectionCard>
      </div>
    </PageContainer>
  )
}
