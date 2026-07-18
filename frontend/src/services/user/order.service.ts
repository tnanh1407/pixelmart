import api from '../api'
import type { IOrder, OrderListResponse, CheckoutPayload } from '@/types/order.types'

export const orderService = {
  async getOrders(params?: Record<string, unknown>): Promise<OrderListResponse> {
    const { data } = await api.get('/orders', { params })
    return {
      orders: data.orders || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getOrderById(id: string): Promise<IOrder> {
    const { data } = await api.get(`/orders/${id}`)
    return data.data || data
  },

  async getOrderByCode(code: string): Promise<IOrder> {
    const { data } = await api.get(`/orders/code/${code}`)
    return data.data || data
  },

  async checkout(payload: CheckoutPayload): Promise<IOrder[]> {
    const { data } = await api.post('/orders/checkout', payload)
    return data.data || data
  },

  async cancelOrder(id: string, reason: string) {
    const { data } = await api.post(`/orders/${id}/cancel`, { reason })
    return data.data
  },
}
