import { statsService } from './stats.service'
import { usersService } from './users.service'
import { storesService } from './stores.service'
import { categoriesService } from './categories.service'
import { campaignsService } from './campaigns.service'
import { productsService } from './products.service'
import { adminOrderService } from './orders.service'
import { adminVoucherService } from './vouchers.service'
import { adminBannerService } from './banners.service'
import { adminVendorService } from './vendors.service'
import { adminReviewService } from './reviews.service'
import { flashSalesService } from './flash-sales.service'

export * from './stats.service'
export * from './users.service'
export * from './stores.service'
export * from './categories.service'
export * from './campaigns.service'
export * from './products.service'
export * from './orders.service'
export * from './vouchers.service'
export * from './banners.service'
export * from './vendors.service'
export * from './reviews.service'
export * from './flash-sales.service'

export const adminService = {
  ...statsService,
  ...usersService,
  ...storesService,
  ...categoriesService,
  ...campaignsService,
  ...productsService,
  ...adminOrderService,
  ...adminVoucherService,
  ...adminBannerService,
  ...adminVendorService,
  ...adminReviewService,
  ...flashSalesService,
}
