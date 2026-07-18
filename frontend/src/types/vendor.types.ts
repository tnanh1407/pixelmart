export type VendorStatus = "pending" | "approved" | "rejected" | "suspended"

export interface IVendor {
  _id: string
  userId: string | { _id: string; name: string; email: string; avatar?: string }
  shopName: string
  businessName?: string
  taxCode?: string
  description?: string
  avatar?: string
  banner?: string
  email?: string
  phone?: string
  bankName?: string
  bankAccountNumber?: string
  bankAccountHolder?: string
  status: VendorStatus
  rejectionReason?: string
  verifiedAt?: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
}

export interface VendorListResponse {
  vendors: IVendor[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface VendorStats {
  total: number
  approved: number
  pending: number
  rejected: number
  suspended: number
}
