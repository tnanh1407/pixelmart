import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Zap } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { FlashSaleListResponse } from '@/services/admin/flash-sales.service'
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

interface FlashSaleRow {
  _id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
}

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const statusVariant: Record<string, 'pending' | 'active' | 'inactive' | 'cancelled'> = {
  scheduled: 'pending',
  active: 'active',
  ended: 'inactive',
  cancelled: 'cancelled',
}

const statusLabels: Record<string, string> = {
  scheduled: 'Sắp diễn ra',
  active: 'Đang diễn ra',
  ended: 'Đã kết thúc',
  cancelled: 'Đã hủy',
}

const formatDate = (date?: string) => {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getDuration = (start?: string, end?: string) => {
  if (!start || !end) return '\u2014'
  const diff = new Date(end).getTime() - new Date(start).getTime()
  if (diff <= 0) return '0 ngày'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days} ngày ${hours} giờ`
  return `${hours} giờ`
}

export default function FlashSaleListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery<FlashSaleListResponse>({
    queryKey: ['admin-flash-sales', page, search],
    queryFn: () => adminService.getFlashSales({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteFlashSale(id),
    onSuccess: () => { invalidate(); toast.success('Xóa flash sale thành công') },
    onError: () => toast.error('Không thể xóa flash sale'),
  })

  const flashSales: FlashSaleRow[] = (data?.flashSales || []) as FlashSaleRow[]
  const pagination = data?.pagination || emptyPagination

  const columns: Column<FlashSaleRow>[] = [
    {
      header: 'Tên chương trình',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (fs) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm">{fs.name}</p>
          {fs.description && (
            <p className="text-xs text-muted-foreground truncate max-w-[250px] mt-0.5">{fs.description}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (fs) => (
        <StatusBadge variant={statusVariant[fs.status] || 'inactive'} label={statusLabels[fs.status] || fs.status} />
      ),
    },
    {
      header: 'Ngày bắt đầu',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (fs) => <span>{formatDate(fs.startDate)}</span>,
    },
    {
      header: 'Ngày kết thúc',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (fs) => <span>{formatDate(fs.endDate)}</span>,
    },
    {
      header: 'Thời lượng',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (fs) => <span>{getDuration(fs.startDate, fs.endDate)}</span>,
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (fs) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/flash-sales/${fs._id}/edit`)}
            title="Chỉnh sửa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTargetId(fs._id)}
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
        <PageHeader title="Quản lý Flash Sale" />
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý Flash Sale"
        description={`Tổng: ${pagination.total} chương trình`}
        action={
          <Button onClick={() => navigate('/admin/flash-sales/create')}>
            <Plus size={18} />
            Thêm Flash Sale
          </Button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm flash sale..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : flashSales.length === 0 ? (
          <EmptyState
            icon={Zap}
            message="Không tìm thấy flash sale nào"
            description={search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có chương trình flash sale nào'}
            action={
              <Button onClick={() => navigate('/admin/flash-sales/create')}>
                <Plus size={16} />
                Thêm flash sale đầu tiên
              </Button>
            }
          />
        ) : (
          <DataTable columns={columns} data={flashSales} keyExtractor={(fs) => fs._id} />
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
        entityLabel="flash sale"
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
