import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { adminService } from '@/services/admin/admin.service'

export interface AdminCategoryForm {
  name: string
  description?: string
  image?: string
}

interface UseAdminCategoryMutationsOptions {
  detailId?: string
  onSaved?: () => void
}

export function useAdminCategoryMutations({
  detailId,
  onSaved,
}: UseAdminCategoryMutationsOptions = {}) {
  const queryClient = useQueryClient()

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    if (detailId) {
      queryClient.invalidateQueries({ queryKey: ['admin-category-detail', detailId] })
    }
  }

  const createMutation = useMutation({
    mutationFn: (payload: AdminCategoryForm) => adminService.createCategory(payload),
    onSuccess: () => {
      invalidateCategories()
      toast.success('Thêm mới danh mục thành công', { closeButton: true })
      onSaved?.()
    },
    onError: () => toast.error('Có lỗi xảy ra khi tạo danh mục', { closeButton: true }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminCategoryForm> }) =>
      adminService.updateCategory(id, payload),
    onSuccess: () => {
      invalidateCategories()
      toast.success('Cập nhật danh mục thành công', { closeButton: true })
      onSaved?.()
    },
    onError: () => toast.error('Có lỗi xảy ra khi cập nhật danh mục', { closeButton: true }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      invalidateCategories()
      toast.success('Xóa danh mục thành công', { closeButton: true })
    },
    onError: () => toast.error('Không thể xóa danh mục', { closeButton: true }),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateCategory(id, { isActive }),
    onSuccess: () => {
      invalidateCategories()
      toast.success('Cập nhật trạng thái thành công', { closeButton: true })
    },
    onError: () => toast.error('Có lỗi xảy ra', { closeButton: true }),
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleActiveMutation,
  }
}
