import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, User, Package, MessageSquareText, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { IReview } from '@/types/review.types'
import {
  LoadingState,
  DetailCard,
  DetailField,
  StatusBadge,
  StatusToggle,
} from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground',
          )}
        />
      ))}
    </div>
  )
}

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: review, isLoading, error } = useQuery<IReview>({
    queryKey: ['admin-review-detail', id],
    queryFn: () => adminService.getReviews({ _id: id }).then((res) => {
      const found = res.reviews.find((r) => r._id === id)
      if (!found) throw new Error('Review not found')
      return found
    }),
    enabled: !!id,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-review-detail', id] })
    queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
  }

  const toggleActiveMutation = useMutation({
    mutationFn: () => adminService.toggleReviewActive(id!),
    onSuccess: () => { invalidate(); toast.success('Cập nhật trạng thái thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  if (isLoading) return <LoadingState className="min-h-[400px]" type="skeleton" rows={6} />

  if (error || !review) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive-light">
          <MessageSquareText size={32} className="text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Không tìm thấy đánh giá</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Đã có lỗi xảy ra hoặc đánh giá không tồn tại.
        </p>
        <Button onClick={() => navigate('/admin/reviews')} className="mt-4">
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const user = typeof review.userId === 'object' ? review.userId : null
  const product = typeof review.productId === 'object' ? review.productId : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/reviews')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Chi tiết đánh giá</h1>
              <StatusBadge variant={review.isActive ? 'active' : 'inactive'} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Ngày tạo: {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {review.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
          </span>
          <StatusToggle
            active={review.isActive}
            onChange={() => toggleActiveMutation.mutate()}
            disabled={toggleActiveMutation.isPending}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DetailCard title="Nội dung đánh giá" icon={MessageSquareText}>
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={review.rating} size={22} />
              <span className="text-sm font-medium text-foreground">{review.rating}/5</span>
            </div>
            {review.title && (
              <DetailField label="Tiêu đề" value={review.title} />
            )}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-1">Nội dung</p>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {review.comment || '\u2014'}
              </p>
            </div>
          </DetailCard>

          {review.images && review.images.length > 0 && (
            <DetailCard title="Hình ảnh" icon={ImageIcon}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {review.images.map((img, idx) => (
                  <a
                    key={idx}
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
                  >
                    <img
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </DetailCard>
          )}
        </div>

        <div className="space-y-6">
          <DetailCard title="Sản phẩm" icon={Package}>
            {product ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-14 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center">
                        <Package size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{product.slug}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </DetailCard>

          <DetailCard title="Khách hàng" icon={User}>
            {user ? (
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="size-10 rounded-full object-cover border border-border" />
                ) : (
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {user.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </DetailCard>

          <DetailCard title="Thông tin chung">
            <DetailField label="ID đánh giá" value={review._id} mono />
            <DetailField label="Trạng thái" value={<StatusBadge variant={review.isActive ? 'active' : 'inactive'} />} />
            <DetailField label="Ngày tạo" value={formatDate(review.createdAt)} />
            {review.updatedAt && (
              <DetailField label="Cập nhật" value={formatDate(review.updatedAt)} />
            )}
          </DetailCard>
        </div>
      </div>
    </div>
  )
}
