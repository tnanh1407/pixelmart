import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { adminService } from '@/services/admin/admin.service'
import type { IProduct } from '@/types/product.types'

export function useAdminProductMutations(products: IProduct[]) {
  const queryClient = useQueryClient()

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] })
  }

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateProduct(id, { isActive }),
    onSuccess: () => {
      invalidateProducts()
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => {
      const product = products.find((item) => item._id === id)
      return adminService.updateProduct(id, { isFeatured: !product?.isFeatured })
    },
    onSuccess: () => {
      invalidateProducts()
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      invalidateProducts()
      toast.success('Xóa sản phẩm thành công')
    },
    onError: () => toast.error('Không thể xóa sản phẩm'),
  })

  return {
    toggleActiveMutation,
    toggleFeaturedMutation,
    deleteMutation,
  }
}
