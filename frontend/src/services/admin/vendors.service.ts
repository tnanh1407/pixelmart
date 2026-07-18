import api from '../../api'
import type { IVendor, VendorListResponse, VendorStats } from '@/types/vendor.types'

export const adminVendorService = {
  async getVendors(params?: Record<string, unknown>): Promise<VendorListResponse> {
    const { data } = await api.get('/admin/vendors', { params })
    return {
      vendors: data.vendors || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getVendorById(id: string): Promise<IVendor> {
    const { data } = await api.get(`/admin/vendors/${id}`)
    return data.data || data
  },

  async approveVendor(id: string): Promise<IVendor> {
    const { data } = await api.post(`/admin/vendors/${id}/approve`)
    return data.data
  },

  async rejectVendor(id: string, reason: string): Promise<IVendor> {
    const { data } = await api.post(`/admin/vendors/${id}/reject`, { reason })
    return data.data
  },

  async suspendVendor(id: string, reason: string): Promise<IVendor> {
    const { data } = await api.post(`/admin/vendors/${id}/suspend`, { reason })
    return data.data
  },

  async getVendorStats(): Promise<VendorStats> {
    const { data } = await api.get('/admin/vendors/stats')
    return data.data || data
  },
}
