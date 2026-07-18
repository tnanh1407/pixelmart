import {
  LayoutDashboard, TrendingUp,
  Package, Tags, Store, ShoppingCart, Undo2, UserCheck,
  Megaphone, Zap, Ticket, Image,
  Users, ShieldCheck,
  Star, Heart, MessageCircle, Bell,
  CreditCard, BarChart3, Settings,
  UserRound, KeyRound, LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  id: string
  title: string
  url: string
  icon: LucideIcon
  badge?: string | number
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  end?: boolean
  children?: SidebarItem[]
  roles?: string[]
  permissions?: string[]
}

export interface SidebarSection {
  id: string
  title: string
  icon?: LucideIcon
  items: SidebarItem[]
  defaultOpen?: boolean
  roles?: string[]
}

export interface SidebarFooterAction {
  id: string
  label: string
  icon: LucideIcon
  type: 'link' | 'action'
  url?: string
  onClick?: () => void
  variant?: 'default' | 'destructive'
  separatorBefore?: boolean
}

export interface SidebarWorkspace {
  name: string
  logo: string
  subtitle?: string
}

export const workspaceConfig: SidebarWorkspace = {
  name: 'PixelMart',
  logo: '/core/logo_web.svg',
  subtitle: 'Admin Panel',
}

export const sidebarConfig: SidebarSection[] = [
  {
    id: 'overview',
    title: 'Tổng quan',
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        url: '/admin',
        icon: LayoutDashboard,
        end: true,
      },
      {
        id: 'analytics',
        title: 'Phân tích',
        url: '/admin/analytics',
        icon: TrendingUp,
      },
    ],
  },
  {
    id: 'commerce',
    title: 'Thương mại',
    icon: ShoppingCart,
    defaultOpen: true,
    items: [
      {
        id: 'products',
        title: 'Sản phẩm',
        url: '/admin/products',
        icon: Package,
      },
      {
        id: 'categories',
        title: 'Danh mục',
        url: '/admin/categories',
        icon: Tags,
      },
      {
        id: 'stores',
        title: 'Cửa hàng',
        url: '/admin/stores',
        icon: Store,
      },
      {
        id: 'vendors',
        title: 'Người bán',
        url: '/admin/vendors',
        icon: UserCheck,
      },
      {
        id: 'orders',
        title: 'Đơn hàng',
        url: '/admin/orders',
        icon: ShoppingCart,
      },
      {
        id: 'returns',
        title: 'Trả hàng/Hoàn tiền',
        url: '/admin/returns',
        icon: Undo2,
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    icon: Megaphone,
    defaultOpen: false,
    items: [
      {
        id: 'campaigns',
        title: 'Chiến dịch',
        url: '/admin/campaigns',
        icon: Megaphone,
      },
      {
        id: 'flash-sales',
        title: 'Flash Sale',
        url: '/admin/flash-sales',
        icon: Zap,
      },
      {
        id: 'vouchers',
        title: 'Mã giảm giá',
        url: '/admin/vouchers',
        icon: Ticket,
      },
      {
        id: 'banners',
        title: 'Banner',
        url: '/admin/banners',
        icon: Image,
      },
    ],
  },
  {
    id: 'users',
    title: 'Người dùng',
    icon: Users,
    defaultOpen: false,
    items: [
      {
        id: 'customers',
        title: 'Khách hàng',
        url: '/admin/users',
        icon: Users,
      },
      {
        id: 'staff',
        title: 'Quản trị viên',
        url: '/admin/admins',
        icon: ShieldCheck,
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'content',
    title: 'Nội dung & Tương tác',
    icon: MessageCircle,
    defaultOpen: false,
    items: [
      {
        id: 'reviews',
        title: 'Đánh giá',
        url: '/admin/reviews',
        icon: Star,
      },
      {
        id: 'wishlists',
        title: 'Yêu thích',
        url: '/admin/wishlists',
        icon: Heart,
      },
      {
        id: 'chat',
        title: 'Tin nhắn',
        url: '/admin/chat',
        icon: MessageCircle,
      },
      {
        id: 'notifications',
        title: 'Thông báo',
        url: '/admin/notifications',
        icon: Bell,
      },
    ],
  },
  {
    id: 'system',
    title: 'Hệ thống',
    icon: Settings,
    defaultOpen: false,
    items: [
      {
        id: 'payments',
        title: 'Thanh toán',
        url: '/admin/payments',
        icon: CreditCard,
      },
      {
        id: 'reports',
        title: 'Báo cáo',
        url: '/admin/reports',
        icon: BarChart3,
        roles: ['admin'],
      },
      {
        id: 'settings',
        title: 'Cài đặt',
        url: '/admin/settings',
        icon: Settings,
        roles: ['admin'],
      },
    ],
  },
]

export const footerActions: SidebarFooterAction[] = [
  {
    id: 'profile',
    label: 'Hồ sơ cá nhân',
    icon: UserRound,
    type: 'link',
    url: '/user/profile',
  },
  {
    id: 'change-password',
    label: 'Đổi mật khẩu',
    icon: KeyRound,
    type: 'link',
    url: '/user/change-password',
    separatorBefore: true,
  },
  {
    id: 'logout',
    label: 'Đăng xuất',
    icon: LogOut,
    type: 'action',
    variant: 'destructive',
    separatorBefore: true,
  },
]

export function filterSidebarConfig(
  sections: SidebarSection[],
  query: string,
  role?: string,
): SidebarSection[] {
  if (!query && !role) return sections

  const lowerQuery = query.toLowerCase().trim()

  return sections
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => {
          if (role && item.roles && !item.roles.includes(role)) return false
          return true
        })
        .filter((item) => {
          if (!lowerQuery) return true
          const titleMatch = item.title.toLowerCase().includes(lowerQuery)
          const sectionMatch = section.title.toLowerCase().includes(lowerQuery)
          const childMatch = item.children?.some(
            (child) => child.title.toLowerCase().includes(lowerQuery)
          )
          return titleMatch || sectionMatch || childMatch
        }),
    }))
    .filter((section) => section.items.length > 0)
}
