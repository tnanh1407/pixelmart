export type VoucherType = "percentage" | "fixed"
export type VoucherScope = "platform" | "store"
export type VoucherStatus = "active" | "expired" | "disabled"

export interface IVoucher {
  _id: string
  code: string
  name: string
  description?: string
  type: VoucherType
  value: number
  minOrderValue: number
  maxDiscount?: number | null
  scope: VoucherScope
  storeId?: string | { _id: string; name: string; slug: string; logo?: string }
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  status: VoucherStatus
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface VoucherListResponse {
  vouchers: IVoucher[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface ValidateVoucherResponse {
  voucher: IVoucher
  discountAmount: number
}
