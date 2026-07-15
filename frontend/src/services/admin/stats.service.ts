import api from '../api'

export interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalStores: number
  totalCategories: number
  totalBanners: number
  activeUsers: number
  activeProducts: number
  activeStores: number
  recentUsers: Array<{
    _id: string
    name: string
    email: string
    role: string
    createdAt: string
    avatar?: string
  }>
}

export const statsService = {
  // Stats - gọi nhiều endpoint để tổng hợp
  async getStats(): Promise<AdminStats> {
    const [usersRes, productsRes, storesRes, categoriesRes, bannersRes, recentUsersRes] =
      await Promise.all([
        api.get('/users', { params: { limit: 1 } }),
        api.get('/products', { params: { limit: 1 } }),
        api.get('/stores', { params: { limit: 1 } }),
        api.get('/categories', { params: { limit: 1 } }),
        api.get('/banners/all', { params: { limit: 1 } }),
        api.get('/users', { params: { limit: 5, sort: '-createdAt' } }),
      ])

    return {
      totalUsers: usersRes.data.pagination?.total || usersRes.data.data?.length || 0,
      totalProducts: productsRes.data.pagination?.total || productsRes.data.data?.length || 0,
      totalStores: storesRes.data.pagination?.total || storesRes.data.data?.length || 0,
      totalCategories: categoriesRes.data.pagination?.total || categoriesRes.data.data?.length || 0,
      totalBanners: bannersRes.data.pagination?.total || bannersRes.data.data?.length || 0,
      activeUsers: usersRes.data.pagination?.total || 0,
      activeProducts: productsRes.data.pagination?.total || 0,
      activeStores: storesRes.data.pagination?.total || 0,
      recentUsers: recentUsersRes.data.users || recentUsersRes.data.data || [],
    }
  },
}
