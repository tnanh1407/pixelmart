import api from '../api'
import type { IProduct, ProductListResponse, GetProductsParams } from '@/types/product.types'

export const productService = {
  async getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
    const { data } = await api.get('/products', { params })
    return {
      products: data.products || data.data || [],
      pagination: data.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 },
    }
  },

  async getProductById(id: string): Promise<IProduct> {
    const { data } = await api.get(`/products/${id}`)
    return data.data
  },

  async createProduct(payload: Partial<IProduct>): Promise<IProduct> {
    const { data } = await api.post('/products', payload)
    return data.data
  },

  async updateProduct(id: string, payload: Partial<IProduct>): Promise<IProduct> {
    const { data } = await api.patch(`/products/${id}`, payload)
    return data.data
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}
