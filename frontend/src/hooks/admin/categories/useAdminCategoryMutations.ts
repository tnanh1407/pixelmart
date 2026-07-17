import { useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

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

const swalClass = {
  popup: '!rounded-xl',
  confirmButton: '!rounded-lg !px-6',
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
      Swal.fire({
        title: 'Thành công!',
        text: 'Thêm mới danh mục thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: swalClass,
      })
      onSaved?.()
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Có lỗi xảy ra khi tạo danh mục.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: swalClass,
    }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminCategoryForm> }) =>
      adminService.updateCategory(id, payload),
    onSuccess: () => {
      invalidateCategories()
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật danh mục thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: swalClass,
      })
      onSaved?.()
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Có lỗi xảy ra khi cập nhật danh mục.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: swalClass,
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      invalidateCategories()
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Xóa danh mục thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: swalClass,
      })
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Không thể xóa danh mục.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: swalClass,
    }),
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
