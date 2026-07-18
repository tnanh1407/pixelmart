import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const statusVariants = cva('border-none shadow-none', {
  variants: {
    variant: {
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
    },
  },
  defaultVariants: {
    variant: 'inactive',
  },
})

interface StatusBadgeProps extends VariantProps<typeof statusVariants> {
  label?: string
  className?: string
}

const variantLabels: Record<string, string> = {
  active: 'Hoạt động',
  inactive: 'Ẩn',
  pending: 'Chờ xử lý',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  suspended: 'Đình chỉ',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  paid: 'Đã thanh toán',
  unpaid: 'Chưa thanh toán',
  refunded: 'Đã hoàn tiền',
  failed: 'Thất bại',
}

export default function StatusBadge({
  variant = 'inactive',
  label,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      className={cn(statusVariants({ variant }), 'px-3 py-1 text-xs font-semibold', className)}
    >
      {label ?? variantLabels[variant ?? 'inactive'] ?? variant}
    </Badge>
  )
}
