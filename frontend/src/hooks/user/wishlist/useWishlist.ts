import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { wishlistService } from '@/services/user/wishlist.service'

export function useWishlist(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['wishlist', params],
    queryFn: () => wishlistService.getWishlist(params),
    staleTime: 60 * 1000,
  })
}

export function useCheckWishlist(productId: string) {
  return useQuery({
    queryKey: ['wishlist-check', productId],
    queryFn: () => wishlistService.checkWishlist(productId),
    enabled: !!productId,
  })
}

export function useWishlistMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    queryClient.invalidateQueries({ queryKey: ['wishlist-check'] })
  }

  const addToWishlist = useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    onSuccess: () => { invalidate(); toast.success('Đã thêm vào yêu thích') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi thêm vào yêu thích'),
  })

  const removeFromWishlist = useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => { invalidate(); toast.success('Đã xóa khỏi yêu thích') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi xóa'),
  })

  return { addToWishlist, removeFromWishlist }
}
