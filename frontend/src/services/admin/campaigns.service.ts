import api from '../api'
import type { ICampaign } from '@/types/campaign.types'

export interface CampaignListResponse {
  campaigns: ICampaign[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const campaignsService = {
  async getCampaigns(params: {
    page?: number
    limit?: number
    search?: string
  } = {}): Promise<CampaignListResponse> {
    const { data } = await api.get('/campaigns/all', { params })
    return {
      campaigns: data.campaigns || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async createCampaign(payload: Partial<ICampaign> & { title: string }): Promise<void> {
    await api.post('/campaigns', payload)
  },

  async updateCampaign(id: string, payload: Partial<ICampaign>): Promise<void> {
    await api.patch(`/campaigns/${id}`, payload)
  },

  async deleteCampaign(id: string): Promise<void> {
    await api.delete(`/campaigns/${id}`)
  },

  async uploadCampaignImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post('/campaigns/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data.url
  },
}

