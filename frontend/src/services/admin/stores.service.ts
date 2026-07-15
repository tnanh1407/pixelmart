import api from '../api'

export interface StoreListResponse {
  stores: Array<{
    _id: string
    name: string
    slug: string
    logo?: string
    ownerId: string
    phone?: string
    email?: string
    isVerified: boolean
    isActive: boolean
    ratingsAverage: number
    ratingsQuantity: number
    followersCount: number
    createdAt: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const storesService = {
  async getStores(params: {
    page?: number
    limit?: number
    search?: string
    sort?: string
  } = {}): Promise<StoreListResponse> {
    const { data } = await api.get('/stores', { params })
    return {
      stores: data.stores || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async updateStore(id: string, payload: { isVerified?: boolean; isActive?: boolean }): Promise<void> {
    await api.put(`/stores/${id}`, payload)
  },

  async deleteStore(id: string): Promise<void> {
    await api.delete(`/stores/${id}`)
  },
}
