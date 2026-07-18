export type OrderStatus = "pending" | "confirmed" | "processing" | "shipping" | "delivered" | "cancelled" | "returned"

export type PaymentMethod = "cod" | "bank_transfer" | "e_wallet"

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed"

export interface IOrderItem {
  productId: string
  productName: string
  productImage: string
  productSlug: string
  storeId: string
  storeName: string
  price: number
  discountPrice: number | null
  quantity: number
  subtotal: number
}

export interface IShippingAddress {
  receiverName: string
  receiverPhone: string
  provinceName: string
  districtName: string
  wardName: string
  streetAddress: string
}

export interface IOrder {
  _id: string
  userId: string | { _id: string; name: string; email: string; phone?: string }
  storeId: string | { _id: string; name: string; slug: string; logo?: string; phone?: string }
  orderCode: string
  status: OrderStatus
  items: IOrderItem[]
  shippingAddress: IShippingAddress
  shippingFee: number
  subtotal: number
  discountAmount: number
  totalAmount: number
  voucherId?: string
  voucherCode?: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  transactionId?: string
  shippingTrackingNumber?: string
  shippingCarrier?: string
  note?: string
  cancelReason?: string
  confirmedAt?: string
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}

export interface OrderListResponse {
  orders: IOrder[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface CheckoutPayload {
  shippingAddress: IShippingAddress
  voucherCode?: string
  paymentMethod: string
  note?: string
}
