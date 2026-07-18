export interface ICartItem {
  _id: string
  userId: string
  productId: string | {
    _id: string
    name: string
    slug: string
    price: number
    discountPrice: number | null
    stock: number
    images: string[]
    storeId: string | { _id: string; name: string; slug: string; logo?: string }
  }
  storeId: string
  quantity: number
  selected: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ICartGroup {
  store: { _id: string; name: string; slug: string; logo?: string }
  items: ICartItem[]
}

export interface ICartCount {
  count: number
}

export interface AddToCartPayload {
  productId: string
  quantity?: number
}

export interface UpdateCartItemPayload {
  quantity?: number
  selected?: boolean
}
