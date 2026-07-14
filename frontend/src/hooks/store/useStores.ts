import { useQuery } from '@tanstack/react-query'
import { storeService } from '@/services/store.service'
import type { GetStoresParams } from '@/types/store.types'

export function useStores(params: GetStoresParams = {}) {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => storeService.getStores(params),
    staleTime: 2 * 60 * 1000,
  })
}

export default useStores
