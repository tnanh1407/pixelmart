import api from "../client"
import type { INotification, NotificationListResponse } from '@/types/notification.types'

export const notificationService = {
  async getNotifications(params?: Record<string, unknown>): Promise<NotificationListResponse> {
    const { data } = await api.get('/notifications', { params })
    return data.data || data
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get('/notifications/unread-count')
    return data.data?.count || data.data || 0
  },

  async markAsRead(id: string): Promise<INotification> {
    const { data } = await api.patch(`/notifications/${id}/read`)
    return data.data
  },

  async markAllAsRead() {
    const { data } = await api.patch('/notifications/read-all')
    return data
  },

  async deleteNotification(id: string) {
    const { data } = await api.delete(`/notifications/${id}`)
    return data
  },

  async deleteAllNotifications() {
    const { data } = await api.delete('/notifications')
    return data
  },
}
