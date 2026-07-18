import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Image } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { CampaignListResponse } from '@/services/admin/campaigns.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
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

interface CampaignRow {
  _id: string
  title: string
  slug?: string
  type?: 'promotion' | 'blog'
  image?: string
  isActive: boolean
  startDate?: string
  endDate?: string
  order: number
}

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const formatDate = (date?: string) => {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function CampaignListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [previewCampaign, setPreviewCampaign] = useState<CampaignRow | null>(null)

  const { deleteMutation, toggleActiveMutation } = useAdminCampaignMutations()

  const { data, isLoading, isError, refetch } = useQuery<CampaignListResponse>({
    queryKey: ['admin-campaigns', page, search],
    queryFn: () => adminService.getCampaigns({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const campaigns: CampaignRow[] = (data?.campaigns || []) as CampaignRow[]
  const pagination = data?.pagination || emptyPagination

  const columns: Column<CampaignRow>[] = [
    {
      header: 'Hình ảnh',
      headerClassName: 'w-24 px-6',
      cellClassName: 'px-6 py-4',
      render: (c) => (
        <div
          onClick={() => setPreviewCampaign(c)}
          className="w-20 h-12 rounded-lg overflow-hidden border border-border bg-muted cursor-pointer hover:opacity-85 transition-opacity"
        >
          {c.image ? (
            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
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
      render: (c) => (
        <p
          onClick={() => navigate(`/admin/campaigns/${c._id}`)}
          className="font-medium text-foreground text-sm truncate max-w-[220px] cursor-pointer hover:text-primary transition-colors"
        >
          {c.title}
        </p>
      ),
    },
    {
      header: 'Slug',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (c) => (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{c.slug || '\u2014'}</code>
      ),
    },
    {
      header: 'Loại',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (c) => {
        if (!c.type) return <span className="text-sm text-muted-foreground">\u2014</span>
        return c.type === 'promotion'
          ? <span className="text-xs font-medium bg-info-light text-info px-2 py-0.5 rounded">Khuyến mãi</span>
          : <span className="text-xs font-medium bg-warning-light text-warning px-2 py-0.5 rounded">Bài viết</span>
      },
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (c) => (
        <StatusBadge variant={c.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      header: 'Thời gian',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (c) => {
        const start = formatDate(c.startDate)
        const end = formatDate(c.endDate)
        return <span>{start} \u2013 {end}</span>
      },
    },
    {
      header: 'Thứ tự',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (c) => <span>{c.order}</span>,
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleActiveMutation.mutate({ id: c._id, isActive: c.isActive })}
            disabled={toggleActiveMutation.isPending}
            title={c.isActive ? 'Ẩn' : 'Hiện'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {c.isActive ? <path d="M20 6 9 17l-5-5"/> : <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>}
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/campaigns/${c._id}/edit`)}
            title="Chỉnh sửa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTargetId(c._id)}
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
        <PageHeader title="Quản lý chiến dịch" />
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý chiến dịch"
        description={`Tổng: ${pagination.total} chiến dịch`}
        action={
          <Button onClick={() => navigate('/admin/campaigns/create')}>
            <Plus size={18} />
            Thêm chiến dịch
          </Button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm chiến dịch..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : campaigns.length === 0 ? (
          <EmptyState
            icon={Image}
            message="Không tìm thấy chiến dịch nào"
            description={search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có chiến dịch nào trong hệ thống'}
            action={
              <Button onClick={() => navigate('/admin/campaigns/create')}>
                <Plus size={16} />
                Thêm chiến dịch đầu tiên
              </Button>
            }
          />
        ) : (
          <DataTable columns={columns} data={campaigns} keyExtractor={(c) => c._id} />
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
        entityLabel="chiến dịch"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId)
            setDeleteTargetId(null)
          }
        }}
      />

      <ImagePreview
        open={!!previewCampaign}
        onOpenChange={(open) => !open && setPreviewCampaign(null)}
        src={previewCampaign?.image}
        alt={previewCampaign?.title}
      />
    </div>
  )
}
