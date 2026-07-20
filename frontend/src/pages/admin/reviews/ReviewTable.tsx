import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Star, MessageSquareText, Eye, EyeOff, Trash2 } from 'lucide-react'
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

export type ReviewRow = {
  _id: string
  userId: string | { _id: string; name: string; email: string; avatar?: string }
  productId: string | { _id: string; name: string; slug: string; images: string[] }
  rating: number
  title?: string
  comment?: string
  isActive: boolean
  createdAt: string
}

interface ReviewTableProps {
  reviews: ReviewRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
  onToggleActive: (id: string) => void
  isTogglingActive?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground',
          )}
        />
      ))}
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-28" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-36" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-28" /></TableCell>
          <TableCell className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-1">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={8} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MessageSquareText size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy đánh giá nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReviewTable({
  reviews,
  isLoading = false,
  onDelete,
  isDeleting = false,
  onToggleActive,
  isTogglingActive = false,
}: ReviewTableProps) {
  const navigate = useNavigate()
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left w-64">Sản phẩm</TableHead>
          <TableHead className="px-6 text-left w-48">Khách hàng</TableHead>
          <TableHead className="px-6 text-left w-24">Đánh giá</TableHead>
          <TableHead className="px-6 text-left w-40">Tiêu đề</TableHead>
          <TableHead className="px-6 text-left">Nội dung</TableHead>
          <TableHead className="px-6 text-left w-28">Trạng thái</TableHead>
          <TableHead className="px-6 text-left w-36">Ngày tạo</TableHead>
          <TableHead className="px-6 text-right w-32">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : reviews.length === 0 ? (
          <EmptyRow />
        ) : (
          reviews.map((review) => {
            const product = typeof review.productId === 'object' ? review.productId : null
            const user = typeof review.userId === 'object' ? review.userId : null
            const thumb = product?.images?.[0]
            const isActive = localActive[review._id] ?? review.isActive

            return (
              <TableRow key={review._id} className="group">
                {/* Sản phẩm */}
                <TableCell className="px-6 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                      {thumb ? (
                        <img src={thumb} alt={product?.name} className="size-full object-cover" />
                      ) : (
                        <Star size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                      {product?.name || 'N/A'}
                    </span>
                  </div>
                </TableCell>

                {/* Khách hàng */}
                <TableCell className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="size-7 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          {user?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-foreground">{user?.name || 'N/A'}</span>
                  </div>
                </TableCell>

                {/* Đánh giá */}
                <TableCell className="px-6 py-3">
                  <StarRating rating={review.rating} />
                </TableCell>

                {/* Tiêu đề */}
                <TableCell className="px-6 py-3">
                  <span className="text-sm text-foreground truncate max-w-[180px] block">
                    {review.title || '\u2014'}
                  </span>
                </TableCell>

                {/* Nội dung */}
                <TableCell className="px-6 py-3">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                    {review.comment || '\u2014'}
                  </span>
                </TableCell>

                {/* Trạng thái */}
                <TableCell className="px-6 py-3">
                  <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(isActive ? 'active' : 'inactive'))} />
                </TableCell>

                {/* Ngày tạo */}
                <TableCell className="px-6 py-3 text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </TableCell>

                {/* Thao tác */}
                <TableCell className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => {
                        const next = !review.isActive
                        setLocalActive((prev) => ({ ...prev, [review._id]: next }))
                        onToggleActive(review._id)
                      }}
                      disabled={isTogglingActive}
                      title={isActive ? 'Ẩn' : 'Hiện'}
                    >
                      {isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => navigate(`/admin/reviews/${review._id}`)}
                      title="Xem chi tiết"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(review._id)}
                      disabled={isDeleting}
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
