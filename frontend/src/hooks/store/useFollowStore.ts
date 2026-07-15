import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storeService } from '@/services/store.service'
import useUserStore from '@/stores/useUserStore'

export function useFollowStatus(storeId: string | undefined) {
  const { isAuthenticated } = useUserStore()

  return useQuery({
    queryKey: ['followStatus', storeId],
    queryFn: () => storeService.checkFollowStatus(storeId!),
    enabled: !!storeId && isAuthenticated,
    retry: false,
  })
}

export function useFollowStore(storeId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => storeService.followStore(storeId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', storeId] })
      queryClient.invalidateQueries({ queryKey: ['store', storeId] })
    },
  })
}

export function useUnfollowStore(storeId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => storeService.unfollowStore(storeId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', storeId] })
      queryClient.invalidateQueries({ queryKey: ['store', storeId] })
    },
  })
}

export function useFollowedStores(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['followedStores', params],
    queryFn: () => storeService.getFollowedStores(params),
  })
}

export function useStoreFollowers(storeId: string | undefined, params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['storeFollowers', storeId, params],
    queryFn: () => storeService.getStoreFollowers(storeId!, params),
    enabled: !!storeId,
  })
}

