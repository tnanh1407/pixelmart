import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Image } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { IBanner, BannerListResponse } from '@/types/banner.types'
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
  ImagePreview,
} from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const positionLabels: Record<string, string> = {
  home_top: 'Đầu trang chủ',
  home_middle: 'Giữa trang chủ',
  sidebar: 'Sidebar',
  popup: 'Popup',
}

const positionVariants: Record<string, 'active' | 'inactive' | 'pending' | 'info'> = {
  home_top: 'active',
  home_middle: 'info',
  sidebar: 'pending',
  popup: 'inactive',
}

const typeLabels: Record<string, string> = {
  slider: 'Slider',
  static: 'Tĩnh',
  promo_card: 'Promo Card',
}

export default function BannerListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [positionFilter, setPositionFilter] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [previewBanner, setPreviewBanner] = useState<IBanner | null>(null)

  const params: Record<string, unknown> = { page, limit: 10 }
  if (search) params.search = search
  if (positionFilter) params.position = positionFilter

  const { data, isLoading, isError, refetch } = useQuery<BannerListResponse>({
    queryKey: ['admin-banners', params],
    queryFn: () => adminService.getBanners(params),
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-banners'] })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => { invalidate(); toast.success('Xóa banner thành công') },
    onError: () => toast.error('Không thể xóa banner'),
  })

  const banners = data?.banners || []
  const pagination = data?.pagination || emptyPagination

  const columns: Column<IBanner>[] = [
    {
      header: 'Hình ảnh',
      headerClassName: 'w-24 px-6',
      cellClassName: 'px-6 py-4',
      render: (b) => (
        <div
          onClick={() => setPreviewBanner(b)}
          className="w-20 h-12 rounded-lg overflow-hidden border border-border bg-muted cursor-pointer hover:opacity-85 transition-opacity"
        >
          {b.image ? (
            <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image size={16} className="text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Tiêu đề',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (b) => (
        <p className="font-medium text-foreground text-sm truncate max-w-[220px]">
          {b.title}
        </p>
      ),
    },
    {
      header: 'Vị trí',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (b) => (
        <Badge
          variant="secondary"
          className="font-normal text-xs"
        >
          {positionLabels[b.position] || b.position}
        </Badge>
      ),
    },
    {
      header: 'Loại',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (b) => (
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {typeLabels[b.type] || b.type}
        </span>
      ),
    },
    {
      header: 'Thứ tự',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (b) => <span>{b.order}</span>,
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (b) => (
        <StatusBadge variant={b.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (b) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/banners/${b._id}/edit`)}
            title="Chỉnh sửa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTargetId(b._id)}
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
        <PageHeader title="Quản lý Banner" />
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý Banner"
        description={`Tổng: ${pagination.total} banner`}
        action={
          <Button onClick={() => navigate('/admin/banners/create')}>
            <Plus size={18} />
            Thêm Banner
          </Button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm banner..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
        filter={
          <select
            value={positionFilter}
            onChange={(e) => { setPositionFilter(e.target.value); setPage(1) }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">Tất cả vị trí</option>
            <option value="home_top">Đầu trang chủ</option>
            <option value="home_middle">Giữa trang chủ</option>
            <option value="sidebar">Sidebar</option>
            <option value="popup">Popup</option>
          </select>
        }
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : banners.length === 0 ? (
          <EmptyState
            icon={Image}
            message="Không tìm thấy banner nào"
            description={search || positionFilter ? 'Thử thay đổi điều kiện tìm kiếm' : 'Chưa có banner nào trong hệ thống'}
            action={
              <Button onClick={() => navigate('/admin/banners/create')}>
                <Plus size={16} />
                Thêm banner đầu tiên
              </Button>
            }
          />
        ) : (
          <DataTable columns={columns} data={banners} keyExtractor={(b) => b._id} />
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
        entityLabel="banner"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId)
            setDeleteTargetId(null)
          }
        }}
      />

      <ImagePreview
        open={!!previewBanner}
        onOpenChange={(open) => !open && setPreviewBanner(null)}
        src={previewBanner?.image}
        alt={previewBanner?.title}
      />
    </div>
  )
}
