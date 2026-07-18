import api from "../client"
import type { ICartGroup, ICartCount, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types'

export const cartService = {
  async getCart(): Promise<ICartGroup[]> {
    const { data } = await api.get('/cart')
    return data.data || data
  },

  async getCartCount(): Promise<ICartCount> {
    const { data } = await api.get('/cart/count')
    return data.data || data
  },

  async addToCart(payload: AddToCartPayload) {
    const { data } = await api.post('/cart', payload)
    return data.data
  },

  async updateCartItem(id: string, payload: UpdateCartItemPayload) {
    const { data } = await api.patch(`/cart/${id}`, payload)
    return data.data
  },

  async removeFromCart(id: string) {
    const { data } = await api.delete(`/cart/${id}`)
    return data
  },

  async clearCart() {
    const { data } = await api.delete('/cart')
    return data
  },

  async selectAllItems(selected: boolean) {
    const { data } = await api.patch('/cart/select-all', { selected })
    return data
  },
}
