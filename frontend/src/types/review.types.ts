export interface IReview {
  _id: string
  userId: string | { _id: string; name: string; email: string; avatar?: string }
  productId: string | { _id: string; name: string; slug: string; images: string[] }
  orderId?: string
  rating: number
  title?: string
  comment?: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ReviewListResponse {
  reviews: IReview[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface CreateReviewPayload {
  productId: string
  orderId?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
}
