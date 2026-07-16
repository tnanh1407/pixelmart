import { NavLink } from 'react-router-dom'
import {
  ShoppingBag,
  Star,
  User,
  Shield,
  Bell,
  FileText,
  MessageSquare,
  Heart,
  Wallet,
  RefreshCw,
  AlertTriangle,
  Truck,
  Flag,
  Headphones,
  MessageCircle,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import useUserStore from '@/stores/useUserStore'

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

interface SidebarItem {
  name: string
  path: string
  icon: React.ComponentType<{ size?: number }>
}

const menuSections: SidebarSection[] = [
  {
    title: 'Quản lý đơn hàng',
    items: [
      { name: 'Đơn hàng', path: '/user/orders', icon: ShoppingBag },
      { name: 'Đánh giá', path: '/user/reviews', icon: Star },
    ],
  },
  {
    title: 'Quản lý tài khoản',
    items: [
      { name: 'Tài khoản', path: '/user/profile', icon: User },
      { name: 'Bảo mật tài khoản', path: '/user/security', icon: Shield },
      { name: 'Thông báo', path: '/user/notifications', icon: Bell },
      { name: 'Quản lý hóa đơn', path: '/user/invoices', icon: FileText },
      { name: 'Tin nhắn', path: '/user/messages', icon: MessageSquare },
      { name: 'Yêu thích', path: '/user/wishlist', icon: Heart },
    ],
  },
  {
    title: 'Quản lý tài chính',
    items: [
      { name: 'Voucher của tôi', path: '/user/vouchers', icon: Wallet },
    ],
  },
  {
    title: 'Hỗ trợ khách hàng',
    items: [
      { name: 'Hoàn tiền', path: '/user/refunds', icon: RefreshCw },
      { name: 'Khiếu nại sản phẩm', path: '/user/complaints', icon: AlertTriangle },
      { name: 'Tư vấn hàng hóa', path: '/user/consulting', icon: Truck },
      { name: 'Báo cáo vi phạm', path: '/user/reports', icon: Flag },
      { name: 'Dịch vụ khách hàng', path: '/user/customer-service', icon: Headphones },
      { name: 'Phản hồi', path: '/user/feedback', icon: MessageCircle },
    ],
  },
]

export default function UserSidebar() {
  const { user, logout } = useUserStore()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-primary">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User size={24} className="text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{user?.name || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-2">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {section.title}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'text-primary bg-primary/5 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    )
                  }
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 rounded transition-colors"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
