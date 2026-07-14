import { useQuery } from '@tanstack/react-query'
import { storeService } from '@/services/store.service'
import useUserStore from '@/stores/useUserStore'

export function useMyStore() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['myStore'],
    queryFn: () => storeService.getMyStore(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export default useMyStore
