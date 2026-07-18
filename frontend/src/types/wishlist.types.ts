export interface IWishlistItem {
  _id: string
  userId: string
  productId: string | {
    _id: string
    name: string
    slug: string
    price: number
    discountPrice: number | null
    images: string[]
    ratingsAverage: number
    storeId: string
  }
  createdAt: string
}

export interface WishlistListResponse {
  items: IWishlistItem[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
