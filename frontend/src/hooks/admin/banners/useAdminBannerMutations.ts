import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'

export function useAdminBannerMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: any) => adminService.createBanner(payload),
    onSuccess: () => { invalidate(); toast.success('Tạo banner thành công') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi tạo banner'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminService.updateBanner(id, payload),
    onSuccess: () => { invalidate(); toast.success('Cập nhật banner thành công') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi cập nhật'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => { invalidate(); toast.success('Đã xóa banner') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi xóa'),
  })

  return { createMutation, updateMutation, deleteMutation }
}
