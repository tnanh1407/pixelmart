import api from "../client"

export interface Address {
  _id?: string
  receiverName: string
  receiverPhone: string
  provinceCode: string
  provinceName: string
  districtCode: string
  districtName: string
  wardCode: string
  wardName: string
  streetAddress: string
  isDefault: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
  gender?: string
  dob?: string
  provider?: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  isActive?: boolean
  hasPassword?: boolean
  addresses?: Address[]
}

interface GoogleLoginPayload {
  googleId: string
  email: string
  name: string
  avatar?: string
}

interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post('/auth/login', { email, password })
    return data.data.user
  },

  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.post('/auth/register', payload)
    return data.data.user
  },

  async googleLogin(payload: GoogleLoginPayload): Promise<User> {
    const { data } = await api.post('/auth/google', payload)
    return data.data.user
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password, confirmPassword })
  },

  async sendVerification(): Promise<void> {
    await api.post('/auth/send-verification')
  },

  async verifyEmail(code: string): Promise<void> {
    await api.post('/auth/verify-email', { code })
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me')
    return data.data
  },

  async updateProfile(payload: { name?: string; gender?: string; dob?: string; phone?: string; avatar?: File }): Promise<User> {
    // If avatar is included, use FormData for multipart upload
    if (payload.avatar) {
      const formData = new FormData()
      formData.append('data', JSON.stringify({
        name: payload.name,
        gender: payload.gender,
        dob: payload.dob,
        phone: payload.phone,
      }))
      formData.append('avatar', payload.avatar)
      const { data } = await api.patch('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    }
    // Otherwise, use regular JSON
    const { data } = await api.patch('/users/profile', payload)
    return data.data
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    await api.post('/auth/change-password', { currentPassword, newPassword, confirmPassword })
  },

  async updateProfile(payload: { name?: string; gender?: string; dob?: string; phone?: string; avatar?: File }): Promise<User> {
    const { data } = await api.patch('/users/profile', payload)
    return data.data
  },

  async addAddress(payload: Omit<Address, '_id' | 'isDefault'> & { isDefault: boolean }): Promise<Address[]> {
    const { data } = await api.post('/users/addresses', payload)
    return data.data
  },

  async updateAddress(addressId: string, payload: Partial<Address>): Promise<Address[]> {
    const { data } = await api.patch(`/users/addresses/${addressId}`, payload)
    return data.data
  },

  async deleteAddress(addressId: string): Promise<Address[]> {
    const { data } = await api.delete(`/users/addresses/${addressId}`)
    return data.data
  },

  async setDefaultAddress(addressId: string): Promise<Address[]> {
    const { data } = await api.patch(`/users/addresses/${addressId}/default`)
    return data.data
  },
}
