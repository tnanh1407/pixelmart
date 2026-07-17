import api from '../api'
import type { GetProductsParams, ProductListResponse } from '@/types/product.types'

export type { ProductListResponse }

export const productsService = {
  async getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
    const { data } = await api.get('/products', { params })
    return {
      products: data.products || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async updateProduct(id: string, payload: { isActive?: boolean; isFeatured?: boolean }): Promise<void> {
    await api.patch(`/products/${id}`, payload)
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}
