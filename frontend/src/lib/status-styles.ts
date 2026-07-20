import { cn } from '@/lib/utils'

type StatusVariant = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled' | 'paid' | 'unpaid' | 'refunded' | 'failed'

const variantStyles: Record<StatusVariant, string> = {
  active: 'bg-success-light text-success',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-warning-light text-warning',
  approved: 'bg-success-light text-success',
  rejected: 'bg-destructive-light text-destructive',
  suspended: 'bg-destructive-light text-destructive',
  confirmed: 'bg-info-light text-info',
  shipping: 'bg-info-light text-info',
  delivered: 'bg-success-light text-success',
  cancelled: 'bg-destructive-light text-destructive',
  paid: 'bg-success-light text-success',
  unpaid: 'bg-warning-light text-warning',
  refunded: 'bg-info-light text-info',
  failed: 'bg-destructive-light text-destructive',
}

export function statusVariantClass(variant: string): string {
  return variantStyles[variant as StatusVariant] ?? 'bg-muted text-muted-foreground'
}
