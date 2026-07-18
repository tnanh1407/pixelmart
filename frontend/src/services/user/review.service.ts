import api from "../client"
import type { IReview, ReviewListResponse, CreateReviewPayload } from '@/types/review.types'

export const reviewService = {
  async getProductReviews(productId: string, params?: Record<string, unknown>): Promise<ReviewListResponse> {
    const { data } = await api.get(`/products/${productId}/reviews`, { params })
    return {
      reviews: data.reviews || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getMyReviews(params?: Record<string, unknown>): Promise<ReviewListResponse> {
    const { data } = await api.get('/reviews/mine', { params })
    return {
      reviews: data.reviews || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async createReview(payload: CreateReviewPayload): Promise<IReview> {
    const { data } = await api.post('/reviews', payload)
    return data.data
  },

  async updateReview(id: string, payload: Partial<CreateReviewPayload>): Promise<IReview> {
    const { data } = await api.patch(`/reviews/${id}`, payload)
    return data.data
  },

  async deleteReview(id: string) {
    const { data } = await api.delete(`/reviews/${id}`)
    return data
  },
}
