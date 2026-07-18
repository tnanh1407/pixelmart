import api from "../client"
import type { IWishlistItem, WishlistListResponse } from '@/types/wishlist.types'

export const wishlistService = {
  async getWishlist(params?: Record<string, unknown>): Promise<WishlistListResponse> {
    const { data } = await api.get('/wishlist', { params })
    return {
      items: data.items || data.data || [],
      pagination: data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  },

  async addToWishlist(productId: string): Promise<IWishlistItem> {
    const { data } = await api.post('/wishlist', { productId })
    return data.data
  },

  async removeFromWishlist(productId: string) {
    const { data } = await api.delete(`/wishlist/${productId}`)
    return data
  },

  async checkWishlist(productId: string): Promise<boolean> {
    const { data } = await api.get(`/wishlist/check/${productId}`)
    return data.data?.inWishlist || false
  },
}
