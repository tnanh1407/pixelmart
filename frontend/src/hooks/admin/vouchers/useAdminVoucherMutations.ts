import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'

export function useAdminVoucherMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: any) => adminService.createVoucher(payload),
    onSuccess: () => { invalidate(); toast.success('Tạo voucher thành công') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi tạo voucher'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminService.updateVoucher(id, payload),
    onSuccess: () => { invalidate(); toast.success('Cập nhật voucher thành công') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi cập nhật'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteVoucher(id),
    onSuccess: () => { invalidate(); toast.success('Đã xóa voucher') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi xóa'),
  })

  return { createMutation, updateMutation, deleteMutation }
}
