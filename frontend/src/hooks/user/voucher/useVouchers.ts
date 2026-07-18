import { useQuery } from '@tanstack/react-query'
import { voucherService } from '@/services/user/voucher.service'

export function useAvailableVouchers(params?: { storeId?: string; orderValue?: number }) {
  return useQuery({
    queryKey: ['available-vouchers', params],
    queryFn: () => voucherService.getAvailableVouchers(params),
    enabled: !!params?.orderValue || !!params?.storeId,
    staleTime: 60 * 1000,
  })
}
