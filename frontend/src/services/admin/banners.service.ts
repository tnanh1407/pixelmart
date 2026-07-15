import api from '../api'

export interface BannerListResponse {
  banners: Array<{
    _id: string
    title: string
    shortDescription?: string
    image?: string
    link?: string
    isActive: boolean
    startDate?: string
    endDate?: string
    order: number
    createdAt: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const bannersService = {
  async getBanners(params: {
    page?: number
    limit?: number
  } = {}): Promise<BannerListResponse> {
    const { data } = await api.get('/banners/all', { params })
    return {
      banners: data.banners || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async createBanner(payload: {
    title: string
    shortDescription?: string
    image?: string
    link?: string
    startDate?: string
    endDate?: string
    order?: number
  }): Promise<void> {
    await api.post('/banners', payload)
  },

  async updateBanner(id: string, payload: {
    title?: string
    shortDescription?: string
    image?: string
    link?: string
    isActive?: boolean
    startDate?: string
    endDate?: string
    order?: number
  }): Promise<void> {
    await api.put(`/banners/${id}`, payload)
  },

  async deleteBanner(id: string): Promise<void> {
    await api.delete(`/banners/${id}`)
  },

  async uploadBannerImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post('/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data.url
  },
}

