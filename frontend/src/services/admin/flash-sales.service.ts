import api from "../client"

export interface FlashSale {
  _id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface FlashSaleListResponse {
  flashSales: FlashSale[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const flashSalesService = {
  async getFlashSales(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
  } = {}): Promise<FlashSaleListResponse> {
    const { data } = await api.get('/flash-sales/all', { params })
    return {
      flashSales: data.flashSales || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getFlashSaleById(id: string): Promise<FlashSale> {
    const { data } = await api.get(`/flash-sales/${id}`)
    return data.data || data
  },

  async createFlashSale(payload: Partial<FlashSale> & { name: string }): Promise<void> {
    await api.post('/flash-sales', payload)
  },

  async updateFlashSale(id: string, payload: Partial<FlashSale>): Promise<void> {
    await api.patch(`/flash-sales/${id}`, payload)
  },

  async deleteFlashSale(id: string): Promise<void> {
    await api.delete(`/flash-sales/${id}`)
  },
}
