import {
  LayoutDashboard, TrendingUp,
  Package, Tags, Store, ShoppingCart, Undo2, UserCheck,
  Megaphone, Zap, Ticket, Image,
  Users, Star, Bell, BarChart3, Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  id: string
  title: string
  url: string
  icon: LucideIcon
  end?: boolean
}

export interface SidebarGroup {
  label: string
  items: SidebarItem[]
  defaultOpen?: boolean
}

export const navGroups: SidebarGroup[] = [
  {
    label: 'Tổng quan',
    items: [
      { id: 'dashboard', title: 'Dashboard', url: '/admin', icon: LayoutDashboard, end: true },
      { id: 'analytics', title: 'Phân tích', url: '/admin/analytics', icon: TrendingUp },
    ],
  },
  {
    label: 'Thương mại',
    items: [
      { id: 'products', title: 'Sản phẩm', url: '/admin/products', icon: Package },
      { id: 'categories', title: 'Danh mục', url: '/admin/categories', icon: Tags },
      { id: 'stores', title: 'Cửa hàng', url: '/admin/stores', icon: Store },
      { id: 'orders', title: 'Đơn hàng', url: '/admin/orders', icon: ShoppingCart },
      { id: 'returns', title: 'Trả hàng/Hoàn tiền', url: '/admin/returns', icon: Undo2 },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { id: 'campaigns', title: 'Chiến dịch', url: '/admin/campaigns', icon: Megaphone },
      { id: 'flash-sales', title: 'Siêu giảm giá', url: '/admin/flash-sales', icon: Zap },
      { id: 'vouchers', title: 'Mã giảm giá', url: '/admin/vouchers', icon: Ticket },
    ],
  },
  {
    label: 'Người dùng',
    items: [
      { id: 'users', title: 'Khách hàng', url: '/admin/users', icon: Users },
    ],
  },
  {
    label: 'Nội dung',
    defaultOpen: false,
    items: [
      { id: 'reviews', title: 'Đánh giá', url: '/admin/reviews', icon: Star },
      { id: 'notifications', title: 'Thông báo', url: '/admin/notifications', icon: Bell },
    ],
  },
  {
    label: 'Hệ thống',
    defaultOpen: false,
    items: [
      { id: 'reports', title: 'Báo cáo', url: '/admin/reports', icon: BarChart3 },
      { id: 'settings', title: 'Cài đặt', url: '/admin/settings', icon: Settings },
    ],
  },
]
