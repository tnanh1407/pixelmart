import api from '../../api'
import type { IOrder, OrderListResponse } from '@/types/order.types'

export const adminOrderService = {
  async getOrders(params?: Record<string, unknown>): Promise<OrderListResponse> {
    const { data } = await api.get('/admin/orders', { params })
    return {
      orders: data.orders || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getOrderById(id: string): Promise<IOrder> {
    const { data } = await api.get(`/admin/orders/${id}`)
    return data.data || data
  },

  async updateOrderStatus(id: string, status: string, cancelReason?: string) {
    const { data } = await api.patch(`/admin/orders/${id}/status`, { status, cancelReason })
    return data.data
  },

  async updatePaymentStatus(id: string, paymentStatus: string, transactionId?: string) {
    const { data } = await api.patch(`/admin/orders/${id}/payment`, { paymentStatus, transactionId })
    return data.data
  },
}
