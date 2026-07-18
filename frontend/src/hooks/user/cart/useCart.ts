import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cartService } from '@/services/user/cart.service'
import type { AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    staleTime: 30 * 1000,
  })
}

export function useCartCount() {
  return useQuery({
    queryKey: ['cart-count'],
    queryFn: () => cartService.getCartCount(),
    refetchInterval: 30 * 1000,
  })
}

export function useCartMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] })
    queryClient.invalidateQueries({ queryKey: ['cart-count'] })
  }

  const addToCart = useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addToCart(payload),
    onSuccess: () => { invalidate(); toast.success('Đã thêm vào giỏ hàng') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi thêm vào giỏ hàng'),
  })

  const updateItem = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCartItemPayload }) => cartService.updateCartItem(id, payload),
    onSuccess: () => invalidate(),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi cập nhật'),
  })

  const removeItem = useMutation({
    mutationFn: (id: string) => cartService.removeFromCart(id),
    onSuccess: () => { invalidate(); toast.success('Đã xóa khỏi giỏ hàng') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi xóa'),
  })

  const clearCart = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => invalidate(),
  })

  const selectAll = useMutation({
    mutationFn: (selected: boolean) => cartService.selectAllItems(selected),
    onSuccess: () => invalidate(),
  })

  return { addToCart, updateItem, removeItem, clearCart, selectAll }
}
