import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { adminService } from '@/services/admin/admin.service'
import type { ICampaign } from '@/types/campaign.types'

export type AdminCampaignPayload = Partial<ICampaign> & { title?: string }

interface UseAdminCampaignMutationsOptions {
  detailId?: string
  onSaved?: () => void
}

export function useAdminCampaignMutations({
  detailId,
  onSaved,
}: UseAdminCampaignMutationsOptions = {}) {
  const queryClient = useQueryClient()

  const invalidateCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] })
    if (detailId) {
      queryClient.invalidateQueries({ queryKey: ['admin-campaign-detail', detailId] })
    }
  }

  const createMutation = useMutation({
    mutationFn: (payload: AdminCampaignPayload & { title: string }) => adminService.createCampaign(payload),
    onSuccess: () => {
      invalidateCampaigns()
      toast.success("Tạo chiến dịch mới thành công", { closeButton: true })
      onSaved?.()
    },
    onError: () => toast.error("Tạo chiến dịch không thành công", { closeButton: true }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminCampaignPayload }) =>
      adminService.updateCampaign(id, payload),
    onSuccess: () => {
      invalidateCampaigns()
      toast.success("Cập nhật chiến dịch thành công", { closeButton: true })
      onSaved?.()
    },
    onError: () => toast.error("Cập nhật chiến dịch không thành công", { closeButton: true }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCampaign(id),
    onSuccess: () => {
      invalidateCampaigns()
      toast.success("Xóa chiến dịch thành công", { closeButton: true })
    },
    onError: () => toast.error("Xóa chiến dịch không thành công", { closeButton: true }),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateCampaign(id, { isActive }),
    onSuccess: () => {
      invalidateCampaigns()
      toast.success('Cập nhật thành công', { closeButton: true })
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
