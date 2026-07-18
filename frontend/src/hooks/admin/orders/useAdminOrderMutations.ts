import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'

export function useAdminOrderMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  }

  const updateStatus = useMutation({
    mutationFn: ({ id, status, cancelReason }: { id: string; status: string; cancelReason?: string }) =>
      adminService.updateOrderStatus(id, status, cancelReason),
    onSuccess: () => { invalidate(); toast.success('Cập nhật trạng thái thành công') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi cập nhật'),
  })

  const updatePayment = useMutation({
    mutationFn: ({ id, paymentStatus, transactionId }: { id: string; paymentStatus: string; transactionId?: string }) =>
      adminService.updatePaymentStatus(id, paymentStatus, transactionId),
    onSuccess: () => { invalidate(); toast.success('Cập nhật thanh toán thành công') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi cập nhật'),
  })

  return { updateStatus, updatePayment }
}
