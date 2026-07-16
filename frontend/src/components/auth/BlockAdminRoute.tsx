import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/auth'

export default function BlockAdminRoute() {
  const { isLoading, isAdmin } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#009b4d]" />
      </div>
    )
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
