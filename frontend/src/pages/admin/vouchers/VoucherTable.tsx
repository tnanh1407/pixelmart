import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Tag, Trash2 } from 'lucide-react'
import { useAdminVoucherMutations } from '@/hooks/admin/vouchers/useAdminVoucherMutations'
import { CopyButton } from '@/components/admin/shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { statusVariantClass } from '@/lib/status-styles'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Types ───────────────────────────────────────────────────────────────────

export type VoucherRow = {
  _id: string
  code: string
  name: string
  description?: string
  type: string
  value: number
  minOrderValue: number
  maxDiscount?: number | null
  scope: string
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  isActive: boolean
  status: string
}

interface VoucherTableProps {
  vouchers: VoucherRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  percentage: 'Phần trăm',
  fixed: 'Cố định',
}

const scopeLabels: Record<string, string> = {
  platform: 'Toàn hệ thống',
  store: 'Theo cửa hàng',
}

const formatDate = (date?: string) => {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatCurrency = (value?: number | null) => {
  if (value == null) return '\u2014'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-32" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-28" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-32" /></TableCell>
          <TableCell className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-1">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={10} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Tag size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy voucher nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function VoucherTable({
  vouchers,
  isLoading = false,
  onDelete,
  isDeleting = false,
}: VoucherTableProps) {
  const navigate = useNavigate()
  const { deleteMutation } = useAdminVoucherMutations()
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left">Mã</TableHead>
          <TableHead className="px-6 text-left">Tên</TableHead>
          <TableHead className="px-6 text-left">Loại</TableHead>
          <TableHead className="px-6 text-left">Giá trị</TableHead>
          <TableHead className="px-6 text-left">Đơn tối thiểu</TableHead>
          <TableHead className="px-6 text-left w-32">Trạng thái</TableHead>
          <TableHead className="px-6 text-left">Đã dùng</TableHead>
          <TableHead className="px-6 text-left">Phạm vi</TableHead>
          <TableHead className="px-6 text-left">Thời gian</TableHead>
          <TableHead className="px-6 text-right w-28">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : vouchers.length === 0 ? (
          <EmptyRow />
        ) : (
          vouchers.map((v) => (
            <TableRow key={v._id} className="group">
              {/* Mã */}
              <TableCell className="px-6 py-4 text-xs font-semibold text-foreground">
                <code className="bg-muted px-2 py-1 rounded">{v.code}</code>
              </TableCell>

              {/* Tên */}
              <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                {v.name}
              </TableCell>

              {/* Loại */}
              <TableCell className="px-6 py-4">
                <Badge variant="secondary" className="font-normal text-xs">
                  {typeLabels[v.type] || v.type}
                </Badge>
              </TableCell>

              {/* Giá trị */}
              <TableCell className="px-6 py-4 text-sm text-foreground font-medium">
                {v.type === 'percentage' ? `${v.value}%` : formatCurrency(v.value)}
              </TableCell>

              {/* Đơn tối thiểu */}
              <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                {formatCurrency(v.minOrderValue)}
              </TableCell>

              {/* Trạng thái */}
              <TableCell className="px-6 py-4">
                <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(localActive[v._id] != null ? (localActive[v._id] ? 'active' : 'inactive') : (v.isActive ? 'active' : 'inactive')))}>
                  {localActive[v._id] != null ? (localActive[v._id] ? 'Đang hoạt động' : 'Tạm tắt') : (v.isActive ? 'Đang hoạt động' : 'Tạm tắt')}
                </Badge>
              </TableCell>

              {/* Đã dùng */}
              <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                {v.usedCount} / {v.usageLimit}
              </TableCell>

              {/* Phạm vi */}
              <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                {scopeLabels[v.scope] || v.scope}
              </TableCell>

              {/* Thời gian */}
              <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                {formatDate(v.startDate)} \u2013 {formatDate(v.endDate)}
              </TableCell>

              {/* Thao tác */}
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/vouchers/${v._id}/edit`)}
                    title="Chỉnh sửa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    onClick={() => onDelete(v._id)}
                    disabled={isDeleting}
                    title="Xóa"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
