import { type User } from '@/services/user/auth.service'

export function isAdminRole(role?: string | null) {
  return role?.trim().toLowerCase() === 'admin'
}


export function getAuthenticatedRedirectPath(user?: Pick<User, 'role'> | null) {
  if (isAdminRole(user?.role)) return '/admin'
  return '/'
}
