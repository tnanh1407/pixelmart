import useUserStore from '@/stores/useUserStore'
import { useMeQuery } from './useMeQuery'
import { isAdminRole } from '@/utils/authRedirect'

export function useAuth() {
  const user = useUserStore((state) => state.user)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const { isLoading: isFetchingUser } = useMeQuery()

  const isAdmin = isAdminRole(user?.role)
  return {
    user,
    isAuthenticated,
    isLoading: isFetchingUser,
    isAdmin,
  }
}

export default useAuth
