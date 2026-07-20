import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Image } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { BannerListResponse, IBanner } from '@/types/banner.types'
import { toast } from 'sonner'
import BannerTable from './BannerTable'
import {
  PageHeader,
  SearchToolbar,
  Pagination,
  LoadingState,
  EmptyState,
  ErrorState,
  DeleteDialog,
  ImagePreview,
} from '@/components/admin/shared'
import { Button } from '@/components/ui/button'

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

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
          <BannerTable data={banners} onDelete={(id) => setDeleteTargetId(id)} />
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
