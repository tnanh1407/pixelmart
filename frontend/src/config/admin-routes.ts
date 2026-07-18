export const adminPathLabels: Record<string, string> = {
  admin: "Dashboard",
  users: "Người dùng",
  products: "Sản phẩm",
  stores: "Cửa hàng",
  categories: "Danh mục",
  campaigns: "Chiến dịch",
  notifications: "Thông báo",
  reports: "Báo cáo",
  settings: "Cài đặt",
}

export const adminDetailLabels: Record<string, string> = {
  categories: "Chi tiết danh mục",
  campaigns: "Chi tiết chiến dịch",
  stores: "Chi tiết cửa hàng",
}

export const adminDetailParentSegments = new Set(Object.keys(adminDetailLabels))
