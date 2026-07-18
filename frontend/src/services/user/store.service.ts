import api from "../client"
import type { IStore, StoreListResponse, GetStoresParams } from '@/types/store.types'

export const storeService = {
  async getStores(params: GetStoresParams = {}): Promise<StoreListResponse> {
    const { data } = await api.get('/stores', { params })
    return {
      stores: data.stores || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getStoreById(id: string): Promise<IStore> {
    const { data } = await api.get(`/stores/${id}`)
    return data.data
  },

  async getMyStore(): Promise<IStore> {
    const { data } = await api.get('/stores/me')
    return data.data
  },

  async createStore(payload: Partial<IStore>): Promise<IStore> {
    const { data } = await api.post('/stores', payload)
    return data.data
  },

  async updateStore(id: string, payload: Partial<IStore>): Promise<IStore> {
    const { data } = await api.patch(`/stores/${id}`, payload)
    return data.data
  },

  async deleteStore(id: string): Promise<void> {
    await api.delete(`/stores/${id}`)
  },

  async followStore(id: string): Promise<{ isFollowing: boolean }> {
    const { data } = await api.post(`/stores/${id}/follow`)
    return data
  },

  async unfollowStore(id: string): Promise<{ isFollowing: boolean }> {
    const { data } = await api.delete(`/stores/${id}/follow`)
    return data
  },

  async checkFollowStatus(id: string): Promise<{ isFollowing: boolean }> {
    const { data } = await api.get(`/stores/${id}/follow/status`)
    return data
  },

  async getFollowedStores(params: { page?: number; limit?: number } = {}): Promise<StoreListResponse> {
    const { data } = await api.get('/stores/followed', { params })
    return {
      stores: data.stores || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getStoreFollowers(id: string, params: { page?: number; limit?: number } = {}): Promise<{ followers: any[]; pagination: any }> {
    const { data } = await api.get(`/stores/${id}/followers`, { params })
    return {
      followers: data.followers || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },
}
