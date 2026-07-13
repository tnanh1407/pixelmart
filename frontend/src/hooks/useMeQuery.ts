import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import useUserStore from '@/stores/useUserStore'

export function useMeQuery() {
  const { setUser, logout } = useUserStore.getState()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await authService.getMe()
        setUser(user)
        return user
      } catch (err: any) {
        // Chỉ logout khi realmente 401 (token hết hạn)
        // Network error hoặc 500 sẽ không logout ngay
        if (err?.response?.status === 401) {
          logout()
        }
        throw err
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
