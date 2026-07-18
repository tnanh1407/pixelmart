import api from "../client"
import type { GetProductsParams, ProductListResponse, IProduct } from '@/types/product.types'

export type { ProductListResponse }

export const productsService = {
  async getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
    const { data } = await api.get('/products', { params })
    return {
      products: data.products || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getProductById(id: string): Promise<IProduct> {
    const { data } = await api.get(`/products/${id}`)
    return data.data || data
  },

  async createProduct(payload: Partial<IProduct>): Promise<IProduct> {
    const { data } = await api.post('/products', payload)
    return data.data || data
  },

  async updateProduct(id: string, payload: Partial<IProduct>): Promise<IProduct> {
    const { data } = await api.patch(`/products/${id}`, payload)
    return data.data || data
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data?.url || data.url
  },
}
