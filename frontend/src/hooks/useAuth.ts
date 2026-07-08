import useUserStore from '@/stores/useUserStore'
import { useMeQuery } from './useMeQuery'

export function useAuth() {
  const user = useUserStore((state) => state.user)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const { isLoading: isFetchingUser } = useMeQuery()

  const isAdmin = user?.role === 'admin'

  return {
    user,
    isAuthenticated,
    isLoading: isFetchingUser,
    isAdmin,
  }
}

export default useAuth
