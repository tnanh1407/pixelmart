import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
      toast.success('Cập nhật trạng thái xác minh thành công', { closeButton: true })
    },
    onError: () => toast.error('Có lỗi xảy ra', { closeButton: true }),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateStore(id, { isActive }),
    onSuccess: () => {
      invalidateStores()
      toast.success('Cập nhật trạng thái hoạt động thành công', { closeButton: true })
    },
    onError: () => toast.error('Có lỗi xảy ra', { closeButton: true }),
  })

  const createStoreMutation = useMutation({
    mutationFn: (payload: AdminStoreForm) => adminService.createStore(payload),
    onSuccess: () => {
      invalidateStores()
      toast.success('Thêm mới cửa hàng thành công', { closeButton: true })
      onSaved?.()
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo cửa hàng', { closeButton: true })
    },
  })

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminStoreForm }) =>
      adminService.updateStore(id, payload),
    onSuccess: () => {
      invalidateStores()
      toast.success('Cập nhật cửa hàng thành công', { closeButton: true })
      onSaved?.()
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật cửa hàng', { closeButton: true })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteStore(id),
    onSuccess: () => {
      invalidateStores()
      toast.success('Xóa cửa hàng thành công', { closeButton: true })
    },
    onError: () => toast.error('Không thể xóa cửa hàng', { closeButton: true }),
  })

  return {
    toggleVerifiedMutation,
    toggleActiveMutation,
    createStoreMutation,
    updateStoreMutation,
    deleteMutation,
  }
}
