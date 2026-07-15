import { statsService } from './stats.service'
import { usersService } from './users.service'
import { storesService } from './stores.service'
import { categoriesService } from './categories.service'
import { bannersService } from './banners.service'
import { productsService } from './products.service'

export * from './stats.service'
export * from './users.service'
export * from './stores.service'
export * from './categories.service'
export * from './banners.service'
export * from './products.service'

export const adminService = {
  ...statsService,
  ...usersService,
  ...storesService,
  ...categoriesService,
  ...bannersService,
  ...productsService,
}
