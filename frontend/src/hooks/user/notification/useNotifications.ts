import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/user/notification.service'

export function useNotifications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
    staleTime: 30 * 1000,
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 60 * 1000,
  })
}

export function useNotificationMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    queryClient.invalidateQueries({ queryKey: ['unread-count'] })
  }

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => invalidate(),
  })

  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => invalidate(),
  })

  const deleteNotification = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => invalidate(),
  })

  const deleteAll = useMutation({
    mutationFn: () => notificationService.deleteAllNotifications(),
    onSuccess: () => invalidate(),
  })

  return { markAsRead, markAllAsRead, deleteNotification, deleteAll }
}
