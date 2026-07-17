import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

import { adminService, type StoreListResponse } from '@/services/admin/admin.service'

export interface AdminStoreForm {
  name: string
  logo?: string
  description?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    ward?: string
    district?: string
    city?: string
  }
  isVerified: boolean
  isActive: boolean
  ownerId: unknown
}

type StoreItem = StoreListResponse['stores'][number]

interface UseAdminStoreMutationsOptions {
  stores?: StoreItem[]
  onSaved?: () => void
}

const swalClass = {
  popup: '!rounded-xl',
  confirmButton: '!rounded-lg !px-6',
}

export function useAdminStoreMutations({
  stores = [],
  onSaved,
}: UseAdminStoreMutationsOptions = {}) {
  const queryClient = useQueryClient()

  const invalidateStores = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
  }

  const toggleVerifiedMutation = useMutation({
    mutationFn: (id: string) => {
      const store = stores.find((item) => item._id === id)
      return adminService.updateStore(id, { isVerified: !store?.isVerified })
    },
    onSuccess: () => {
      invalidateStores()
      toast.success('Cập nhật trạng thái xác minh thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => {
      const store = stores.find((item) => item._id === id)
      return adminService.updateStore(id, { isActive: !store?.isActive })
    },
    onSuccess: () => {
      invalidateStores()
      toast.success('Cập nhật trạng thái hoạt động thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const createStoreMutation = useMutation({
    mutationFn: (payload: AdminStoreForm) => adminService.createStore(payload),
    onSuccess: () => {
      invalidateStores()
      Swal.fire({
        title: 'Thành công!',
        text: 'Thêm mới cửa hàng thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: swalClass,
      })
      onSaved?.()
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      Swal.fire({
        title: 'Thất bại!',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi tạo cửa hàng.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
        customClass: swalClass,
      })
    },
  })

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminStoreForm }) =>
      adminService.updateStore(id, payload),
    onSuccess: () => {
      invalidateStores()
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật cửa hàng thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: swalClass,
      })
      onSaved?.()
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      Swal.fire({
        title: 'Thất bại!',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật cửa hàng.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
        customClass: swalClass,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteStore(id),
    onSuccess: () => {
      invalidateStores()
      toast.success('Xóa cửa hàng thành công')
    },
    onError: () => toast.error('Không thể xóa cửa hàng'),
  })

  return {
    toggleVerifiedMutation,
    toggleActiveMutation,
    createStoreMutation,
    updateStoreMutation,
    deleteMutation,
  }
}
