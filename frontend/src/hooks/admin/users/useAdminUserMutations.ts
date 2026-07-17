import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { adminService } from '@/services/admin/admin.service'

export function useAdminUserMutations() {
  const queryClient = useQueryClient()

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  }

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserActive(id),
    onSuccess: () => {
      invalidateUsers()
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      invalidateUsers()
      toast.success('Xóa người dùng thành công')
    },
    onError: () => toast.error('Không thể xóa người dùng'),
  })

  return {
    toggleActiveMutation,
    deleteMutation,
  }
}
