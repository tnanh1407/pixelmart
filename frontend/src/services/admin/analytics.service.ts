export interface RevenuePoint {
  date: string
  revenue: number
  orders: number
}

export interface OrderStatusBreakdown {
  status: string
  count: number
  color: string
}

export interface StorePerformance {
  id: string
  name: string
  logo: string
  revenue: number
  orders: number
  rating: number
}

export interface ProductAnalytics {
  id: string
  name: string
  image: string
  price: number
  sold: number
  stock: number
  views: number
  storeName: string
}

export interface UserAnalyticPoint {
  date: string
  newUsers: number
  activeUsers: number
  returningUsers: number
}

export interface Activity {
  id: string
  type: 'new_user' | 'new_order' | 'new_store' | 'new_campaign' | 'flash_sale'
  message: string
  time: string
  detail?: string
}

export interface SystemHealthStatus {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  uptime: string
  latency: string
}

export interface DashboardAnalytics {
  revenue: { total: number; change: number; sparkline: number[]; label: string }
  orders: { total: number; change: number; sparkline: number[]; label: string }
  products: { total: number; change: number; sparkline: number[]; label: string }
  users: { total: number; change: number; sparkline: number[]; label: string }
  stores: { total: number; change: number; sparkline: number[]; label: string }
  conversionRate: { total: string; change: number; sparkline: number[]; label: string }
  averageOrderValue: { total: string; change: number; sparkline: number[]; label: string }
  activeCampaigns: { total: number; change: number; sparkline: number[]; label: string }
  revenueTimeline: RevenuePoint[]
  orderStatusBreakdown: OrderStatusBreakdown[]
  topStores: StorePerformance[]
  bestSelling: ProductAnalytics[]
  lowStock: ProductAnalytics[]
  userTrend: UserAnalyticPoint[]
  recentActivities: Activity[]
  systemHealth: SystemHealthStatus[]
}

function seedRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function sparklineValues(base: number, variance: number, points: number): number[] {
  const rng = seedRandom(base)
  return Array.from({ length: points }, (_, i) => {
    const trend = Math.sin(i / 3) * variance * 0.5
    return Math.max(0, Math.round(base + trend + (rng() - 0.5) * variance))
  })
}

function monthsBack(n: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function formatVND(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return new Intl.NumberFormat('vi-VN').format(n)
}

const VIETNAMESE_NAMES = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức',
  'Hoàng Thị Em', 'Vũ Đức Phúc', 'Đặng Thị Giang', 'Bùi Văn Hải',
  'Đỗ Thị Hương', 'Ngô Văn Khánh', 'Dương Thị Lan', 'Lý Văn Minh',
]

const STORE_NAMES = [
  'Nông Sản Xanh Hà Nội', 'Đặc Sản Tây Bắc', 'Gạo Ngon Đồng Bằng',
  'Trái Cây Vườn Việt', 'Trà & Cà Phê Cao Nguyên', 'Rau Sạch Đà Lạt',
  'Hải Sản Khánh Hòa', 'Mật Ong Rừng Cát Bà', 'Nước Mắm Phú Quốc',
  'Chè Thái Nguyên', 'Yến Sào Nha Trang', 'Hạt Điều Bình Phước',
]

const PRODUCT_NAMES = [
  'Bưởi Đoan Hùng OCOP', 'Gạo Nếp Tú Lệ', 'Miến Dong Phia Đén',
  'Chè Tân Cương Thái Nguyên', 'Mật Ong Bạc Hà', 'Hồng Sấy Treo Đà Lạt',
  'Tỏi Đen Lý Sơn', 'Đông Trùng Hạ Thảo', 'Yến Sào Khánh Hòa',
  'Sâm Ngọc Linh Kon Tum', 'Thịt Trâu Gác Bếp', 'Măng Ớt Thác Bà',
  'Trà Dây Sapa', 'Dầu Dừa Bến Tre', 'Bột Trà Xanh Matcha',
]

const rng = seedRandom(42)

export const analyticsService = {
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    await new Promise(r => setTimeout(r, 600))

    const now = new Date()

    const revenueTimeline: RevenuePoint[] = Array.from({ length: 12 }, (_, i) => {
      const d = monthsBack(11 - i)
      return {
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        revenue: Math.round(80_000_000 + rng() * 120_000_000),
        orders: Math.round(200 + rng() * 300),
      }
    })

    const totalRevenue = revenueTimeline.reduce((s, p) => s + p.revenue, 0)
    const totalOrders = revenueTimeline.reduce((s, p) => s + p.orders, 0)

    const orderStatusBreakdown: OrderStatusBreakdown[] = [
      { status: 'Chờ xác nhận', count: Math.round(120 + rng() * 60), color: 'oklch(0.67 0.15 75)' },
      { status: 'Đang xử lý', count: Math.round(80 + rng() * 40), color: 'oklch(0.6 0.2 240)' },
      { status: 'Đang giao', count: Math.round(140 + rng() * 60), color: 'oklch(0.6 0.15 200)' },
      { status: 'Hoàn thành', count: Math.round(500 + rng() * 200), color: 'oklch(0.527 0.154 150)' },
      { status: 'Đã hủy', count: Math.round(20 + rng() * 15), color: 'oklch(0.55 0.2 20)' },
    ]

    const topStores: StorePerformance[] = STORE_NAMES.slice(0, 10).map((name, i) => ({
      id: `store-${i}`,
      name,
      logo: `https://picsum.photos/40/40?random=${10 + i}`,
      revenue: Math.round(30_000_000 + rng() * 120_000_000),
      orders: Math.round(50 + rng() * 300),
      rating: Math.round((4 + rng()) * 10) / 10,
    })).sort((a, b) => b.revenue - a.revenue)

    const bestSelling: ProductAnalytics[] = PRODUCT_NAMES.slice(0, 10).map((name, i) => ({
      id: `product-${i}`,
      name,
      image: `https://picsum.photos/40/40?random=${20 + i}`,
      price: Math.round(50_000 + rng() * 1_950_000),
      sold: Math.round(50 + rng() * 400),
      stock: Math.round(20 + rng() * 80),
      views: Math.round(500 + rng() * 5000),
      storeName: STORE_NAMES[i % STORE_NAMES.length],
    })).sort((a, b) => b.sold - a.sold)

    const lowStock: ProductAnalytics[] = bestSelling
      .map(p => ({ ...p, stock: Math.round(rng() * 10) }))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)

    const userTrend: UserAnalyticPoint[] = Array.from({ length: 90 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - 89 + i)
      return {
        date: formatDate(d),
        newUsers: Math.round(10 + rng() * 25),
        activeUsers: Math.round(80 + rng() * 60),
        returningUsers: Math.round(30 + rng() * 40),
      }
    })

    const recentActivities: Activity[] = [
      { id: 'a1', type: 'new_order', message: 'Đơn hàng mới #DH-3842', time: '2 phút trước', detail: '2 sản phẩm - 450.000đ' },
      { id: 'a2', type: 'new_user', message: 'Người dùng mới đăng ký', time: '5 phút trước', detail: VIETNAMESE_NAMES[0] },
      { id: 'a3', type: 'flash_sale', message: 'Flash Sale "Summer Sale" đã kích hoạt', time: '15 phút trước' },
      { id: 'a4', type: 'new_store', message: 'Cửa hàng mới đăng ký', time: '30 phút trước', detail: 'Đặc Sản Miền Tây' },
      { id: 'a5', type: 'new_campaign', message: 'Chiến dịch "Ngày Hội Nông Sản" được tạo', time: '1 giờ trước' },
      { id: 'a6', type: 'new_order', message: 'Đơn hàng mới #DH-3841', time: '1 giờ trước', detail: '5 sản phẩm - 1.250.000đ' },
      { id: 'a7', type: 'new_user', message: 'Người dùng mới đăng ký', time: '2 giờ trước', detail: VIETNAMESE_NAMES[1] },
      { id: 'a8', type: 'new_order', message: 'Đơn hàng mới #DH-3840', time: '3 giờ trước', detail: '1 sản phẩm - 180.000đ' },
    ]

    const systemHealth: SystemHealthStatus[] = [
      { name: 'Database', status: 'healthy', uptime: '99.99%', latency: '12ms' },
      { name: 'API Server', status: 'healthy', uptime: '99.95%', latency: '45ms' },
      { name: 'Redis Cache', status: 'healthy', uptime: '99.99%', latency: '2ms' },
      { name: 'Storage (S3)', status: 'healthy', uptime: '99.90%', latency: '80ms' },
      { name: 'CDN', status: 'degraded', uptime: '98.50%', latency: '250ms' },
      { name: 'Email Service', status: 'healthy', uptime: '99.80%', latency: '300ms' },
    ]

    return {
      revenue: {
        total: totalRevenue,
        change: 12.5,
        sparkline: sparklineValues(900, 300, 12),
        label: formatVND(totalRevenue),
      },
      orders: {
        total: totalOrders,
        change: 8.2,
        sparkline: sparklineValues(250, 80, 12),
        label: new Intl.NumberFormat('vi-VN').format(totalOrders),
      },
      products: {
        total: 156,
        change: 3.3,
        sparkline: sparklineValues(150, 10, 12),
        label: '156',
      },
      users: {
        total: 12450,
        change: 15.3,
        sparkline: sparklineValues(12000, 1000, 12),
        label: '12.450',
      },
      stores: {
        total: 48,
        change: 4.3,
        sparkline: sparklineValues(45, 5, 12),
        label: '48',
      },
      conversionRate: {
        total: '3.2%',
        change: -0.4,
        sparkline: sparklineValues(30, 8, 12),
        label: '3.2%',
      },
      averageOrderValue: {
        total: formatVND(325000),
        change: 3.1,
        sparkline: sparklineValues(300, 40, 12),
        label: formatVND(325000),
      },
      activeCampaigns: {
        total: 5,
        change: 66.7,
        sparkline: sparklineValues(3, 2, 12),
        label: '5',
      },
      revenueTimeline,
      orderStatusBreakdown,
      topStores,
      bestSelling,
      lowStock,
      userTrend,
      recentActivities,
      systemHealth,
    }
  },
}
