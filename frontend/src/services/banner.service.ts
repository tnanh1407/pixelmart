import api from './api'
import type { IBanner } from '@/types/banner.types'

export const bannerService = {
  async getActiveBanners(): Promise<IBanner[]> {
    const { data } = await api.get('/banners')
    return data.data || []
  },

  async getAllBanners(params: any = {}): Promise<{ banners: IBanner[]; pagination: any }> {
    const { data } = await api.get('/banners/all', { params })
    return {
      banners: data.banners || data.data || [],
      pagination: data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 },
    }
  },

  async getBannerById(id: string): Promise<IBanner> {
    const { data } = await api.get(`/banners/${id}`)
    return data.data
  },

  async createBanner(payload: Partial<IBanner>): Promise<IBanner> {
    const { data } = await api.post('/banners', payload)
    return data.data
  },

  async updateBanner(id: string, payload: Partial<IBanner>): Promise<IBanner> {
    const { data } = await api.put(`/banners/${id}`, payload)
    return data.data
  },

  async deleteBanner(id: string): Promise<void> {
    await api.delete(`/banners/${id}`)
  },
}
