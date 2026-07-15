export interface IStore {
  _id: string
  name: string
  slug: string
  logo?: string
  description?: string
  ownerId: string
  phone?: string
  email?: string
  address?: {
    street?: string
    ward?: string
    district?: string
    city?: string
  }
  followersCount?: number
  policies?: string[]
  isVerified: boolean
  ratingsAverage: number
  ratingsQuantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface StoreListResponse {
  stores: IStore[]
  pagination: IPagination
}

export interface GetStoresParams {
  page?: number
  limit?: number
  search?: string
  isVerified?: boolean
}
