export type NotificationType = "order" | "promotion" | "system" | "chat" | "review" | "vendor"

export interface INotification {
  _id: string
  userId: string
  senderId?: string | { _id: string; name: string; avatar?: string }
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  link?: string
  metadata?: Record<string, unknown>
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationListResponse {
  notifications: INotification[]
  unreadCount: number
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
