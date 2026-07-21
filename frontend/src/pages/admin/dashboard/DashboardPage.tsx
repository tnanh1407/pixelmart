import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DollarSign, ShoppingCart, Package, Users, Store, MousePointerClick,
  ShoppingBag, Megaphone, RefreshCw, Download, Calendar,
} from 'lucide-react'
import { analyticsService, type DashboardAnalytics } from '@/services/admin/analytics.service'
import { Button } from '@/components/ui/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  KPICard, RevenueChart, OrderStats, StorePerformance,
  ProductPerformance, UserAnalytics, SystemHealth,
  RecentActivity, QuickActions,
} from '@/components/admin/Main/dashboard'

const kpiConfig = (data: DashboardAnalytics | undefined) => [
  {
    title: 'Doanh thu',
    value: data?.revenue.label ?? '0',
    icon: DollarSign,
    change: data?.revenue.change ?? 0,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    title: 'Đơn hàng',
    value: data?.orders.label ?? '0',
    icon: ShoppingCart,
    change: data?.orders.change ?? 0,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    title: 'Sản phẩm',
    value: data?.products.label ?? '0',
    icon: Package,
    change: data?.products.change ?? 0,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    title: 'Người dùng',
    value: data?.users.label ?? '0',
    icon: Users,
    change: data?.users.change ?? 0,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
  },
  {
    title: 'Cửa hàng',
    value: data?.stores.label ?? '0',
    icon: Store,
    change: data?.stores.change ?? 0,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
  },
  {
    title: 'Tỷ lệ chuyển đổi',
    value: data?.conversionRate.label ?? '0%',
    icon: MousePointerClick,
    change: data?.conversionRate.change ?? 0,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    title: 'Giá trị TB đơn hàng',
    value: data?.averageOrderValue.label ?? '0',
    icon: ShoppingBag,
    change: data?.averageOrderValue.change ?? 0,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
  },
  {
    title: 'Chiến dịch',
    value: data?.activeCampaigns.label ?? '0',
    icon: Megaphone,
    change: data?.activeCampaigns.change ?? 0,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
  },
]

export default function DashboardPage() {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const { data, isLoading, isFetching, refetch } = useQuery<DashboardAnalytics>({
    queryKey: ['admin-analytics'],
    queryFn: () => analyticsService.getDashboardAnalytics(),
    staleTime: 60 * 1000,
  })

  const handleRefresh = useCallback(() => {
    refetch()
    setLastRefresh(new Date())
  }, [refetch])

  const today = new Date()
  const formattedDate = today.toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const kpis = kpiConfig(data)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Calendar size={15} />
                  <span className="hidden sm:inline">30 ngày qua</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Thay đổi khoảng thời gian</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Download size={15} />
                  <span className="hidden sm:inline">Xuất báo cáo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tải báo cáo CSV</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          </Button>

          <span className="text-xs text-muted-foreground hidden lg:block">
            Cập nhật: {lastRefresh.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} loading={isLoading} {...kpi} />
        ))}
      </div>

      {/* Revenue Chart - Full width */}
      <RevenueChart
        data={data?.revenueTimeline ?? []}
        loading={isLoading}
      />

      {/* Order Stats + Store Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OrderStats
            data={data?.orderStatusBreakdown ?? []}
            loading={isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <StorePerformance
            data={data?.topStores ?? []}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Product Performance + User Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductPerformance
          bestSelling={data?.bestSelling ?? []}
          lowStock={data?.lowStock ?? []}
          loading={isLoading}
        />
        <UserAnalytics
          data={data?.userTrend ?? []}
          loading={isLoading}
        />
      </div>

      {/* Recent Activity + System Health + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity
            data={data?.recentActivities ?? []}
            loading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <SystemHealth
            data={data?.systemHealth ?? []}
            loading={isLoading}
          />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
