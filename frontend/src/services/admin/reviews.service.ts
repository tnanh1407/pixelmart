import api from "../client"
import type { ReviewListResponse } from '@/types/review.types'

export const adminReviewService = {
  async getReviews(params?: Record<string, unknown>): Promise<ReviewListResponse> {
    const { data } = await api.get('/admin/reviews', { params })
    return {
      reviews: data.reviews || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async toggleReviewActive(id: string) {
    const { data } = await api.patch(`/admin/reviews/${id}/toggle`)
    return data.data
  },

  async deleteReview(id: string) {
    const { data } = await api.delete(`/admin/reviews/${id}`)
    return data
  },
}
