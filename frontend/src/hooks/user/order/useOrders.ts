import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orderService } from '@/services/user/order.service'
import type { CheckoutPayload } from '@/types/order.types'

export function useOrders(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrders(params),
    staleTime: 60 * 1000,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  })
}

export function useOrderMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] })
    queryClient.invalidateQueries({ queryKey: ['cart'] })
    queryClient.invalidateQueries({ queryKey: ['cart-count'] })
  }

  const checkout = useMutation({
    mutationFn: (payload: CheckoutPayload) => orderService.checkout(payload),
    onSuccess: () => { invalidate(); toast.success('Đặt hàng thành công!') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi đặt hàng'),
  })

  const cancelOrder = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => orderService.cancelOrder(id, reason),
    onSuccess: () => { invalidate(); toast.success('Đã hủy đơn hàng') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi hủy đơn'),
  })

  return { checkout, cancelOrder }
}
