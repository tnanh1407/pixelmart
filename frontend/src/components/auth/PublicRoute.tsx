import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/user/auth'
import { getAuthenticatedRedirectPath } from '@/utils/authRedirect'

export default function PublicRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#009b4d]" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={getAuthenticatedRedirectPath(user)} replace />
  }

  return <Outlet />
}
