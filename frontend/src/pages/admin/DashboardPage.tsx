import { useQuery } from '@tanstack/react-query'
import { Users, Package, Store, Tag, TrendingUp, Activity, ShoppingCart, BarChart3 } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/admin/shared'

const formatNumber = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
    staleTime: 30 * 1000,
  })

  const statCards = [
    { name: 'Tổng người dùng', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-blue-500', bgColor: 'bg-blue-50', link: '/admin/users' },
    { name: 'Tổng sản phẩm', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-green-500', bgColor: 'bg-green-50', link: '/admin/products' },
    { name: 'Tổng cửa hàng', value: stats?.totalStores ?? 0, icon: Store, color: 'bg-purple-500', bgColor: 'bg-purple-50', link: '/admin/stores' },
    { name: 'Danh mục', value: stats?.totalCategories ?? 0, icon: Tag, color: 'bg-orange-500', bgColor: 'bg-orange-50', link: '/admin/categories' },
  ]

  const quickLinks = [
    { name: 'Quản lý người dùng', path: '/admin/users', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { name: 'Quản lý sản phẩm', path: '/admin/products', icon: Package, color: 'text-green-600 bg-green-50' },
    { name: 'Quản lý cửa hàng', path: '/admin/stores', icon: Store, color: 'text-purple-600 bg-purple-50' },
    { name: 'Quản lý danh mục', path: '/admin/categories', icon: Tag, color: 'text-orange-600 bg-orange-50' },
    { name: 'Quản lý chiến dịch', path: '/admin/campaigns', icon: BarChart3, color: 'text-pink-600 bg-pink-50' },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Tổng quan hệ thống PixelMart"
        action={
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Activity size={16} className="text-green-500" />
            <span>Hệ thống hoạt động tốt</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.name} to={stat.link} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{stat.name}</p>
                {isLoading ? (
                  <div className="h-8 w-20 bg-gray-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-text mt-1">{formatNumber(stat.value)}</p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-text mb-4">Truy cập nhanh</h2>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link key={link.path} to={link.path} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className={`${link.color} p-2 rounded-lg`}><link.icon size={18} /></div>
                <span className="text-sm font-medium text-text group-hover:text-text">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Người dùng gần đây</h2>
            <Link to="/admin/users" className="text-sm text-primary hover:text-primary-hover font-medium">Xem tất cả</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : stats?.recentUsers && stats.recentUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.recentUsers.map((user: any) => (
                <div key={user._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-indigo-600 font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text text-sm">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' : user.role === 'vendor' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>{user.role}</span>
                    <p className="text-xs text-text-muted mt-0.5">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-text mb-4">Thông tin hệ thống</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ShoppingCart size={24} className="mx-auto text-text-muted mb-2" />
            <p className="text-xs text-text-muted">Banner hoạt động</p>
            <p className="text-lg font-bold text-text">{stats?.totalCampaigns ?? 0}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Store size={24} className="mx-auto text-text-muted mb-2" />
            <p className="text-xs text-text-muted">Cửa hàng hoạt động</p>
            <p className="text-lg font-bold text-text">{stats?.activeStores ?? 0}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Package size={24} className="mx-auto text-text-muted mb-2" />
            <p className="text-xs text-text-muted">Sản phẩm đang bán</p>
            <p className="text-lg font-bold text-text">{stats?.activeProducts ?? 0}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp size={24} className="mx-auto text-text-muted mb-2" />
            <p className="text-xs text-text-muted">Người dùng hoạt động</p>
            <p className="text-lg font-bold text-text">{stats?.activeUsers ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
