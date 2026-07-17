import useUserStore from '@/stores/useUserStore'
import { useMeQuery } from './useMeQuery'
import { isAdminRole, isVendorRole } from '@/utils/authRedirect'

export function useAuth() {
  const user = useUserStore((state) => state.user)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const { isLoading: isFetchingUser } = useMeQuery()

  const isAdmin = isAdminRole(user?.role)
  const isVendor = isVendorRole(user?.role)
  return {
    user,
    isAuthenticated,
    isLoading: isFetchingUser,
    isAdmin,
    isVendor,
  }
}

export default useAuth
