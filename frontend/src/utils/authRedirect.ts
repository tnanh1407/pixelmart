import { type User } from '@/services/auth.service'

export function isAdminRole(role?: string | null) {
  return role?.trim().toLowerCase() === 'admin'
}

export function isVendorRole(role?: string | null) {
  return role?.trim().toLowerCase() === 'vendor'
}

export function getAuthenticatedRedirectPath(user?: Pick<User, 'role'> | null) {
  if (isAdminRole(user?.role)) return '/admin'
  if (isVendorRole(user?.role)) return '/vendor'
  return '/'
}
