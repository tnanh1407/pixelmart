import api from "../client"

export interface UserListResponse {
  users: Array<{
    _id: string
    name: string
    email: string
    role: string
    phone?: string
    avatar?: string
    isActive: boolean
    isEmailVerified: boolean
    createdAt: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const usersService = {
  async getUsers(params: {
    page?: number
    limit?: number
    search?: string
    role?: string
    sort?: string
  } = {}): Promise<UserListResponse> {
    const { data } = await api.get('/users', { params })
    return {
      users: data.users || data.data || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async toggleUserActive(id: string): Promise<void> {
    await api.patch(`/users/${id}/toggle-active`)
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
