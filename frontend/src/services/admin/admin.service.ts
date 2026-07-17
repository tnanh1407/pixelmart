import { statsService } from './stats.service'
import { usersService } from './users.service'
import { storesService } from './stores.service'
import { categoriesService } from './categories.service'
import { campaignsService } from './campaigns.service'
import { productsService } from './products.service'

export * from './stats.service'
export * from './users.service'
export * from './stores.service'
export * from './categories.service'
export * from './campaigns.service'
export * from './products.service'

export const adminService = {
  ...statsService,
  ...usersService,
  ...storesService,
  ...categoriesService,
  ...campaignsService,
  ...productsService,
}
