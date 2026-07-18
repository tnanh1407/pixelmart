import { useState } from 'react'
import { useNotifications, useNotificationMutations } from '@/hooks/user/notification'
import { PageContainer, PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/admin/shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  ShoppingCart, Megaphone, Settings, Star, Store, Bell,
} from 'lucide-react'
import type { INotification, NotificationType } from '@/types/notification.types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const TYPE_ICONS: Record<NotificationType, typeof ShoppingCart> = {
  order: ShoppingCart,
  promotion: Megaphone,
  system: Settings,
  review: Star,
  vendor: Store,
}

const TYPE_LABELS: Record<string, string> = {
  order: 'Đơn hàng',
  promotion: 'Khuyến mãi',
  system: 'Hệ thống',
  review: 'Đánh giá',
  vendor: 'Cửa hàng',
}

function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: INotification
  onMarkRead: (id: string) => void
}) {
  const Icon = TYPE_ICONS[notification.type] || Bell

  return (
    <button
      type="button"
      onClick={() => !notification.isRead && onMarkRead(notification._id)}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
        !notification.isRead && 'bg-primary/5',
        notification.isRead && 'opacity-60',
      )}
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          !notification.isRead ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm',
              !notification.isRead ? 'font-semibold text-foreground' : 'text-foreground',
            )}
          >
            {notification.title}
          </span>
          {!notification.isRead && <span className="size-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-auto">
            {TYPE_LABELS[notification.type] || notification.type}
          </Badge>
          <span className="text-xs text-muted-foreground">{dayjs(notification.createdAt).fromNow()}</span>
        </div>
      </div>
    </button>
  )
}

type TabKey = 'all' | 'unread' | 'read'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
  { key: 'read', label: 'Đã đọc' },
]

export default function NotificationListPage() {
  const [tab, setTab] = useState<TabKey>('all')

  const params: Record<string, unknown> = {}
  if (tab === 'unread') params.isRead = false
  if (tab === 'read') params.isRead = true

  const { data, isLoading, isError, refetch } = useNotifications(params)
  const { markAsRead } = useNotificationMutations()

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount ?? 0

  return (
    <PageContainer>
      <PageHeader
        title="Thông báo"
        description="Quản lý thông báo hệ thống"
        action={
          <Badge variant="secondary" className="text-sm px-3 py-1 gap-1.5">
            <Bell size={14} />
            {unreadCount} chưa đọc
          </Badge>
        }
      />

      <div className="flex items-center gap-1 mb-4 bg-muted rounded-lg p-0.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex items-center px-3 py-1.5 text-sm rounded-md transition-colors',
              tab === t.key
                ? 'bg-card text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            {t.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState type="skeleton" rows={6} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            message="Không có thông báo"
            description={
              tab !== 'all'
                ? 'Không có thông báo trong bộ lọc này'
                : 'Bạn chưa có thông báo nào'
            }
          />
        ) : (
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {notifications.map((n) => (
              <NotificationCard
                key={n._id}
                notification={n}
                onMarkRead={(id) => markAsRead.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
