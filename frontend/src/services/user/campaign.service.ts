import type { ICampaign } from '@/types/campaign.types';
import api from "../client"

export const campaignService = {
  async getActiveCampaigns(): Promise<ICampaign[]> {
    const { data } = await api.get('/campaigns')
    return data.data || []
  },

  async getAllCampaigns(params: any = {}): Promise<{ campaigns: ICampaign[]; pagination: any }> {
    const { data } = await api.get('/campaigns/all', { params })
    return {
      campaigns: data.campaigns || data.data || [],
      pagination: data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 },
    }
  },

  async getCampaignById(id: string): Promise<ICampaign> {
    const { data } = await api.get(`/campaigns/${id}`)
    return data.data
  },

  async createCampaign(payload: Partial<ICampaign>): Promise<ICampaign> {
    const { data } = await api.post('/campaigns', payload)
    return data.data
  },

  async updateCampaign(id: string, payload: Partial<ICampaign>): Promise<ICampaign> {
    const { data } = await api.patch(`/campaigns/${id}`, payload)
    return data.data
  },

  async deleteCampaign(id: string): Promise<void> {
    await api.delete(`/campaigns/${id}`)
  },
}
