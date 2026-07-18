import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'

export function useAdminVendorMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })
  }

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveVendor(id),
    onSuccess: () => { invalidate(); toast.success('Đã duyệt người bán') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi duyệt'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminService.rejectVendor(id, reason),
    onSuccess: () => { invalidate(); toast.success('Đã từ chối người bán') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi từ chối'),
  })

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminService.suspendVendor(id, reason),
    onSuccess: () => { invalidate(); toast.success('Đã khóa người bán') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi khóa'),
  })

  return { approveMutation, rejectMutation, suspendMutation }
}
