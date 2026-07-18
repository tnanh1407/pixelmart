import api from "../client"
import type { IVoucher, VoucherListResponse } from '@/types/voucher.types'

export const adminVoucherService = {
  async getVouchers(params?: Record<string, unknown>): Promise<VoucherListResponse> {
    const { data } = await api.get('/admin/vouchers', { params })
    return {
      vouchers: data.vouchers || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getVoucherById(id: string): Promise<IVoucher> {
    const { data } = await api.get(`/admin/vouchers/${id}`)
    return data.data || data
  },

  async createVoucher(payload: Partial<IVoucher>): Promise<IVoucher> {
    const { data } = await api.post('/admin/vouchers', payload)
    return data.data
  },

  async updateVoucher(id: string, payload: Partial<IVoucher>): Promise<IVoucher> {
    const { data } = await api.patch(`/admin/vouchers/${id}`, payload)
    return data.data
  },

  async deleteVoucher(id: string) {
    const { data } = await api.delete(`/admin/vouchers/${id}`)
    return data
  },
}
