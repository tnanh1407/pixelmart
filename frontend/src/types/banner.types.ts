export type BannerPosition = "home_top" | "home_middle" | "sidebar" | "popup"
export type BannerType = "slider" | "static" | "promo_card"

export interface IBanner {
  _id: string
  title: string
  image: string
  targetUrl?: string
  position: BannerPosition
  type: BannerType
  order: number
  isActive: boolean
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export interface BannerListResponse {
  banners: IBanner[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
