export interface ISpecification {
  key: string
  value: string
}

export interface IFlashSale {
  price: number
  stock: number
  sold: number
  startDate: string
  endDate: string
}

export interface IProduct {
  _id: string
  name: string
  slug: string
  sku?: string
  brand?: string
  description: string
  shortDescription?: string
  price: number
  discountPrice?: number | null
  stock: number
  images: string[]
  categoryId: string | ICategoryRef
  storeId: string | IStoreRef
  specifications?: ISpecification[]
  ratingsAverage: number
  ratingsQuantity: number
  isFeatured: boolean
  isActive: boolean
  flashSale?: IFlashSale | null
  createdAt: string
  updatedAt: string
}

export interface ICategoryRef {
  _id: string
  name: string
  slug: string
}

export interface IStoreRef {
  _id: string
  name: string
  slug: string
  logo?: string
  isVerified: boolean
}

export interface IPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProductListResponse {
  products: IProduct[]
  pagination: IPagination
}

export interface GetProductsParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  storeId?: string
  minPrice?: number
  maxPrice?: number
  isFeatured?: boolean
  flashSaleActive?: boolean
  sort?: 'priceAsc' | 'priceDesc' | 'rating' | 'sold'
}
