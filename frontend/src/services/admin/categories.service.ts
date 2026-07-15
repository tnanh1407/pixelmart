import api from '../api'

export interface CategoryListResponse {
  categories: Array<{
    _id: string
    name: string
    slug: string
    description?: string
    image?: string
    isActive: boolean
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const categoriesService = {
  async getCategories(params: {
    page?: number
    limit?: number
    search?: string
  } = {}): Promise<CategoryListResponse> {
    const { data } = await api.get('/categories', { params })
    return {
      categories: data.categories || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async createCategory(payload: { name: string; description?: string; image?: string }): Promise<void> {
    await api.post('/categories', payload)
  },

  async updateCategory(id: string, payload: { name?: string; description?: string; image?: string; isActive?: boolean }): Promise<void> {
    await api.put(`/categories/${id}`, payload)
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
