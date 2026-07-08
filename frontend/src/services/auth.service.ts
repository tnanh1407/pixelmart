import api from './api'

export interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
  gender?: string
  provider?: string
  isEmailVerified?: boolean
  isActive?: boolean
}

interface GoogleLoginPayload {
  googleId: string
  email: string
  firstName: string
  lastName: string
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

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me')
    return data.data
  },
}
