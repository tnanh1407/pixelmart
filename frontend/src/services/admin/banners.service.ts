import api from '../../api'
import type { IBanner, BannerListResponse } from '@/types/banner.types'

export const adminBannerService = {
  async getBanners(params?: Record<string, unknown>): Promise<BannerListResponse> {
    const { data } = await api.get('/admin/banners', { params })
    return {
      banners: data.banners || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getBannerById(id: string): Promise<IBanner> {
    const { data } = await api.get(`/admin/banners/${id}`)
    return data.data || data
  },

  async createBanner(payload: Partial<IBanner>): Promise<IBanner> {
    const { data } = await api.post('/admin/banners', payload)
    return data.data
  },

  async updateBanner(id: string, payload: Partial<IBanner>): Promise<IBanner> {
    const { data } = await api.patch(`/admin/banners/${id}`, payload)
    return data.data
  },

  async deleteBanner(id: string) {
    const { data } = await api.delete(`/admin/banners/${id}`)
    return data
  },

  async uploadBannerImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post('/admin/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data || data
  },
}
