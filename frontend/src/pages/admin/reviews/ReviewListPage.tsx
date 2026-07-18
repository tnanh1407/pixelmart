import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Star, MessageSquareText } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { IReview, ReviewListResponse } from '@/types/review.types'
import { toast } from 'sonner'
import {
  PageHeader,
  SearchToolbar,
  DataTable,
  Pagination,
  LoadingState,
  EmptyState,
  ErrorState,
  DeleteDialog,
  StatusBadge,
} from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

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

export default function ReviewListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [ratingFilter, setRatingFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const params = useMemo(() => {
    const p: Record<string, unknown> = { page, limit: 10 }
    if (search) p.search = search
    if (ratingFilter) p.rating = Number(ratingFilter)
    if (activeFilter) p.isActive = activeFilter === 'true'
    return p
  }, [page, search, ratingFilter, activeFilter])

  const { data, isLoading, isError, refetch } = useQuery<ReviewListResponse>({
    queryKey: ['admin-reviews', params],
    queryFn: () => adminService.getReviews(params),
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => { invalidate(); toast.success('Xóa đánh giá thành công') },
    onError: () => toast.error('Không thể xóa đánh giá'),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleReviewActive(id),
    onSuccess: () => { invalidate(); toast.success('Cập nhật trạng thái thành công') },
    onError: () => toast.error('Không thể cập nhật trạng thái'),
  })

  const reviews = data?.reviews || []
  const pagination = data?.pagination || emptyPagination

  const columns: Column<IReview>[] = [
    {
      header: 'Sản phẩm',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (r) => {
        const product = typeof r.productId === 'object' ? r.productId : null
        const thumb = product?.images?.[0]
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
              {thumb ? (
                <img src={thumb} alt={product?.name} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center">
                  <Star size={14} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
              {product?.name || 'N/A'}
            </span>
          </div>
        )
      },
    },
    {
      header: 'Khách hàng',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (r) => {
        const user = typeof r.userId === 'object' ? r.userId : null
        return (
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
        )
      },
    },
    {
      header: 'Đánh giá',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (r) => <StarRating rating={r.rating} />,
    },
    {
      header: 'Tiêu đề',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (r) => (
        <span className="text-sm text-foreground truncate max-w-[180px] block">
          {r.title || '\u2014'}
        </span>
      ),
    },
    {
      header: 'Nội dung',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (r) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {r.comment || '\u2014'}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (r) => (
        <StatusBadge variant={r.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      header: 'Ngày tạo',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (r) => <span>{formatDate(r.createdAt)}</span>,
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleActiveMutation.mutate(r._id)}
            disabled={toggleActiveMutation.isPending}
            title={r.isActive ? 'Ẩn' : 'Hiện'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {r.isActive ? <path d="M20 6 9 17l-5-5"/> : <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>}
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/reviews/${r._id}`)}
            title="Xem chi tiết"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTargetId(r._id)}
            disabled={deleteMutation.isPending}
            title="Xóa"
            className="text-destructive hover:text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </Button>
        </div>
      ),
    },
  ]

  if (isError) {
    return (
      <div>
        <PageHeader title="Quản lý Đánh giá" />
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý Đánh giá"
        description={`Tổng: ${pagination.total} đánh giá`}
      />

      <SearchToolbar
        placeholder="Tìm kiếm sản phẩm hoặc khách hàng..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
        filter={
          <div className="flex gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => { setRatingFilter(e.target.value); setPage(1) }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
            <select
              value={activeFilter}
              onChange={(e) => { setActiveFilter(e.target.value); setPage(1) }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hiển thị</option>
              <option value="false">Ẩn</option>
            </select>
          </div>
        }
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            message="Không tìm thấy đánh giá nào"
            description={
              search || ratingFilter || activeFilter
                ? 'Thử thay đổi điều kiện tìm kiếm'
                : 'Chưa có đánh giá nào trong hệ thống'
            }
          />
        ) : (
          <DataTable columns={columns} data={reviews} keyExtractor={(r) => r._id} />
        )}
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          total={pagination.total}
        />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="đánh giá"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId)
            setDeleteTargetId(null)
          }
        }}
      />
    </div>
  )
}
