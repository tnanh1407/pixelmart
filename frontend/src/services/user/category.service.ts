import api from "../client"
import type { ICategory } from '@/types/category.types'

export const categoryService = {
  async getCategories(): Promise<ICategory[]> {
    const { data } = await api.get('/categories')
    return data.data || []
  },

  async getCategoryById(id: string): Promise<ICategory> {
    const { data } = await api.get(`/categories/${id}`)
    return data.data
  },
}
