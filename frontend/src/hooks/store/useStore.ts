import { useQuery } from '@tanstack/react-query'
import { storeService } from '@/services/store.service'

export function useStore(id: string | undefined) {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => storeService.getStoreById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export default useStore
