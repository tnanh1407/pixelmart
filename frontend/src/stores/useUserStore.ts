import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type User } from '@/services/user/auth.service'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  googleLogin: (payload: {
    googleId: string
    email: string
    name: string
    avatar?: string | undefined
  }) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  setUser: (user: User) => void
  updateProfile: (payload: { name?: string; gender?: string; dob?: string; phone?: string; avatar?: File }) => Promise<void>
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const user = await authService.login(email, password)
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const user = await authService.register(data)
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      googleLogin: async (payload) => {
        set({ isLoading: true })
        try {
          const user = await authService.googleLogin(payload)
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({
          user: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('user-storage')
      },

      fetchUser: async () => {
        try {
          const user = await authService.getMe()
          set({ user, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false })
        }
      },

      setUser: (user) => set({ user, isAuthenticated: true }),

      updateProfile: async (payload) => {
        const user = await authService.updateProfile(payload)
        set({ user })
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useUserStore
