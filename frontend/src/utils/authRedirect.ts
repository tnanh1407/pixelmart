import { type User } from '@/services/auth.service'

export function isAdminRole(role?: string | null) {
  return role?.trim().toLowerCase() === 'admin'
}

export function getAuthenticatedRedirectPath(user?: Pick<User, 'role'> | null) {
  return isAdminRole(user?.role) ? '/admin' : '/'
}
