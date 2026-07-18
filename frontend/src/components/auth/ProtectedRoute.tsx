import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/user/auth'

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'vendor' | 'user'
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, isVendor } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#009b4d]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (requiredRole === 'vendor' && !isVendor && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
